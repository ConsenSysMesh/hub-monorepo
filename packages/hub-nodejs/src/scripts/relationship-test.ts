import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeObjectAdd,
  makeRelationshipAdd,
  NobleEd25519Signer,
  ObjectRef,
  ObjectRefTypes,
  bytesToHexString,
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
const FID = 691017; // <REQUIRED>

// Testnet Configuration
const HUB_URL = "127.0.0.1:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.DEVNET; // Network of the Hub

(async () => {
  // Set up the signer
  const privateKeyBytes = hexToBytes(SIGNER.slice(2));
  const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);
  // const signerPublicKey = (await ed25519Signer.getSignerKey())._unsafeUnwrap();

  const dataOptions = {
    fid: FID,
    network: NETWORK,
  };

  const ObjType = "Person";
  const RelType = "Buddies";
  // If your client does not use SSL.
  const client = getInsecureHubRpcClient(HUB_URL);

  const sourceObj = await makeObjectAdd({
    type: ObjType,
    displayName: "Vlad",
    avatar: "https://vlad.io/avatar.png",
    description: "A cool guy"
  },
  dataOptions,
  ed25519Signer);

  console.log('ObjectAdd message', sourceObj);
  const sourceObjResult = await client.submitMessage(sourceObj._unsafeUnwrap());
  const sourceObjMsg = sourceObjResult._unsafeUnwrap();
  console.log(sourceObjMsg.data?.objectAddBody);

  const targetObj = await makeObjectAdd({
    type: ObjType,
    displayName: "Jerry",
    avatar: "https://jerry.net/avatar.png",
    description: "Another cool guy"
  },
  dataOptions,
  ed25519Signer);

  console.log('ObjectAdd message', targetObj);
  const targetObjResult = await client.submitMessage(targetObj._unsafeUnwrap());
  const targetObjMsg = targetObjResult._unsafeUnwrap();
  console.log(targetObjMsg.data?.objectAddBody);
  
  const objectsByFid = await client.getObjectsByFid({ fid: FID, type: ObjType });

  if (objectsByFid.isOk()) {
    console.log(objectsByFid._unsafeUnwrap().messages.map(m => JSON.stringify(m.data.relationshipAddBody)));
  } else if (objectsByFid.isErr()) {
    console.log('ERROR', objectsByFid.error);
  }

  const rel = await makeRelationshipAdd({
    type: RelType,
    source: ObjectRef.create({
      fid: FID,
      type: ObjectRefTypes.OBJECT,
      network: NETWORK,
      hash: bytesToHexString(sourceObjMsg.hash).value,
    }),
    target: ObjectRef.create({
      fid: FID,
      type: ObjectRefTypes.OBJECT,
      network: NETWORK,
      hash: bytesToHexString(targetObjMsg.hash).value,
    }),
  },
  dataOptions,
  ed25519Signer);

  console.log('RelationshipAdd message', rel);
  const relationshipResult = await client.submitMessage(rel._unsafeUnwrap());
  console.log(relationshipResult._unsafeUnwrap().data?.relationshipAddBody);

  const relationshipsByFid = await client.getRelationshipsByFid({ fid: FID, type: RelType });

  if (relationshipsByFid.isOk()) {
    console.log(relationshipsByFid._unsafeUnwrap().messages.map(m => JSON.stringify(m.data.relationshipAddBody)));
  } else if (relationshipsByFid.isErr()) {
    console.log('ERROR', relationshipsByFid.error);
  }

  client.close();
})();
