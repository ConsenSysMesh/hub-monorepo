/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { UserNameProof } from "./username_proof";

/** Type of hashing scheme used to produce a digest of MessageData */
export enum HashScheme {
  NONE = 0,
  /** BLAKE3 - Default scheme for hashing MessageData */
  BLAKE3 = 1,
}

export function hashSchemeFromJSON(object: any): HashScheme {
  switch (object) {
    case 0:
    case "HASH_SCHEME_NONE":
      return HashScheme.NONE;
    case 1:
    case "HASH_SCHEME_BLAKE3":
      return HashScheme.BLAKE3;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum HashScheme");
  }
}

export function hashSchemeToJSON(object: HashScheme): string {
  switch (object) {
    case HashScheme.NONE:
      return "HASH_SCHEME_NONE";
    case HashScheme.BLAKE3:
      return "HASH_SCHEME_BLAKE3";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum HashScheme");
  }
}

/** Type of signature scheme used to sign the Message hash */
export enum SignatureScheme {
  NONE = 0,
  /** ED25519 - Ed25519 signature (default) */
  ED25519 = 1,
  /** EIP712 - ECDSA signature using EIP-712 scheme */
  EIP712 = 2,
}

export function signatureSchemeFromJSON(object: any): SignatureScheme {
  switch (object) {
    case 0:
    case "SIGNATURE_SCHEME_NONE":
      return SignatureScheme.NONE;
    case 1:
    case "SIGNATURE_SCHEME_ED25519":
      return SignatureScheme.ED25519;
    case 2:
    case "SIGNATURE_SCHEME_EIP712":
      return SignatureScheme.EIP712;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum SignatureScheme");
  }
}

export function signatureSchemeToJSON(object: SignatureScheme): string {
  switch (object) {
    case SignatureScheme.NONE:
      return "SIGNATURE_SCHEME_NONE";
    case SignatureScheme.ED25519:
      return "SIGNATURE_SCHEME_ED25519";
    case SignatureScheme.EIP712:
      return "SIGNATURE_SCHEME_EIP712";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum SignatureScheme");
  }
}

/** Type of the MessageBody */
export enum MessageType {
  NONE = 0,
  /** CAST_ADD - Add a new Cast */
  CAST_ADD = 1,
  /** CAST_REMOVE - Remove an existing Cast */
  CAST_REMOVE = 2,
  /** REACTION_ADD - Add a Reaction to a Cast */
  REACTION_ADD = 3,
  /** REACTION_REMOVE - Remove a Reaction from a Cast */
  REACTION_REMOVE = 4,
  /** LINK_ADD - Add a new Link */
  LINK_ADD = 5,
  /** LINK_REMOVE - Remove an existing Link */
  LINK_REMOVE = 6,
  /** VERIFICATION_ADD_ETH_ADDRESS - Add a Verification of an Ethereum Address */
  VERIFICATION_ADD_ETH_ADDRESS = 7,
  /** VERIFICATION_REMOVE - Remove a Verification */
  VERIFICATION_REMOVE = 8,
  /**
   * USER_DATA_ADD - Deprecated
   *  MESSAGE_TYPE_SIGNER_ADD = 9; // Add a new Ed25519 key pair that signs messages for a user
   *  MESSAGE_TYPE_SIGNER_REMOVE = 10; // Remove an Ed25519 key pair that signs messages for a user
   */
  USER_DATA_ADD = 11,
  /** USERNAME_PROOF - Add or replace a username proof */
  USERNAME_PROOF = 12,
  /** FRAME_ACTION - A Farcaster Frame action */
  FRAME_ACTION = 13,
  /** LINK_COMPACT_STATE - Link Compaction State Message */
  LINK_COMPACT_STATE = 14,
  /** TAG_ADD - Add a Tag to a Cast */
  TAG_ADD = 15,
  /** TAG_REMOVE - Remove a Tag from a Cast */
  TAG_REMOVE = 16,
  /** OBJECT_ADD - Add a generic Object */
  OBJECT_ADD = 17,
  /** OBJECT_REMOVE - Remove a generic Object */
  OBJECT_REMOVE = 18,
  /** RELATIONSHIP_ADD - Add a generic Relationship */
  RELATIONSHIP_ADD = 19,
  /** RELATIONSHIP_REMOVE - Remove a generic Relationship */
  RELATIONSHIP_REMOVE = 20,
}

export function messageTypeFromJSON(object: any): MessageType {
  switch (object) {
    case 0:
    case "MESSAGE_TYPE_NONE":
      return MessageType.NONE;
    case 1:
    case "MESSAGE_TYPE_CAST_ADD":
      return MessageType.CAST_ADD;
    case 2:
    case "MESSAGE_TYPE_CAST_REMOVE":
      return MessageType.CAST_REMOVE;
    case 3:
    case "MESSAGE_TYPE_REACTION_ADD":
      return MessageType.REACTION_ADD;
    case 4:
    case "MESSAGE_TYPE_REACTION_REMOVE":
      return MessageType.REACTION_REMOVE;
    case 5:
    case "MESSAGE_TYPE_LINK_ADD":
      return MessageType.LINK_ADD;
    case 6:
    case "MESSAGE_TYPE_LINK_REMOVE":
      return MessageType.LINK_REMOVE;
    case 7:
    case "MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS":
      return MessageType.VERIFICATION_ADD_ETH_ADDRESS;
    case 8:
    case "MESSAGE_TYPE_VERIFICATION_REMOVE":
      return MessageType.VERIFICATION_REMOVE;
    case 11:
    case "MESSAGE_TYPE_USER_DATA_ADD":
      return MessageType.USER_DATA_ADD;
    case 12:
    case "MESSAGE_TYPE_USERNAME_PROOF":
      return MessageType.USERNAME_PROOF;
    case 13:
    case "MESSAGE_TYPE_FRAME_ACTION":
      return MessageType.FRAME_ACTION;
    case 14:
    case "MESSAGE_TYPE_LINK_COMPACT_STATE":
      return MessageType.LINK_COMPACT_STATE;
    case 15:
    case "MESSAGE_TYPE_TAG_ADD":
      return MessageType.TAG_ADD;
    case 16:
    case "MESSAGE_TYPE_TAG_REMOVE":
      return MessageType.TAG_REMOVE;
    case 17:
    case "MESSAGE_TYPE_OBJECT_ADD":
      return MessageType.OBJECT_ADD;
    case 18:
    case "MESSAGE_TYPE_OBJECT_REMOVE":
      return MessageType.OBJECT_REMOVE;
    case 19:
    case "MESSAGE_TYPE_RELATIONSHIP_ADD":
      return MessageType.RELATIONSHIP_ADD;
    case 20:
    case "MESSAGE_TYPE_RELATIONSHIP_REMOVE":
      return MessageType.RELATIONSHIP_REMOVE;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum MessageType");
  }
}

export function messageTypeToJSON(object: MessageType): string {
  switch (object) {
    case MessageType.NONE:
      return "MESSAGE_TYPE_NONE";
    case MessageType.CAST_ADD:
      return "MESSAGE_TYPE_CAST_ADD";
    case MessageType.CAST_REMOVE:
      return "MESSAGE_TYPE_CAST_REMOVE";
    case MessageType.REACTION_ADD:
      return "MESSAGE_TYPE_REACTION_ADD";
    case MessageType.REACTION_REMOVE:
      return "MESSAGE_TYPE_REACTION_REMOVE";
    case MessageType.LINK_ADD:
      return "MESSAGE_TYPE_LINK_ADD";
    case MessageType.LINK_REMOVE:
      return "MESSAGE_TYPE_LINK_REMOVE";
    case MessageType.VERIFICATION_ADD_ETH_ADDRESS:
      return "MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS";
    case MessageType.VERIFICATION_REMOVE:
      return "MESSAGE_TYPE_VERIFICATION_REMOVE";
    case MessageType.USER_DATA_ADD:
      return "MESSAGE_TYPE_USER_DATA_ADD";
    case MessageType.USERNAME_PROOF:
      return "MESSAGE_TYPE_USERNAME_PROOF";
    case MessageType.FRAME_ACTION:
      return "MESSAGE_TYPE_FRAME_ACTION";
    case MessageType.LINK_COMPACT_STATE:
      return "MESSAGE_TYPE_LINK_COMPACT_STATE";
    case MessageType.TAG_ADD:
      return "MESSAGE_TYPE_TAG_ADD";
    case MessageType.TAG_REMOVE:
      return "MESSAGE_TYPE_TAG_REMOVE";
    case MessageType.OBJECT_ADD:
      return "MESSAGE_TYPE_OBJECT_ADD";
    case MessageType.OBJECT_REMOVE:
      return "MESSAGE_TYPE_OBJECT_REMOVE";
    case MessageType.RELATIONSHIP_ADD:
      return "MESSAGE_TYPE_RELATIONSHIP_ADD";
    case MessageType.RELATIONSHIP_REMOVE:
      return "MESSAGE_TYPE_RELATIONSHIP_REMOVE";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum MessageType");
  }
}

