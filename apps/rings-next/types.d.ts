import config from '@farcaster/rings-next/tamagui.config'
import { ObjectRef, TagBody, ObjectAddBody, RelationshipAddBody, Message } from '@farcaster/hub-web';

export type Conf = typeof config

interface TamaguiCustomConfig extends Conf {}

import { ImageSourcePropType } from 'react-native';

export interface Profile {
  fid?: number;
  pfpUrl?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  custody?: `0x${string}`;
  verifications?: `0x${string}`[];
}

export interface Account {
  id: number;
  name: string;
  ens: string;
  avatarUrl: ImageSourcePropType;
}

export interface EligibilityCriteria {
  users: Array<number>;
  userObjs: Array<User>;
}

export interface Bot {
  _id: string
  id: string;
  accounts: Account[];
  botName: string;
  channelId: string;
  channelImageUrl: ImageSourcePropType;
  channelName: string;
  channelUrl: string;
  dailyAllowance: number;
  eligibilityCriteria: EligibilityCriteria;
  eligibilityDescription: string;
  ownerId: number;
  triggerWord: string;
}


export interface UserStats {
  botConfigId: string;
  balance: number;
  allowance: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  isEligible: boolean;
  rank: number;
}

export interface Leaderboard {
  botConfigId: string;
  users: User[];
}

// TODO: choosing to collapse FC user data composed of multiple UserDataBody pieces into a single object
export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
};

export interface Ring {
  ring: Message;
  stone: Message | undefined,
  owner: User;
  wearer: User | undefined;
};

export enum StoneTypes {
  honesty = 'honesty',
  integrity = 'integrity',
  cool = 'cool',
  // etc
};

export interface RootState {
  users: Reducer<EntityState<User, number>>,
  rings: Reducer<EntityState<Message, string>>,
  stones: Reducer<EntityState<Message, string>>,
  relationships: Reducer<EntityState<Message, string>>,
};