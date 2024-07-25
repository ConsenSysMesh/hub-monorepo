import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  NobleEd25519Signer,
  ObjectRef,
  ObjectRefTypes,
} from "@farcaster/hub-nodejs";
import { hexToBytes } from "@noble/hashes/utils";
import { StoneTagNames, StoneTypes } from "@farcaster/rings-next/types.d";
import { getDataLayer } from "@farcaster/rings-next/scripts/data-utils";
import path from 'path';
import dotEnv from 'dotenv';

// dotenv file path should resolve provided that this script is executed from the project root dir via yarn
const env = dotEnv.config({ path: path.resolve(__dirname, '../.env.development') }).parsed || {};
console.log('.env settings', env);

const SIGNER_FID = Number(env.NEXT_PUBLIC_FID_4); // 691017;
const SIGNER = env.NEXT_PUBLIC_PRIVATE_KEY_4; // "0xe3bfdf6f5d5f0a807aa873c82d6fbf331249a33d51f14441baacf5b76b7c8708";
// Set up the signer
const privateKeyBytes = hexToBytes(SIGNER.slice(2));
const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);

const FID1 = Number(env.NEXT_PUBLIC_FID_1);
const FID2 = Number(env.NEXT_PUBLIC_FID_2);
const FID3 = Number(env.NEXT_PUBLIC_FID_3);

// Testnet Configuration
const HUB_URL = "127.0.0.1:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.DEVNET; // Network of the Hub

const client = getInsecureHubRpcClient(HUB_URL);

const dataOptions = {
  fid: SIGNER_FID,
  network: NETWORK,
};

(async () => {
  const data = getDataLayer(client, dataOptions, ed25519Signer);

  const fidRef1 = ObjectRef.create({
    fid: FID1,
    type: ObjectRefTypes.FID,
  });
  const fidRef2 = ObjectRef.create({
    fid: FID2,
    type: ObjectRefTypes.FID,
  });
  const fidRef3 = ObjectRef.create({
    fid: FID3,
    type: ObjectRefTypes.FID,
  });

  const { ringObjRef: ringObjRef1 } = await data.addRing('Ring of Trust 1');
  const { ringObjRef: ringObjRef2 } = await data.addRing('Ring of Trust 2');
  const { ringObjRef: ringObjRef3 } = await data.addRing('Ring of Trust 3');
  const { ringObjRef: ringObjRef4 } = await data.addRing('Ring of Trust 4');
  const { ringObjRef: ringObjRef5 } = await data.addRing('Ring of Trust 5');

  await data.addOwner(ringObjRef1, fidRef1);
  await data.addOwner(ringObjRef2, fidRef1);
  await data.addOwner(ringObjRef3, fidRef1);

  // await data.printOwnerRels(ringObjRef1);

  await data.addOwner(ringObjRef4, fidRef2);
  await data.addOwner(ringObjRef5, fidRef2);

  // const wearerRel = await data.addWearer(ringObjRef1, fidRef2);

  // await data.printWearerRels(ringObjRef1);

  // add ring Stone (Tag)
  const addStone1Tag = await data.addStone(ringObjRef1, StoneTagNames.stone1, StoneTypes.Honesty);
  const addStone2Tag = await data.addStone(ringObjRef1, StoneTagNames.stone2, StoneTypes.Integrity);

  // await data.printRingStones(ringObjRef1);
  
  client.close();
})();
