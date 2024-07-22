import config from '@farcaster/rings-next/tamagui.config'
import { ObjectRef, TagBody, ObjectAddBody, RelationshipAddBody, Message } from '@farcaster/hub-web';

export type Conf = typeof config

interface TamaguiCustomConfig extends Conf {}

import { ImageSourcePropType } from 'react-native';

// The expected `type` value of Objects representing Rings
const RingObjectType = "Ring";

// TODO: choosing to collapse FC user data composed of multiple UserDataBody pieces into a single object
export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
};

export interface Ring {
  ring: Message;
  stone1: Message | undefined,
  stone2: Message | undefined,
  stone3: Message | undefined,
  owner: User;
  wearer: User | undefined;
  wearerMsg: Message | undefined,
};

// expected `name` field values for the tags representing Stones in a Ring
export enum StoneTagNames {
  stone1 = 'stone1',
  stone2 = 'stone2',
  stone3 = 'stone3',
  // etc
};

// expected `content` field values for the tags representing Stones in a Ring 
export enum StoneTypes {
  Honesty = 'Honesty',
  Integrity = 'Integrity',
  Cool = 'Cool',
  // etc
};



export interface RootState {
  users: Reducer<EntityState<User, number>>,
  rings: Reducer<EntityState<Message, string>>,
  stones: Reducer<EntityState<Message, string>>,
  relationships: Reducer<EntityState<Message, string>>,
};