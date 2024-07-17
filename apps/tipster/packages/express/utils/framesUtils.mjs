import {getFrameHtmlResponse} from "@coinbase/onchainkit/frame";
import envConfig from "../env-loader/index.mjs";
import BotConfigData from "../data/botConfigs.mjs";
import {
    drawAvatar,
    drawAvatarAndHeader,
    drawBaseCanvas,
    drawTextWithEmoji,
    printAtWordWrap,
    width
} from "./canvasUtils.mjs";
import LeaderboardModule from "../common/leaderboard.mjs";
import UserData, { InsufficientAllowanceError } from "../data/users.mjs";
import {getUserOrFetchAndCache} from "./userUtils.mjs";
import NeynarAPI from "../neynar/index.mjs";

export const getStaticFrame = (id) => (
    getFrameHtmlResponse({
        buttons: [
            {
                label: `📖 Guide`,
            },
            {
                label: `👤✅ Check My FID`,
            },
            {
                action: 'link',
                label: `🏆 Dashboard`,
                target: `${envConfig.PUBLIC_URL}/bot/${id}`
            },
        ],
        image: `${envConfig.API_URL}/api/public/images/initial.png`,
        postUrl: `${envConfig.API_URL}/api/frames/${id}`,
    })
);

export const getGuideFrame1 = async (id) => {
    const botConfig = await BotConfigData.getBotConfig(id);
    const { canvas, context } = await drawBaseCanvas('assets/public/images/guide_1.png');

    const example = `<AMOUNT> ${botConfig.triggerWord}`;

    await drawTextWithEmoji(example, 16, 40, 185, context, { bg: '#1C1C1C' } );

    await drawTextWithEmoji(botConfig.triggerWord, 15, 380, 273, context, { fillStyle: 'rgba(255,255,255, 0.92)' });

    await drawAvatarAndHeader(botConfig.channelImageUrl, botConfig.channelName || botConfig.channelId, context);

    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🏠 Home`,
            },
            {
                label: `👤✅ Check`,
            },
            {
                label: `Next >`,
            },
        ],
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/guide1`,
    })
}

export const getGuideFrame2 = async (id) => {
    const botConfig = await BotConfigData.getBotConfig(id);

    const { canvas, context } = await drawBaseCanvas('assets/public/images/guide_2.png');

    const eligibilityText = `Select community members are allowlisted to tip but anyone can receive tips. ${botConfig.eligibilityExplanation ? botConfig.eligibilityExplanation : ''}`;
    printAtWordWrap(eligibilityText, 40, 200, 32, width - 80, context);

    await drawAvatarAndHeader(botConfig.channelImageUrl, botConfig.channelName || botConfig.channelId, context);
    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🏠 Home`,
            },
            {
                label: `< Back`,
            },
            {
                label: `👤✅ Check`,
            },
            {
                label: `Next >`,
            },
        ],
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/guide2`,
    })
}

export const getGuideFrame3 = async (id) => {
    const botConfig = await BotConfigData.getBotConfig(id);

    const { canvas, context } = await drawBaseCanvas('assets/public/images/guide_3.png');

    await drawTextWithEmoji(`${botConfig.dailyAllowance} ${botConfig.triggerWord} / day`, 16, 40, 185, context, { bg: '#1C1C1C' } );

    await drawAvatarAndHeader(botConfig.channelImageUrl, botConfig.channelName || botConfig.channelId, context);
    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🏠 Home`,
            },
            {
                label: `< Back`,
            },
            {
                label: `👤✅ Check`,
            },
        ],
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/guide3`,
    })
}

