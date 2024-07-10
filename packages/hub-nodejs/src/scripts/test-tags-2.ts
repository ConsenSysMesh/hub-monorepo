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
  
  // const SIGNER = "0x121f84291b21498e0118ba878f3ace55fb9c6466d52813be92fe174749ee3f3f";
  // // Fid owned by the custody address
  // const FID = 660003; // <REQUIRED>
  
  const SIGNER = "0xb4c47a7b5729e7eed5120a127984acf068684496ff3dda99259056164b42a5a8";
  // Fid owned by the custody address
  const FID = 773349; // <REQUIRED>
  
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
        text: "This is a cast with no mentions 2",
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
        name: 'bestTag',
        content: 'the best',
        target: {
          castKey: {
            network: 3,
            hash: cast._unsafeUnwrap().hash,
            fid: FID,
          },
        }
      },
    dataOptions,
    ed25519Signer);
  
    const tag = await client.submitMessage(tagAdd._unsafeUnwrap());
  
  //   const tagAdd2 = await makeTagAdd({
  //     name: 'lastone9',
  //     content: 'blah',
  //     target: {
  //       fid: 390760,
  //     }
  //   },
  // dataOptions,
  // ed25519Signer);
  //   const tag2 = await client.submitMessage(tagAdd2._unsafeUnwrap());
  
  //   console.log(tag);
  //   console.log(tag._unsafeUnwrap().data?.tagBody);
  
    // const y = await client.getTagsByFid({ fid: FID, value: "epicTag" });
  
    const y = await client.getTagsByTarget({ 
      target: {
        castKey: {
          network: 3,
          hash: cast._unsafeUnwrap().hash,
          fid: FID,
        },
      }})
  
    if (y.isOk()) {
      y._unsafeUnwrap().messages.forEach((m) => {
        console.log(m.data);
      })
    } else if (y.isErr()) {
      console.log('ERROR', y.error);
    }
  
    // const y = await client.getTagsByFid({ fid: FID, value: 'testTag' });
    // console.log(`Found ${y._unsafeUnwrap().messages.length} tags.`);
    // console.log(JSON.stringify(y._unsafeUnwrap(), null, 2));
  
    client.close();
  })();
  