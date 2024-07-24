import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  NobleEd25519Signer,
  ObjectRef,
  ObjectRefTypes,
} from "@farcaster/hub-nodejs";
import { hexToBytes } from "@noble/hashes/utils";
import { StoneTagNames, StoneTypes } from "@farcaster/rings-next/types";
import { getDataLayer } from "@farcaster/rings-next/scripts/data-utils";

const SIGNER = "0xe3bfdf6f5d5f0a807aa873c82d6fbf331249a33d51f14441baacf5b76b7c8708";
// Set up the signer
const privateKeyBytes = hexToBytes(SIGNER.slice(2));
const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);

// Fid owned by the custody address
const APP_FID = 691017;
const OWNER_FID = 799114;
const WEARER_FID = 799118;

// Testnet Configuration
const HUB_URL = "127.0.0.1:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.DEVNET; // Network of the Hub

const client = getInsecureHubRpcClient(HUB_URL);

const dataOptions = {
  fid: APP_FID,
  network: NETWORK,
};

(async () => {
  const data = getDataLayer(client, dataOptions, ed25519Signer);

  const { ringObj, ringObjRef } = await data.addRing();

  const ownerFidRef = ObjectRef.create({
    fid: OWNER_FID,
    type: ObjectRefTypes.FID,
  });

  const ownerRel = await data.addOwner(ringObjRef, ownerFidRef);

  await data.printOwnerRels(ringObjRef);

  const wearerFidRef = ObjectRef.create({
    fid: WEARER_FID,
    type: ObjectRefTypes.FID,
  });

  const wearerRel = await data.addWearer(ringObjRef, wearerFidRef);

  await data.printWearerRels(ringObjRef);

  // add ring Stone (Tag)
  const addStone1Tag = await data.addStone(ringObjRef, StoneTagNames.stone1, StoneTypes.Honesty);
  const addStone2Tag = await data.addStone(ringObjRef, StoneTagNames.stone2, StoneTypes.Integrity);

  await data.printRingStones(ringObjRef);
  
  client.close();
})();
