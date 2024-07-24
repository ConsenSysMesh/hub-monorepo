import { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';

export enum RelationshipTypes {
  Owner = 'owner',
  Wearer = 'wearer',
}

export const fids = [process.env.NEXT_PUBLIC_FID_1, process.env.NEXT_PUBLIC_FID_2, process.env.NEXT_PUBLIC_FID_3]

export const fidItems: SelectItem[] = fids.map((fid) => ({ id: Number(fid), name: fid, avatar: ""} as SelectItem));
