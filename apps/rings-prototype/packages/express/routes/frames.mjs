import express from 'express';
import {getFrameHtmlResponse, getFrameMessage} from '@coinbase/onchainkit/frame';

import {
    getChecker,
    getGuideFrame1,
    getGuideFrame2,
    getGuideFrame3, getInsufficientAllowanceFrame,
    getNoAllowanceFrame,
    getNotEligibleFrame,
    getStaticFrame,
    getTipperBadInputFrame,
    getTipperFrame,
    getTipperMessageFrame, getTipResultFrame
} from "../utils/framesUtils.mjs";
import {drawBaseCanvas} from "../utils/canvasUtils.mjs";
import envConfig from "../env-loader/index.mjs";
import UserData, {InsufficientAllowanceError} from "../data/users.mjs";

const router = express.Router();

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        switch (message.button) {
            case 1:
                res.send(await getGuideFrame1(id));
                break;
            case 2:
                res.send(await getChecker(id, message.interactor.fid));
                break;
            default:
                res.send(getStaticFrame(id));
        }
    }
});

router.post('/:id/guide1', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        switch (message.button) {
            case 1:
                res.send(getStaticFrame(id));
                break;
            case 2:
                res.send(await getChecker(id, message.interactor.fid));
                break;
            case 3:
                res.send(await getGuideFrame2(id));
                break;
            default:
                res.send(await getGuideFrame1(id));
        }
    }
});

router.post('/:id/guide2', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        switch (message.button) {
            case 1:
                res.send(getStaticFrame(id));
                break;
            case 2:
                res.send(await getGuideFrame1(id));
                break;
            case 3:
                res.send(await getChecker(id, message.interactor.fid));
                break;
            case 4:
                res.send(await getGuideFrame3(id));
                break;
            default:
                res.send(await getGuideFrame2(id));
        }
    }
});

router.post('/:id/guide3', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        switch (message.button) {
            case 1:
                res.send(getStaticFrame(id));
                break;
            case 2:
                res.send(await getGuideFrame2(id));
                break;
            case 3:
                res.send(await getChecker(id, message.interactor.fid));
                break;
            default:
                res.send(await getGuideFrame3(id));
        }
    }
});

router.post('/:id/checker', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        switch (message.button) {
            case 1:
                res.send(getStaticFrame(id));
                break;
            case 2:
                res.send(await getChecker(id, message.interactor.fid));
                break;
            case 3:
                res.send(await getGuideFrame2(id));
                break;
            default:
                res.send(await getChecker(id, message.interactor.fid));
        }
    }
});

router.get('/:id/not-eligible', async (req, res) => {
    const { id } = req.params;
    res.send(await getNotEligibleFrame(id));
});

router.post('/:id/not-eligible', async (req, res) => {
    const { id } = req.params;
    const { isValid } = await getFrameMessage(req.body);

    if (isValid) {
        res.send(await getNotEligibleFrame(id));
    }
});

router.post('/:id/no-allowance', async (req, res) => {
    const { isValid } = await getFrameMessage(req.body);

    if (isValid) {
        res.send(await getNoAllowanceFrame());
    }
});

router.post('/:id/tipper', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);

    if (message) {
        if (message.input) {
            const tippingUser = await UserData.getUser(message.raw.action.interactor.fid, id);
            if (isNaN(message.input)) {
                res.send(await getTipperBadInputFrame(id));
                return;
            } else if (tippingUser.allowance < Number(message.input)) {
                res.send(await getInsufficientAllowanceFrame(id, Number(message.input), tippingUser.allowance));
                return;
            }
            res.send(await getTipperMessageFrame(id, Number(message.input)));
            return;
        }
        res.send(await getTipperFrame(id, message));
    }
});

router.post('/:id/tipperMessage', async (req, res) => {
    const { id } = req.params;
    const { message } = await getFrameMessage(req.body);
    let tipAmount = Number(req.query.tipAmount);
    if (message && message.button === 1) {
        if (message.button === 1) {
            res.send(await getTipResultFrame(id, message, tipAmount, message.input));
        } else {
            res.send(await getTipperMessageFrame(id, tipAmount));
        }
    }
});

export default router;