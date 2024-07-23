import {
    makeObjectAdd,
    makeRelationshipAdd,
    ObjectRef,
    ObjectRefTypes,
    RefDirection,
    makeTagAdd,
    Message,
} from "@farcaster/hub-nodejs";
import { RingObjectType, RelationshipTypes, StoneTagNames, StoneTypes } from "@farcaster/rings-next/types";

export const getDataLayer = (client, dataOptions, ed25519Signer) => {

  const addRing = async (
      displayName: string  = 'A Ring of Trust',
      description: string = 'A symbol of trust from a cool person to another cool person',
  ) => {
    const ringObj = await makeObjectAdd({
      type: RingObjectType,
      displayName,
      description,
    },
    dataOptions,
    ed25519Signer);
  
    if (ringObj.isErr()){
      throw ringObj.error;
    }
    // console.log('ObjectAdd message', ringObj);
    const ringObjResult = await client.submitMessage(ringObj._unsafeUnwrap());

    if (ringObjResult.isErr()){
      throw ringObjResult.error;
    }
    const ringObjMsg = ringObjResult._unsafeUnwrap() as Message;
    console.log('Ring object created', ringObjMsg.data?.objectAddBody);

    const ringObjRef = ObjectRef.create({
      fid: ringObjMsg.data?.fid, // APP_FID,
      type: ObjectRefTypes.OBJECT,
      network: ringObjMsg.data?.network, // NETWORK,
      hash: ringObjMsg.hash,
    });
  
    return { ringObj: ringObjMsg, ringObjRef };
  };
  
  const addOwner = async (ringRef: ObjectRef, ownerRef: ObjectRef) => {
    const ownerRel = await makeRelationshipAdd({
      type: RelationshipTypes.Owner,
      source: ringRef,
      target: ownerRef,
    },
    dataOptions,
    ed25519Signer);
  
    if (ownerRel.isErr()){
      throw ownerRel.error;
    }
    // console.log('RelationshipAdd message', ownerRel);
    const ownerRelResult = await client.submitMessage(ownerRel._unsafeUnwrap());

    if (ownerRelResult.isErr()){
      throw ownerRelResult.error;
    }
    console.log('Owner relationship created', ownerRelResult._unsafeUnwrap().data?.relationshipAddBody);
    return ownerRelResult;
  };

  const addWearer = async (ringRef: ObjectRef, wearerRef: ObjectRef) => {
    const wearerRel = await makeRelationshipAdd({
      type: RelationshipTypes.Wearer,
      source: ringRef,
      target: wearerRef,
    },
    dataOptions,
    ed25519Signer);
  
    if (wearerRel.isErr()){
      throw wearerRel.error;
    }
    // console.log('RelationshipAdd message', wearerRel);
    const wearerRelResult = await client.submitMessage(wearerRel._unsafeUnwrap());
    
    if (wearerRelResult.isErr()) {
      throw wearerRelResult.error;
    }
    console.log('Wearer relationship created', wearerRelResult._unsafeUnwrap().data?.relationshipAddBody);
    return wearerRelResult;
  };
  
  const addStone = async (ringRef: ObjectRef, name: StoneTagNames, type: StoneTypes) => {
    const addStoneTag = await makeTagAdd({
      name,
      content: type,
      target: ringRef,
    },
    dataOptions,
    ed25519Signer);

    if (addStoneTag.isErr()) {
      throw addStoneTag.error;
    }
    console.log('Tag add message', addStoneTag);
  
    const stoneTagResult = await client.submitMessage(addStoneTag._unsafeUnwrap());
    if (stoneTagResult.isErr()) {
      throw stoneTagResult.error;
    }
    console.log('Stone1 tag created', stoneTagResult._unsafeUnwrap().data?.TagBody);
    return stoneTagResult;
  };

  const getObjectsByFid = async (fid: number, type: string) => {
    const objectsByFid = await client.getObjectsByFid({ fid, type });

    if (objectsByFid.isErr()) {
      throw objectsByFid.error;
    }
    return objectsByFid.objects;
  };

  const printObjByFid = async (fid: number, type: string) => {
    const objResult = await getObjectsByFid(fid, type);

    console.log(objResult.map(m => JSON.stringify(m.object)));
  };

  const getRelsByObj = async (relatedObjectRef: ObjectRef, relatedObjectRefType: RefDirection, relType: RelationshipTypes) => {
    const relQueryResult = await client.getRelationshipsByRelatedObjectRef({ relatedObjectRef, relatedObjectRefType, type: relType });

    if (relQueryResult.isErr()) {
      throw relQueryResult.error;
    }
    return relQueryResult._unsafeUnwrap().messages as Array<Message>;
  };

  const printOwnerRels = async (ringObjRef: ObjectRef) => {
    const ownerRelQueryResult = await getRelsByObj(ringObjRef, RefDirection.SOURCE, RelationshipTypes.Owner);

    console.log('Query result for Owners', ownerRelQueryResult.map(m => JSON.stringify(m.data?.relationshipAddBody)));
  }

  const printWearerRels = async (ringObjRef: ObjectRef) => {
    const wearerRelQueryResult = await getRelsByObj(ringObjRef, RefDirection.SOURCE, RelationshipTypes.Wearer);

    console.log('Query result for Wearers', wearerRelQueryResult.map(m => JSON.stringify(m.data?.relationshipAddBody)));
  }

  const getTagsByObj = async (relatedObjectRef: ObjectRef) => {
    const tagQueryResult = await client.getTagsByTarget({ 
      target: relatedObjectRef,
    });
    if (tagQueryResult.isErr()) {
      throw tagQueryResult.error;
    }
    return tagQueryResult._unsafeUnwrap().messages as Array<Message>;
  };

  const printRingStones = async (ringObjRef: ObjectRef) => {
    const tagQueryResult = await getTagsByObj(ringObjRef);

    console.log('Query result for Stones', ...tagQueryResult.map((m) => m.data));
  }

  return {
    addRing,
    addOwner,
    addWearer,
    addStone,
    printOwnerRels,
    printWearerRels,
    printRingStones,
  };
};