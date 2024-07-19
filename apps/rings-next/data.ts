import { Ring } from "@farcaster/rings-next/types";

export interface Data {
  [key: number]: {
    rings: Ring[];
  }
}

let imgCounter = 1; // Initialize counter for img parameter
const generateAvatarUrl = (): string => `https://i.pravatar.cc/150?img=${imgCounter++}`;

const data: Data = {
  773349: {
    rings: [
      {
        ownerFid: 773349,
        stones: [
          { attribute: 'Honest' }
        ],
        wearerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 773349,
        stones: [
          { attribute: 'Smart' }
        ],
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 773349,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 773349,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 773349,
        imgUrl: generateAvatarUrl()
      }
    ],
  },
  784578: {
    rings: [
      {
        ownerFid: 784578,
        stones: [
        ],
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
      {
        ownerFid: 773349,
        stones: [
          { attribute: 'Honest' }
        ],
        wearerFid: 784578,
        imgUrl: generateAvatarUrl()
      },
    ],
  }
};

export default data;