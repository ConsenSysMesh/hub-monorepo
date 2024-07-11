use super::{
    deferred_settle_messages, hub_error_to_js_throw, make_fid_key, make_user_key, message,
    store::{Store, StoreDef},
    utils::{get_page_options, get_store, make_ref_key},
    HubError, IntoU8, MessagesPage, PageOptions, RootPrefix, StoreEventHandler, UserPostfix,
    PAGE_SIZE_MAX, HASH_LENGTH, TS_HASH_LENGTH,
};
use crate::{
    db::{RocksDB, RocksDbTransactionBatch},
    protos::{self, ObjectRef, Message, MessageType, RelationshipAddBody, RelationshipRemoveBody},
};
use crate::{protos::message_data, THREAD_POOL};
use neon::{
    context::{Context, FunctionContext},
    result::JsResult,
    types::{buffer::TypedArray, JsBox, JsBuffer, JsNumber, JsPromise, JsString},
};
use prost::Message as _;
use std::{borrow::Borrow, sync::Arc};

pub struct RelationshipStoreDef {
    prune_size_limit: u32,
}

impl StoreDef for RelationshipStoreDef {
    fn postfix(&self) -> u8 {
        UserPostfix::RelationshipMessage.as_u8()
    }

    fn add_message_type(&self) -> u8 {
        MessageType::RelationshipAdd.into_u8()
    }

    fn remove_message_type(&self) -> u8 {
        MessageType::RelationshipRemove as u8
    }

    fn is_add_type(&self, message: &protos::Message) -> bool {
        message.signature_scheme == protos::SignatureScheme::Ed25519 as i32
            && message.data.is_some()
            && message.data.as_ref().unwrap().r#type == MessageType::RelationshipAdd as i32
            && message.data.as_ref().unwrap().body.is_some()
    }

    fn is_remove_type(&self, message: &protos::Message) -> bool {
        message.signature_scheme == protos::SignatureScheme::Ed25519 as i32
            && message.data.is_some()
            && message.data.as_ref().unwrap().r#type == MessageType::RelationshipRemove as i32
            && message.data.as_ref().unwrap().body.is_some()
    }

    fn compact_state_message_type(&self) -> u8 {
        MessageType::None as u8
    }

    fn is_compact_state_type(&self, _message: &Message) -> bool {
        false
    }

    fn build_secondary_indices(
        &self,
        txn: &mut RocksDbTransactionBatch,
        ts_hash: &[u8; TS_HASH_LENGTH],
        message: &Message,
    ) -> Result<(), HubError> {
        let (by_source_key, by_target_key, name) = self.secondary_index_key(ts_hash, message)?;

        // this is saving the relationship type against both the source and target object ref index
        txn.put(by_source_key, name.clone());
        txn.put(by_target_key, name.clone());

        Ok(())
    }

    fn delete_secondary_indices(
        &self,
        txn: &mut RocksDbTransactionBatch,
        ts_hash: &[u8; TS_HASH_LENGTH],
        message: &Message,
    ) -> Result<(), HubError> {
        let (by_source_key, by_target_key, _) = self.secondary_index_key(ts_hash, message)?;

        txn.delete(by_source_key);
        txn.delete(by_target_key);

        Ok(())
    }

    fn delete_remove_secondary_indices(
        &self,
        _txn: &mut RocksDbTransactionBatch,
        _message: &Message,
    ) -> Result<(), HubError> {
        Ok(())
    }

    fn find_merge_add_conflicts(
        &self,
        _db: &RocksDB,
        _message: &protos::Message,
    ) -> Result<(), HubError> {
        // For tags, there will be no conflicts
        Ok(())
    }

    fn find_merge_remove_conflicts(
        &self,
        _db: &RocksDB,
        _message: &Message,
    ) -> Result<(), HubError> {
        // For tags, there will be no conflicts
        Ok(())
    }

