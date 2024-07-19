import config from '@farcaster/rings-next/tamagui.config'
import { ObjectRef, TagBody, ObjectAddBody, RelationshipAddBody, Message } from '@farcaster/hub-web';

export type Conf = typeof config

interface TamaguiCustomConfig extends Conf {}

import { ImageSourcePropType } from 'react-native';


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