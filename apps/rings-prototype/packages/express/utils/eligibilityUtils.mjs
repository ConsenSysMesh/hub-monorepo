import {ELIGIBILITY_TYPES, HATS_SUPPORTED_CHAINS_MAP} from "../constants/index.mjs";
import { HatsClient } from "@hatsprotocol/sdk-v1-core";
import {createPublicClient, fallback, http} from 'viem';
import _ from 'lodash';
import logger from '@tipster/express/logger.mjs';

const validateEligibilityField = async (eligibilityCriteria, eligibilityType) => {
    try {
        if (eligibilityType === ELIGIBILITY_TYPES.HATS_GATED) {
            const {chainId, hatId} = eligibilityCriteria[ELIGIBILITY_TYPES.HATS_GATED];

            if (!HATS_SUPPORTED_CHAINS_MAP[chainId]) {
                return false;
            }

            const publicClient = createPublicClient({
                chain: HATS_SUPPORTED_CHAINS_MAP[chainId].chain,
                transport: fallback([
                    http(HATS_SUPPORTED_CHAINS_MAP[chainId].rpcUrl),
                    http()
                ]),
            });

            const hatsClient = new HatsClient({
                chainId,
                publicClient,
            });

            const hat = await hatsClient.viewHat(hatId);

            // TODO: HOW TO TELL IF HAT ID INPUT IS VALID?
            return !!hat;

        } else if (eligibilityType === ELIGIBILITY_TYPES.ALLOW_LIST) {
            return eligibilityCriteria[ELIGIBILITY_TYPES.ALLOW_LIST].length > 0;
        }
    } catch (e) {
        logger.error(e.message);
    }
    return false;
}

export const validateEligibility = async (botConfig) => {
    const { eligibilityCriteria, eligibilityType, adminEligibilityCriteria, adminEligibilityType } = botConfig;
    const results = await Promise.all([
        validateEligibilityField(eligibilityCriteria, eligibilityType),
        validateEligibilityField(adminEligibilityCriteria, adminEligibilityType)
    ]);
    return results[0] && results[1];
}

export const checkEligibilityNew = async (fid, userData, eligibilityCriteria, eligibilityType) => {
    const criteria = eligibilityCriteria[eligibilityType];
    if (eligibilityType === ELIGIBILITY_TYPES.HATS_GATED) {
        const {chainId, hatId} = criteria;
        const publicClient = createPublicClient({
            chain: HATS_SUPPORTED_CHAINS_MAP[chainId].chain,
            transport: fallback([
                http(HATS_SUPPORTED_CHAINS_MAP[chainId].rpcUrl),
                http()
            ]),
        });

        const hatsClient = new HatsClient({
            chainId,
            publicClient,
        });

        const addressesGrantingEligibility = [];

        await Promise.all(userData.verified_addresses.eth_addresses.map(async (addr) => {
            const result = await hatsClient.isWearerOfHat({
                wearer: addr,
                hatId,
            });
            if (result) {
                addressesGrantingEligibility.push(addr);
            }
        }));
        return addressesGrantingEligibility;
    } else {
        return criteria.includes(fid);
    }
}

export const interpretEligibility = (result) => {
    if (_.isArray(result)) {
        return result.length > 0;
    }
    return result
}