    fn make_add_key(&self, message: &protos::Message) -> Result<Vec<u8>, HubError> {
        let hash = match message.data.as_ref().unwrap().body.as_ref().unwrap() {
            message_data::Body::RelationshipAddBody(_) => message.hash.as_ref(),
            // Some(message_data::Body::CastAddBody(_)) => message.hash.as_ref(),
            message_data::Body::RelationshipRemoveBody(relationship_remove_body) => {
            // Some(message_data::Body::CastRemoveBody(cast_remove_body)) => {
                relationship_remove_body.target_hash.as_ref()
            }
            _ => {
                return Err(HubError {
                    code: "bad_request.validation_failure".to_string(),
                    message: "Invalid relationship body".to_string(),
                })
            }
        };

        Ok(Self::make_relationship_adds_key(
            message.data.as_ref().unwrap().fid as u32,
            hash,
        ))
    }

    fn make_remove_key(&self, message: &protos::Message) -> Result<Vec<u8>, HubError> {
        let hash = match message.data.as_ref().unwrap().body.as_ref().unwrap() {
            message_data::Body::RelationshipAddBody(_) => message.hash.as_ref(),
            message_data::Body::RelationshipRemoveBody(relationship_remove_body) => {
                relationship_remove_body.target_hash.as_ref()
            }
            _ => {
                return Err(HubError {
                    code: "bad_request.validation_failure".to_string(),
                    message: "Invalid relationship body for remove key".to_string(),
                })
            }
        };

        Ok(Self::make_relationship_removes_key(
            message.data.as_ref().unwrap().fid as u32,
            hash,
        ))
    }

    fn make_compact_state_add_key(&self, _message: &Message) -> Result<Vec<u8>, HubError> {
        Err(HubError {
            code: "bad_request.invalid_param".to_string(),
            message: "Relationship Store doesn't support compact state".to_string(),
        })
    }

    fn get_prune_size_limit(&self) -> u32 {
        self.prune_size_limit
    }
}

