import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeCastAdd,
  makeTagAdd,
  NobleEd25519Signer,
} from "@farcaster/hub-nodejs";
import { hexToBytes } from "@noble/hashes/utils";

/**
 * Populate the following constants with your own values
 */

const SIGNER = "0x64676016b9b8453326a78e989b8afd54844f31b8be63cfd364bd7975449a5047";
// Fid owned by the custody address
const FID = 628598; // <REQUIRED>

// Testnet Configuration
const HUB_URL = "localhost:2283"; // URL + Port of the Hub
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

  // If your client does not use SSL.
  const client = getInsecureHubRpcClient(HUB_URL);

  /**
   * Example 1: A cast with no mentions
   *
   * "This is a cast with no mentions"
   */

  const castAdd = await makeCastAdd(
    {
      text: "This is a cast with no mentions",
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    },
    dataOptions,
    ed25519Signer,
  );

  const cast = await client.submitMessage(castAdd._unsafeUnwrap());

  console.log(cast._unsafeUnwrap().hash);

  const tagAdd = await makeTagAdd({
      type: 'testTag',
      targetCastId: {
        fid: FID,
        hash: cast._unsafeUnwrap().hash,
      }
    },
  dataOptions,
  ed25519Signer);

  const tag = await client.submitMessage(tagAdd._unsafeUnwrap());
  console.log(tag._unsafeUnwrap().data?.tagBody);

  const y = await client.getTagsByFid({ fid: FID, value: "testTag" });

  if (y.isOk()) {
    console.log(y._unsafeUnwrap());
  } else if (y.isErr()) {
    console.log('ERROR', y.error);
  }

  // const y = await client.getTagsByFid({ fid: FID, value: 'testTag' });
  // console.log(`Found ${y._unsafeUnwrap().messages.length} tags.`);
  // console.log(JSON.stringify(y._unsafeUnwrap(), null, 2));

  client.close();
})();
