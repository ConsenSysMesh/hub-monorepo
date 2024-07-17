import logger from '@tipster/express/logger.mjs';
import getDb, { client } from '@tipster/express/data/mongo-client.mjs';
import BotConfigData from '@tipster/express/data/botConfigs.mjs';
import {getUserOrFetchAndCache} from "../utils/userUtils.mjs";
import TipData from "./tips.mjs";

// type User = {
//   _id: ObjectId, // mongo id
//   id: number; // fid
//   botConfigId: string;
//   allowance: number;
//   balance: number;
//   username: string;
//   displayName?: string;
//   custodyAddress: string; // Eth address
//   pfpUrl?: string;
// };

export class NotEligibleError extends Error {}
export class InsufficientAllowanceError extends Error {}

const getUserCol = async () => {
  const db = await getDb();
  return db.collection('users');
};

const UserData = {
  getAllUsers: async (session = null) => {
    const userCol = await getUserCol();
    const user = await userCol.find({}, { session }).toArray();
    return user;
  },
  getUser: async (id, botConfigId, session = null) => {
    const userCol = await getUserCol();
    const user = await userCol.findOne({ id, botConfigId }, { session });
    return user;
  },
  getUserThatSharesEligibilityGrantingAddress: async (botConfigId, addresses, session = null) => {
    const userCol = await getUserCol();
    const user = await userCol.findOne({ botConfigId, addressesGrantingEligibility: { $in: addresses }}, { session });
    return user;
  },
  getUsersByFid: async (id, session = null) => {
    const userCol = await getUserCol();
    const users = await userCol.find({ id }, { session }).toArray();
    return users;
  },
  getSpecificUsersForBot: async (botConfigId, ids = [], session = null) => {
    const userCol = await getUserCol();
    const users = await userCol.find({ botConfigId, id: { $in: ids} }, { session }).toArray();
    return users;
  },
  getUsersForBot: async (botConfigId, session = null) => {
    const userCol = await getUserCol();
    const users = await userCol.find({ botConfigId }, { session }).toArray();
    return users;
  },
  getLeaderBoard: async (botConfigId) => {
    const userCol = await getUserCol();
    const users = await userCol.find({ botConfigId, balance: { $ne: 0 } }).sort({ balance: -1 }).toArray();
    return users;
  },
  createUser: async (user, session = null) => {
    const userCol = await getUserCol();
    const newUser = await userCol.insertOne(user, { session });
    return newUser;
  },
  bulkCreateUsers: async (users, session = null) => {
    const userCol = await getUserCol();
    return await userCol.insertMany(users, { session });
  },
  bulkUpdateUsers: async (users, session = null) => {
    const userCol = await getUserCol();
    return await userCol.bulkWrite(users.map(({ _id, ...userProps }) => ({
      updateOne :
          {
            "filter": { id: userProps.id, botConfigId: userProps.botConfigId },
            "update": { $set: { ...userProps } },
          }
    })), { session });
  },
  incrementUserBalance: async (id, botConfigId, increment = 1, session = null) => {
    const userCol = await getUserCol();
    const result = await userCol.updateOne({id, botConfigId}, { $inc: { balance: increment } }, { session });
    return result;
  },
  updateUserAllowance: async (id, botConfigId, allowance, updateDate = false, session = null) => {
    const changes = { allowance };
    const userCol = await getUserCol();

    // This handles the special case for hat gated tipping eligibility where a user might have multiple accounts with the same verified address
    // ensuring that the allowances of all accounts that are granted eligibility with the same address are synced
    const user = await UserData.getUser(id, botConfigId, session);
    const addresses = user.addressesGrantingEligibility;

    if (addresses) {
      return await userCol.updateMany({ botConfigId, addressesGrantingEligibility: { $in: addresses }}, {$set: changes}, {session});
    } else {
      return await userCol.updateOne({id, botConfigId}, {$set: changes}, {session});
    }
  },
  tipUser: async (fromUserId, toUserId, botConfigId, amount) => {
    logger.info(`Bot ${botConfigId}: Tip from ${fromUserId} to ${toUserId} for ${amount}`);
    // Step 1: Start a Client Session
    const session = client.startSession();
    // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    // Note: The callback for withTransaction MUST be async and/or return a Promise.
    try {
      await session.withTransaction(async () => {
        const userCol = await getUserCol();
        const fromUser = await getUserOrFetchAndCache(fromUserId, botConfigId, session);
        const toUser = await userCol.findOne({ id: toUserId, botConfigId }, { session });

        if (!fromUser) {
          throw new Error('from User not found');
        }

        const botConfig = await BotConfigData.getBotConfig(botConfigId, session);

        if (!botConfig) {
          throw new Error(`Could not find bot config for channel ${botConfigId} for tipper ${fromUserId}`);
        }

        if (!fromUser.isEligible) {
          logger.info(`User ${fromUserId} is not a tipper for channel ${botConfigId}`);
          throw new NotEligibleError();
        }

        if (fromUser.allowance < amount) {
          logger.info(`User ${fromUserId} has insufficient allowance balance`);
          throw new InsufficientAllowanceError(`You only have ${fromUser.allowance} remaining. Please try again with lower amount.`);
        }

        await UserData.updateUserAllowance(fromUserId, botConfigId, fromUser.allowance - amount, false, session);
        if (!toUser) {
          await getUserOrFetchAndCache(toUserId, botConfigId, session);
        }
        await UserData.incrementUserBalance(toUserId, botConfigId, amount, session);
        logger.info(`Successful Tip from ${fromUserId} to ${toUserId} for ${amount}`);
        await TipData.createTipRecord({
          botConfigId,
          fromFid: fromUserId,
          toFid: toUserId,
          tipAmount: amount,
          timestamp: new Date(),
        }, session);
      });
    } finally {
      await session.endSession();
    }
  },
  deleteUsersForBot: async (botConfigId, session = null) => {
    const userCol = await getUserCol();
    const result = await userCol.deleteMany({ botConfigId }, { session });
    return result;
  },
};

export default UserData;