

#[cfg(test)]
mod tests {
    use crate::{
        // db::{RocksDB, RocksDbTransactionBatch}, 
        db::RocksDB, 
        store::{PageOptions, RootPrefix, StoreEventHandler, TagStore, TS_HASH_LENGTH},
    };
    use std::sync::Arc;

    fn pretty_print_hash(vector: Vec<u8>) {
        let string_vector: Vec<String> = vector.iter().map(|&b| format!("{:02x?}", b)).collect();
        let joined = string_vector.join("");
        print!("{}", joined);
    }

    #[test]
    fn test_test() {
        // // Create a new DB with a random temporary path
        // let tmp_path = tempfile::tempdir()
        //     .unwrap()
        //     .path()
        //     .as_os_str()
        //     .to_string_lossy()
        //     .to_string();
        // let db = Arc::new(RocksDB::new(&tmp_path).unwrap());
        // db.open().unwrap();

        // /Users/vic/src/hub-monorepo/apps/hubble/.rocks

        // make sure to shut down the hubble locking this file before!
        let db = Arc::new(RocksDB::new("/Users/vic/src/hub-monorepo/apps/hubble/.rocks/rocks.hub._default").unwrap());
        db.open().unwrap();

        // let mut txn = RocksDbTransactionBatch::new();
        // println!("RootPrefix {}", RootPrefix::TagsByTarget as u8);
        // let mut key = Vec::with_capacity(1 + 28 + 24 + 4);
        // key.push(RootPrefix::TagsByTarget as u8); // TagsByTarget
        // println!("{:x?}", key);

        let store_event_handler = StoreEventHandler::new(Option::None, Option::None, Option::None);
        let _tag_store = TagStore::new(Arc::clone(&db), store_event_handler, 5000);

        // link key
        // <RootPrefix>:<fid>:<UserPostfix>:<targetKey?>:<type?>

        // try to list all user keys
        // let hit = db.count_keys_at_prefix(&[RootPrefix::User as u8]);
        // match hit {
        //     Ok(value) => {
        //         println!("{}", value);
        //     }
        //     Err(err) => {
        //         println!("{}", err);
        //     }
        // }

        let r2 = db.for_each_iterator_by_prefix(&[RootPrefix::User as u8], &PageOptions::default(), |key, value| {
            // println!("{:x?}, {:x?}", key, value);

            let ts_hash_offset = 1;
            let fid_offset: usize = ts_hash_offset; // + TS_HASH_LENGTH;

            let fid = u32::from_be_bytes(key[fid_offset..fid_offset + 4].try_into().unwrap());

            let post_fix: u8 = u8::from_be_bytes(key[fid_offset + 4..fid_offset + 5].try_into().unwrap());

            let ts_hash: [u8; 24] = (key[fid_offset + 5..fid_offset + 5 + TS_HASH_LENGTH].try_into().unwrap());

            println!("prefix: {:?}, fid: {}, post_fix: {:?}, ts_hash: {:?}", &[RootPrefix::User as u8], fid, post_fix, pretty_print_hash(ts_hash.to_vec()));

            // let ts_hash = key[ts_hash_offset..ts_hash_offset + TS_HASH_LENGTH]
            //     .try_into()
            //     .unwrap();

            // let message_primary_key = crate::store::message::make_message_primary_key(
            //     fid,
            //     store.postfix(),
            //     Some(&ts_hash),
            // );

            // if r#type.is_empty() || value.eq(r#type.as_bytes()) {
            //     let ts_hash_offset = prefix.len();
            //     let fid_offset: usize = ts_hash_offset + TS_HASH_LENGTH;

            //     let fid =
            //         u32::from_be_bytes(key[fid_offset..fid_offset + 4].try_into().unwrap());
            //     let ts_hash = key[ts_hash_offset..ts_hash_offset + TS_HASH_LENGTH]
            //         .try_into()
            //         .unwrap();
            //     let message_primary_key = crate::store::message::make_message_primary_key(
            //         fid,
            //         store.postfix(),
            //         Some(&ts_hash),
            //     );

            //     message_keys.push(message_primary_key.to_vec());
            //     if message_keys.len() >= page_options.page_size.unwrap_or(PAGE_SIZE_MAX) {
            //         last_key = key.to_vec();
            //         return Ok(true); // Stop iterating
            //     }
            // }

            Ok(false)
        });
        match r2 {
            Err(err) => {
                println!("{}", err);
            }
            Ok(_e) => {
                
            }
        }
        
        // // Add some keys
        // db.put(b"key100", b"value1").unwrap();
        // db.put(b"key101", b"value3").unwrap();
        // db.put(b"key104", b"value4").unwrap();
        // db.put(b"key200", b"value2").unwrap();

        // // Check if keys exist
        // let exists = db.keys_exist(&vec![b"key100".to_vec(), b"key101".to_vec()]);
        // assert_eq!(exists.unwrap(), vec![true, true]);

        let r = TagStore::get_tag_add(&_tag_store, 628598, String::new(), Option::None);
        match r {
            Ok(value) => {
                // if (Some(value)) {
                println!("Value: {:?}", value);
                // }
            }
            Err(err) => {
                println!("Error: {}", err.message);
            }
        }

        // println!("tag_body::Target {}", tag_store.make_tag_adds_key(123, "test"));

        // Cleanup
        // db.destroy().unwrap();
    }
}