import _ from 'lodash';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import BotConfigData from '@tipster/express/data/botConfigs.mjs';
import UserData from '@tipster/express/data/users.mjs';
import NeynarAPI from "@tipster/express/neynar/index.mjs";
import {channelUrlToId, isChannelLead} from "@tipster/express/utils/channelUtils.mjs";
import {validateEligibility} from "../utils/eligibilityUtils.mjs";
import {ELIGIBILITY_TYPES} from "../constants/index.mjs";
import {getUpdatedUserObj, getUserOrFetchAndCache} from "../utils/userUtils.mjs";
import agenda from "../jobs/index.mjs";

const router = express.Router();

const sanitizeBotConfig = (botConfig) => {
  // sanitizing some sensitive fields that shouldn't go to the frontend
  delete botConfig.secret;
  delete botConfig.webhookId;
  return botConfig;
};

const getBotConfigWithUsers = (botConfig, users) => {
  return {
    ...botConfig,
    eligibilityCriteria: {
      ...botConfig.eligibilityCriteria,
      userObjs: users.filter((u) => u.isEligible),
    },
    adminEligibilityCriteria: {
      ...botConfig.adminEligibilityCriteria,
      userObjs: users.filter((u) => u.isAdmin),
    }
  }
};

export const ensureBotOwner = async (fid, botConfigId) => {
  // TODO: Can ask Neynar every time, but probably ok to just check our own data store
  // const result = await NeynarAPI.checkIsChannelOwner(channelId, fid);
  // if (!result.isOwner) {
  //     throw new Error(`User ${fid} is not the owner of channel ${channelId}`);
  // }
  const isBotOwner = await BotConfigData.isBotOwner(fid, botConfigId);
  if (!isBotOwner) {
    throw new Error(`User ${fid} is not the owner of bot ${botConfigId}`);
  }
};

router.get('/', async (req, res) => {
  const { context } = req;
  const botConfigs = await BotConfigData.getBotConfigByAdminEligibility(context.fid);
  const botConfigsWithUsers = await Promise.all(botConfigs.map(async (bot) => {
    const botUsers = await UserData.getUsersForBot(bot.id);
    const botObj = getBotConfigWithUsers(bot, botUsers);
    return sanitizeBotConfig(botObj);
  }));
  res.json(botConfigsWithUsers);
});