/** Farcaster network the message is intended for */
export enum FarcasterNetwork {
  NONE = 0,
  /** MAINNET - Public primary network */
  MAINNET = 1,
  /** TESTNET - Public test network */
  TESTNET = 2,
  /** DEVNET - Private test network */
  DEVNET = 3,
}

export function farcasterNetworkFromJSON(object: any): FarcasterNetwork {
  switch (object) {
    case 0:
    case "FARCASTER_NETWORK_NONE":
      return FarcasterNetwork.NONE;
    case 1:
    case "FARCASTER_NETWORK_MAINNET":
      return FarcasterNetwork.MAINNET;
    case 2:
    case "FARCASTER_NETWORK_TESTNET":
      return FarcasterNetwork.TESTNET;
    case 3:
    case "FARCASTER_NETWORK_DEVNET":
      return FarcasterNetwork.DEVNET;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum FarcasterNetwork");
  }
}

export function farcasterNetworkToJSON(object: FarcasterNetwork): string {
  switch (object) {
    case FarcasterNetwork.NONE:
      return "FARCASTER_NETWORK_NONE";
    case FarcasterNetwork.MAINNET:
      return "FARCASTER_NETWORK_MAINNET";
    case FarcasterNetwork.TESTNET:
      return "FARCASTER_NETWORK_TESTNET";
    case FarcasterNetwork.DEVNET:
      return "FARCASTER_NETWORK_DEVNET";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum FarcasterNetwork");
  }
}

/** Type of UserData */
export enum UserDataType {
  NONE = 0,
  /** PFP - Profile Picture for the user */
  PFP = 1,
  /** DISPLAY - Display Name for the user */
  DISPLAY = 2,
  /** BIO - Bio for the user */
  BIO = 3,
  /** URL - URL of the user */
  URL = 5,
  /** USERNAME - Preferred Name for the user */
  USERNAME = 6,
}

export function userDataTypeFromJSON(object: any): UserDataType {
  switch (object) {
    case 0:
    case "USER_DATA_TYPE_NONE":
      return UserDataType.NONE;
    case 1:
    case "USER_DATA_TYPE_PFP":
      return UserDataType.PFP;
    case 2:
    case "USER_DATA_TYPE_DISPLAY":
      return UserDataType.DISPLAY;
    case 3:
    case "USER_DATA_TYPE_BIO":
      return UserDataType.BIO;
    case 5:
    case "USER_DATA_TYPE_URL":
      return UserDataType.URL;
    case 6:
    case "USER_DATA_TYPE_USERNAME":
      return UserDataType.USERNAME;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum UserDataType");
  }
}

export function userDataTypeToJSON(object: UserDataType): string {
  switch (object) {
    case UserDataType.NONE:
      return "USER_DATA_TYPE_NONE";
    case UserDataType.PFP:
      return "USER_DATA_TYPE_PFP";
    case UserDataType.DISPLAY:
      return "USER_DATA_TYPE_DISPLAY";
    case UserDataType.BIO:
      return "USER_DATA_TYPE_BIO";
    case UserDataType.URL:
      return "USER_DATA_TYPE_URL";
    case UserDataType.USERNAME:
      return "USER_DATA_TYPE_USERNAME";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum UserDataType");
  }
}

/** Type of Reaction */
export enum ReactionType {
  NONE = 0,
  /** LIKE - Like the target cast */
  LIKE = 1,
  /** RECAST - Share target cast to the user's audience */
  RECAST = 2,
  /** DISLIKE - Dislike/downvote the target cast */
  DISLIKE = 3,
}

export function reactionTypeFromJSON(object: any): ReactionType {
  switch (object) {
    case 0:
    case "REACTION_TYPE_NONE":
      return ReactionType.NONE;
    case 1:
    case "REACTION_TYPE_LIKE":
      return ReactionType.LIKE;
    case 2:
    case "REACTION_TYPE_RECAST":
      return ReactionType.RECAST;
    case 3:
    case "REACTION_TYPE_DISLIKE":
      return ReactionType.DISLIKE;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum ReactionType");
  }
}

export function reactionTypeToJSON(object: ReactionType): string {
  switch (object) {
    case ReactionType.NONE:
      return "REACTION_TYPE_NONE";
    case ReactionType.LIKE:
      return "REACTION_TYPE_LIKE";
    case ReactionType.RECAST:
      return "REACTION_TYPE_RECAST";
    case ReactionType.DISLIKE:
      return "REACTION_TYPE_DISLIKE";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum ReactionType");
  }
}

/** Type of Protocol to disambiguate verification addresses */
export enum Protocol {
  ETHEREUM = 0,
  SOLANA = 1,
}

export function protocolFromJSON(object: any): Protocol {
  switch (object) {
    case 0:
    case "PROTOCOL_ETHEREUM":
      return Protocol.ETHEREUM;
    case 1:
    case "PROTOCOL_SOLANA":
      return Protocol.SOLANA;
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum Protocol");
  }
}

export function protocolToJSON(object: Protocol): string {
  switch (object) {
    case Protocol.ETHEREUM:
      return "PROTOCOL_ETHEREUM";
    case Protocol.SOLANA:
      return "PROTOCOL_SOLANA";
    default:
      throw new tsProtoGlobalThis.Error("Unrecognized enum value " + object + " for enum Protocol");
  }
}

/**
 * A Message is a delta operation on the Farcaster network. The message protobuf is an envelope
 * that wraps a MessageData object and contains a hash and signature which can verify its authenticity.
 */
export interface Message {
  /** Contents of the message */
  data:
    | MessageData
    | undefined;
  /** Hash digest of data */
  hash: Uint8Array;
  /** Hash scheme that produced the hash digest */
  hashScheme: HashScheme;
  /** Signature of the hash digest */
  signature: Uint8Array;
  /** Signature scheme that produced the signature */
  signatureScheme: SignatureScheme;
  /** Public key or address of the key pair that produced the signature */
  signer: Uint8Array;
  /** MessageData serialized to bytes if using protobuf serialization other than ts-proto */
  dataBytes?: Uint8Array | undefined;
}

/**
 * A MessageData object contains properties common to all messages and wraps a body object which
 * contains properties specific to the MessageType.
 */
export interface MessageData {
  /** Type of message contained in the body */
  type: MessageType;
  /** Farcaster ID of the user producing the message */
  fid: number;
  /** Farcaster epoch timestamp in seconds */
  timestamp: number;
  /** Farcaster network the message is intended for */
  network: FarcasterNetwork;
  castAddBody?: CastAddBody | undefined;
  castRemoveBody?: CastRemoveBody | undefined;
  reactionBody?: ReactionBody | undefined;
  verificationAddAddressBody?: VerificationAddAddressBody | undefined;
  verificationRemoveBody?:
    | VerificationRemoveBody
    | undefined;
  /** SignerAddBody signer_add_body = 11; // Deprecated */
  userDataBody?:
    | UserDataBody
    | undefined;
  /** SignerRemoveBody signer_remove_body = 13; // Deprecated */
  linkBody?: LinkBody | undefined;
  usernameProofBody?: UserNameProof | undefined;
  frameActionBody?:
    | FrameActionBody
    | undefined;
  /** Compaction messages */
  linkCompactStateBody?: LinkCompactStateBody | undefined;
  tagBody?: TagBody | undefined;
  objectAddBody?: ObjectAddBody | undefined;
  objectRemoveBody?: ObjectRemoveBody | undefined;
  relationshipAddBody?: RelationshipAddBody | undefined;
  relationshipRemoveBody?: RelationshipRemoveBody | undefined;
}

/** Adds metadata about a user */
export interface UserDataBody {
  /** Type of metadata */
  type: UserDataType;
  /** Value of the metadata */
  value: string;
}

export interface Embed {
  url?: string | undefined;
  castId?: CastId | undefined;
}

/** Adds a new Cast */
export interface CastAddBody {
  /** URLs to be embedded in the cast */
  embedsDeprecated: string[];
  /** Fids mentioned in the cast */
  mentions: number[];
  /** Parent cast of the cast */
  parentCastId?:
    | CastId
    | undefined;
  /** Parent URL */
  parentUrl?:
    | string
    | undefined;
  /** Text of the cast */
  text: string;
  /** Positions of the mentions in the text */
  mentionsPositions: number[];
  /** URLs or cast ids to be embedded in the cast */
  embeds: Embed[];
}

/** Removes an existing Cast */
export interface CastRemoveBody {
  /** Hash of the cast to remove */
  targetHash: Uint8Array;
}

