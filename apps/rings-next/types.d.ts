import config from '@farcaster/rings-next/tamagui.config'

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

export interface User {
  _id: string;
  id: number;
  botConfigId: string;
  allowance: number;
  balance: number;
  username: string;
  displayName: string;
  custodyAddress: string;
  pfpUrl: string;
}

export interface Leaderboard {
  botConfigId: string;
  users: User[];
}
