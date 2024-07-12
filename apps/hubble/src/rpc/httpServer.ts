import {
  ContactInfoResponse,
  FidsResponse,
  HubError,
  HubEvent,
  HubInfoResponse,
  HubResult,
  HubServiceServer,
  Message,
  ObjectResponse,
  MessagesResponse,
  OnChainEvent,
  OnChainEventResponse,
  StorageLimitsResponse,
  UserNameProof,
  UsernameProofsResponse,
  bytesToHexString,
  hexStringToBytes,
  onChainEventTypeFromJSON,
  reactionTypeFromJSON,
  sendUnaryData,
  userDataTypeFromJSON,
  utf8StringToBytes,
  ValidationResponse,
  base58ToBytes,
  bytesToBase58,
  ObjectRef,
  ObjectRefTypes,
  FarcasterNetwork,
} from "@farcaster/hub-nodejs";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { Result, err, ok } from "neverthrow";
import { logger } from "../utils/logger.js";
import { PageOptions } from "../storage/stores/types.js";
import Engine from "../storage/engine/index.js";
import { statsd } from "../utils/statsd.js";
import { DeepPartial } from "storage/stores/rustStoreBase.js";

const log = logger.child({ component: "HttpAPIServer" });

// Some typescript type magic to automatically get types for the grpc methods
// so that we don't have to manually keep them in sync, and we get type checking

// For a function call like getCast(call: ServerUnaryCall<_>, response), this will extract the ServerUnaryCall<_> type
type FirstParameter<T> = T extends (arg1: infer U, ...args: unknown[]) => unknown ? U : never;

// For a string like "getCast", this will extract the call type, e.g. ServerUnaryCall<CastId, Message>
type CallTypeForMethod<M extends keyof HubServiceServer> = FirstParameter<HubServiceServer[M]>;

// For a type like ServerUnaryCall<CastId, Message>, this will extract the CastId type
type FirstGenericType<T> = T extends ServerUnaryCall<infer U, unknown> ? U : never;

// For a string like "getCast", this will extract the CastId type
type FirstTemplateParamType<M extends keyof HubServiceServer> = FirstGenericType<Parameters<HubServiceServer[M]>[0]>;

// Represents the static toJSON method of a protobuf message
type StaticEncodable<T> = {
  toJSON(message: T): unknown;
};

export const DEFAULT_PAGE_SIZE = 1000; // Global maximum limit

// Get the call Object for a given method
function getCallObject<M extends keyof HubServiceServer>(
  method: M,
  params: DeepPartial<FirstTemplateParamType<M>>,
  request: fastify.FastifyRequest,
  metadata?: Metadata,
): CallTypeForMethod<M> {
  statsd().increment(`httpapi.${method}`);

  return {
    request: params,
    metadata,
    getPeer: () => request.ip,
  } as CallTypeForMethod<M>;
}

// Generic handler for grpc methods's responses
function handleResponse<M>(reply: fastify.FastifyReply, obj: StaticEncodable<M>): sendUnaryData<M> {
  return (err, response) => {
    if (err) {
      reply.code(400).type("application/json").send(JSON.stringify(err));
    } else {
      if (response) {
        // Convert the protobuf object to JSON
        const json = protoToJSON(response, obj);
        reply.send(json);
      } else {
        reply.send(err);
      }
    }
  };
}

export function convertB64ToHex(str: string): string {
  if (str.length === 0) {
    return str;
  }

  try {
    // Try to convert the string from base64 to hex
    const bytesBuf = Buffer.from(str, "base64");

    // Check if the decoded base64 string can be converted back to the original base64 string
    // If it can, return the hex string, otherwise return the original string
    return bytesBuf.toString("base64") === str ? bytesToHexString(bytesBuf).unwrapOr("") : str;
  } catch {
    // If an error occurs, return the original string
    return str;
  }
}