/** Identifier used to look up a Cast */
export interface CastId {
  /** Fid of the user who created the cast */
  fid: number;
  /** Hash of the cast */
  hash: Uint8Array;
}

/** Adds or removes a Reaction from a Cast */
export interface ReactionBody {
  /** Type of reaction */
  type: ReactionType;
  /** CastId of the Cast to react to */
  targetCastId?:
    | CastId
    | undefined;
  /** URL to react to */
  targetUrl?: string | undefined;
}

/** Generic reference to an H1/H2 object */
export interface ObjectKey {
  network: FarcasterNetwork;
  hash: Uint8Array;
  fid: number;
}

export interface ObjectRef {
  /** Add CID later */
  fid?:
    | number
    | undefined;
  /** ref to an H1 cast */
  castKey?:
    | ObjectKey
    | undefined;
  /** ref to an H2 object */
  objectKey?:
    | ObjectKey
    | undefined;
  /** ref to an H2 relationship */
  relationshipKey?: ObjectKey | undefined;
}

/** Adds or removes a Tag from a Cast */
export interface TagBody {
  /** Tag value */
  name: string;
  content?: string | undefined;
  target: ObjectRef | undefined;
}

/** Identifier used to look up an H2 Object (equivalent to CastId atm) */
export interface ObjectId {
  /** Fid of the user who created the object */
  fid: number;
  /** Hash of the object */
  hash: Uint8Array;
}

/** Generic object at H2 */
export interface ObjectAddBody {
  /** Type of object (completely user-defined, thus a string) */
  type: string;
  displayName?:
    | string
    | undefined;
  /** base64 encoded image or a URL? */
  avatar?: string | undefined;
  description?: string | undefined;
}

/** Removes an existing Cast */
export interface ObjectRemoveBody {
  /** Hash of the object to remove */
  targetHash: Uint8Array;
}

/** Generic relationship at H2 */
export interface RelationshipAddBody {
  /** Type of relationship (completely user-defined, thus a string) */
  type: string;
  /** The implied directionality of the relationship is from source towards the target */
  source: ObjectRef | undefined;
  target: ObjectRef | undefined;
}

/** Removes an existing Cast */
export interface RelationshipRemoveBody {
  /** Hash of the relationship to remove */
  targetHash: Uint8Array;
}

/** Adds a Verification of ownership of an Address based on Protocol */
export interface VerificationAddAddressBody {
  /** Address being verified for a given Protocol */
  address: Uint8Array;
  /** Signature produced by the user's address for a given Protocol */
  claimSignature: Uint8Array;
  /** Hash of the latest Ethereum block when the signature was produced */
  blockHash: Uint8Array;
  /** Type of verification. 0 = EOA, 1 = contract */
  verificationType: number;
  /** 0 for EOA verifications, 1 or 10 for contract verifications */
  chainId: number;
  /** Protocol of the Verification */
  protocol: Protocol;
}

/** Removes a Verification of a given protocol */
export interface VerificationRemoveBody {
  /** Address of the Verification to remove */
  address: Uint8Array;
  /** Protocol of the Verification to remove */
  protocol: Protocol;
}

/** Adds or removes a Link */
export interface LinkBody {
  /** Type of link, <= 8 characters */
  type: string;
  /** User-defined timestamp that preserves original timestamp when message.data.timestamp needs to be updated for compaction */
  displayTimestamp?:
    | number
    | undefined;
  /** The fid the link relates to */
  targetFid?: number | undefined;
}

/** A Compaction message for the Link Store */
export interface LinkCompactStateBody {
  /** Type of link, <= 8 characters */
  type: string;
  targetFids: number[];
}

/** A Farcaster Frame action */
export interface FrameActionBody {
  /** URL of the Frame triggering the action */
  url: Uint8Array;
  /** The index of the button pressed (1-4) */
  buttonIndex: number;
  /** The cast which contained the frame url */
  castId:
    | CastId
    | undefined;
  /** Text input from the user, if present */
  inputText: Uint8Array;
  /** Serialized frame state value */
  state: Uint8Array;
  /** Chain-specific transaction ID for tx actions */
  transactionId: Uint8Array;
  /** Chain-specific address for tx actions */
  address: Uint8Array;
}

function createBaseMessage(): Message {
  return {
    data: undefined,
    hash: new Uint8Array(),
    hashScheme: 0,
    signature: new Uint8Array(),
    signatureScheme: 0,
    signer: new Uint8Array(),
    dataBytes: undefined,
  };
}

