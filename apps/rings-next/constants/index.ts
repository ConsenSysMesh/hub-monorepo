import { Item as SelectItem } from '@farcaster/rings-next/components/select/Select';


export const IS_USING_MOCK_DATA = process.env.NEXT_PUBLIC_MOCK_DATA === 'true';
export const eligibilityEnums = {
  AllowList: 'allowList',
  HatsGated: 'hatsGated',
};

// TODO: delete existing trash above
export enum RelationshipTypes {
  Owner = 'owner',
  Wearer = 'wearer',
}

export const fids: SelectItem[] = [{ id: 773349, name: "773349" }, { id: 784578, name: "784578" }];