export function convertB64ToB58(str: string): string {
  try {
    const bytesBuf = Buffer.from(str, "base64");

    // Check if the decoded base64 string can be converted back to the original base64 string
    // If it can, return the base58 string, otherwise return the original string
    return bytesBuf.toString("base64") === str ? bytesToBase58(bytesBuf).unwrapOr("") : str;
  } catch {
    // If an error occurs, return the original string
    return str;
  }
}

// Map of current key names to old key names that we want to preserve for backwards compatibility reasons
// If you are renaming a protobuf field, add the current name as the key, and the old name as the value, and we
// will copy the contents of the current field to the old field
const BACKWARDS_COMPATIBILITY_MAP: Record<string, string> = {
  verificationAddAddressBody: "verificationAddEthAddressBody",
  claimSignature: "ethSignature",
};

/**
 * The protobuf format specifies encoding bytes as base64 strings, but we want to return hex strings
 * to be consistent with the rest of the API, so we need to convert the base64 strings to hex strings
 * before returning them.
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function transformHash(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // These are the target keys that are base64 encoded, which should be converted to hex
  const toHexKeys = ["hash", "signer", "transactionHash", "key", "owner", "to", "from", "recoveryAddress"];

  // Convert these target keys to strings
  const toStringKeys = ["name"];

  const toHexOrBase58Keys = ["address", "blockHash"];

  for (const key in obj) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (obj.hasOwnProperty(key)) {
      if (toHexKeys.includes(key) && typeof obj[key] === "string") {
        obj[key] = convertB64ToHex(obj[key]);
      } else if (toStringKeys.includes(key) && typeof obj[key] === "string") {
        obj[key] = Buffer.from(obj[key], "base64").toString("utf-8");
      } else if (toHexOrBase58Keys.includes(key) && typeof obj[key] === "string") {
        // We need to convert solana related bytes to base58
        if (obj["protocol"] === "PROTOCOL_SOLANA") {
          obj[key] = convertB64ToB58(obj[key]);
        } else {
          obj[key] = convertB64ToHex(obj[key]);
        }
      } else if (typeof obj[key] === "object") {
        transformHash(obj[key]);
      }

      const backwardsCompatibleName = BACKWARDS_COMPATIBILITY_MAP[key];
      if (backwardsCompatibleName) {
        obj[backwardsCompatibleName] = obj[key];
      }
    }
  }

  return obj;
}

// Generic function to convert protobuf objects to JSON
export function protoToJSON<T>(message: T, obj: StaticEncodable<T>): unknown {
  return transformHash(obj.toJSON(message));
}

// Get a protobuf enum value from a string or number
function getProtobufType<T>(typeName: string, fn: (typeName: unknown) => T): T | undefined {
  const parsedTypeName = parseInt(typeName);
  return Result.fromThrowable(
    () => fn(isNaN(parsedTypeName) ? typeName : parsedTypeName),
    (e) => e,
  )().unwrapOr(undefined);
}

// Paging options that can be passed in as query parameters
type QueryPageParams = {
  pageSize?: number;
  pageToken?: string;
  reverse?: number | boolean;
};

function getPageOptions(query: QueryPageParams): PageOptions {
  const pageSize = query.pageSize ? parseInt(query.pageSize.toString()) : DEFAULT_PAGE_SIZE;

  // Ensure the pageSize does not exceed the global maximum
  const effectivePageSize = Math.min(pageSize, DEFAULT_PAGE_SIZE);

  const pageToken = query.pageToken
    ? Uint8Array.from(Buffer.from(query.pageToken.replaceAll(" ", "+"), "base64"))
    : undefined;

  return {
    pageSize: effectivePageSize,
    pageToken,
    reverse: query.reverse ? true : undefined,
  };
}

export class HttpAPIServer {
  grpcImpl: HubServiceServer;
  engine: Engine;

  app = fastify();

  constructor(grpcImpl: HubServiceServer, engine: Engine, corsOrigin = "*") {
    this.grpcImpl = grpcImpl;
    this.engine = engine;

    // Handle binary data
    this.app.addContentTypeParser("application/octet-stream", { parseAs: "buffer" }, function (req, body, done) {
      done(null, body);
    });

    this.app.setErrorHandler((error, request, reply) => {
      log.error({ err: error, errMsg: error.message, request }, "Error in http request");
      reply.code(500).send({ error: error.message });
    });

    this.app.register(fastifyCors, { origin: [corsOrigin] });
    this.initHandlers();
  }

  getMetadataFromAuthString(authString: string | undefined): Metadata {
    const metadata = new Metadata();
    if (authString) {
      metadata.add("authorization", authString);
    }

    return metadata;
  }

  initHandlers() {
    //================getInfo================
    // @doc-tag: /info?dbstats=...
    this.app.get<{ Querystring: { dbstats: string } }>("/v1/info", (request, reply) => {
      const { dbstats } = request.query;
      const dbStats = dbstats === "true" ? true : parseInt(dbstats) ? true : false;

      const call = getCallObject("getInfo", { dbStats }, request);
      this.grpcImpl.getInfo(call, handleResponse(reply, HubInfoResponse));
    });

    //================currentPeers================
    // @doc-tag: /currentPeers
    this.app.get("/v1/currentPeers", (request, reply) => {
      const call = getCallObject("getCurrentPeers", {}, request);
      this.grpcImpl.getCurrentPeers(call, handleResponse(reply, ContactInfoResponse));
    });

    //================Casts================
    // @doc-tag: /castById?fid=...&hash=...
    this.app.get<{ Querystring: { fid: string; hash: string } }>("/v1/castById", (request, reply) => {
      const { fid, hash } = request.query;

      const call = getCallObject("getCast", { fid: parseInt(fid), hash: hexStringToBytes(hash).unwrapOr([]) }, request);

      this.grpcImpl.getCast(call, handleResponse(reply, Message));
    });

    // @doc-tag: /castsByFid?fid=...
    this.app.get<{ Querystring: QueryPageParams & { fid: string } }>("/v1/castsByFid", (request, reply) => {
      const { fid } = request.query;
      const pageOptions = getPageOptions(request.query);

      const call = getCallObject("getAllCastMessagesByFid", { fid: parseInt(fid), ...pageOptions }, request);
      this.grpcImpl.getAllCastMessagesByFid(call, handleResponse(reply, MessagesResponse));
    });

    // @doc-tag: /castsByParent?fid=...&hash=...
    // @doc-tag: /castsByParent?url=...
    this.app.get<{ Querystring: QueryPageParams & { fid: string; hash: string; url: string } }>(
      "/v1/castsByParent",
      (request, reply) => {
        const { fid, hash, url } = request.query;
        const decodedUrl = decodeURIComponent(url);
        const pageOptions = getPageOptions(request.query);

        let parentCastId = undefined;
        if (fid && hash) {
          parentCastId = { fid: parseInt(fid), hash: hexStringToBytes(hash).unwrapOr([]) };
        }

        const call = getCallObject(
          "getCastsByParent",
          { parentUrl: decodedUrl, parentCastId, ...pageOptions },
          request,
        );
        this.grpcImpl.getCastsByParent(call, handleResponse(reply, MessagesResponse));
      },
    );

    // @doc-tag: /castsByMention?fid=...
    this.app.get<{ Querystring: QueryPageParams & { fid: string } }>("/v1/castsByMention", (request, reply) => {
      const { fid } = request.query;
      const pageOptions = getPageOptions(request.query);

      const call = getCallObject("getCastsByMention", { fid: parseInt(fid), ...pageOptions }, request);
      this.grpcImpl.getCastsByMention(call, handleResponse(reply, MessagesResponse));
    });

    //=================Reactions=================
    // @doc-tag: /reactionById?fid=...&target_fid=...&target_hash=...&reaction_type=...
    this.app.get<{
      Querystring: { reaction_type: string; fid: string; target_fid: string; target_hash: string };
    }>("/v1/reactionById", (request, reply) => {
      const { fid, target_fid, target_hash } = request.query;

      const call = getCallObject(
        "getReaction",
        {
          fid: parseInt(fid),
          targetCastId: { fid: parseInt(target_fid), hash: hexStringToBytes(target_hash).unwrapOr([]) },
          reactionType: getProtobufType(request.query.reaction_type, reactionTypeFromJSON) ?? 0,
        },
        request,
      );

      this.grpcImpl.getReaction(call, handleResponse(reply, Message));
    });

    // @doc-tag: /reactionsByFid?fid=...&reaction_type=...
    this.app.get<{ Querystring: { reaction_type: string; fid: string } & QueryPageParams }>(
      "/v1/reactionsByFid",
      (request, reply) => {
        const { fid } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getReactionsByFid",
          {
            fid: parseInt(fid),
            reactionType: getProtobufType(request.query.reaction_type, reactionTypeFromJSON),
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getReactionsByFid(call, handleResponse(reply, MessagesResponse));
      },
    );

    // @doc-tag: /reactionsByCast?target_fid=...&target_hash=...&reaction_type=...
    this.app.get<{
      Querystring: { target_fid: string; target_hash: string; reaction_type: string } & QueryPageParams;
    }>("/v1/reactionsByCast", (request, reply) => {
      const { target_fid, target_hash } = request.query;
      const pageOptions = getPageOptions(request.query);

      const call = getCallObject(
        "getReactionsByCast",
        {
          targetCastId: { fid: parseInt(target_fid), hash: hexStringToBytes(target_hash).unwrapOr([]) },
          reactionType: getProtobufType(request.query.reaction_type, reactionTypeFromJSON),
          ...pageOptions,
        },
        request,
      );

      this.grpcImpl.getReactionsByCast(call, handleResponse(reply, MessagesResponse));
    });

    // @doc-tag: /reactionsByTarget?url=...&reaction_type=...
    this.app.get<{ Querystring: { url: string; reaction_type: string } & QueryPageParams }>(
      "/v1/reactionsByTarget",
      (request, reply) => {
        const { url } = request.query;
        const pageOptions = getPageOptions(request.query);

        const decodedUrl = decodeURIComponent(url);
        const call = getCallObject(
          "getReactionsByTarget",
          {
            targetUrl: decodedUrl,
            reactionType: getProtobufType(request.query.reaction_type, reactionTypeFromJSON),
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getReactionsByTarget(call, handleResponse(reply, MessagesResponse));
      },
    );

    //=================Tags=================
    // @doc-tag: /tagById?fid=...&target_fid=...&target_hash=...&value=...
    this.app.get<{
      Querystring: { value: string; fid: string; target_fid: string; target_hash: string };
    }>("/v1/tagById", (request, reply) => {
      const { fid, target_fid, target_hash } = request.query;

      const call = getCallObject(
        "getTag",
        {
          fid: parseInt(fid),
          targetCastId: { fid: parseInt(target_fid), hash: hexStringToBytes(target_hash).unwrapOr([]) },
          value: request.query.value,
        },
        request,
      );

      this.grpcImpl.getTag(call, handleResponse(reply, Message));
    });

    // @doc-tag: /tagsByFid?fid=...&value=...
    this.app.get<{ Querystring: { value: string; fid: string } & QueryPageParams }>(
      "/v1/tagsByFid",
      (request, reply) => {
        const { fid, value } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getTagsByFid",
          {
            fid: parseInt(fid),
            value,
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getTagsByFid(call, handleResponse(reply, MessagesResponse));
      },
    );

    // @doc-tag: /reactionsByCast?target_fid=...&target_hash=...&value=...
    // this.app.get<{
    //   Querystring: { target_fid: string; target_hash: string; value: string } & QueryPageParams;
    // }>("/v1/tagsByCast", (request, reply) => {
    //   const { target_fid, target_hash } = request.query;
    //   const pageOptions = getPageOptions(request.query);

    //   const call = getCallObject(
    //     "getTagsByCast",
    //     {
    //       target: {
    //         fid: 301932,
    //       },
    //       name: request.query.name,
    //       ...pageOptions,
    //     },
    //     request,
    //   );

    //   this.grpcImpl.getTagsByCast(call, handleResponse(reply, MessagesResponse));
    // });

    // @doc-tag: /tagsByTarget?type=...&target=...&name=...
    this.app.get<{ Querystring: { targetType: string; targetValue: string; name: string } & QueryPageParams }>(
      "/v1/tagsByTarget",
      (request, reply) => {
        const pageOptions = getPageOptions(request.query);

        // TODO: Fix this
        const call = getCallObject(
          "getTagsByTarget",
          {
            target: {
              fid: 301932,
            },
            name: request.query.name,
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getTagsByTarget(call, handleResponse(reply, MessagesResponse));
      },
    );


    //=================Objects=================
    // @doc-tag: /objectById?fid=...&hash=...
    this.app.get<{
      Querystring: { hash: string; fid: string, includeTags: string, creatorTagsOnly: string };
    }>("/v1/objectById", (request, reply) => {
      const { fid, hash, includeTags, creatorTagsOnly} = request.query;

      const call = getCallObject(
        "getObject",
        {
          fid: parseInt(fid),
          hash: hexStringToBytes(hash).unwrapOr([]),
          tagOptions: {
            includeTags: includeTags === "true",
            creatorTagsOnly: creatorTagsOnly === "true",
          },
        },
        request,
      );

      this.grpcImpl.getObject(call, handleResponse(reply, ObjectResponse));
    });

    // @doc-tag: /objectsByFid?fid=...&type=...
    this.app.get<{ Querystring: { type: string; fid: string } & QueryPageParams }>(
      "/v1/objectsByFid",
      (request, reply) => {
        const { fid, type } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getObjectsByFid",
          {
            fid: parseInt(fid),
            type,
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getObjectsByFid(call, handleResponse(reply, MessagesResponse));
      },
    );

    //=================Relationships=================
    // @doc-tag: /relationshipById?fid=...&hash=...
    this.app.get<{
      Querystring: { hash: string; fid: string };
    }>("/v1/relationshipById", (request, reply) => {
      const { fid, hash } = request.query;

      const call = getCallObject(
        "getRelationship",
        {
          fid: parseInt(fid),
          hash: hexStringToBytes(hash).unwrapOr([]),
        },
        request,
      );

      this.grpcImpl.getRelationship(call, handleResponse(reply, Message));
    });

    // @doc-tag: /relationshipsByFid?fid=...&type=...
    this.app.get<{ Querystring: { type: string; fid: string } & QueryPageParams }>(
      "/v1/relationshipsByFid",
      (request, reply) => {
        const { fid, type } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getRelationshipsByFid",
          {
            fid: parseInt(fid),
            type,
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getRelationshipsByFid(call, handleResponse(reply, MessagesResponse));
      },
    );

    // @doc-tag: /relationshipsBySource?ref_type=Cast/Object/Fid,source_fid=...&source_object_network=...&source_object_fid=...&source_object_hash=...&type=...
    this.app.get<{ Querystring: {
      type: string,
      ref_type: number,
      source_network: number, source_fid: number, source_hash: string,
    } & QueryPageParams }>(
      "/v1/relationshipsBySource",
      (request, reply) => {
        const {
          ref_type,
          source_network, source_fid, source_hash,
          type,
        } = request.query;
        const pageOptions = getPageOptions(request.query);

        let source;
        if (ref_type == ObjectRefTypes.FID) {
          source = ObjectRef.create({ fid: source_fid });
        } else if (source_network && source_fid && source_hash) {
          source = ObjectRef.create({
            network: source_network as FarcasterNetwork,
            fid: source_fid,
            hash: hexStringToBytes(source_hash).unwrapOr(new Uint8Array()),
          });
        } else {
          reply.code(400).send({
            error: "Invalid URL params",
            errorDetail: `For ${ref_type} object reference type, source_network, source_fid and source_hash are required`,
          });
          return;
        }
        const call = getCallObject(
          "getRelationshipsBySource",
          {
            source,
            type,
            ...pageOptions,
          },
          request,
        );

        this.grpcImpl.getRelationshipsBySource(call, handleResponse(reply, MessagesResponse));
      },
    );
  
    //=================Links=================
    // @doc-tag: /linkById?fid=...&target_fid=...&link_type=...
    this.app.get<{ Querystring: { link_type: string; fid: string; target_fid: string } }>(
      "/v1/linkById",
      (request, reply) => {
        const { fid, target_fid } = request.query;

        const call = getCallObject(
          "getLink",
          {
            fid: parseInt(fid),
            targetFid: parseInt(target_fid),
            linkType: request.query.link_type,
          },
          request,
        );

        this.grpcImpl.getLink(call, handleResponse(reply, Message));
      },
    );

    // @doc-tag: /linksByFid?fid=...&link_type=...
    this.app.get<{ Querystring: { link_type: string; fid: string } & QueryPageParams }>(
      "/v1/linksByFid",
      (request, reply) => {
        const { fid } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getLinksByFid",
          { fid: parseInt(fid), linkType: request.query.link_type, ...pageOptions },
          request,
        );

        this.grpcImpl.getLinksByFid(call, handleResponse(reply, MessagesResponse));
      },
    );

    // @doc-tag: /linksByTargetFid?target_fid=...&link_type=...
    this.app.get<{ Params: {}; Querystring: { link_type: string; target_fid: string } & QueryPageParams }>(
      "/v1/linksByTargetFid",
      (request, reply) => {
        const { target_fid } = request.query;
        const pageOptions = getPageOptions(request.query);

        const call = getCallObject(
          "getLinksByTarget",
          { targetFid: parseInt(target_fid), linkType: request.query.link_type, ...pageOptions },
          request,
        );

        this.grpcImpl.getLinksByTarget(call, handleResponse(reply, MessagesResponse));
      },
    );

    //==============User Data================
    // @doc-tag: /userDataByFid?fid=...&user_data_type=...
    this.app.get<{ Querystring: { fid: string; user_data_type: string } & QueryPageParams }>(
      "/v1/userDataByFid",
      (request, reply) => {
        const { fid } = request.query;
        const pageOptions = getPageOptions(request.query);
        const userDataType = getProtobufType(request.query.user_data_type, userDataTypeFromJSON);

        if (userDataType) {
          const call = getCallObject("getUserData", { fid: parseInt(fid), userDataType, ...pageOptions }, request);
          this.grpcImpl.getUserData(call, handleResponse(reply, Message));
        } else {
          const call = getCallObject("getUserDataByFid", { fid: parseInt(fid), ...pageOptions }, request);
          this.grpcImpl.getUserDataByFid(call, handleResponse(reply, MessagesResponse));
        }
      },
    );

    //=================FIDs=================
    // @doc-tag: /fids
    this.app.get<{ Querystring: QueryPageParams }>("/v1/fids", (request, reply) => {
      const pageOptions = getPageOptions(request.query);

      const call = getCallObject("getFids", pageOptions, request);
      this.grpcImpl.getFids(call, handleResponse(reply, FidsResponse));
    });

    //=================Storage API================
    // @doc-tag: /storageLimitsByFid?fid=...
    this.app.get<{ Querystring: { fid: string } }>("/v1/storageLimitsByFid", (request, reply) => {
      const { fid } = request.query;

      const call = getCallObject("getCurrentStorageLimitsByFid", { fid: parseInt(fid) }, request);
      this.grpcImpl.getCurrentStorageLimitsByFid(call, handleResponse(reply, StorageLimitsResponse));
    });

    //===============Username Proofs=================
    // @doc-tag: /userNameProofByName?name=...
    this.app.get<{ Querystring: { name: string } }>("/v1/userNameProofByName", (request, reply) => {
      const { name } = request.query;

      const fnameBytes = utf8StringToBytes(name).unwrapOr(new Uint8Array());

      const call = getCallObject("getUsernameProof", { name: fnameBytes }, request);
      this.grpcImpl.getUsernameProof(call, handleResponse(reply, UserNameProof));
    });

    // @doc-tag: /userNameProofsByFid?fid=...
    this.app.get<{ Querystring: { fid: string } }>("/v1/userNameProofsByFid", (request, reply) => {
      const { fid } = request.query;

      const call = getCallObject("getUserNameProofsByFid", { fid: parseInt(fid) }, request);
      this.grpcImpl.getUserNameProofsByFid(call, handleResponse(reply, UsernameProofsResponse));
    });

    //=============Verifications================
    // @doc-tag: /verificationsByFid?fid=...&address=...
    this.app.get<{ Querystring: { fid: string; address: string } }>("/v1/verificationsByFid", (request, reply) => {
      const { fid, address } = request.query;

      if (address) {
        // Eth addresses are hex encoded and sol addresses are base58 encoded, determine which by checking length
        const addressBytes = address.length === 42 ? hexStringToBytes(address) : base58ToBytes(address);
        const call = getCallObject(
          "getVerification",
          { fid: parseInt(fid), address: addressBytes.unwrapOr(new Uint8Array()) },
          request,
        );
        this.grpcImpl.getVerification(call, handleResponse(reply, Message));
      } else {
        const call = getCallObject("getVerificationsByFid", { fid: parseInt(fid) }, request);
        this.grpcImpl.getVerificationsByFid(call, handleResponse(reply, MessagesResponse));
      }
    });

    //================On Chain Events================
    // @doc-tag: /onChainSignersByFid?fid=...&signer=...
    this.app.get<{ Querystring: { signer: string; fid: string } & QueryPageParams }>(
      "/v1/onChainSignersByFid",
      (request, reply) => {
        const { fid, signer } = request.query;

        if (signer) {
          const call = getCallObject(
            "getOnChainSigner",
            { fid: parseInt(fid), signer: hexStringToBytes(signer).unwrapOr(new Uint8Array()) },
            request,
          );
          this.grpcImpl.getOnChainSigner(call, handleResponse(reply, OnChainEvent));
        } else {
          const pageOptions = getPageOptions(request.query);
          const call = getCallObject("getOnChainSignersByFid", { fid: parseInt(fid), ...pageOptions }, request);
          this.grpcImpl.getOnChainSignersByFid(call, handleResponse(reply, OnChainEventResponse));
        }
      },
    );

    // @doc-tag /onChainEventsByFid?fid=...&event_type=...
    this.app.get<{ Querystring: { fid: string; event_type: string } & QueryPageParams }>(
      "/v1/onChainEventsByFid",
      (request, reply) => {
        const { fid } = request.query;
        const pageOptions = getPageOptions(request.query);
        const eventType = getProtobufType(request.query.event_type, onChainEventTypeFromJSON) ?? 0;

        const call = getCallObject("getOnChainEvents", { fid: parseInt(fid), eventType, ...pageOptions }, request);
        this.grpcImpl.getOnChainEvents(call, handleResponse(reply, OnChainEventResponse));
      },
    );

    // @doc-tag /onChainIdRegistryEventByAddress?address=...
    this.app.get<{ Querystring: { address: string } }>("/v1/onChainIdRegistryEventByAddress", (request, reply) => {
      const { address } = request.query;

      const call = getCallObject(
        "getIdRegistryOnChainEventByAddress",
        { address: hexStringToBytes(address).unwrapOr(new Uint8Array()) },
        request,
      );
      this.grpcImpl.getIdRegistryOnChainEventByAddress(call, handleResponse(reply, OnChainEvent));
    });

    //==================Submit Message==================
    // @doc-tag: /submitMessage
    this.app.post<{ Body: Buffer }>("/v1/submitMessage", (request, reply) => {
      // Get the Body content-type
      const contentType = request.headers["content-type"] as string;

      let message;
      if (contentType === "application/octet-stream") {
        // The Posted Body is a serialized Message protobuf
        const parsedMessage = Result.fromThrowable(
          () => Message.decode(request.body),
          (e) => e as Error,
        )();

        if (parsedMessage.isErr()) {
          reply.code(400).send({
            error:
              "Could not parse Message. This API accepts only Message protobufs encoded into bytes (application/octet-stream)",
            errorDetail: parsedMessage.error.message,
          });
          return;
        } else {
          message = parsedMessage.value;
        }
      } else {
        reply.code(400).send({
          error: "Unsupported Media Type",
          errorDetail: `Content-Type ${contentType} is not supported`,
        });
        return;
      }

      // Grab and forward any authorization headers
      const metadata = this.getMetadataFromAuthString(request?.headers?.authorization);
      const call = getCallObject("submitMessage", message, request, metadata);
      this.grpcImpl.submitMessage(call, handleResponse(reply, Message));
    });

    //==================Validate Message==================
    // @doc-tag: /validateMessage
    this.app.post<{ Body: Buffer }>("/v1/validateMessage", (request, reply) => {
      // Get the Body content-type
      const contentType = request.headers["content-type"] as string;

      let message;
      if (contentType === "application/octet-stream") {
        // The Posted Body is a serialized Message protobuf
        const parsedMessage = Result.fromThrowable(
          () => Message.decode(request.body),
          (e) => e as Error,
        )();

        if (parsedMessage.isErr()) {
          reply.code(400).send({
            error:
              "Could not parse Message. This API accepts only Message protobufs encoded into bytes (application/octet-stream)",
            errorDetail: parsedMessage.error.message,
          });
          return;
        } else {
          message = parsedMessage.value;
        }
      } else {
        reply.code(400).send({
          error: "Unsupported Media Type",
          errorDetail: `Content-Type ${contentType} is not supported`,
        });
        return;
      }

      const call = getCallObject("validateMessage", message, request);
      this.grpcImpl.validateMessage(call, handleResponse(reply, ValidationResponse));
    });

    //==================Events==================
    // @doc-tag: /eventById?event_id=...
    this.app.get<{ Querystring: { event_id: string } }>("/v1/eventById", (request, reply) => {
      const { event_id: id } = request.query;

      const call = getCallObject("getEvent", { id: parseInt(id) }, request);
      this.grpcImpl.getEvent(call, handleResponse(reply, HubEvent));
    });

    // @doc-tag /events?from_event_id=...
    this.app.get<{ Querystring: { from_event_id: string } }>("/v1/events", (request, reply) => {
      const { from_event_id } = request.query;

      this.engine.getEvents(parseInt(from_event_id)).then((resp) => {
        if (resp.isErr()) {
          reply.code(400).send({ error: resp.error.message });
        } else {
          const nextPageEventId = resp.value.nextPageEventId;
          statsd().increment("httpapi.events");
          const events = resp.value.events.map((event) => protoToJSON(event, HubEvent));
          reply.send({ nextPageEventId, events });
        }
      });
    });
  }

  async start(ip = "0.0.0.0", port = 0): Promise<HubResult<string>> {
    return new Promise((resolve) => {
      this.app.listen({ host: ip, port }, (e, address) => {
        if (e) {
          log.error({ err: e, errMsg: e.message }, "Failed to start http server");
          resolve(err(new HubError("unavailable.network_failure", `Failed to start http server: ${e.message}`)));
        }

        log.info({ address }, "Started http API server");
        resolve(ok(address));
      });
    });
  }

  async stop() {
    await this.app.close();
    log.info("Stopped http API server");
  }
}