export const getChecker = async (id, fid) => {
    const botConfig = await BotConfigData.getBotConfig(id);
    const { userStats: { balance, allowance, username, pfpUrl, isEligible, rank }, leaderBoard } = await LeaderboardModule.getLeaderBoardStats(id, fid);
    const { canvas, context } = await drawBaseCanvas('assets/public/images/checker.png');

    context.font = "bold 20pt 'PT Sans'";
    context.fillStyle = "#fff";
    context.textAlign = 'center';

    context.fillText(`${balance ? `${rank} / ${leaderBoard.length}` : '-'}`, 196, 200);
    context.fillText(`${balance}`, 568, 200);

    context.fillText(`${isEligible ? 'Yes' : 'No'}`, 196, 340);
    context.fillText(`${isEligible ? allowance : 'N/A'}`, 568, 340);

    context.font = "20pt 'Inter'";
    context.fillStyle = "#A0A0A0";
    context.textAlign = 'left';

    context.fillText(`${(botConfig.channelName || botConfig.channelId).toUpperCase()} TIP STATS`, 104, 90);

    await drawAvatarAndHeader(pfpUrl, `@${username}`, context);

    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🏠 Home`,
            },
            {
                label: `👤✅ Refresh`,
            },
            {
                label: '📖 Eligibility FAQ'
            },
        ],
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/checker`,
    })
}

export const getTipperBadInputFrame = async (id) => {
    const { canvas } = await drawBaseCanvas('assets/public/images/malformed_entry.png');
    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🎁 Try Again`,
            },
        ],
        input: {
            text: 'Tip Amount',
        },
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/tipper`,
    })
}

export const getErrorFrame = async () => {
    const { canvas } = await drawBaseCanvas('assets/public/images/error.png');
    return getFrameHtmlResponse({
        image: canvas.toDataURL('image/jpeg'),
    })
}

const MAX_TIP_MESSAGE_LENGTH = 150;
export const getTipResultFrame = async (id, message, tipAmount, tipMessage) => {
    // Check if tip message is too long
    if (tipMessage && tipMessage.length > MAX_TIP_MESSAGE_LENGTH) {
        return getTipperMessageFrame(id, tipAmount, true);
    }

    const botConfig = await BotConfigData.getBotConfig(id);
    const receivingUser = await getUserOrFetchAndCache(message.raw.action.cast.author.fid, id);
    const tippingUser = await UserData.getUser(message.raw.action.interactor.fid, id);
    try {
        await UserData.tipUser(message.raw.action.interactor.fid, message.raw.action.cast.author.fid, id, tipAmount);
        const { canvas, context } = await drawBaseCanvas('assets/public/images/tip_success.png');
        await drawTextWithEmoji(`${tipAmount} ${botConfig.triggerWord}`, 18, width / 2, 250, context, { centerAligned: true, font: "18pt 'PT Sans'", fillStyle: "rgba(255, 255, 255, 0.6)" } );

        context.textAlign = "center";
        context.font = "18pt 'PT Sans'";
        context.fillStyle = "rgba(255, 255, 255, 0.6)";
        context.fillText(`sent to @${receivingUser.username}`, width/2, 285);

        const castText = `You\'ve received ${tipAmount} ${botConfig.triggerWord}!\n\n${tipMessage ? `\"${tipMessage}\"\n` : ''}- from @${tippingUser.username}`;

        await NeynarAPI.cast(castText, { replyTo: message.raw.action.cast.hash });

        return getFrameHtmlResponse({
            image: canvas.toDataURL('image/jpeg'),
        })
    } catch (e) {
        if (e instanceof InsufficientAllowanceError) {
            return await getInsufficientAllowanceFrame(id, tipAmount, tippingUser.allowance);
        } else {
            return await getErrorFrame();
        }
    }
}

export const getInsufficientAllowanceFrame = async (id, amount, allowance) => {
    const {canvas, context} = await drawBaseCanvas('assets/public/images/exceeds_allowance.png');
    context.textAlign = "center";
    context.font = "bold 28pt 'PT Sans'";
    context.fillStyle = "#fff";

    context.fillText(`${amount} Exceeds Allowance`, width / 2, 180);
    context.font = "bold 18pt 'PT Sans'";
    context.fillText(`${allowance}`, width / 2, 290);
    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🎁 Try Again`,
            },
        ],
        input: {
            text: 'Tip Amount',
        },
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/tipper`,
    })
}

