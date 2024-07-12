import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeCastAdd,
  makeTagAdd,
  makeObjectAdd,
  NobleEd25519Signer,
  ObjectRefTypes,
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

const SIGNER = "0xb4c47a7b5729e7eed5120a127984acf068684496ff3dda99259056164b42a5a8";
// Fid owned by the custody address
const FID = 773349; // <REQUIRED>

const SIGNER2 = "0xc5dfbd819106c7c0a4ee8d2a4a54aa76957a8bf0a9f1029be6683b0e1ed5d6d5";
const FID2 = 784578;

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

  const privateKeyBytes2 = hexToBytes(SIGNER2.slice(2));
  const ed25519Signer2 = new NobleEd25519Signer(privateKeyBytes2);
  // const signerPublicKey = (await ed25519Signer.getSignerKey())._unsafeUnwrap();

  const dataOptions2 = {
    fid: FID2,
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
  const object = await client.submitMessage(objectAdd._unsafeUnwrap());

  const tagAdd = await makeTagAdd({
    name: 'newtagg',
    content: 'the best',
    target: {
      type: ObjectRefTypes.CAST,
      network: NETWORK,
      hash: objectAdd._unsafeUnwrap().hash,
      fid: FID,
    },
  },
  dataOptions,
  ed25519Signer);

  const tag = await client.submitMessage(tagAdd._unsafeUnwrap());

  const tagAdd2 = await makeTagAdd({
    name: 'newtag2',
    content: 'the best 2',
    target: {
      type: ObjectRefTypes.CAST,
      network: NETWORK,
      hash: objectAdd._unsafeUnwrap().hash,
      fid: FID,
    }
  },
  dataOptions2,
  ed25519Signer2);

  const tag2 = await client.submitMessage(tagAdd2._unsafeUnwrap());


  const y = await client.getObject({ fid: FID, hash: objectAdd._unsafeUnwrap().hash, tagOptions: { includeTags: true, creatorTagsOnly: false } });

  if (y.isOk()) {
    console.log(y._unsafeUnwrap().object?.data?.objectAddBody);
    y._unsafeUnwrap().tags.forEach(t => {
      console.log(t.data);
    })
  } else if (y.isErr()) {
    console.log('ERROR', y.error);
  }

  // const y = await client.getTagsByFid({ fid: FID, value: 'testTag' });
  // console.log(`Found ${y._unsafeUnwrap().messages.length} tags.`);
  // console.log(JSON.stringify(y._unsafeUnwrap(), null, 2));

  client.close();
})();
