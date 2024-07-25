import {
  CastId,
  Message,
  TagAddMessage,
  TagRemoveMessage,
  StoreType,
  getDefaultStoreLimit,
  ObjectRef,
} from "@farcaster/hub-nodejs";
import {
  rsCreateTagStore,
  rsGetTagAdd,
  rsGetTagAddsByFid,
  rsGetTagRemove,
  rsGetTagRemovesByFid,
  rsGetTagsByTarget,
  rustErrorToHubError,
} from "../../rustfunctions.js";
import StoreEventHandler from "./storeEventHandler.js";
import { MessagesPage, PageOptions, StorePruneOptions } from "./types.js";
import { UserPostfix } from "../db/types.js";
import { ResultAsync } from "neverthrow";
import RocksDB from "storage/db/rocksdb.js";
import { RustStoreBase } from "./rustStoreBase.js";
import { messageDecode } from "../../storage/db/message.js";

class TagStore extends RustStoreBase<TagAddMessage, TagRemoveMessage> {
  constructor(db: RocksDB, eventHandler: StoreEventHandler, options: StorePruneOptions = {}) {
    const pruneSizeLimit = options.pruneSizeLimit ?? getDefaultStoreLimit(StoreType.TAGS);
    const rustTagStore = rsCreateTagStore(db.rustDb, eventHandler.getRustStoreEventHandler(), pruneSizeLimit);

    super(db, rustTagStore, UserPostfix.TagMessage, eventHandler, pruneSizeLimit);
  }

  async getTagAdd(fid: number, value: string, target: CastId | string): Promise<TagAddMessage> {
    let targetCastId = Buffer.from([]);
    let targetUrl = "";

    if (typeof target === "string") {
      targetUrl = target;
    } else {
      targetCastId = Buffer.from(CastId.encode(target).finish());
    }

    const result = await ResultAsync.fromPromise(
      rsGetTagAdd(this._rustStore, fid, value, targetCastId, targetUrl),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as TagAddMessage;
  }

  async getTagRemove(fid: number, value: string, target: CastId | string): Promise<TagRemoveMessage> {
    let targetCastId = Buffer.from([]);
    let targetUrl = "";

    if (typeof target === "string") {
      targetUrl = target;
    } else {
      targetCastId = Buffer.from(CastId.encode(target).finish());
    }

    const result = await ResultAsync.fromPromise(
      rsGetTagRemove(this._rustStore, fid, value, targetCastId, targetUrl),
      rustErrorToHubError,
    );
    if (result.isErr()) {
      throw result.error;
    }
    return messageDecode(new Uint8Array(result.value)) as TagRemoveMessage;
  }

  async getTagAddsByFid(
    fid: number,
    value?: string,
    pageOptions: PageOptions = {},
  ): Promise<MessagesPage<TagAddMessage>> {
    const messages_page = await rsGetTagAddsByFid(
      this._rustStore,
      fid,
      value ?? "",
      pageOptions ?? {},
    );

    const messages =
      messages_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as TagAddMessage;
      }) ?? [];

    return { messages, nextPageToken: messages_page.nextPageToken };
  }

  async getTagRemovesByFid(
    fid: number,
    value?: string,
    pageOptions?: PageOptions,
  ): Promise<MessagesPage<TagRemoveMessage>> {
    const message_page = await rsGetTagRemovesByFid(this._rustStore, fid, value ?? "", pageOptions ?? {});

    const messages =
      message_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as TagRemoveMessage;
      }) ?? [];

    return { messages, nextPageToken: message_page.nextPageToken };
  }

  async getAllTagMessagesByFid(
    fid: number,
    pageOptions: PageOptions = {},
  ): Promise<MessagesPage<TagAddMessage | TagRemoveMessage>> {
    return await this.getAllMessagesByFid(fid, pageOptions);
  }

  async getTagsByTarget(
    target: ObjectRef,
    fid?: number,
    value?: string,
    pageOptions: PageOptions = {},
  ): Promise<MessagesPage<TagAddMessage>> {
    
    const targetBuffer = Buffer.from(ObjectRef.encode(target).finish());

    const message_page = await rsGetTagsByTarget(
      this._rustStore,
      targetBuffer,
      fid ?? 0,
      value ?? "",
      pageOptions,
    );

    const messages =
      message_page.messageBytes?.map((message_bytes) => {
        return messageDecode(new Uint8Array(message_bytes)) as TagAddMessage;
      }) ?? [];

    return { messages, nextPageToken: message_page.nextPageToken };
  }
}

export default TagStore;