export const Message = {
  encode(message: Message, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== undefined) {
      MessageData.encode(message.data, writer.uint32(10).fork()).ldelim();
    }
    if (message.hash.length !== 0) {
      writer.uint32(18).bytes(message.hash);
    }
    if (message.hashScheme !== 0) {
      writer.uint32(24).int32(message.hashScheme);
    }
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature);
    }
    if (message.signatureScheme !== 0) {
      writer.uint32(40).int32(message.signatureScheme);
    }
    if (message.signer.length !== 0) {
      writer.uint32(50).bytes(message.signer);
    }
    if (message.dataBytes !== undefined) {
      writer.uint32(58).bytes(message.dataBytes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Message {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.data = MessageData.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.hash = reader.bytes();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.hashScheme = reader.int32() as any;
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.signature = reader.bytes();
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.signatureScheme = reader.int32() as any;
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.signer = reader.bytes();
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.dataBytes = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Message {
    return {
      data: isSet(object.data) ? MessageData.fromJSON(object.data) : undefined,
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(),
      hashScheme: isSet(object.hashScheme) ? hashSchemeFromJSON(object.hashScheme) : 0,
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
      signatureScheme: isSet(object.signatureScheme) ? signatureSchemeFromJSON(object.signatureScheme) : 0,
      signer: isSet(object.signer) ? bytesFromBase64(object.signer) : new Uint8Array(),
      dataBytes: isSet(object.dataBytes) ? bytesFromBase64(object.dataBytes) : undefined,
    };
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    message.data !== undefined && (obj.data = message.data ? MessageData.toJSON(message.data) : undefined);
    message.hash !== undefined &&
      (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
    message.hashScheme !== undefined && (obj.hashScheme = hashSchemeToJSON(message.hashScheme));
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    message.signatureScheme !== undefined && (obj.signatureScheme = signatureSchemeToJSON(message.signatureScheme));
    message.signer !== undefined &&
      (obj.signer = base64FromBytes(message.signer !== undefined ? message.signer : new Uint8Array()));
    message.dataBytes !== undefined &&
      (obj.dataBytes = message.dataBytes !== undefined ? base64FromBytes(message.dataBytes) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Message>, I>>(base?: I): Message {
    return Message.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Message>, I>>(object: I): Message {
    const message = createBaseMessage();
    message.data = (object.data !== undefined && object.data !== null)
      ? MessageData.fromPartial(object.data)
      : undefined;
    message.hash = object.hash ?? new Uint8Array();
    message.hashScheme = object.hashScheme ?? 0;
    message.signature = object.signature ?? new Uint8Array();
    message.signatureScheme = object.signatureScheme ?? 0;
    message.signer = object.signer ?? new Uint8Array();
    message.dataBytes = object.dataBytes ?? undefined;
    return message;
  },
};

function createBaseMessageData(): MessageData {
  return {
    type: 0,
    fid: 0,
    timestamp: 0,
    network: 0,
    castAddBody: undefined,
    castRemoveBody: undefined,
    reactionBody: undefined,
    verificationAddAddressBody: undefined,
    verificationRemoveBody: undefined,
    userDataBody: undefined,
    linkBody: undefined,
    usernameProofBody: undefined,
    frameActionBody: undefined,
    linkCompactStateBody: undefined,
    tagBody: undefined,
    objectAddBody: undefined,
    objectRemoveBody: undefined,
    relationshipAddBody: undefined,
    relationshipRemoveBody: undefined,
  };
}

export const MessageData = {
  encode(message: MessageData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.fid !== 0) {
      writer.uint32(16).uint64(message.fid);
    }
    if (message.timestamp !== 0) {
      writer.uint32(24).uint32(message.timestamp);
    }
    if (message.network !== 0) {
      writer.uint32(32).int32(message.network);
    }
    if (message.castAddBody !== undefined) {
      CastAddBody.encode(message.castAddBody, writer.uint32(42).fork()).ldelim();
    }
    if (message.castRemoveBody !== undefined) {
      CastRemoveBody.encode(message.castRemoveBody, writer.uint32(50).fork()).ldelim();
    }
    if (message.reactionBody !== undefined) {
      ReactionBody.encode(message.reactionBody, writer.uint32(58).fork()).ldelim();
    }
    if (message.verificationAddAddressBody !== undefined) {
      VerificationAddAddressBody.encode(message.verificationAddAddressBody, writer.uint32(74).fork()).ldelim();
    }
    if (message.verificationRemoveBody !== undefined) {
      VerificationRemoveBody.encode(message.verificationRemoveBody, writer.uint32(82).fork()).ldelim();
    }
    if (message.userDataBody !== undefined) {
      UserDataBody.encode(message.userDataBody, writer.uint32(98).fork()).ldelim();
    }
    if (message.linkBody !== undefined) {
      LinkBody.encode(message.linkBody, writer.uint32(114).fork()).ldelim();
    }
    if (message.usernameProofBody !== undefined) {
      UserNameProof.encode(message.usernameProofBody, writer.uint32(122).fork()).ldelim();
    }
    if (message.frameActionBody !== undefined) {
      FrameActionBody.encode(message.frameActionBody, writer.uint32(130).fork()).ldelim();
    }
    if (message.linkCompactStateBody !== undefined) {
      LinkCompactStateBody.encode(message.linkCompactStateBody, writer.uint32(138).fork()).ldelim();
    }
    if (message.tagBody !== undefined) {
      TagBody.encode(message.tagBody, writer.uint32(146).fork()).ldelim();
    }
    if (message.objectAddBody !== undefined) {
      ObjectAddBody.encode(message.objectAddBody, writer.uint32(154).fork()).ldelim();
    }
    if (message.objectRemoveBody !== undefined) {
      ObjectRemoveBody.encode(message.objectRemoveBody, writer.uint32(162).fork()).ldelim();
    }
    if (message.relationshipAddBody !== undefined) {
      RelationshipAddBody.encode(message.relationshipAddBody, writer.uint32(170).fork()).ldelim();
    }
    if (message.relationshipRemoveBody !== undefined) {
      RelationshipRemoveBody.encode(message.relationshipRemoveBody, writer.uint32(178).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.timestamp = reader.uint32();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.network = reader.int32() as any;
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.castAddBody = CastAddBody.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.castRemoveBody = CastRemoveBody.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.reactionBody = ReactionBody.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag != 74) {
            break;
          }

          message.verificationAddAddressBody = VerificationAddAddressBody.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag != 82) {
            break;
          }

          message.verificationRemoveBody = VerificationRemoveBody.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag != 98) {
            break;
          }

          message.userDataBody = UserDataBody.decode(reader, reader.uint32());
          continue;
        case 14:
          if (tag != 114) {
            break;
          }

          message.linkBody = LinkBody.decode(reader, reader.uint32());
          continue;
        case 15:
          if (tag != 122) {
            break;
          }

          message.usernameProofBody = UserNameProof.decode(reader, reader.uint32());
          continue;
        case 16:
          if (tag != 130) {
            break;
          }

          message.frameActionBody = FrameActionBody.decode(reader, reader.uint32());
          continue;
        case 17:
          if (tag != 138) {
            break;
          }

          message.linkCompactStateBody = LinkCompactStateBody.decode(reader, reader.uint32());
          continue;
        case 18:
          if (tag != 146) {
            break;
          }

          message.tagBody = TagBody.decode(reader, reader.uint32());
          continue;
        case 19:
          if (tag != 154) {
            break;
          }

          message.objectAddBody = ObjectAddBody.decode(reader, reader.uint32());
          continue;
        case 20:
          if (tag != 162) {
            break;
          }

          message.objectRemoveBody = ObjectRemoveBody.decode(reader, reader.uint32());
          continue;
        case 21:
          if (tag != 170) {
            break;
          }

          message.relationshipAddBody = RelationshipAddBody.decode(reader, reader.uint32());
          continue;
        case 22:
          if (tag != 178) {
            break;
          }

          message.relationshipRemoveBody = RelationshipRemoveBody.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MessageData {
    return {
      type: isSet(object.type) ? messageTypeFromJSON(object.type) : 0,
      fid: isSet(object.fid) ? Number(object.fid) : 0,
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      network: isSet(object.network) ? farcasterNetworkFromJSON(object.network) : 0,
      castAddBody: isSet(object.castAddBody) ? CastAddBody.fromJSON(object.castAddBody) : undefined,
      castRemoveBody: isSet(object.castRemoveBody) ? CastRemoveBody.fromJSON(object.castRemoveBody) : undefined,
      reactionBody: isSet(object.reactionBody) ? ReactionBody.fromJSON(object.reactionBody) : undefined,
      verificationAddAddressBody: isSet(object.verificationAddAddressBody)
        ? VerificationAddAddressBody.fromJSON(object.verificationAddAddressBody)
        : undefined,
      verificationRemoveBody: isSet(object.verificationRemoveBody)
        ? VerificationRemoveBody.fromJSON(object.verificationRemoveBody)
        : undefined,
      userDataBody: isSet(object.userDataBody) ? UserDataBody.fromJSON(object.userDataBody) : undefined,
      linkBody: isSet(object.linkBody) ? LinkBody.fromJSON(object.linkBody) : undefined,
      usernameProofBody: isSet(object.usernameProofBody) ? UserNameProof.fromJSON(object.usernameProofBody) : undefined,
      frameActionBody: isSet(object.frameActionBody) ? FrameActionBody.fromJSON(object.frameActionBody) : undefined,
      linkCompactStateBody: isSet(object.linkCompactStateBody)
        ? LinkCompactStateBody.fromJSON(object.linkCompactStateBody)
        : undefined,
      tagBody: isSet(object.tagBody) ? TagBody.fromJSON(object.tagBody) : undefined,
      objectAddBody: isSet(object.objectAddBody) ? ObjectAddBody.fromJSON(object.objectAddBody) : undefined,
      objectRemoveBody: isSet(object.objectRemoveBody) ? ObjectRemoveBody.fromJSON(object.objectRemoveBody) : undefined,
      relationshipAddBody: isSet(object.relationshipAddBody)
        ? RelationshipAddBody.fromJSON(object.relationshipAddBody)
        : undefined,
      relationshipRemoveBody: isSet(object.relationshipRemoveBody)
        ? RelationshipRemoveBody.fromJSON(object.relationshipRemoveBody)
        : undefined,
    };
  },

  toJSON(message: MessageData): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = messageTypeToJSON(message.type));
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    message.network !== undefined && (obj.network = farcasterNetworkToJSON(message.network));
    message.castAddBody !== undefined &&
      (obj.castAddBody = message.castAddBody ? CastAddBody.toJSON(message.castAddBody) : undefined);
    message.castRemoveBody !== undefined &&
      (obj.castRemoveBody = message.castRemoveBody ? CastRemoveBody.toJSON(message.castRemoveBody) : undefined);
    message.reactionBody !== undefined &&
      (obj.reactionBody = message.reactionBody ? ReactionBody.toJSON(message.reactionBody) : undefined);
    message.verificationAddAddressBody !== undefined &&
      (obj.verificationAddAddressBody = message.verificationAddAddressBody
        ? VerificationAddAddressBody.toJSON(message.verificationAddAddressBody)
        : undefined);
    message.verificationRemoveBody !== undefined && (obj.verificationRemoveBody = message.verificationRemoveBody
      ? VerificationRemoveBody.toJSON(message.verificationRemoveBody)
      : undefined);
    message.userDataBody !== undefined &&
      (obj.userDataBody = message.userDataBody ? UserDataBody.toJSON(message.userDataBody) : undefined);
    message.linkBody !== undefined && (obj.linkBody = message.linkBody ? LinkBody.toJSON(message.linkBody) : undefined);
    message.usernameProofBody !== undefined &&
      (obj.usernameProofBody = message.usernameProofBody ? UserNameProof.toJSON(message.usernameProofBody) : undefined);
    message.frameActionBody !== undefined &&
      (obj.frameActionBody = message.frameActionBody ? FrameActionBody.toJSON(message.frameActionBody) : undefined);
    message.linkCompactStateBody !== undefined && (obj.linkCompactStateBody = message.linkCompactStateBody
      ? LinkCompactStateBody.toJSON(message.linkCompactStateBody)
      : undefined);
    message.tagBody !== undefined && (obj.tagBody = message.tagBody ? TagBody.toJSON(message.tagBody) : undefined);
    message.objectAddBody !== undefined &&
      (obj.objectAddBody = message.objectAddBody ? ObjectAddBody.toJSON(message.objectAddBody) : undefined);
    message.objectRemoveBody !== undefined &&
      (obj.objectRemoveBody = message.objectRemoveBody ? ObjectRemoveBody.toJSON(message.objectRemoveBody) : undefined);
    message.relationshipAddBody !== undefined && (obj.relationshipAddBody = message.relationshipAddBody
      ? RelationshipAddBody.toJSON(message.relationshipAddBody)
      : undefined);
    message.relationshipRemoveBody !== undefined && (obj.relationshipRemoveBody = message.relationshipRemoveBody
      ? RelationshipRemoveBody.toJSON(message.relationshipRemoveBody)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<MessageData>, I>>(base?: I): MessageData {
    return MessageData.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MessageData>, I>>(object: I): MessageData {
    const message = createBaseMessageData();
    message.type = object.type ?? 0;
    message.fid = object.fid ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.network = object.network ?? 0;
    message.castAddBody = (object.castAddBody !== undefined && object.castAddBody !== null)
      ? CastAddBody.fromPartial(object.castAddBody)
      : undefined;
    message.castRemoveBody = (object.castRemoveBody !== undefined && object.castRemoveBody !== null)
      ? CastRemoveBody.fromPartial(object.castRemoveBody)
      : undefined;
    message.reactionBody = (object.reactionBody !== undefined && object.reactionBody !== null)
      ? ReactionBody.fromPartial(object.reactionBody)
      : undefined;
    message.verificationAddAddressBody =
      (object.verificationAddAddressBody !== undefined && object.verificationAddAddressBody !== null)
        ? VerificationAddAddressBody.fromPartial(object.verificationAddAddressBody)
        : undefined;
    message.verificationRemoveBody =
      (object.verificationRemoveBody !== undefined && object.verificationRemoveBody !== null)
        ? VerificationRemoveBody.fromPartial(object.verificationRemoveBody)
        : undefined;
    message.userDataBody = (object.userDataBody !== undefined && object.userDataBody !== null)
      ? UserDataBody.fromPartial(object.userDataBody)
      : undefined;
    message.linkBody = (object.linkBody !== undefined && object.linkBody !== null)
      ? LinkBody.fromPartial(object.linkBody)
      : undefined;
    message.usernameProofBody = (object.usernameProofBody !== undefined && object.usernameProofBody !== null)
      ? UserNameProof.fromPartial(object.usernameProofBody)
      : undefined;
    message.frameActionBody = (object.frameActionBody !== undefined && object.frameActionBody !== null)
      ? FrameActionBody.fromPartial(object.frameActionBody)
      : undefined;
    message.linkCompactStateBody = (object.linkCompactStateBody !== undefined && object.linkCompactStateBody !== null)
      ? LinkCompactStateBody.fromPartial(object.linkCompactStateBody)
      : undefined;
    message.tagBody = (object.tagBody !== undefined && object.tagBody !== null)
      ? TagBody.fromPartial(object.tagBody)
      : undefined;
    message.objectAddBody = (object.objectAddBody !== undefined && object.objectAddBody !== null)
      ? ObjectAddBody.fromPartial(object.objectAddBody)
      : undefined;
    message.objectRemoveBody = (object.objectRemoveBody !== undefined && object.objectRemoveBody !== null)
      ? ObjectRemoveBody.fromPartial(object.objectRemoveBody)
      : undefined;
    message.relationshipAddBody = (object.relationshipAddBody !== undefined && object.relationshipAddBody !== null)
      ? RelationshipAddBody.fromPartial(object.relationshipAddBody)
      : undefined;
    message.relationshipRemoveBody =
      (object.relationshipRemoveBody !== undefined && object.relationshipRemoveBody !== null)
        ? RelationshipRemoveBody.fromPartial(object.relationshipRemoveBody)
        : undefined;
    return message;
  },
};

function createBaseUserDataBody(): UserDataBody {
  return { type: 0, value: "" };
}

export const UserDataBody = {
  encode(message: UserDataBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserDataBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserDataBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserDataBody {
    return {
      type: isSet(object.type) ? userDataTypeFromJSON(object.type) : 0,
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: UserDataBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = userDataTypeToJSON(message.type));
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  create<I extends Exact<DeepPartial<UserDataBody>, I>>(base?: I): UserDataBody {
    return UserDataBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UserDataBody>, I>>(object: I): UserDataBody {
    const message = createBaseUserDataBody();
    message.type = object.type ?? 0;
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseEmbed(): Embed {
  return { url: undefined, castId: undefined };
}

export const Embed = {
  encode(message: Embed, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url !== undefined) {
      writer.uint32(10).string(message.url);
    }
    if (message.castId !== undefined) {
      CastId.encode(message.castId, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Embed {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEmbed();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.url = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.castId = CastId.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Embed {
    return {
      url: isSet(object.url) ? String(object.url) : undefined,
      castId: isSet(object.castId) ? CastId.fromJSON(object.castId) : undefined,
    };
  },

  toJSON(message: Embed): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.castId !== undefined && (obj.castId = message.castId ? CastId.toJSON(message.castId) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<Embed>, I>>(base?: I): Embed {
    return Embed.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Embed>, I>>(object: I): Embed {
    const message = createBaseEmbed();
    message.url = object.url ?? undefined;
    message.castId = (object.castId !== undefined && object.castId !== null)
      ? CastId.fromPartial(object.castId)
      : undefined;
    return message;
  },
};

function createBaseCastAddBody(): CastAddBody {
  return {
    embedsDeprecated: [],
    mentions: [],
    parentCastId: undefined,
    parentUrl: undefined,
    text: "",
    mentionsPositions: [],
    embeds: [],
  };
}

export const CastAddBody = {
  encode(message: CastAddBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.embedsDeprecated) {
      writer.uint32(10).string(v!);
    }
    writer.uint32(18).fork();
    for (const v of message.mentions) {
      writer.uint64(v);
    }
    writer.ldelim();
    if (message.parentCastId !== undefined) {
      CastId.encode(message.parentCastId, writer.uint32(26).fork()).ldelim();
    }
    if (message.parentUrl !== undefined) {
      writer.uint32(58).string(message.parentUrl);
    }
    if (message.text !== "") {
      writer.uint32(34).string(message.text);
    }
    writer.uint32(42).fork();
    for (const v of message.mentionsPositions) {
      writer.uint32(v);
    }
    writer.ldelim();
    for (const v of message.embeds) {
      Embed.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CastAddBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCastAddBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.embedsDeprecated.push(reader.string());
          continue;
        case 2:
          if (tag == 16) {
            message.mentions.push(longToNumber(reader.uint64() as Long));
            continue;
          }

          if (tag == 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.mentions.push(longToNumber(reader.uint64() as Long));
            }

            continue;
          }

          break;
        case 3:
          if (tag != 26) {
            break;
          }

          message.parentCastId = CastId.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.parentUrl = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.text = reader.string();
          continue;
        case 5:
          if (tag == 40) {
            message.mentionsPositions.push(reader.uint32());
            continue;
          }

          if (tag == 42) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.mentionsPositions.push(reader.uint32());
            }

            continue;
          }

          break;
        case 6:
          if (tag != 50) {
            break;
          }

          message.embeds.push(Embed.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CastAddBody {
    return {
      embedsDeprecated: Array.isArray(object?.embedsDeprecated)
        ? object.embedsDeprecated.map((e: any) => String(e))
        : [],
      mentions: Array.isArray(object?.mentions) ? object.mentions.map((e: any) => Number(e)) : [],
      parentCastId: isSet(object.parentCastId) ? CastId.fromJSON(object.parentCastId) : undefined,
      parentUrl: isSet(object.parentUrl) ? String(object.parentUrl) : undefined,
      text: isSet(object.text) ? String(object.text) : "",
      mentionsPositions: Array.isArray(object?.mentionsPositions)
        ? object.mentionsPositions.map((e: any) => Number(e))
        : [],
      embeds: Array.isArray(object?.embeds) ? object.embeds.map((e: any) => Embed.fromJSON(e)) : [],
    };
  },

  toJSON(message: CastAddBody): unknown {
    const obj: any = {};
    if (message.embedsDeprecated) {
      obj.embedsDeprecated = message.embedsDeprecated.map((e) => e);
    } else {
      obj.embedsDeprecated = [];
    }
    if (message.mentions) {
      obj.mentions = message.mentions.map((e) => Math.round(e));
    } else {
      obj.mentions = [];
    }
    message.parentCastId !== undefined &&
      (obj.parentCastId = message.parentCastId ? CastId.toJSON(message.parentCastId) : undefined);
    message.parentUrl !== undefined && (obj.parentUrl = message.parentUrl);
    message.text !== undefined && (obj.text = message.text);
    if (message.mentionsPositions) {
      obj.mentionsPositions = message.mentionsPositions.map((e) => Math.round(e));
    } else {
      obj.mentionsPositions = [];
    }
    if (message.embeds) {
      obj.embeds = message.embeds.map((e) => e ? Embed.toJSON(e) : undefined);
    } else {
      obj.embeds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CastAddBody>, I>>(base?: I): CastAddBody {
    return CastAddBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CastAddBody>, I>>(object: I): CastAddBody {
    const message = createBaseCastAddBody();
    message.embedsDeprecated = object.embedsDeprecated?.map((e) => e) || [];
    message.mentions = object.mentions?.map((e) => e) || [];
    message.parentCastId = (object.parentCastId !== undefined && object.parentCastId !== null)
      ? CastId.fromPartial(object.parentCastId)
      : undefined;
    message.parentUrl = object.parentUrl ?? undefined;
    message.text = object.text ?? "";
    message.mentionsPositions = object.mentionsPositions?.map((e) => e) || [];
    message.embeds = object.embeds?.map((e) => Embed.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCastRemoveBody(): CastRemoveBody {
  return { targetHash: new Uint8Array() };
}

export const CastRemoveBody = {
  encode(message: CastRemoveBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHash.length !== 0) {
      writer.uint32(10).bytes(message.targetHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CastRemoveBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCastRemoveBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.targetHash = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CastRemoveBody {
    return { targetHash: isSet(object.targetHash) ? bytesFromBase64(object.targetHash) : new Uint8Array() };
  },

  toJSON(message: CastRemoveBody): unknown {
    const obj: any = {};
    message.targetHash !== undefined &&
      (obj.targetHash = base64FromBytes(message.targetHash !== undefined ? message.targetHash : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<CastRemoveBody>, I>>(base?: I): CastRemoveBody {
    return CastRemoveBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CastRemoveBody>, I>>(object: I): CastRemoveBody {
    const message = createBaseCastRemoveBody();
    message.targetHash = object.targetHash ?? new Uint8Array();
    return message;
  },
};

function createBaseCastId(): CastId {
  return { fid: 0, hash: new Uint8Array() };
}

export const CastId = {
  encode(message: CastId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fid !== 0) {
      writer.uint32(8).uint64(message.fid);
    }
    if (message.hash.length !== 0) {
      writer.uint32(18).bytes(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CastId {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCastId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.hash = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CastId {
    return {
      fid: isSet(object.fid) ? Number(object.fid) : 0,
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(),
    };
  },

  toJSON(message: CastId): unknown {
    const obj: any = {};
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.hash !== undefined &&
      (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<CastId>, I>>(base?: I): CastId {
    return CastId.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CastId>, I>>(object: I): CastId {
    const message = createBaseCastId();
    message.fid = object.fid ?? 0;
    message.hash = object.hash ?? new Uint8Array();
    return message;
  },
};

function createBaseReactionBody(): ReactionBody {
  return { type: 0, targetCastId: undefined, targetUrl: undefined };
}

export const ReactionBody = {
  encode(message: ReactionBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.targetCastId !== undefined) {
      CastId.encode(message.targetCastId, writer.uint32(18).fork()).ldelim();
    }
    if (message.targetUrl !== undefined) {
      writer.uint32(26).string(message.targetUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReactionBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReactionBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.targetCastId = CastId.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.targetUrl = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReactionBody {
    return {
      type: isSet(object.type) ? reactionTypeFromJSON(object.type) : 0,
      targetCastId: isSet(object.targetCastId) ? CastId.fromJSON(object.targetCastId) : undefined,
      targetUrl: isSet(object.targetUrl) ? String(object.targetUrl) : undefined,
    };
  },

  toJSON(message: ReactionBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = reactionTypeToJSON(message.type));
    message.targetCastId !== undefined &&
      (obj.targetCastId = message.targetCastId ? CastId.toJSON(message.targetCastId) : undefined);
    message.targetUrl !== undefined && (obj.targetUrl = message.targetUrl);
    return obj;
  },

  create<I extends Exact<DeepPartial<ReactionBody>, I>>(base?: I): ReactionBody {
    return ReactionBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ReactionBody>, I>>(object: I): ReactionBody {
    const message = createBaseReactionBody();
    message.type = object.type ?? 0;
    message.targetCastId = (object.targetCastId !== undefined && object.targetCastId !== null)
      ? CastId.fromPartial(object.targetCastId)
      : undefined;
    message.targetUrl = object.targetUrl ?? undefined;
    return message;
  },
};

function createBaseObjectKey(): ObjectKey {
  return { network: 0, hash: new Uint8Array(), fid: 0 };
}

export const ObjectKey = {
  encode(message: ObjectKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.network !== 0) {
      writer.uint32(8).int32(message.network);
    }
    if (message.hash.length !== 0) {
      writer.uint32(26).bytes(message.hash);
    }
    if (message.fid !== 0) {
      writer.uint32(32).uint64(message.fid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.network = reader.int32() as any;
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.hash = reader.bytes();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectKey {
    return {
      network: isSet(object.network) ? farcasterNetworkFromJSON(object.network) : 0,
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(),
      fid: isSet(object.fid) ? Number(object.fid) : 0,
    };
  },

  toJSON(message: ObjectKey): unknown {
    const obj: any = {};
    message.network !== undefined && (obj.network = farcasterNetworkToJSON(message.network));
    message.hash !== undefined &&
      (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectKey>, I>>(base?: I): ObjectKey {
    return ObjectKey.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ObjectKey>, I>>(object: I): ObjectKey {
    const message = createBaseObjectKey();
    message.network = object.network ?? 0;
    message.hash = object.hash ?? new Uint8Array();
    message.fid = object.fid ?? 0;
    return message;
  },
};

function createBaseObjectRef(): ObjectRef {
  return { fid: undefined, castKey: undefined, objectKey: undefined, relationshipKey: undefined };
}

export const ObjectRef = {
  encode(message: ObjectRef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fid !== undefined) {
      writer.uint32(8).uint64(message.fid);
    }
    if (message.castKey !== undefined) {
      ObjectKey.encode(message.castKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.objectKey !== undefined) {
      ObjectKey.encode(message.objectKey, writer.uint32(26).fork()).ldelim();
    }
    if (message.relationshipKey !== undefined) {
      ObjectKey.encode(message.relationshipKey, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectRef {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectRef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.castKey = ObjectKey.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.objectKey = ObjectKey.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.relationshipKey = ObjectKey.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectRef {
    return {
      fid: isSet(object.fid) ? Number(object.fid) : undefined,
      castKey: isSet(object.castKey) ? ObjectKey.fromJSON(object.castKey) : undefined,
      objectKey: isSet(object.objectKey) ? ObjectKey.fromJSON(object.objectKey) : undefined,
      relationshipKey: isSet(object.relationshipKey) ? ObjectKey.fromJSON(object.relationshipKey) : undefined,
    };
  },

  toJSON(message: ObjectRef): unknown {
    const obj: any = {};
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.castKey !== undefined && (obj.castKey = message.castKey ? ObjectKey.toJSON(message.castKey) : undefined);
    message.objectKey !== undefined &&
      (obj.objectKey = message.objectKey ? ObjectKey.toJSON(message.objectKey) : undefined);
    message.relationshipKey !== undefined &&
      (obj.relationshipKey = message.relationshipKey ? ObjectKey.toJSON(message.relationshipKey) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectRef>, I>>(base?: I): ObjectRef {
    return ObjectRef.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ObjectRef>, I>>(object: I): ObjectRef {
    const message = createBaseObjectRef();
    message.fid = object.fid ?? undefined;
    message.castKey = (object.castKey !== undefined && object.castKey !== null)
      ? ObjectKey.fromPartial(object.castKey)
      : undefined;
    message.objectKey = (object.objectKey !== undefined && object.objectKey !== null)
      ? ObjectKey.fromPartial(object.objectKey)
      : undefined;
    message.relationshipKey = (object.relationshipKey !== undefined && object.relationshipKey !== null)
      ? ObjectKey.fromPartial(object.relationshipKey)
      : undefined;
    return message;
  },
};

function createBaseTagBody(): TagBody {
  return { name: "", content: undefined, target: undefined };
}

export const TagBody = {
  encode(message: TagBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.content !== undefined) {
      writer.uint32(18).string(message.content);
    }
    if (message.target !== undefined) {
      ObjectRef.encode(message.target, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TagBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTagBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.content = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.target = ObjectRef.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TagBody {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      content: isSet(object.content) ? String(object.content) : undefined,
      target: isSet(object.target) ? ObjectRef.fromJSON(object.target) : undefined,
    };
  },

  toJSON(message: TagBody): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.content !== undefined && (obj.content = message.content);
    message.target !== undefined && (obj.target = message.target ? ObjectRef.toJSON(message.target) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<TagBody>, I>>(base?: I): TagBody {
    return TagBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TagBody>, I>>(object: I): TagBody {
    const message = createBaseTagBody();
    message.name = object.name ?? "";
    message.content = object.content ?? undefined;
    message.target = (object.target !== undefined && object.target !== null)
      ? ObjectRef.fromPartial(object.target)
      : undefined;
    return message;
  },
};

function createBaseObjectId(): ObjectId {
  return { fid: 0, hash: new Uint8Array() };
}

export const ObjectId = {
  encode(message: ObjectId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fid !== 0) {
      writer.uint32(8).uint64(message.fid);
    }
    if (message.hash.length !== 0) {
      writer.uint32(18).bytes(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectId {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectId();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 8) {
            break;
          }

          message.fid = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.hash = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectId {
    return {
      fid: isSet(object.fid) ? Number(object.fid) : 0,
      hash: isSet(object.hash) ? bytesFromBase64(object.hash) : new Uint8Array(),
    };
  },

  toJSON(message: ObjectId): unknown {
    const obj: any = {};
    message.fid !== undefined && (obj.fid = Math.round(message.fid));
    message.hash !== undefined &&
      (obj.hash = base64FromBytes(message.hash !== undefined ? message.hash : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectId>, I>>(base?: I): ObjectId {
    return ObjectId.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ObjectId>, I>>(object: I): ObjectId {
    const message = createBaseObjectId();
    message.fid = object.fid ?? 0;
    message.hash = object.hash ?? new Uint8Array();
    return message;
  },
};

function createBaseObjectAddBody(): ObjectAddBody {
  return { type: "", displayName: undefined, avatar: undefined, description: undefined };
}

export const ObjectAddBody = {
  encode(message: ObjectAddBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.displayName !== undefined) {
      writer.uint32(18).string(message.displayName);
    }
    if (message.avatar !== undefined) {
      writer.uint32(26).string(message.avatar);
    }
    if (message.description !== undefined) {
      writer.uint32(34).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectAddBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectAddBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.displayName = reader.string();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.avatar = reader.string();
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.description = reader.string();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectAddBody {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : undefined,
      avatar: isSet(object.avatar) ? String(object.avatar) : undefined,
      description: isSet(object.description) ? String(object.description) : undefined,
    };
  },

  toJSON(message: ObjectAddBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.displayName !== undefined && (obj.displayName = message.displayName);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectAddBody>, I>>(base?: I): ObjectAddBody {
    return ObjectAddBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ObjectAddBody>, I>>(object: I): ObjectAddBody {
    const message = createBaseObjectAddBody();
    message.type = object.type ?? "";
    message.displayName = object.displayName ?? undefined;
    message.avatar = object.avatar ?? undefined;
    message.description = object.description ?? undefined;
    return message;
  },
};

function createBaseObjectRemoveBody(): ObjectRemoveBody {
  return { targetHash: new Uint8Array() };
}

export const ObjectRemoveBody = {
  encode(message: ObjectRemoveBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHash.length !== 0) {
      writer.uint32(10).bytes(message.targetHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ObjectRemoveBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseObjectRemoveBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.targetHash = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ObjectRemoveBody {
    return { targetHash: isSet(object.targetHash) ? bytesFromBase64(object.targetHash) : new Uint8Array() };
  },

  toJSON(message: ObjectRemoveBody): unknown {
    const obj: any = {};
    message.targetHash !== undefined &&
      (obj.targetHash = base64FromBytes(message.targetHash !== undefined ? message.targetHash : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<ObjectRemoveBody>, I>>(base?: I): ObjectRemoveBody {
    return ObjectRemoveBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ObjectRemoveBody>, I>>(object: I): ObjectRemoveBody {
    const message = createBaseObjectRemoveBody();
    message.targetHash = object.targetHash ?? new Uint8Array();
    return message;
  },
};

function createBaseRelationshipAddBody(): RelationshipAddBody {
  return { type: "", source: undefined, target: undefined };
}

export const RelationshipAddBody = {
  encode(message: RelationshipAddBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.source !== undefined) {
      ObjectRef.encode(message.source, writer.uint32(18).fork()).ldelim();
    }
    if (message.target !== undefined) {
      ObjectRef.encode(message.target, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelationshipAddBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationshipAddBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.source = ObjectRef.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.target = ObjectRef.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RelationshipAddBody {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      source: isSet(object.source) ? ObjectRef.fromJSON(object.source) : undefined,
      target: isSet(object.target) ? ObjectRef.fromJSON(object.target) : undefined,
    };
  },

  toJSON(message: RelationshipAddBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.source !== undefined && (obj.source = message.source ? ObjectRef.toJSON(message.source) : undefined);
    message.target !== undefined && (obj.target = message.target ? ObjectRef.toJSON(message.target) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<RelationshipAddBody>, I>>(base?: I): RelationshipAddBody {
    return RelationshipAddBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RelationshipAddBody>, I>>(object: I): RelationshipAddBody {
    const message = createBaseRelationshipAddBody();
    message.type = object.type ?? "";
    message.source = (object.source !== undefined && object.source !== null)
      ? ObjectRef.fromPartial(object.source)
      : undefined;
    message.target = (object.target !== undefined && object.target !== null)
      ? ObjectRef.fromPartial(object.target)
      : undefined;
    return message;
  },
};

function createBaseRelationshipRemoveBody(): RelationshipRemoveBody {
  return { targetHash: new Uint8Array() };
}

export const RelationshipRemoveBody = {
  encode(message: RelationshipRemoveBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHash.length !== 0) {
      writer.uint32(10).bytes(message.targetHash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RelationshipRemoveBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRelationshipRemoveBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.targetHash = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RelationshipRemoveBody {
    return { targetHash: isSet(object.targetHash) ? bytesFromBase64(object.targetHash) : new Uint8Array() };
  },

  toJSON(message: RelationshipRemoveBody): unknown {
    const obj: any = {};
    message.targetHash !== undefined &&
      (obj.targetHash = base64FromBytes(message.targetHash !== undefined ? message.targetHash : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<RelationshipRemoveBody>, I>>(base?: I): RelationshipRemoveBody {
    return RelationshipRemoveBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<RelationshipRemoveBody>, I>>(object: I): RelationshipRemoveBody {
    const message = createBaseRelationshipRemoveBody();
    message.targetHash = object.targetHash ?? new Uint8Array();
    return message;
  },
};

function createBaseVerificationAddAddressBody(): VerificationAddAddressBody {
  return {
    address: new Uint8Array(),
    claimSignature: new Uint8Array(),
    blockHash: new Uint8Array(),
    verificationType: 0,
    chainId: 0,
    protocol: 0,
  };
}

export const VerificationAddAddressBody = {
  encode(message: VerificationAddAddressBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.claimSignature.length !== 0) {
      writer.uint32(18).bytes(message.claimSignature);
    }
    if (message.blockHash.length !== 0) {
      writer.uint32(26).bytes(message.blockHash);
    }
    if (message.verificationType !== 0) {
      writer.uint32(32).uint32(message.verificationType);
    }
    if (message.chainId !== 0) {
      writer.uint32(40).uint32(message.chainId);
    }
    if (message.protocol !== 0) {
      writer.uint32(56).int32(message.protocol);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerificationAddAddressBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerificationAddAddressBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 2:
          if (tag != 18) {
            break;
          }

          message.claimSignature = reader.bytes();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.blockHash = reader.bytes();
          continue;
        case 4:
          if (tag != 32) {
            break;
          }

          message.verificationType = reader.uint32();
          continue;
        case 5:
          if (tag != 40) {
            break;
          }

          message.chainId = reader.uint32();
          continue;
        case 7:
          if (tag != 56) {
            break;
          }

          message.protocol = reader.int32() as any;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerificationAddAddressBody {
    return {
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(),
      claimSignature: isSet(object.claimSignature) ? bytesFromBase64(object.claimSignature) : new Uint8Array(),
      blockHash: isSet(object.blockHash) ? bytesFromBase64(object.blockHash) : new Uint8Array(),
      verificationType: isSet(object.verificationType) ? Number(object.verificationType) : 0,
      chainId: isSet(object.chainId) ? Number(object.chainId) : 0,
      protocol: isSet(object.protocol) ? protocolFromJSON(object.protocol) : 0,
    };
  },

  toJSON(message: VerificationAddAddressBody): unknown {
    const obj: any = {};
    message.address !== undefined &&
      (obj.address = base64FromBytes(message.address !== undefined ? message.address : new Uint8Array()));
    message.claimSignature !== undefined &&
      (obj.claimSignature = base64FromBytes(
        message.claimSignature !== undefined ? message.claimSignature : new Uint8Array(),
      ));
    message.blockHash !== undefined &&
      (obj.blockHash = base64FromBytes(message.blockHash !== undefined ? message.blockHash : new Uint8Array()));
    message.verificationType !== undefined && (obj.verificationType = Math.round(message.verificationType));
    message.chainId !== undefined && (obj.chainId = Math.round(message.chainId));
    message.protocol !== undefined && (obj.protocol = protocolToJSON(message.protocol));
    return obj;
  },

  create<I extends Exact<DeepPartial<VerificationAddAddressBody>, I>>(base?: I): VerificationAddAddressBody {
    return VerificationAddAddressBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<VerificationAddAddressBody>, I>>(object: I): VerificationAddAddressBody {
    const message = createBaseVerificationAddAddressBody();
    message.address = object.address ?? new Uint8Array();
    message.claimSignature = object.claimSignature ?? new Uint8Array();
    message.blockHash = object.blockHash ?? new Uint8Array();
    message.verificationType = object.verificationType ?? 0;
    message.chainId = object.chainId ?? 0;
    message.protocol = object.protocol ?? 0;
    return message;
  },
};

function createBaseVerificationRemoveBody(): VerificationRemoveBody {
  return { address: new Uint8Array(), protocol: 0 };
}

export const VerificationRemoveBody = {
  encode(message: VerificationRemoveBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.protocol !== 0) {
      writer.uint32(16).int32(message.protocol);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VerificationRemoveBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVerificationRemoveBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.protocol = reader.int32() as any;
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): VerificationRemoveBody {
    return {
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(),
      protocol: isSet(object.protocol) ? protocolFromJSON(object.protocol) : 0,
    };
  },

  toJSON(message: VerificationRemoveBody): unknown {
    const obj: any = {};
    message.address !== undefined &&
      (obj.address = base64FromBytes(message.address !== undefined ? message.address : new Uint8Array()));
    message.protocol !== undefined && (obj.protocol = protocolToJSON(message.protocol));
    return obj;
  },

  create<I extends Exact<DeepPartial<VerificationRemoveBody>, I>>(base?: I): VerificationRemoveBody {
    return VerificationRemoveBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<VerificationRemoveBody>, I>>(object: I): VerificationRemoveBody {
    const message = createBaseVerificationRemoveBody();
    message.address = object.address ?? new Uint8Array();
    message.protocol = object.protocol ?? 0;
    return message;
  },
};

function createBaseLinkBody(): LinkBody {
  return { type: "", displayTimestamp: undefined, targetFid: undefined };
}

export const LinkBody = {
  encode(message: LinkBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    if (message.displayTimestamp !== undefined) {
      writer.uint32(16).uint32(message.displayTimestamp);
    }
    if (message.targetFid !== undefined) {
      writer.uint32(24).uint64(message.targetFid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.displayTimestamp = reader.uint32();
          continue;
        case 3:
          if (tag != 24) {
            break;
          }

          message.targetFid = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LinkBody {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      displayTimestamp: isSet(object.displayTimestamp) ? Number(object.displayTimestamp) : undefined,
      targetFid: isSet(object.targetFid) ? Number(object.targetFid) : undefined,
    };
  },

  toJSON(message: LinkBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    message.displayTimestamp !== undefined && (obj.displayTimestamp = Math.round(message.displayTimestamp));
    message.targetFid !== undefined && (obj.targetFid = Math.round(message.targetFid));
    return obj;
  },

  create<I extends Exact<DeepPartial<LinkBody>, I>>(base?: I): LinkBody {
    return LinkBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LinkBody>, I>>(object: I): LinkBody {
    const message = createBaseLinkBody();
    message.type = object.type ?? "";
    message.displayTimestamp = object.displayTimestamp ?? undefined;
    message.targetFid = object.targetFid ?? undefined;
    return message;
  },
};

function createBaseLinkCompactStateBody(): LinkCompactStateBody {
  return { type: "", targetFids: [] };
}

export const LinkCompactStateBody = {
  encode(message: LinkCompactStateBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== "") {
      writer.uint32(10).string(message.type);
    }
    writer.uint32(18).fork();
    for (const v of message.targetFids) {
      writer.uint64(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LinkCompactStateBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLinkCompactStateBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.type = reader.string();
          continue;
        case 2:
          if (tag == 16) {
            message.targetFids.push(longToNumber(reader.uint64() as Long));
            continue;
          }

          if (tag == 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.targetFids.push(longToNumber(reader.uint64() as Long));
            }

            continue;
          }

          break;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LinkCompactStateBody {
    return {
      type: isSet(object.type) ? String(object.type) : "",
      targetFids: Array.isArray(object?.targetFids) ? object.targetFids.map((e: any) => Number(e)) : [],
    };
  },

  toJSON(message: LinkCompactStateBody): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = message.type);
    if (message.targetFids) {
      obj.targetFids = message.targetFids.map((e) => Math.round(e));
    } else {
      obj.targetFids = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LinkCompactStateBody>, I>>(base?: I): LinkCompactStateBody {
    return LinkCompactStateBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<LinkCompactStateBody>, I>>(object: I): LinkCompactStateBody {
    const message = createBaseLinkCompactStateBody();
    message.type = object.type ?? "";
    message.targetFids = object.targetFids?.map((e) => e) || [];
    return message;
  },
};

function createBaseFrameActionBody(): FrameActionBody {
  return {
    url: new Uint8Array(),
    buttonIndex: 0,
    castId: undefined,
    inputText: new Uint8Array(),
    state: new Uint8Array(),
    transactionId: new Uint8Array(),
    address: new Uint8Array(),
  };
}

export const FrameActionBody = {
  encode(message: FrameActionBody, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.url.length !== 0) {
      writer.uint32(10).bytes(message.url);
    }
    if (message.buttonIndex !== 0) {
      writer.uint32(16).uint32(message.buttonIndex);
    }
    if (message.castId !== undefined) {
      CastId.encode(message.castId, writer.uint32(26).fork()).ldelim();
    }
    if (message.inputText.length !== 0) {
      writer.uint32(34).bytes(message.inputText);
    }
    if (message.state.length !== 0) {
      writer.uint32(42).bytes(message.state);
    }
    if (message.transactionId.length !== 0) {
      writer.uint32(50).bytes(message.transactionId);
    }
    if (message.address.length !== 0) {
      writer.uint32(58).bytes(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FrameActionBody {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFrameActionBody();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag != 10) {
            break;
          }

          message.url = reader.bytes();
          continue;
        case 2:
          if (tag != 16) {
            break;
          }

          message.buttonIndex = reader.uint32();
          continue;
        case 3:
          if (tag != 26) {
            break;
          }

          message.castId = CastId.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag != 34) {
            break;
          }

          message.inputText = reader.bytes();
          continue;
        case 5:
          if (tag != 42) {
            break;
          }

          message.state = reader.bytes();
          continue;
        case 6:
          if (tag != 50) {
            break;
          }

          message.transactionId = reader.bytes();
          continue;
        case 7:
          if (tag != 58) {
            break;
          }

          message.address = reader.bytes();
          continue;
      }
      if ((tag & 7) == 4 || tag == 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FrameActionBody {
    return {
      url: isSet(object.url) ? bytesFromBase64(object.url) : new Uint8Array(),
      buttonIndex: isSet(object.buttonIndex) ? Number(object.buttonIndex) : 0,
      castId: isSet(object.castId) ? CastId.fromJSON(object.castId) : undefined,
      inputText: isSet(object.inputText) ? bytesFromBase64(object.inputText) : new Uint8Array(),
      state: isSet(object.state) ? bytesFromBase64(object.state) : new Uint8Array(),
      transactionId: isSet(object.transactionId) ? bytesFromBase64(object.transactionId) : new Uint8Array(),
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(),
    };
  },

  toJSON(message: FrameActionBody): unknown {
    const obj: any = {};
    message.url !== undefined &&
      (obj.url = base64FromBytes(message.url !== undefined ? message.url : new Uint8Array()));
    message.buttonIndex !== undefined && (obj.buttonIndex = Math.round(message.buttonIndex));
    message.castId !== undefined && (obj.castId = message.castId ? CastId.toJSON(message.castId) : undefined);
    message.inputText !== undefined &&
      (obj.inputText = base64FromBytes(message.inputText !== undefined ? message.inputText : new Uint8Array()));
    message.state !== undefined &&
      (obj.state = base64FromBytes(message.state !== undefined ? message.state : new Uint8Array()));
    message.transactionId !== undefined &&
      (obj.transactionId = base64FromBytes(
        message.transactionId !== undefined ? message.transactionId : new Uint8Array(),
      ));
    message.address !== undefined &&
      (obj.address = base64FromBytes(message.address !== undefined ? message.address : new Uint8Array()));
    return obj;
  },

  create<I extends Exact<DeepPartial<FrameActionBody>, I>>(base?: I): FrameActionBody {
    return FrameActionBody.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FrameActionBody>, I>>(object: I): FrameActionBody {
    const message = createBaseFrameActionBody();
    message.url = object.url ?? new Uint8Array();
    message.buttonIndex = object.buttonIndex ?? 0;
    message.castId = (object.castId !== undefined && object.castId !== null)
      ? CastId.fromPartial(object.castId)
      : undefined;
    message.inputText = object.inputText ?? new Uint8Array();
    message.state = object.state ?? new Uint8Array();
    message.transactionId = object.transactionId ?? new Uint8Array();
    message.address = object.address ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
