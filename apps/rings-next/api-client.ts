import axios, { AxiosResponse } from 'axios';
import { RelationshipTypes } from '@farcaster/rings-next/constants';
import {
  ObjectRefTypes,
  RefDirection,
  ObjectRef,
  FarcasterNetwork,
  MessagesResponse,
  Message,
  ObjectResponse,
} from '@farcaster/hub-web';
import { User } from '@farcaster/rings-next/types';

const API_HOST = process.env.NEXT_PUBLIC_API_URL;
const API_URL = `${API_HOST}/v1`;
const NETWORK = FarcasterNetwork.DEVNET;

const getApiClient = () => {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    // headers: {
    //   'Authentication': `${sessionToken}`,
    // }
  });

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

  const getRingWearerRels = async (ringRef: ObjectRef) => {
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
    getOwnedRings: async (fid: number) => {
      // first find the owner relationships for the user's fid
      const results = {
        rings: [] as Array<Message>,
        stones: [] as Array<Message>,
        relationships: [] as Array<Message>,
        users: [] as Array<User>,
      }
      const fids: Array<number> = [];
      const ownerResult = await getRingOwnerRels(fid);
      const ownerRels = ownerResult.messages;
      results.relationships.push(...ownerRels);
      for (let ownerRel of ownerRels) {
        console.log('Found a ring owner relationship!', ownerRel);
        if (!ownerRel.data?.relationshipAddBody) continue; // null checks to make TS happy
        let ringRef = ownerRel.data.relationshipAddBody.source as ObjectRef;
        fids.push(ownerRel.data.relationshipAddBody.target?.fid as number);
      
        // get the ring object
        let ringObjResult = await getRingObject(ringRef);
        if (!ringObjResult.object?.data) {
          continue;
        }
        let ringObj = ringObjResult.object;
        results.rings.push(ringObj);
        let ringTags = ringObjResult.tags;
        results.stones.push(...ringTags);
        console.log('Found a ring!', ringObj, ringTags);
    
        // console.log('Ring hash bytes', hexStringToBytes(ringRef.hash));
        
        // now also get the ring wearers to have complete ring state?
        const wearerResult = await getRingWearerRels(ringRef);
        const wearerRels = wearerResult.messages;
        results.relationships.push(...wearerRels);
        for (let wearerRel of wearerRels) {
          console.log('Found a ring wearer relationship!', wearerRel);
          if (!wearerRel.data?.relationshipAddBody) continue; // null checks to make TS happy
          fids.push(wearerRel.data.relationshipAddBody.target?.fid as number);
          
          // TODO: figure out whether we're loading in the profiles of all the users involved with the rings
          
        }
      }
      results.users = _.uniq(fids).map((fid: number) => ({ fid } as User)); // lean User objects without profile info for now
      return results;
    },
  };
}

export default () => {
  // const sessionToken = localStorage.getItem('session');
  return getApiClient();
}