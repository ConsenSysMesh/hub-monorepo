import {
  CastId,
  Message,
  ObjectAddMessage,
  ObjectRemoveMessage,
  StoreType,
  getDefaultStoreLimit,
} from "@farcaster/hub-nodejs";
import {
  rsCreateObjectStore,
  rsGetObjectAdd,
  rsGetObjectAddsByFid,
  rsGetObjectRemove,
  rsGetObjectRemovesByFid,
  rustErrorToHubError,
} from "../../rustfunctions.js";
import StoreEventHandler from "./storeEventHandler.js";
import { MessagesPage, PageOptions, StorePruneOptions } from "./types.js";
import { UserPostfix } from "../db/types.js";
import { ResultAsync } from "neverthrow";
import RocksDB from "storage/db/rocksdb.js";
import { RustStoreBase } from "./rustStoreBase.js";
import { messageDecode } from "../../storage/db/message.js";

class ObjectStore extends RustStoreBase<ObjectAddMessage, ObjectRemoveMessage> {
  constructor(db: RocksDB, eventHandler: StoreEventHandler, options: StorePruneOptions = {}) {
    const pruneSizeLimit = options.pruneSizeLimit ?? getDefaultStoreLimit(StoreType.OBJECTS);
    const objectsStore = rsCreateObjectStore(db.rustDb, eventHandler.getRustStoreEventHandler(), pruneSizeLimit);

    super(db, objectsStore, UserPostfix.ObjectMessage, eventHandler, pruneSizeLimit);
  }

  /** Looks up ObjectAdd message by object tsHash */
  async getObjectAdd(fid: number, hash: Uint8Array): Promise<ObjectAddMessage> {
    const hashBytes = Buffer.from(hash);
    const result = await ResultAsync.fromPromise(
      rsGetObjectAdd(this._rustStore, fid, hashBytes),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as ObjectAddMessage;
  }

  /** Looks up ObjectRemove message by target_hash tsHash */
  async getObjectRemove(fid: number, hash: Uint8Array): Promise<ObjectRemoveMessage> {
    const hashBytes = Buffer.from(hash);
    const result = await ResultAsync.fromPromise(
      rsGetObjectRemove(this._rustStore, fid, hashBytes),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as ObjectRemoveMessage;
  }

  async getObjectAddsByFid(
    fid: number,
    type?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<ObjectAddMessage>> {
    const messages_page = await rsGetObjectAddsByFid(
      this._rustStore,
      fid,
      type ?? "",
      pageOptions ?? {},
    );

    const messages =
      messages_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as ObjectAddMessage;
      }) ?? [];

    return { messages, nextPageToken: messages_page.nextPageToken };
  }

  async getObjectRemovesByFid(
    fid: number,
    value?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<ObjectRemoveMessage>> {
    const message_page = await rsGetObjectRemovesByFid(this._rustStore, fid, value ?? "", pageOptions ?? {});

    const messages =
      message_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as ObjectRemoveMessage;
      }) ?? [];

    return { messages, nextPageToken: message_page.nextPageToken };
  }

  async getAllTagMessagesByFid(
    fid: number,
    pageOptions: PageOptions = {},
  ): Promise<MessagesPage<ObjectAddMessage | ObjectRemoveMessage>> {
    return await this.getAllMessagesByFid(fid, pageOptions);
  }
}

export default ObjectStore;
