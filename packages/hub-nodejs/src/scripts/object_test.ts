import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeCastAdd,
  makeTagAdd,
  makeObjectAdd,
  NobleEd25519Signer,
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

  const ObjType = "VladObj";
  // If your client does not use SSL.
  const client = getInsecureHubRpcClient(HUB_URL);

  const objectAdd = await makeObjectAdd({
    type: ObjType,
    displayName: "Vlad OBJ CUZ 2",
    avatar: "https://i.pinimg.com/474x/36/f3/89/36f38906aa7073156b19e445a74d03f2.jpg",
    description: "Vlad's awesome custom object numba 2"
  },
  dataOptions,
  ed25519Signer);

  console.log('ObjectAdd message', objectAdd);
  const tag = await client.submitMessage(objectAdd._unsafeUnwrap());
  console.log(tag._unsafeUnwrap().data?.objectAddBody);

  const y = await client.getObjectsByFid({ fid: FID, type: ObjType });

  if (y.isOk()) {
    console.log(y._unsafeUnwrap().messages.map(m => m.data));
  } else if (y.isErr()) {
    console.log('ERROR', y.error);
  }

  // const y = await client.getTagsByFid({ fid: FID, value: 'testTag' });
  // console.log(`Found ${y._unsafeUnwrap().messages.length} tags.`);
  // console.log(JSON.stringify(y._unsafeUnwrap(), null, 2));

  client.close();
})();
