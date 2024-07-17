import UserData from "../data/users.mjs";
import NeynarAPI from "../neynar/index.mjs";
import BotConfigData from "../data/botConfigs.mjs";
import _ from 'lodash';
import logger from '@tipster/express/logger.mjs';
import { client } from '@tipster/express/data/mongo-client.mjs';
import {getUpdatedUserObj} from "../utils/userUtils.mjs";

// Update Eligibility Fields + Optionally update allowance
const updateEligibility = async (users, userDataMap, botConfigMap, session = null) => {
    const updatedUsers = _.compact(await Promise.all(users.map(async (u) => {
        if (!botConfigMap[u.botConfigId]) {
            logger.info(`${u.botConfigId} config does not exist`);
            return null;
        }
        const updatedUser = await getUpdatedUserObj(botConfigMap[u.botConfigId], userDataMap[u.id], u);
        return _.isEqual(updatedUser, u) ? null : updatedUser;
    })));

    if (updatedUsers.length > 0) {
        logger.info(`Updating ${updatedUsers.length} users`);
        await UserData.bulkUpdateUsers(updatedUsers, session);
        logger.info('Successful Update');
    } else {
        logger.info('No Updates Required');
    }
}

const updateSingleBotEligibility = async (botConfigId, session = null) => {
    const users = await UserData.getUsersForBot(botConfigId, session);

    const botConfig = await BotConfigData.getBotConfig(botConfigId, session);

    const fids = users.map((u) => u.id);

    const neynarUserData = await NeynarAPI.getBulkUserData(fids);

    const userDataMap = _.keyBy(neynarUserData.users, 'fid');

    await updateEligibility(users, userDataMap, { [botConfig.id]: botConfig }, session);
}

const updateAllBotEligibility = async (session = null) => {
    const users = await UserData.getAllUsers(session);

    const uniqueFids = Array.from(new Set(users.map((u) => u.id)));

    const neynarUserData = await NeynarAPI.getBulkUserData(uniqueFids);

    const userDataMap = _.keyBy(neynarUserData.users, 'fid');

    const botConfigs = await BotConfigData.getAllBotConfigs(session);

    const botConfigMap = _.keyBy(botConfigs, 'id');

    await updateEligibility(users, userDataMap, botConfigMap, session);
}

const JobHandlers = {
    updateAllEligibilityAndAllowance: async (job, done) => {
        logger.info(`${new Date().toISOString()}: Starting update-eligibility-and-allowance job...`);

        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                await updateAllBotEligibility(session);
            });
        } catch (e) {
            logger.error('Failed update-eligibility-and-allowance job');
            logger.error(e.message);
            throw (e);
        } finally {
            await session.endSession();
        }
        done();
    },
    updateOneEligibilityAndAllowance: async (job, done) => {
        const { data } = job.attrs;

        logger.info(`${new Date().toISOString()} Starting update-one-eligibility-and-allowance job for bot ${data.botConfigId}...`);

        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                await updateSingleBotEligibility(data.botConfigId, session);
            });
        } catch (e) {
            logger.error('Failed update-one-eligibility-and-allowance job');
            logger.error(e.message);
            throw (e);
        } finally {
            await session.endSession();
        }
        done();
    },
};

export default JobHandlers;