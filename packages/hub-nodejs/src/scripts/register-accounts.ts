import * as ed from "@noble/ed25519";
import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  BUNDLER_ADDRESS,
  bundlerABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  FarcasterNetwork,
} from "@farcaster/hub-nodejs";
import { bytesToHex, createPublicClient, createWalletClient, http, parseEther, toBytes } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { optimism } from "viem/chains";
import colorize from '@pinojs/json-colorizer';
import fs from "fs";

const HUB_URL = "localhost:2283"; // URL + Port of the Hub
const NETWORK = FarcasterNetwork.DEVNET; // Network of the Hub

// 1. Set up clients and account keys

const hardhatAccount = privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

const APP_PRIVATE_KEY = generatePrivateKey();
const APP_PUBLIC_KEY = privateKeyToAccount(APP_PRIVATE_KEY);
const ALICE_PRIVATE_KEY = generatePrivateKey();
const ALICE_PUBLIC_KEY = privateKeyToAccount(ALICE_PRIVATE_KEY);
const OP_PROVIDER_URL = "http://localhost:8545";

const publicClient = createPublicClient({
  chain: optimism,
  transport: http(OP_PROVIDER_URL),
});

const walletClient = createWalletClient({
  chain: optimism,
  transport: http(OP_PROVIDER_URL),
});

const app = privateKeyToAccount(APP_PRIVATE_KEY);
const appAccountKey = new ViemLocalEip712Signer(app);

const alice = privateKeyToAccount(ALICE_PRIVATE_KEY);
const aliceAccountKey = new ViemLocalEip712Signer(alice);

const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // set the signatures' deadline to 1 hour from now

const WARPCAST_RECOVERY_PROXY = "0x00000000FcB080a4D6c39a9354dA9EB9bC104cd7";

async function sendEth(address: `0x${string}`, value: string) {
  const sendTxHash = await walletClient.sendTransaction({
    account: hardhatAccount.address,
    to: address,
    value: parseEther(value),
  });
}

(async () => {
  await sendEth(APP_PUBLIC_KEY.address, "100");
  await sendEth(ALICE_PUBLIC_KEY.address, "100");

  // 2. Register an app fid

  const price = await publicClient.readContract({
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "price",
    args: [0n],
  });

  const { request } = await publicClient.simulateContract({
    account: app,
    address: ID_GATEWAY_ADDRESS,
    abi: idGatewayABI,
    functionName: "register",
    args: [WARPCAST_RECOVERY_PROXY, 0n],
    value: price,
  });
  await walletClient.writeContract(request);

  const APP_FID = await publicClient.readContract({
    address: ID_REGISTRY_ADDRESS,
    abi: idRegistryABI,
    functionName: "idOf",
    args: [app.address],
  });

  // 3. Collect a Register signature from the user.

  let nonce = await publicClient.readContract({
    address: KEY_GATEWAY_ADDRESS,
    abi: keyGatewayABI,
    functionName: "nonces",
    args: [alice.address],
  });

  const registerSignatureResult = await aliceAccountKey.signRegister({
    to: alice.address as `0x${string}`,
    recovery: WARPCAST_RECOVERY_PROXY,
    nonce,
    deadline,
  });

  let registerSignature;
  if (registerSignatureResult.isOk()) {
    registerSignature = registerSignatureResult.value;
  } else {
    throw new Error("Failed to generate register signature");
  }

  // Create an Ed25519 account keypair for Alice and get the public key.
  const privateKeyBytes = ed.utils.randomPrivateKey();
  const accountKey = new NobleEd25519Signer(privateKeyBytes);
  let accountPubKey = new Uint8Array();
  const accountKeyResult = await accountKey.getSignerKey();
  fs.writeFile('alice-signing.key', bytesToHex(privateKeyBytes), () => {});

  // 5. Use your app account to create a Signed Key Request
  if (accountKeyResult.isOk()) {
    accountPubKey = accountKeyResult.value;

    const signedKeyRequestMetadata = await appAccountKey.getSignedKeyRequestMetadata({
      requestFid: APP_FID,
      key: accountPubKey,
      deadline,
    });

    // 6. Collect an Add signature from the user.
    if (signedKeyRequestMetadata.isOk()) {
      const metadata = bytesToHex(signedKeyRequestMetadata.value);

      nonce = await publicClient.readContract({
        address: KEY_GATEWAY_ADDRESS,
        abi: keyGatewayABI,
        functionName: "nonces",
        args: [alice.address],
      });

      const addSignatureResult = await aliceAccountKey.signAdd({
        owner: alice.address as `0x${string}`,
        keyType: 1,
        key: accountPubKey,
        metadataType: 1,
        metadata,
        nonce,
        deadline,
      });

      // 7. Call the Bundler contract to register on-chain.
      if (addSignatureResult.isOk()) {
        const addSignature = addSignatureResult.value;

        const price = await publicClient.readContract({
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: "price",
          args: [0n],
        });

        const { request } = await publicClient.simulateContract({
          account: app,
          address: BUNDLER_ADDRESS,
          abi: bundlerABI,
          functionName: "register",
          args: [
            {
              to: alice.address,
              recovery: WARPCAST_RECOVERY_PROXY,
              sig: bytesToHex(registerSignature),
              deadline,
            },
            [
              {
                keyType: 1,
                key: bytesToHex(accountPubKey),
                metadataType: 1,
                metadata: metadata,
                sig: bytesToHex(addSignature),
                deadline,
              },
            ],
            0n,
          ],
          value: price,
        });
        await walletClient.writeContract(request);
      }
    }

    const output = {
      app: {
        custody: {
          address: APP_PUBLIC_KEY.address,
          key: APP_PRIVATE_KEY,
        },
        fid: APP_FID.toString(),
      },
      alice: {
        custody: {
          address: ALICE_PUBLIC_KEY.address,
          key: ALICE_PRIVATE_KEY,
        },
        signing: {
          address: bytesToHex(accountPubKey),
          key: bytesToHex(privateKeyBytes),
        },
      }
    }
    const outputString = JSON.stringify(output, null, 2);
    console.log('Writing this to account.json', colorize(outputString));
    fs.writeFileSync('accounts.json', outputString);

    // send a cast
  }
})();
