import _ from 'lodash';
import getDb from '@tipster/express/data/mongo-client.mjs';
import UserData from "./users.mjs";

const getBotConfigCol = async () => {
  const db = await getDb();
  return db.collection('botConfigs');
};

const BotConfigData = {
  getAllBotConfigs: async (session = null) => {
    const configCol = await getBotConfigCol();
    const cursor = await configCol.find({}, { session });
    const configs = await cursor.toArray();
    return configs;
  },
  getBotConfigsByOwnerId: async (ownerId, session = null) => {
    const configCol = await getBotConfigCol();
    const cursor = await configCol.find({ ownerId }, { session });
    const configs = await cursor.toArray();
    return configs;
  },
  getBotConfigByAdminEligibility: async (fid, session) => {
    const configCol = await getBotConfigCol();
    const userObjs = await UserData.getUsersByFid(fid);
    const configIds = [];
    userObjs.forEach((u) => {
      if (u.isAdmin) {
        configIds.push(u.botConfigId);
      }
    });
    const cursor = await configCol.find({ id: { $in: configIds }}, { session });
    const configs = await cursor.toArray();
    return configs;
  },
  getBotConfig: async (id, session = null) => {
    const configCol = await getBotConfigCol();
    return configCol.findOne({ id }, { session });
  },
  getBotConfigByChannel: async (channelUrl, session = null) => {
    const configCol = await getBotConfigCol();
    return configCol.findOne({ channelUrl }, { session });
  },
  createBotConfig: async (config, session = null) => {
    const configCol = await getBotConfigCol();
    return configCol.insertOne(config, { session });
  },
  updateBotConfig: async (id, config, session = null) => {
    const configCol = await getBotConfigCol();
    const updateParams = _.omit(config, ['_id', 'id']);
    return configCol.updateOne({ id }, { $set: updateParams }, { session });
  },
  deleteBotConfig: async (id, session = null) => {
    const configCol = await getBotConfigCol();
    return configCol.deleteOne({ id }, { session });
  },
  isBotOwner: async (userId, botId, session = null) => {
    const configCol = await getBotConfigCol();
    const docCount = await configCol.countDocuments({ id: botId, ownerId: userId }, { limit: 1, session });
    return docCount === 1;
  },
};

export default BotConfigData;