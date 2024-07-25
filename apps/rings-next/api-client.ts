import axios, { AxiosResponse } from 'axios';
import { NETWORK, SignersByFid } from '@farcaster/rings-next/constants';
import {
  ObjectRefTypes,
  RefDirection,
  ObjectRef,
  MessagesResponse,
  Message,
  ObjectResponse,
  TagBody,
  makeTagAdd,
  RelationshipAddBody,
  makeRelationshipAdd,
  makeRelationshipRemove,
} from '@farcaster/hub-web';
import { User, RelationshipTypes } from '@farcaster/rings-next/types.d';
import { convertHexHash, getObjectRefStoreId, getMessageStoreId } from '@farcaster/rings-next/state/utils';

const API_HOST = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_HOST}/v1`;

const getApiClient = () => {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    // headers: {
    //   'Authentication': `${sessionToken}`,
    // }
  });

  const submitMessage = async (msg: Message) => {
    const messageBytes = Buffer.from(Message.encode(msg).finish());
    const result = await client.post('/submitMessage', 
      messageBytes, {
        headers: { "Content-Type": "application/octet-stream" },
      },
    );
    return result.data as MessagesResponse;
  };

  const getRingOwnerRels = async (fid: number) => {
    const result = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.FID,
        object_ref_fid: fid,
        ref_direction: RefDirection.TARGET,
        type: RelationshipTypes.Owner,
      }
    });
    return result.data as MessagesResponse;
  };

  const getRingWearerRels = async (fid: number) => {
    const result = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.FID,
        object_ref_fid: fid,
        ref_direction: RefDirection.TARGET,
        type: RelationshipTypes.Wearer,
      }
    });
    return result.data as MessagesResponse;
  };

  const getRingWearerRelsByRing = async (ringRef: ObjectRef) => {
    const result = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.OBJECT,
        object_ref_network: NETWORK,
        object_ref_fid: ringRef.fid,
        object_ref_hash: ringRef.hash,
        ref_direction: RefDirection.SOURCE,
        type: RelationshipTypes.Wearer,
      }
    });
    return result.data as MessagesResponse;
  }

  const getRingOwnerRelsByRing = async (ringRef: ObjectRef) => {
    const result = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.OBJECT,
        object_ref_network: NETWORK,
        object_ref_fid: ringRef.fid,
        object_ref_hash: ringRef.hash,
        ref_direction: RefDirection.SOURCE,
        type: RelationshipTypes.Owner,
      }
    });
    return result.data as MessagesResponse;
  }
  
  const getRingObject = async (ringRef: ObjectRef) => {
    const result = await client.get('/objectById', {
      params: {
        fid: ringRef.fid,
        hash: ringRef.hash,
        includeTags: true,
        creatorTagsOnly: false,
      }
    });
    return result.data as ObjectResponse;
  }

  return {
    getUserDataByFid: async (fid: number) => {
      const result = await client.get('/userDataByFid', {
        params: {
          fid,
        }
      });
      // TODO: shape the data as a single user object before passing it down
      return result.data as MessagesResponse;
    },
    getOwnedAndWornRings: async (fid: number) => {
      const results = {
        rings: [] as Array<Message>,
        stones: [] as Array<Message>,
        relationships: [] as Array<Message>,
        users: [] as Array<User>,
      }
      const fids: Array<number> = [];
      let ownedRingRefs: Array<ObjectRef> = [];
      let wornRingRefs: Array<ObjectRef> = [];
      let ownerRels: Array<Message> = [];
      let wearerRels: Array<Message> = [];

      // Get the owner Relationships for the FID
      const ownerResult = await getRingOwnerRels(fid);
      ownerRels = ownerResult.messages;
      results.relationships.push(...ownerRels);
      for (let ownerRel of ownerRels) {
        // console.log('Found a ring owner relationship!', ownerRel);
        let ringRef = ownerRel.data?.relationshipAddBody?.source as ObjectRef;
        ownedRingRefs.push(ringRef);
      }

      // Get the wearer Relationships for the FID
      const wearerResult = await getRingWearerRels(fid);
      wearerRels = wearerResult.messages;
      results.relationships.push(...wearerRels);
      for (let wearerRel of wearerRels) {
        // console.log('Found a ring wearer relationship!', wearerRel);
        let ringRef = wearerRel.data?.relationshipAddBody?.source as ObjectRef;
        wornRingRefs.push(ringRef);      
      }

      // For every owned ring, find the ring wearers
      for (let ownedRingRef of ownedRingRefs) {
        const ownedRingWearerResult = await getRingWearerRelsByRing(ownedRingRef);
        const ownedRingWearerRels = ownedRingWearerResult.messages;
        wearerRels.push(...ownedRingWearerRels);
      }

      // For every worn ring, find the ring owners
      for (let wornRingRef of wornRingRefs) {
        const wornRingsOwnerResult = await getRingOwnerRelsByRing(wornRingRef);
        const wornRingsOwnerRels = wornRingsOwnerResult.messages;
        ownerRels.push(...wornRingsOwnerRels);
      }

      const uniqueRingRefs = _.uniqBy([...ownedRingRefs, ...wornRingRefs], ref => getObjectRefStoreId(ref));

      // Having found all relevant ring refs, fetch the ring objects with stone tags
      for (let ringRef of uniqueRingRefs) {
        // get the ring object
        // console.log('Ring hash bytes', hexStringToBytes(ringRef.hash));
        let ringObjResult = await getRingObject(ringRef);
        if (!ringObjResult.object?.data) {
          continue;
        }
        let ringObj = ringObjResult.object;
        results.rings.push(ringObj);
        let ringTags = ringObjResult.tags;
        results.stones.push(...ringTags);
        console.log('Found a ring!', ringObj, ringTags);
      }

      // Dedupe owner and wearer relationships in case some FIDs are participating as both owners and wearers of rings
      results.relationships = _.uniqBy([...ownerRels, ...wearerRels], rel => getMessageStoreId(rel));

      // TODO: figure out whether we're loading in the profiles of all the users involved with the rings
      results.users =
        // all FIDs involved are the target of the relationships discovered
        _.uniq(results.relationships.map(r => r.data?.relationshipAddBody?.target?.fid as number))
          .map((fid: number) => ({ fid } as User)); // lean User objects without profile info for now
      return results;
    },
    
    updateStone: async (fid: number, changes: TagBody) => {
      const signer = SignersByFid[fid];
      if (!signer) {
        throw new Error(`No signer for fid: ${fid}`);
      }
      const newStone = await makeTagAdd(changes, {
          fid,
          network: NETWORK,
        },
        signer,
      );
      if (newStone.isErr()){
        throw newStone.error;
      }
      const result = await submitMessage((newStone._unsafeUnwrap()));
      return result;
    },
    updateRingWearer: async (fid: number, newWearer: RelationshipAddBody, existingWearer: Message | undefined) => {
      // TODO: not hooked up and untested
      const signer = SignersByFid[fid];
      if (!signer) {
        throw new Error(`No signer for fid: ${fid}`);
      }

      if (existingWearer) {
        const relRemove = {
          targetHash: convertHexHash(existingWearer.hash), // API expects binary array hashes, not hex strings
        };
        
        const removedRelationship = await makeRelationshipRemove(relRemove, {
            fid,
            network: NETWORK,
          },
          signer,
        );
        if (removedRelationship.isErr()) {
          throw removedRelationship.error;
        }
        const result = await submitMessage((removedRelationship._unsafeUnwrap()));
      }
      const newRelationship = await makeRelationshipAdd(newWearer, {
          fid,
          network: NETWORK,
        },
        signer,
      );
      if (newRelationship.isErr()) {
        throw newRelationship.error;
      }
      const result = await submitMessage((newRelationship._unsafeUnwrap()));
      return {
        added: result,
        removed: existingWearer,
      }
    },
  };
}

export default () => {
  // const sessionToken = localStorage.getItem('session');
  return getApiClient();
}