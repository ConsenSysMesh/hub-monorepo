import express from 'express';
import { getFrameMessage } from '@coinbase/onchainkit/frame';
import BotConfigData from "../data/botConfigs.mjs";
import envLoader from "../env-loader/index.mjs";
import {getUserOrFetchAndCache} from "../utils/userUtils.mjs";
const router = express.Router();

router.get('/', async (req, res) => {
     res.json({
        name: `Tip with Tipster.bot${envLoader.APP_ENV !== 'production' ? ` (${envLoader.APP_ENV})`: ''}`,
        icon: 'gift',
        description: 'Use tipster bot to send tip',
        // Optional external link to an "about" page.
        // You should only include this if you can't fully describe your
        // action using the description field.
        // Must be http or https protocol.
        aboutUrl: envLoader.PUBLIC_URL,
        action: {
            type: 'post'
        }
    })
});

router.post('/', async (req, res) => {
    const { message } = await getFrameMessage(req.body);

    const channelName = message.raw.action.cast.root_parent_url;

    // Check if the cast is in a channel
    if (!channelName) {
        res.status(400).send({ message: 'Cast is not in a channel' });
        return;
    }
    const botConfig = await BotConfigData.getBotConfigByChannel(channelName);

    // Check if botConfig exists for the channel
    if (!botConfig) {
        res.status(400).send({ message: 'Tipster not set up for channel' });
        return;
    }

    const interactorFid = message.interactor.fid;

    if (interactorFid === message.raw.action.cast.author.fid) {
        res.status(400).send({ message: 'Cannot tip yourself' });
        return;
    }

    const userObj = await getUserOrFetchAndCache(interactorFid, botConfig.id);

    if (!userObj) {
        res.status(400).send({ message: 'User not found' });
        return;
    }

    // Check tip eligibility: if ineligible send ineligible frame
    if (!userObj.isEligible) {
        res.json({
            type: 'frame',
            frameUrl: `${envLoader.API_URL}/api/frames/${botConfig.id}/not-eligible`
        })
        return;
    }

    // If allowance == 0: send no more allowance frame
    if (userObj.allowance === 0) {
        res.json({
            type: 'frame',
            frameUrl: `${envLoader.API_URL}/api/frames/${botConfig.id}/no-allowance`
        })
        return;
    }

    // o/w we have the happy path
    res.json({
        type: 'frame',
        frameUrl: `${envLoader.API_URL}/api/frames/${botConfig.id}/tipper`
    })
});

export default router;