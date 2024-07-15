import {
  RelationshipAddMessage,
  RelationshipRemoveMessage,
  StoreType,
  getDefaultStoreLimit,
  ObjectRef,
  RelatedObjectTypes,
} from "@farcaster/hub-nodejs";
import {
  rsCreateRelationshipStore,
  rsGetRelationshipAdd,
  rsGetRelationshipAddsByFid,
  rsGetRelationshipRemove,
  rsGetRelationshipRemovesByFid,
  rsGetRelationshipsByRelatedObjectRef,
  rustErrorToHubError,
} from "../../rustfunctions.js";
import StoreEventHandler from "./storeEventHandler.js";
import { MessagesPage, PageOptions, StorePruneOptions } from "./types.js";
import { UserPostfix } from "../db/types.js";
import { ResultAsync } from "neverthrow";
import RocksDB from "storage/db/rocksdb.js";
import { RustStoreBase } from "./rustStoreBase.js";
import { messageDecode } from "../../storage/db/message.js";

class RelationshipStore extends RustStoreBase<RelationshipAddMessage, RelationshipRemoveMessage> {
  constructor(db: RocksDB, eventHandler: StoreEventHandler, options: StorePruneOptions = {}) {
    const pruneSizeLimit = options.pruneSizeLimit ?? getDefaultStoreLimit(StoreType.RELATIONSHIPS);
    const relationshipsStore = rsCreateRelationshipStore(db.rustDb, eventHandler.getRustStoreEventHandler(), pruneSizeLimit);

    super(db, relationshipsStore, UserPostfix.RelationshipMessage, eventHandler, pruneSizeLimit);
  }

  /** Looks up RelationshipAdd message by relationship tsHash */
  async getRelationshipAdd(fid: number, hash: Uint8Array): Promise<RelationshipAddMessage> {
    const hashBytes = Buffer.from(hash);
    const result = await ResultAsync.fromPromise(
      rsGetRelationshipAdd(this._rustStore, fid, hashBytes),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as RelationshipAddMessage;
  }

  /** Looks up RelationshipRemove message by target_hash tsHash */
  async getRelationshipRemove(fid: number, hash: Uint8Array): Promise<RelationshipRemoveMessage> {
    const hashBytes = Buffer.from(hash);
    const result = await ResultAsync.fromPromise(
      rsGetRelationshipRemove(this._rustStore, fid, hashBytes),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as RelationshipRemoveMessage;
  }

  async getRelationshipAddsByFid(
    fid: number,
    type?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<RelationshipAddMessage>> {
    const messages_page = await rsGetRelationshipAddsByFid(
      this._rustStore,
      fid,
      type ?? "",
      pageOptions ?? {},
    );

    const messages =
      messages_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as RelationshipAddMessage;
      }) ?? [];

    return { messages, nextPageToken: messages_page.nextPageToken };
  }

  async getRelationshipRemovesByFid(
    fid: number,
    value?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<RelationshipRemoveMessage>> {
    const message_page = await rsGetRelationshipRemovesByFid(this._rustStore, fid, value ?? "", pageOptions ?? {});

    const messages =
      message_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as RelationshipRemoveMessage;
      }) ?? [];

    return { messages, nextPageToken: message_page.nextPageToken };
  }

  async getAllRelationshipMessagesByFid(
    fid: number,
    pageOptions: PageOptions = {},
  ): Promise<MessagesPage<RelationshipAddMessage | RelationshipRemoveMessage>> {
    return await this.getAllMessagesByFid(fid, pageOptions);
  }

  async getRelationshipsByRelatedObjectRef(
    relatedObjectRef: ObjectRef,
    relatedObjectRefType: RelatedObjectTypes,
    type?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<RelationshipAddMessage>> {
    const relatedObjectRefBuffer = Buffer.from(ObjectRef.encode(relatedObjectRef).finish());
    const messages_page = await rsGetRelationshipsByRelatedObjectRef(
      this._rustStore,
      relatedObjectRefBuffer,
      relatedObjectRefType,
      type ?? "",
      pageOptions ?? {},
    );

    const messages =
      messages_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as RelationshipAddMessage;
      }) ?? [];

    return { messages, nextPageToken: messages_page.nextPageToken };
  }
}

export default RelationshipStore;
