import {
  FarcasterNetwork,
  getInsecureHubRpcClient,
  HubResult,
  makeCastAdd,
  makeCastRemove,
  makeLinkAdd,
  makeLinkRemove,
  makeReactionAdd,
  makeUserDataAdd,
  Message,
  NobleEd25519Signer,
  ReactionType,
  UserDataType,
} from "@farcaster/hub-nodejs";
import { hexToBytes } from "@noble/hashes/utils";

/**
 * Populate the following constants with your own values
 */

// Signer private key registered with the Hub (see hello-world example)
const SIGNER = "0x19ff90fce9247ae41b71bfe9d4dce9185c97a69a8545310884a91b808856e58c";
// Fid owned by the custody address
const FID = 569997; // <REQUIRED>

// Testnet Configuration
const HUB_URL = "localhost:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.TESTNET; // Network of the Hub

(async () => {
  // Set up the signer
  const privateKeyBytes = hexToBytes(SIGNER.slice(2));
  const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);
  const signerPublicKey = (await ed25519Signer.getSignerKey())._unsafeUnwrap();

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

  const x = await client.submitMessage(castAdd._unsafeUnwrap());
  console.log("submittedMessage", x);

  client.close();
})();
