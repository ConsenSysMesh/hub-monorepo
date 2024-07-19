import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeObjectAdd,
  makeRelationshipAdd,
  NobleEd25519Signer,
  ObjectRef,
  ObjectRefTypes,
  bytesToHexString,
  RelationshipsByRelatedObjectRefRequest,
  RefDirection,
  makeTagAdd,
} from "@farcaster/hub-nodejs";
import { hexToBytes } from "@noble/hashes/utils";

/**
 * Populate the following constants with your own values
 */

// {
//   "app": {
//     "custody": {
//       "address": "0x98a2d6B9e4aFFAC7682902e7d9668AC539caC6dA",
//       "key": "0x8f9fa310221f5b56fd6efceee571c67cead6905d55262be97ad63c8aba863376"
//     },
//     "fid": "691016"
//   },
//   "alice": {
//     "custody": {
//       "address": "0xE6A6206FD9d0CDFF797f3aBE96F6444fdBD679E3",
//       "key": "0xaa29d02c02da27dbf2e4d98883e1b9d8adea936889332c0b5942e992b330c5f4"
//     },
//     "signing": {
//       "address": "0x11428b1025ce1731b42498b6a87f32b91ddb855a4a40ad04a8cb5b8a61076cc8",
//       "key": "0xe3bfdf6f5d5f0a807aa873c82d6fbf331249a33d51f14441baacf5b76b7c8708"
//     }
//   }
// }

const SIGNER = "0xe3bfdf6f5d5f0a807aa873c82d6fbf331249a33d51f14441baacf5b76b7c8708";
// Fid owned by the custody address
const APP_FID = 691017; // <REQUIRED>
const OWNER_FID = 773349; // <REQUIRED>
const WEARER_FID = 784578; // <REQUIRED>

// Testnet Configuration
const HUB_URL = "127.0.0.1:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.DEVNET; // Network of the Hub

(async () => {
  // Set up the signer
  const privateKeyBytes = hexToBytes(SIGNER.slice(2));
  const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);
  // const signerPublicKey = (await ed25519Signer.getSignerKey())._unsafeUnwrap();

  const dataOptions = {
    fid: APP_FID,
    network: NETWORK,
  };

  const RingObjectType = "Ring";
  enum RelationshipTypes {
    Owner = 'owner',
    Wearer = 'wearer',
  }

// expected `name` field values for the tags representing Stones in a Ring
enum StoneTagNames {
  stone1 = 'stone1',
  stone2 = 'stone2',
  stone3 = 'stone3',
  // etc
};

// expected `content` field values for the tags representing Stones in a Ring 
enum StoneTypes {
  Honesty = 'Honesty',
  Integrity = 'Integrity',
  Cool = 'Cool',
  // etc
};

  // If your client does not use SSL.
  const client = getInsecureHubRpcClient(HUB_URL);

  const ringObj = await makeObjectAdd({
    type: RingObjectType,
    displayName: "A Ring of Trust",
    description: "A symbol of trust from a cool person to another cool person"
  },
  dataOptions,
  ed25519Signer);

  console.log('ObjectAdd message', ringObj);
  const ringObjResult = await client.submitMessage(ringObj._unsafeUnwrap());
  const ringObjMsg = ringObjResult._unsafeUnwrap();
  console.log('Ring created', ringObjMsg.data?.objectAddBody);
  
  // const objectsByFid = await client.getObjectsByFid({ fid: FID, type: ObjType });

  // if (objectsByFid.isOk()) {
  //   console.log(objectsByFid._unsafeUnwrap().objects.map(m => JSON.stringify(m.object)));
  // } else if (objectsByFid.isErr()) {
  //   console.log('ERROR', objectsByFid.error);
  // }

  const ringObjectRef = ObjectRef.create({
    fid: APP_FID,
    type: ObjectRefTypes.OBJECT,
    network: NETWORK,
    hash: ringObjMsg.hash,
  });

  const ownerFidRef = ObjectRef.create({
    fid: OWNER_FID,
    type: ObjectRefTypes.FID,
  });

  const ownerRel = await makeRelationshipAdd({
    type: RelationshipTypes.Owner,
    source: ringObjectRef,
    target: ownerFidRef,
  },
  dataOptions,
  ed25519Signer);

  console.log('RelationshipAdd message', ownerRel);
  const ownerRelResult = await client.submitMessage(ownerRel._unsafeUnwrap());
  console.log('Owner relationship created', ownerRelResult._unsafeUnwrap().data?.relationshipAddBody);

  // const relationshipsByFid = await client.getRelationshipsByFid({ fid: FID, type: RelType });
  const ownerRelQueryResult = await client.getRelationshipsByRelatedObjectRef({ relatedObjectRef: ringObjectRef, relatedObjectRefType: RefDirection.SOURCE, type: RelationshipTypes.Owner });

  if (ownerRelQueryResult.isOk()) {
    console.log('Query result for Owners', ownerRelQueryResult._unsafeUnwrap().messages.map(m => JSON.stringify(m.data.relationshipAddBody)));
  } else if (ownerRelQueryResult.isErr()) {
    console.log('ERROR', ownerRelQueryResult.error);
  }

  const wearerFidRef = ObjectRef.create({
    fid: WEARER_FID,
    type: ObjectRefTypes.FID,
  });

  const wearerRel = await makeRelationshipAdd({
    type: RelationshipTypes.Wearer,
    source: ringObjectRef,
    target: wearerFidRef,
  },
  dataOptions,
  ed25519Signer);

  console.log('RelationshipAdd message', wearerRel);
  const wearerRelResult = await client.submitMessage(wearerRel._unsafeUnwrap());
  console.log('Wearer relationship created', wearerRelResult._unsafeUnwrap().data?.relationshipAddBody);

  const wearerRelQueryResult = await client.getRelationshipsByRelatedObjectRef({ relatedObjectRef: ringObjectRef, relatedObjectRefType: RefDirection.SOURCE, type: RelationshipTypes.Wearer });

  if (wearerRelQueryResult.isOk()) {
    console.log('Query result for Wearers', wearerRelQueryResult._unsafeUnwrap().messages.map(m => JSON.stringify(m.data.relationshipAddBody)));
  } else if (wearerRelQueryResult.isErr()) {
    console.log('ERROR', wearerRelQueryResult.error);
  }

  // add ring Stone (Tag)
  const addStoneTag = await makeTagAdd({
    name: StoneTagNames.stone1,
    content: StoneTypes.Honesty,
    target: ringObjectRef,
  },
  dataOptions,
  ed25519Signer);
  console.log('Tag add message', addStoneTag);

  const tagResult = await client.submitMessage(addStoneTag._unsafeUnwrap());
  console.log('Stone tag created', tagResult._unsafeUnwrap().data?.TagBody);

  const stoneTagQueryResult = await client.getTagsByTarget({ 
    target: ringObjectRef,
  })

  if (stoneTagQueryResult.isOk()) {
    stoneTagQueryResult._unsafeUnwrap().messages.forEach((m) => {
      console.log(m.data);
    })
  } else if (stoneTagQueryResult.isErr()) {
    console.log('ERROR', stoneTagQueryResult.error);
  }

  client.close();
})();
