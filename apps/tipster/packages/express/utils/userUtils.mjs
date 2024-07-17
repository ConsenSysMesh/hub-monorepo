import UserData from "../data/users.mjs";
import NeynarAPI, {convertCommonUserFields} from "../neynar/index.mjs";
import {checkEligibilityNew, interpretEligibility} from "./eligibilityUtils.mjs";
import BotConfigData from "../data/botConfigs.mjs";
import moment from 'moment';
import _ from "lodash";

export const getUpdatedUserObj = async (botConfig, neynarUser, currentUser = null) => {
    const isEligibleResult = await checkEligibilityNew(neynarUser.fid, neynarUser, botConfig.eligibilityCriteria, botConfig.eligibilityType);
    const isEligible = interpretEligibility(isEligibleResult);
    const isAdminResult = await checkEligibilityNew(neynarUser.fid, neynarUser, botConfig.adminEligibilityCriteria, botConfig.adminEligibilityType);
    const isAdmin = interpretEligibility(isAdminResult);
    const addressesGrantingEligibility = isEligible && _.isArray(isEligibleResult) ? isEligibleResult : null;
    const updatedUser = {
        ...(currentUser || {}),
        id: neynarUser.fid, // fid
        botConfigId: botConfig.id,
        isAdmin,
        isEligible,
        addressesGrantingEligibility,
        ...convertCommonUserFields(neynarUser)
    }

    // If we are creating a new user, set default values based on eligibility
    if (!currentUser) {
        updatedUser.allowance = isEligible ? botConfig.dailyAllowance : 0;
        updatedUser.allowanceGrantedOn = isEligible ? new Date() : null;
        updatedUser.balance = 0;
    }
    // If we are updating user, check if we need to update their allowance
    else if (!updatedUser.allowanceGrantedOn || !moment(updatedUser.allowanceGrantedOn).isSame(new Date(), 'days')) {
        if (isEligible) {
            // Update Allowance
            updatedUser.allowance = botConfig.dailyAllowance;
            updatedUser.allowanceGrantedOn = new Date();
        } else {
            // Revoke Allowance
            updatedUser.allowance = 0;
        }
    }
    return updatedUser;
}

export const getUserOrFetchAndCache = async (id, botConfigId, session = null) => {
    const botConfig = await BotConfigData.getBotConfig(botConfigId, session);
    const user = await UserData.getUser(id, botConfigId, session);
    if (user) {
        return user;
    } else {
        const neynarUser = (await NeynarAPI.getBulkUserData([id])).users[0];
        const newUser = await getUpdatedUserObj(botConfig, neynarUser);
        // Sybil Check
        const addressesToSearch = newUser.addressesGrantingEligibility;
        if (addressesToSearch) {
            const sybilUser = await UserData.getUserThatSharesEligibilityGrantingAddress(botConfigId, addressesToSearch, session);
            if (sybilUser) {
                newUser.allowance = sybilUser.allowance;
                newUser.allowanceGrantedOn = sybilUser.allowanceGrantedOn;
            }
        }
        await UserData.createUser(newUser, session);
        return await UserData.getUser(id, botConfigId, session);
    }
}
