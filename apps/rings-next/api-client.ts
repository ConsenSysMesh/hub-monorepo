import axios, { AxiosResponse } from 'axios';
import { RelationshipTypes } from '@farcaster/rings-next/constants';
import {
  ObjectRefTypes,
  RefDirection,
  ObjectRef,
  FarcasterNetwork,
  hexStringToBytes,
} from '@farcaster/hub-web';

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
    const ownerRels = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.FID,
        object_ref_fid: fid,
        ref_direction: RefDirection.TARGET,
        type: RelationshipTypes.Owner,
      }
    });
    return ownerRels;
  };

  const getRingWearerRels = async (ringRef: ObjectRef) => {
    const ringWearerRels = await client.get('/relationshipsByRelatedObjectRef', {
      params: {
        ref_type: ObjectRefTypes.OBJECT,
        object_ref_network: NETWORK,
        object_ref_fid: ringRef.fid,
        object_ref_hash: ringRef.hash,
        ref_direction: RefDirection.SOURCE,
        type: RelationshipTypes.Wearer,
      }
    });
    return ringWearerRels;
  }
  
  const getRingObject = async (ringRef: ObjectRef) => {
    const obj = await client.get('/objectById', {
      params: {
        fid: ringRef.fid,
        hash: ringRef.hash,
      }
    });
    return obj;
  }

  return {
    getOwnedRings: async (fid: number) => {
      // first find the owner relationships for the user's fid
      const ownerResult = await getRingOwnerRels(fid);
      const ownerRels = ownerResult.data.messages;
      for (let ownerRel of ownerRels) {
        console.log('Found a ring owner relationship!', ownerRel);
        if (!ownerRel.data?.relationshipAddBody) continue; // null checks to make TS happy
        let ringRef = ownerRel.data.relationshipAddBody.source;
        
        // get the ring object
        let ringObjResult = await getRingObject(ringRef);
        let ringObj = ringObjResult.data.object.data.objectAddBody;
        let ringTags = ringObjResult.data.tags;
        console.log('Found a ring!', ringObj, ringTags);
    
        // console.log('Ring hash bytes', hexStringToBytes(ringRef.hash));
        
        // now also get the ring wearers to have complete ring state?
        const wearerResult = await getRingWearerRels(ringRef);
        const wearerRels = wearerResult.data.messages;
        for (let wearerRel of wearerRels) {
          console.log('Found a ring wearer relationship!', wearerRel);
          if (!wearerRel.data?.relationshipAddBody) continue; // null checks to make TS happy
          let wearerFid = wearerRel.data.relationshipAddBody.target?.fid;
          
          // TODO: figure out the rest of this data loading recipe
          
        }
      }
      return ownerRels;
    },
  };
}

export default () => {
  // const sessionToken = localStorage.getItem('session');
  return getApiClient();
}