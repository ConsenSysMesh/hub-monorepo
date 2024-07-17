import express from 'express';
import NeynarAPI from "../neynar/index.mjs";
import {channelUrlToId} from "../utils/channelUtils.mjs";

const router = express.Router();

router.get('/validate', async (req, res) => {
    const { url } = req.query;
    const id = channelUrlToId(url);
    const result = await NeynarAPI.checkIsChannelOwner(id, req.context.fid);
    res.json(result);
});

export default router;