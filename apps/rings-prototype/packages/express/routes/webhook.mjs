import BotConfigData from "@tipster/express/data/botConfigs.mjs";
import UserData, {NotEligibleError, InsufficientAllowanceError} from "@tipster/express/data/users.mjs";
import {createHmac} from "crypto";
import express from 'express';
import escapeStringRegexp from 'escape-string-regexp';
import logger from '@tipster/express/logger.mjs';
import NeynarAPI from "../neynar/index.mjs";
import envConfig from '@tipster/express/env-loader/index.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
    const botId = req.query.botId;
    // Get BotConfig
    const config = await BotConfigData.getBotConfig(botId);
    if (!config) {
        console.log('no config');
        return res.status(404).json({ message: 'Unregistered webhook call' });
    }

    // Validate request body
    let hookData;
    try {
        hookData = await validateWebhookCall(req, config);
    } catch (e) {
        console.log('unauth');
        return res.status(401).json({ message: `Unauthorized: ${e.message}` })
    }

    const tipperFid = hookData.data.author.fid;
    const subjectFid = hookData.data.parent_author.fid;
    if (!subjectFid) {
        return res.send('Not a reply, no tip awarded.');
    }

    if (tipperFid === Number(envConfig.BOT_SIGNER_FID)) {
        return res.send('Ignored cast from tipster bot');
    }

    // Parse Tip
    const castContent = hookData.data.text;
    // This expects msgs to contain snippets such as `123 {triggerWord}`. This isn't currently super flexible in terms of syntax.
    const results = new RegExp(`[1-9]\\d* ${escapeStringRegexp(config.triggerWord)}`, 'i').exec(castContent);
    if (!results) {
        return res.send('Trigger phrase not present');
    }

    logger.info(`Keyword Tip attempt from ${hookData.data.author.fid} to ${hookData.data.parent_author.fid}`);

    if (subjectFid === tipperFid) {
        await NeynarAPI.cast(`🚫 NOT A VALID TIP!\nYou cannot tip yourself
            \nP.s. - You should consider using our Action method to tip to get this type of feedback there instead of a cast for all to see ;)
        `, { replyTo: hookData.data.hash });
        return res.send('Failed Tip: Can\'t tip yourself.');
    }

    const tipAmount = Number(results[0].replace(/ .*/,''));

    // Award tip
    try {
        await UserData.tipUser(tipperFid, subjectFid, botId, tipAmount);
        const tippingUser = await UserData.getUser(tipperFid, botId);
        await NeynarAPI.cast(`${tipAmount} ${config.triggerWord} Sent. You have ${tippingUser.allowance} remaining`, { replyTo: hookData.data.hash });
    } catch (e) {
        if (e instanceof NotEligibleError) {
            await NeynarAPI.cast(`🚫 NOT ELIGIBLE!\nYou are not eligible to tip ${config.triggerWord}
                \nP.s. - You should consider using our Action method to tip to get this type of feedback there instead of a cast for all to see ;)
            `, { replyTo: hookData.data.hash, embeds: [{ url: `${envConfig.API_URL}/api/frames/${botId}/not-eligible`}] });
            return res.send('Failed Tip: User is ineligible')
        } else if (e instanceof InsufficientAllowanceError) {
            await NeynarAPI.cast(`🚫 NOT A VALID TIP!\n${tipAmount} exceeds your remaining allowance
                \n${e.message}
                \nP.s. - You should consider using our Action method to tip to get this type of feedback there instead of a cast for all to see ;)
            `, { replyTo: hookData.data.hash });
            return res.send('Failed Tip: User has insufficient allowance')
        } else {
            // TODO: NO USER FEEDBACK FOR NOW
            // Picked up by sentry
            throw e;
        }
    }

    return res.send(`Success! Kudos given.`);
});

const validateWebhookCall = async (req, config) => {
    const body = JSON.stringify(await req.body);
    const sig = req.headers["x-neynar-signature"];
    if (!sig) {
        throw new Error("Neynar signature missing from request headers");
    }

    const webhookSecret = config.secret;

    const hmac = createHmac("sha512", webhookSecret);
    hmac.update(body);

    const generatedSignature = hmac.digest("hex");

    const isValid = generatedSignature === sig;
    if (!isValid) {
        throw new Error("Invalid webhook signature");
    }
    return JSON.parse(body);
}

export default router;
