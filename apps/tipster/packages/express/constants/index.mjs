import {arbitrum, base, celo, gnosis, mainnet, optimism, polygon, sepolia} from "viem/chains";
import envConfig from '@tipster/express/env-loader/index.mjs';

export const ELIGIBILITY_TYPES = {
    ALLOW_LIST: 'allowList',
    HATS_GATED: 'hatsGated',
}

export const HATS_SUPPORTED_CHAINS_MAP = {
    1: { chain: mainnet, rpcUrl: `https://mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    10: { chain: optimism, rpcUrl: `https://optimism-mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    100: { chain: gnosis, rpcUrl: `https://rpc.gnosischain.com` },
    137: { chain: polygon, rpcUrl: `https://polygon-mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    8453: { chain: base, rpcUrl: `https://base-mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    42_161: { chain: arbitrum, rpcUrl: `https://arbitrum-mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    42_220: { chain: celo, rpcUrl: `https://celo-mainnet.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
    11_155_111: { chain: sepolia, rpcUrl: `https://sepolia.infura.io/v3/${envConfig.INFURA_PROJECT_ID}` },
}