router.post('/', async (req, res) => {
  const data = await req.body;
  // TODO: sanitize user input
  const channelId = channelUrlToId(data.channelUrl);
  const neynarChannel = await NeynarAPI.getChannelData(channelId);

  // Check if channel owner
  if (!isChannelLead(req.context.fid, neynarChannel)) {
    res.status(401).send('Unauthorized request to create tip bot. Must be the Owner of the channel.');
    return;
  }

  // validate eligibility
  const isValid = await validateEligibility(data);
  if (!isValid) {
    res.status(400).send('Bad Request');
    return;
  }

  const botId = uuidv4();
  const result = await NeynarAPI.createChannelWebhook(botId, data.botName, data.channelUrl);


  const botConfigData = {
    id: botId, // mongo ID field
    webhookId: result.webhook.webhook_id, // Neynar webhook ID
    secret: result.webhook.secrets[0].value,
    channelId,
    channelImageUrl: neynarChannel.channel.image_url,
    channelName: neynarChannel.channel.name,
    ...data,

    // channelId: 'testing', // Neynar channel ID (url string?)
    // channelUrl: 'https://warpcast.com/~/channel/testing', // Neynar channel ID (url string?)
    // eligibilityExplanation: 'be good',
    // ownerId: 390759, // FID
    // dailyAllowance: 500,
    // triggerWord: 'TEST',
    // botName: 'Test',
    // eligibilityType: 0 for user allow list, 1 for hat gated
    // eligibilityCriteria: {
    //     users: [390759], // User Allow List
    //     hat: { // Hat Gated
    //       chainId: 0
    //       hatId: BigInt
    //     }
    // }

    // adminEligibilityType: 0 for user allow list, 1 for hat gated
    // adminEligibilityCriteria: {
    //     users: [390759], // User Allow List
    //     hat: { // Hat Gated
    //       chainId: 0
    //       hatId: BigInt
    //     }
    // }
  }
  await BotConfigData.createBotConfig(botConfigData);
  let newBotUsers = [];

  // Create Allowlist Users Upfront
  const newUserIds = new Set();
  if (botConfigData.eligibilityType === ELIGIBILITY_TYPES.ALLOW_LIST) {
    botConfigData.eligibilityCriteria[ELIGIBILITY_TYPES.ALLOW_LIST]?.forEach(id => newUserIds.add(id))
  }
  if (botConfigData.adminEligibilityType === ELIGIBILITY_TYPES.ALLOW_LIST) {
    botConfigData.adminEligibilityCriteria[ELIGIBILITY_TYPES.ALLOW_LIST]?.forEach(id => newUserIds.add(id))
  }
  const newUserIdsArr = Array.from(newUserIds);
  if (newUserIdsArr.length) {
    const neynarUsersResponse = await NeynarAPI.getBulkUserData(newUserIdsArr);
    const newUsers = await Promise.all(
        neynarUsersResponse.users.map(async (user) => {
          return await getUpdatedUserObj(botConfigData, user);
        })
    );
    await UserData.bulkCreateUsers(newUsers);
    newBotUsers = await UserData.getUsersForBot(botId);
  }
  const newBotWithUsers = getBotConfigWithUsers(botConfigData, newBotUsers);
  return res.json(
    sanitizeBotConfig(newBotWithUsers)
  );
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const bot = await BotConfigData.getBotConfig(id);
  const botUsers = await UserData.getUsersForBot(bot.id);
  const botObj = getBotConfigWithUsers(bot, botUsers);
  res.json(
    sanitizeBotConfig(botObj)
  );
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const data = await req.body;
  // TODO: sanitize user input
  const botConfig = await BotConfigData.getBotConfig(id);
  const user = await getUserOrFetchAndCache(req.context.fid, id);

  if (!user.isAdmin) {
    return res.status(401).send('Unauthorized bot config update request');
  }

  if (!botConfig) {
    return res.status(404).send(`Bot config ${id} not found`);
  }

  // validate eligibility
  const isValid = await validateEligibility(data);
  if (!isValid) {
    res.status(400).send('Bad Request');
    return;
  }
  const result = await BotConfigData.updateBotConfig(id, data);

  // Handle AllowList
  const existingUsers = await UserData.getUsersForBot(id);
  const existingUsersMap = _.keyBy(existingUsers, 'id');
  const newUserIds = new Set();
  if (data.eligibilityType === ELIGIBILITY_TYPES.ALLOW_LIST) {
    data.eligibilityCriteria[ELIGIBILITY_TYPES.ALLOW_LIST].forEach(id => {
      if (!existingUsersMap[id]) {
        newUserIds.add(id);
      }
    })
  }
  if (data.adminEligibilityType === ELIGIBILITY_TYPES.ALLOW_LIST) {
    data.adminEligibilityCriteria[ELIGIBILITY_TYPES.ALLOW_LIST].forEach(id => {
      if (!existingUsersMap[id]) {
        newUserIds.add(id);
      }
    })
  }
  const newUserIdsArr = Array.from(newUserIds);
  if (newUserIdsArr.length) {
    const neynarUsersResponse = await NeynarAPI.getBulkUserData(newUserIdsArr);
    const newUsers = await Promise.all(
        neynarUsersResponse.users.map(async (user) => {
          return await getUpdatedUserObj(data, user);
        })
    );
    await UserData.bulkCreateUsers(newUsers);
  }

  // Kick off eligibility Sync
  await agenda.now('update-one-eligibility-and-allowance', { botConfigId: id })

  const webhookNameChanged = botConfig.botName !== data.botName;
  const webhookChannelUrlChanged = botConfig.channelUrl !== data.channelUrl;
  if (webhookNameChanged || webhookChannelUrlChanged) {
    await NeynarAPI.updateChannelWebhook(botConfig.webhookId, botConfig.id, data.botName, data.channelUrl);
  }

  return res.json(
    sanitizeBotConfig(result)
  );
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await ensureBotOwner(req.context.fid, id);

  const botConfig = await BotConfigData.getBotConfig(id);
  if (!botConfig) {
    return res.status(404).send(`Bot config ${id} not found`);
  }
  // TODO: consider soft-deleting
  await BotConfigData.deleteBotConfig(id);
  await UserData.deleteUsersForBot(id);
  await NeynarAPI.deleteChannelWebhook(botConfig.webhookId);
  return res.sendStatus(200);
});

router.get('/byChannel', async (req, res) => {
  const { channelUrl } = req.query;
  const botConfig = await BotConfigData.getBotConfigByChannel(getBotConfigByChannel);
  if (!botConfig) {
    return res.status(404).send(`Bot config ${id} not found`);
  }

  return res.sendStatus(200);

});

export default router;