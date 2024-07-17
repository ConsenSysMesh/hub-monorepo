import express from 'express';
import NeynarAPI, { convertCommonUserFields } from "@tipster/express/neynar/index.mjs";

const router = express.Router();

router.get('/search', async (req, res) => {
  // TODO: how do we restrict access to this endpoint? Should it be wide open to anyone that can login via Neynar?
  const q = req.query.q;
  const cursor = req.query.cursor;
  const results = await NeynarAPI.searchUsernames(q, cursor);
  const userObjs = (results.result.users || []).map(convertCommonUserFields);
  res.json(userObjs);
});

export default router;