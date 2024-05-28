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

// Signer private key registered with the Hub (see hello-world example)
const SIGNER = "0xf7baa925cbadc673ae3eb6fa33fe61f4134acfb003ce33e6df6d19fe3ef34684";
// Fid owned by the custody address
const FID = 586432; // <REQUIRED>

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

  const f = await client.getFids({});
  console.log(f);

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

  console.log(JSON.stringify(cast));

  const tagAdd = await makeTagAdd({
      value: 'testTag',
      targetCastId: {
        fid: cast.fid,
        hash: cast.hash,
      },
    },
  dataOptions,
  ed25519Signer);

  const tag = await client.submitMessage(await tagAdd._unsafeUnwrap());

  console.log('TAG!!!!', tag);

  const y = await client.getCastsByFid({ fid: FID });

  // console.log(JSON.stringify(y, null, 2));

  client.close();
})();
