import _ from "lodash";
import {
  FarcasterNetwork,
  NobleEd25519Signer,
  hexStringToBytes,
} from '@farcaster/hub-web';
import { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';

export const NETWORK = FarcasterNetwork.DEVNET;

export const Fids = [process.env.NEXT_PUBLIC_FID_1 as string, process.env.NEXT_PUBLIC_FID_2 as string, process.env.NEXT_PUBLIC_FID_3 as string];
export const Pks = [process.env.NEXT_PUBLIC_PRIVATE_KEY_1 as string, process.env.NEXT_PUBLIC_PRIVATE_KEY_2 as string, process.env.NEXT_PUBLIC_PRIVATE_KEY_3 as string];

export const SignersByFid = Fids.reduce((acc, cur, index) => {
  const pk = Pks[index];
  if (pk) {
    acc[cur] = new NobleEd25519Signer(hexStringToBytes(pk.slice(2))._unsafeUnwrap());
  }
  return acc;
},
{});

export const fidItems: SelectItem[] = Fids.map((fid) => ({ id: Number(fid), name: fid, avatar: ""} as SelectItem));
