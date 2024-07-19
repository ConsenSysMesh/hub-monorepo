import { Message, MessageData, ObjectRef, ObjectRefTypes, farcasterNetworkFromJSON, hexStringToBytes } from "@farcaster/hub-web";

export const getMessageStoreId  = (msg: Message) => {
    const data = msg.data as MessageData;
    return `${data.network}_${data.fid}_${msg.hash}`;
}

export const getObjectRefStoreId  = (objectRef: ObjectRef) =>
    `${objectRef.network}_${objectRef.fid}_${objectRef.hash}`;

export const getObjectRefType = (msg: Message) => {
    if (msg.data?.castAddBody) {
        return ObjectRefTypes.CAST;
    } else if (msg.data?.objectAddBody) {
        return ObjectRefTypes.OBJECT;
    } else if (msg.data?.relationshipAddBody) {
        return ObjectRefTypes.RELATIONSHIP;
    } else {
        throw new Error(`Unexpected message body type in getObjectRefType`);
    }
};

export const getObjectRefForMessage  = (msg: Message) => {
    let type = getObjectRefType(msg);
    return ObjectRef.create({
        type,
        fid: msg.data?.fid,
        // Data returned via HTTP API has some JSON conversions done to enum and
        //  byte array fields, which needs to be undone before the content can be used
        //  in crafting new Messages (eg. in `makeTagAdd`)
        network: farcasterNetworkFromJSON(msg.data?.network),
        hash: hexStringToBytes(msg.hash as string)._unsafeUnwrap(),
    });
}