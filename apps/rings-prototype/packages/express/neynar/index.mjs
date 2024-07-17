import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import envConfig from '@tipster/express/env-loader/index.mjs';
import _ from 'lodash';

const getClient = () => {
    return new NeynarAPIClient(envConfig.NEYNAR_API_KEY);
};

const getCallbackUrl = botId => `${envConfig.API_URL}/api/webhook?botId=${botId}`;
const getSubscriptionOptions = (channelId) => ({
  subscription: {
      'cast.created' : {
          'root_parent_urls': [channelId],
          // 'text': `[1-9]\\d* (?i)${triggerWord}`
      }
  }
});

const NeynarAPI = {
    // Get User Data
    getBulkUserData: async (fids) => {
        const chunks = _.chunk(fids, 100);
        const data = await Promise.all(chunks.map(async (chunk) => {
            return (await getClient().fetchBulkUsers(chunk)).users;
        }))
        return { users: _.flatten(data) }
    },

    searchUsernames: async (q, cursor) => {
        // For now limit to 5
        return getClient().searchUser(q, null, { limit: 5, cursor})
    },

    // Get Channel Data
    getChannelData: async (id) => {
        return getClient().lookupChannel(id);
    },

    checkIsChannelOwner: async (channelId, fid) => {
        const result = await getClient().lookupChannel(channelId);
        return result.channel.lead.fid === fid;
    },

    // Create Webhook
    createChannelWebhook: async (botId, botName, channelId) => {
        const url = getCallbackUrl(botId);
        const options = getSubscriptionOptions(channelId);
        return getClient().publishWebhook(botName, url, options);
    },
    updateChannelWebhook: async (webhookId, botId, botName, channelId) => {
        const url = getCallbackUrl(botId);
        const options = getSubscriptionOptions(channelId);
        return await getClient().updateWebhook(webhookId, botName, url, options);
    },
    deleteChannelWebhook: async (id) => await getClient().deleteWebhook(id),
    cast: async (castText, castOptions = {}) => await getClient().publishCast(envConfig.BOT_SIGNER_UUID, castText, castOptions)
};

export const convertCommonUserFields = (user) => {
    return {
        id: user.fid,
        custodyAddress: user.custody_address,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        verifiedEthAddresses: user.verified_addresses.eth_addresses,
    };
}
export default NeynarAPI;