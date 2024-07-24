import { Message, MessageData, ObjectRef } from "@farcaster/hub-web";

export const getMessageStoreId  = (msg: Message) => {
    const data = msg.data as MessageData;
    return `${data.network}_${data.fid}_${msg.hash}`;
}

export const getObjectRefStoreId  = (objectRef: ObjectRef) =>
    `${objectRef.network}_${objectRef.fid}_${objectRef.hash}`;