impl RelationshipStoreDef {
    fn secondary_index_key(
        &self,
        ts_hash: &[u8; TS_HASH_LENGTH],
        message: &protos::Message,
    ) -> Result<(Vec<u8>, Vec<u8>, Vec<u8>), HubError> {
        let relationship_body = match message.data.as_ref().unwrap().body.as_ref().unwrap() {
            message_data::Body::RelationshipAddBody(relationship_body) => relationship_body,
            _ => Err(HubError {
                code: "bad_request.validation_failure".to_string(),
                message: "Invalid relationship body".to_string(),
            })?,
        };

        let source = relationship_body.source.as_ref().ok_or(HubError {
            code: "bad_request.validation_failure".to_string(),
            message: "Invalid source body".to_string(),
        })?;
    
        let target = relationship_body.target.as_ref().ok_or(HubError {
            code: "bad_request.validation_failure".to_string(),
            message: "Invalid target body".to_string(),
        })?;

        let by_source_key = RelationshipStoreDef::make_relationship_by_source_key(
            source,
            message.data.as_ref().unwrap().fid as u32,
            Some(ts_hash),
        );

        let by_target_key = RelationshipStoreDef::make_relationship_by_target_key(
            target,
            message.data.as_ref().unwrap().fid as u32,
            Some(ts_hash),
        );

        Ok((by_source_key, by_target_key, relationship_body.r#type.as_bytes().to_vec()))
    }

    pub fn make_relationship_by_source_key(
        source: &ObjectRef,
        fid: u32,
        ts_hash: Option<&[u8; TS_HASH_LENGTH]>,
    ) -> Vec<u8> {
        let key = Self::make_relationship_by_related_object_key(RootPrefix::RelationshipsBySource, source, fid, ts_hash);
        key
    }

    pub fn make_relationship_by_target_key(
        target: &ObjectRef,
        fid: u32,
        ts_hash: Option<&[u8; TS_HASH_LENGTH]>,
    ) -> Vec<u8> {
        let key = Self::make_relationship_by_related_object_key(RootPrefix::RelationshipsByTarget, target, fid, ts_hash);
        key
    }

    fn make_relationship_by_related_object_key(
        root_prefix: RootPrefix,
        object_ref: &ObjectRef,
        fid: u32,
        ts_hash: Option<&[u8; TS_HASH_LENGTH]>,
    ) -> Vec<u8> {
        let mut key = Vec::with_capacity(1 + 22 + 24 + 4);

        key.push(root_prefix as u8); // 1 byte
        key.extend_from_slice(&make_ref_key(object_ref)); // at most 22 bytes if object ref isn't an fid
        if ts_hash.is_some() && ts_hash.unwrap().len() == TS_HASH_LENGTH {
            key.extend_from_slice(ts_hash.unwrap());
        }
        if fid > 0 {
            key.extend_from_slice(&make_fid_key(fid));
        }

        key
    }

    pub fn make_relationship_adds_key(
        fid: u32,
        hash: &Vec<u8>,
    ) -> Vec<u8> {
        let mut key = Vec::with_capacity(5 + 1 + 20);

        key.extend_from_slice(&make_user_key(fid)); // make_user_key, 5 bytes
        key.push(UserPostfix::RelationshipAdds as u8); // RelationshipAdds postfix, 1 byte
        if hash.len() == HASH_LENGTH {            
            key.extend_from_slice(hash.as_slice()); // hash, 20 bytes
        }
        key
    }

    pub fn make_relationship_removes_key(
        fid: u32,
        hash: &Vec<u8>,
    ) -> Vec<u8> {
        let mut key = Vec::with_capacity(5 + 1 + 20);

        key.extend_from_slice(&make_user_key(fid)); // make_user_key, 5 bytes
        key.push(UserPostfix::RelationshipRemoves as u8); // RelationshipRemoves postfix, 1 byte
        if hash.len() == HASH_LENGTH {
            key.extend_from_slice(hash.as_slice()); // hash, 20 bytes
        }
        key
    }
}

pub struct RelationshipStore {}

impl RelationshipStore {
    pub fn new(
        db: Arc<RocksDB>,
        store_event_handler: Arc<StoreEventHandler>,
        prune_size_limit: u32,
    ) -> Store {
        Store::new_with_store_def(
            db,
            store_event_handler,
            Box::new(RelationshipStoreDef { prune_size_limit }),
        )
    }

    pub fn get_relationship_add(
        store: &Store,
        fid: u32,
        hash: Vec<u8>,
    ) -> Result<Option<protos::Message>, HubError> {
        let partial_message = protos::Message {
            data: Some(protos::MessageData {
                fid: fid as u64,
                r#type: MessageType::RelationshipAdd.into(),
                body: Some(protos::message_data::Body::RelationshipAddBody(RelationshipAddBody {
                    ..Default::default()
                })),
                ..Default::default()
            }),
            hash,
            ..Default::default()
        };

        store.get_add(&partial_message)
    }

    pub fn js_get_relationship_add(mut cx: FunctionContext) -> JsResult<JsPromise> {
        let channel = cx.channel();

        let store = get_store(&mut cx)?;

        let fid = cx.argument::<JsNumber>(0).unwrap().value(&mut cx) as u32;
        let hash_buffer = cx.argument::<JsBuffer>(1)?;
        let hash_bytes = hash_buffer.as_slice(&cx);

        let result = match Self::get_relationship_add(&store, fid, hash_bytes.to_vec()) {
            Ok(Some(message)) => message.encode_to_vec(),
            Ok(None) => cx.throw_error(format!(
                "{}/{} for {}",
                "not_found", "RelationshipAddMessage not found", fid
            ))?,
            Err(e) => return hub_error_to_js_throw(&mut cx, e),
        };

        let (deferred, promise) = cx.promise();
        deferred.settle_with(&channel, move |mut cx| {
            let mut js_buffer = cx.buffer(result.len())?;
            js_buffer.as_mut_slice(&mut cx).copy_from_slice(&result);
            Ok(js_buffer)
        });

        Ok(promise)
    }

    pub fn get_relationship_remove(
        store: &Store,
        fid: u32,
        hash: Vec<u8>, 
    ) -> Result<Option<protos::Message>, HubError> {
        let partial_message = protos::Message {
            data: Some(protos::MessageData {
                fid: fid as u64,
                r#type: MessageType::RelationshipRemove.into(),
                body: Some(protos::message_data::Body::RelationshipRemoveBody(RelationshipRemoveBody {
                    target_hash: hash.clone(),
                })),
                ..Default::default()
            }),
            ..Default::default()
        };

        let r = store.get_remove(&partial_message);
        // println!("got tag remove: {:?}", r);

        r
    }

    pub fn js_get_relationship_remove(mut cx: FunctionContext) -> JsResult<JsPromise> {
        let store = get_store(&mut cx)?;

        let fid = cx.argument::<JsNumber>(0).unwrap().value(&mut cx) as u32;
        let hash_buffer = cx.argument::<JsBuffer>(1)?;
        let hash_bytes = hash_buffer.as_slice(&cx).to_vec();

        let result = match RelationshipStore::get_relationship_remove(&store, fid, hash_bytes) {
            Ok(Some(message)) => message.encode_to_vec(),
            Ok(None) => cx.throw_error(format!(
                "{}/{} for {}",
                "not_found", "RelationshipRemoveMessage not found", fid
            ))?,
            Err(e) => return hub_error_to_js_throw(&mut cx, e),
        };

        let channel = cx.channel();
        let (deferred, promise) = cx.promise();
        deferred.settle_with(&channel, move |mut cx| {
            let mut js_buffer = cx.buffer(result.len())?;
            js_buffer.as_mut_slice(&mut cx).copy_from_slice(&result);
            Ok(js_buffer)
        });

        Ok(promise)
    }

    pub fn get_relationship_adds_by_fid(
        store: &Store,
        fid: u32,
        r#type: String,
        page_options: &PageOptions,
    ) -> Result<MessagesPage, HubError> {
        store.get_adds_by_fid(
            fid,
            page_options,
            Some(|message: &Message| {
                if let Some(relationship_body) = &message.data.as_ref().unwrap().body {
                    if let protos::message_data::Body::RelationshipAddBody(relationship_body) = relationship_body {
                        if r#type == "" || relationship_body.r#type == r#type {
                            return true;
                        }
                    }
                }

                false
            }),
        )
    }

    pub fn create_relationship_store(mut cx: FunctionContext) -> JsResult<JsBox<Arc<Store>>> {
        let db_js_box = cx.argument::<JsBox<Arc<RocksDB>>>(0)?;
        let db = (**db_js_box.borrow()).clone();

        // Read the StoreEventHandlerfg
        let store_event_handler_js_box = cx.argument::<JsBox<Arc<StoreEventHandler>>>(1)?;
        let store_event_handler = (**store_event_handler_js_box.borrow()).clone();

        // Read the prune size limit and prune time limit from the options
        let prune_size_limit = cx
            .argument::<JsNumber>(2)
            .map(|n| n.value(&mut cx) as u32)?;

        Ok(cx.boxed(Arc::new(RelationshipStore::new(
            db,
            store_event_handler,
            prune_size_limit,
        ))))
    }

    pub fn js_get_relationship_adds_by_fid(mut cx: FunctionContext) -> JsResult<JsPromise> {
        let store = get_store(&mut cx)?;

        let fid = cx.argument::<JsNumber>(0).unwrap().value(&mut cx) as u32;
        let r#type = cx.argument::<JsString>(1).map(|s| s.value(&mut cx))?;

        let page_options = get_page_options(&mut cx, 2)?;
        let channel = cx.channel();
        let (deferred, promise) = cx.promise();

        THREAD_POOL.lock().unwrap().execute(move || {
            let messages =
                RelationshipStore::get_relationship_adds_by_fid(&store, fid, r#type, &page_options);

            deferred_settle_messages(deferred, &channel, messages);
        });

        Ok(promise)
    }

    pub fn get_relationship_removes_by_fid(
        store: &Store,
        fid: u32,
        r#type: String,
        page_options: &PageOptions,
    ) -> Result<MessagesPage, HubError> {
        store.get_removes_by_fid(
            fid,
            page_options,
            Some(|message: &Message| {
                if let Some(relationship_body) = &message.data.as_ref().unwrap().body {
                    if let protos::message_data::Body::RelationshipAddBody(relationship_body) = relationship_body {
                        if relationship_body.r#type == r#type {
                            return true;
                        }
                    }
                }

                false
            }),
        )
    }

    pub fn js_get_relationship_removes_by_fid(mut cx: FunctionContext) -> JsResult<JsPromise> {
        let store = get_store(&mut cx)?;

        let fid = cx.argument::<JsNumber>(0).unwrap().value(&mut cx) as u32;
        let r#type = cx.argument::<JsString>(1).map(|s| s.value(&mut cx))?;

        let page_options = get_page_options(&mut cx, 2)?;
        let channel = cx.channel();
        let (deferred, promise) = cx.promise();

        THREAD_POOL.lock().unwrap().execute(move || {
            let messages = RelationshipStore::get_relationship_removes_by_fid(
                &store,
                fid,
                r#type,
                &page_options,
            );

            deferred_settle_messages(deferred, &channel, messages);
        });

        Ok(promise)
    }

    pub fn get_relationships_by_source(
        store: &Store,
        source: &ObjectRef,
        name: String,
        page_options: &PageOptions,
    ) -> Result<MessagesPage, HubError> {
        let prefix = RelationshipStoreDef::make_relationship_by_source_key(source, 0, None);

        let mut message_keys = vec![];
        let mut last_key = vec![];

        store
            .db()
            .for_each_iterator_by_prefix(&prefix, page_options, |key, value| {
                if name.is_empty() || value.eq(name.as_bytes())
                {
                    let ts_hash_offset = prefix.len();
                    let fid_offset = ts_hash_offset + TS_HASH_LENGTH;

                    let fid =
                        u32::from_be_bytes(key[fid_offset..fid_offset + 4].try_into().unwrap());
                    let ts_hash = key[ts_hash_offset..ts_hash_offset + TS_HASH_LENGTH]
                        .try_into()
                        .unwrap();
                    let message_primary_key = crate::store::message::make_message_primary_key(
                        fid,
                        store.postfix(),
                        Some(&ts_hash),
                    );

                    message_keys.push(message_primary_key.to_vec());
                    if message_keys.len() >= page_options.page_size.unwrap_or(PAGE_SIZE_MAX) {
                        last_key = key.to_vec();
                        return Ok(true); // Stop iterating
                    }
                }

                Ok(false) // Continue iterating
            })?;

        let messages_bytes =
            message::get_many_messages_as_bytes(store.db().borrow(), message_keys)?;
        let next_page_token = if last_key.len() > 0 {
            Some(last_key[prefix.len()..].to_vec())
        } else {
            None
        };

        Ok(MessagesPage {
            messages_bytes,
            next_page_token,
        })
    }

    pub fn js_get_relationships_by_source(mut cx: FunctionContext) -> JsResult<JsPromise> {
        let store = get_store(&mut cx)?;

        let source_object_ref_buffer = cx.argument::<JsBuffer>(0)?;
        let source_object_ref_bytes = source_object_ref_buffer.as_slice(&cx);
        let source_object_ref = if source_object_ref_bytes.len() > 0 {
            match protos::ObjectRef::decode(source_object_ref_bytes) {
                Ok(object_ref) => Some(object_ref),
                Err(e) => return cx.throw_error(e.to_string()),
            }
        } else {
            return cx.throw_error("source_object_ref is required");
        };
    
        let name = cx.argument::<JsString>(2).map(|s| s.value(&mut cx))?;

        let page_options = get_page_options(&mut cx, 3)?;

        let channel = cx.channel();
        let (deferred, promise) = cx.promise();

        THREAD_POOL.lock().unwrap().execute(move || {
            let messages = RelationshipStore::get_relationships_by_source(
                &store,
                &source_object_ref.unwrap(),
                name,
                &page_options,
            );

            deferred_settle_messages(deferred, &channel, messages);
        });

        Ok(promise)
    }
}
