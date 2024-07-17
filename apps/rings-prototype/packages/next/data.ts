import { Bot, UserStats, Leaderboard } from "@tipster/next/types";

export interface Data {
  bots: Bot[];
  userStats: UserStats;
  leaderboard: Leaderboard;
}

let imgCounter = 1; // Initialize counter for img parameter
const generateAvatarUrl = (): string => `https://i.pravatar.cc/150?img=${imgCounter++}`;

const data: Data = {
  bots: [
    {
      _id: '1',
      id: 'bot1',
      botName: 'Bot 1',
      channelId: 'channel1',
      channelImageUrl: generateAvatarUrl(),
      channelName: 'Channel 1',
      channelUrl: 'https://example.com/channel1',
      dailyAllowance: 10,
      eligibilityCriteria: {
        userObjs: [
          {
            id: 1,
            displayName: 'Account 1',
            username: 'ENS 1',
            pfpUrl: generateAvatarUrl(),
          },
          {
            id: 2,
            displayName: 'Account 2',
            username: 'ENS 2',
            pfpUrl: generateAvatarUrl()
          },
          {
            id: 3,
            displayName: 'Account 3',
            username: 'ENS 3',
            pfpUrl: generateAvatarUrl()
          },
        ]
      },
      eligibilityDescription: 'Eligibility criteria for Bot 1',
      triggerWord: 'bot1'
    },
    {
      _id: '2',
      id: 'bot2',
      accounts: [
        {
          id: 2,
          name: 'Account 2',
          ens: 'ENS 2',
          avatarUrl: generateAvatarUrl(),
        }
      ],
      botName: 'Bot 2',
      channelId: 'channel2',
      channelImageUrl: generateAvatarUrl(),
      channelName: 'Channel 2',
      channelUrl: 'https://example.com/channel2',
      dailyAllowance: 5,
      eligibilityCriteria: {
        userObjs: [
          {
            id: 1,
            displayName: 'Account 1',
            username: 'ENS 1',
            pfpUrl: generateAvatarUrl(),
          },
          {
            id: 2,
            displayName: 'Account 2',
            username: 'ENS 2',
            pfpUrl: generateAvatarUrl()
          },
          {
            id: 3,
            displayName: 'Account 3',
            username: 'ENS 3',
            pfpUrl: generateAvatarUrl()
          },
        ]
      },
      adminEligibilityCriteria: {
        userObjs: [
          {
            id: 1,
            displayName: 'Account 1',
            username: 'ENS 1',
            pfpUrl: generateAvatarUrl(),
          },
          {
            id: 2,
            displayName: 'Account 2',
            username: 'ENS 2',
            pfpUrl: generateAvatarUrl()
          },
          {
            id: 3,
            displayName: 'Account 3',
            username: 'ENS 3',
            pfpUrl: generateAvatarUrl()
          },
        ]
      },
      eligibilityDescription: 'Eligibility criteria for Bot 2',
      triggerWord: 'bot2'
    }
  ],
  userStats: {
    id: '1',
    botConfigId: 'bot1', // Add botConfigId
    displayName: 'Account 1',
    username: 'ENS 1',
    pfpUrl: generateAvatarUrl(),
    balance: 99,
    rank: 7,
    isEligible: true,
    allowance: 50,
  },
  leaderboard: {
    botConfigId: 'bot1', // Add botConfigId
    users: [
      {
        id: 1,
        displayName: 'Account 2',
        username: 'ENS 2',
        pfpUrl: generateAvatarUrl(),
        balance: 1,
        isEligible: false,
      },
      {
        id: 2,
        displayName: 'Account 3',
        username: 'ENS 3',
        pfpUrl: generateAvatarUrl(),
        balance: 100,
        isEligible: true,
      },
      {
        id: 3,
        displayName: 'Account 4',
        username: 'ENS 4',
        pfpUrl: generateAvatarUrl(),
        balance: 4,
        isEligible: false
      },
    ],
  },
};

export default data;