export const getTipperMessageFrame = async (id, amount, isErrored = false) => {
    const botConfig = await BotConfigData.getBotConfig(id);
    const { canvas, context } = await drawBaseCanvas('assets/public/images/tip_confirmation_frame.png');
    context.textAlign = "center";
    context.font = "bold 28pt 'PT Sans'";
    context.fillStyle = "#fff";
    await drawTextWithEmoji(`Send ${amount} ${botConfig.triggerWord}?`, 28, width / 2, 130, context, { centerAligned: true, font: "bold 28pt 'PT Sans'" } );

    context.font = "18pt 'PT Sans'";
    if (isErrored) {
        context.fillStyle = "rgba(204, 0, 0, 1)";
        context.fillText('Your message was too long. Please try again.', width / 2, 190);
    } else {
        context.fillStyle = "rgba(255, 255, 255, 0.6)";
        context.fillText('Feel free to include a message', width / 2, 190);
    }

    return getFrameHtmlResponse({
        buttons: [
            {
                label: `✅ Confirm & Send`,
            },
        ],
        input: {
            text: `Optional Message (max ${MAX_TIP_MESSAGE_LENGTH} char)`,
        },
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/tipperMessage?tipAmount=${amount}`,
    })
}

export const getTipperFrame = async (id, message) => {
    const botConfig = await BotConfigData.getBotConfig(id);
    const tippingUser = await UserData.getUser(message.raw.action.interactor.fid, id);
    const receivingUser = await getUserOrFetchAndCache(message.raw.action.cast.author.fid, id);

    const { canvas, context } = await drawBaseCanvas('assets/public/images/tip_frame.png');

    context.textAlign = "center";
    await drawTextWithEmoji(`${botConfig.triggerWord} Tip`, 28, width / 2, 130, context, { centerAligned: true, font: "bold 28pt 'PT Sans'" } );

    context.fillStyle = "#fff";
    context.font = "bold 18pt 'PT Sans'";
    context.fillText(`${tippingUser.allowance}`, width / 2, 308);

    context.font = "18pt 'PT Sans'";
    context.fillStyle = "rgba(255, 255, 255, 0.6)";

    const text = `How much would you like to give to @${receivingUser.username}?`
    context.fillText(text, width / 2, 190);

    await drawAvatar(botConfig.channelImageUrl, { x: width/2, y: 50, radius: 32 }, context);

    return getFrameHtmlResponse({
        buttons: [
            {
                label: `🎁 Continue`,
            },
        ],
        input: {
            text: 'Tip Amount',
        },
        image: canvas.toDataURL('image/jpeg'),
        postUrl: `${envConfig.API_URL}/api/frames/${id}/tipper`,
    })
}

export const getNotEligibleFrame = async (id) => {
    const botConfig = await BotConfigData.getBotConfig(id);
    const { canvas, context } = await drawBaseCanvas('assets/public/images/not_eligible.png');
    context.textAlign = "center";
    context.font = "bold 28pt 'PT Sans'";
    context.fillStyle = "#fff";
    context.fillText(`${botConfig.channelName} (yet)`, width / 2, 180);

    const eligibilityText = `Select community members are allowlisted to tip but anyone can receive tips. ${botConfig.eligibilityExplanation ? botConfig.eligibilityExplanation : ''}`;
    printAtWordWrap(eligibilityText, width / 2, 230, 32, width - 80, context);

    // TODO: add settings button
    return getFrameHtmlResponse({
        image: canvas.toDataURL('image/jpeg'),
    })
}

export const getNoAllowanceFrame = async () => {
    const { canvas, context } = await drawBaseCanvas('assets/public/images/no_allowance.png');
    const secondsUntilEndOfTheDay = 86400 - Math.floor(new Date() / 1000) % 86400;

    const hours = Math.floor(secondsUntilEndOfTheDay / 3600);
    const minutes = Math.floor((secondsUntilEndOfTheDay - (hours * 3600)) / 60);

    const hoursString = `${hours}`;
    const minutesString = `${minutes}`;

    const timeString = `${hoursString.length === 1 ? '0' : ''}${hoursString}hr, ${minutesString.length === 1 ? '0' : ''}${minutesString}min`

    context.textAlign = "center";
    context.fillStyle = "#fff";
    context.font = "bold 18pt 'PT Sans'";
    context.fillText(timeString, width / 2, 330);

    return getFrameHtmlResponse({
        image: canvas.toDataURL('image/jpeg'),
    })
}
