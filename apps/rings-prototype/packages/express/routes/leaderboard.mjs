import express from 'express';
import LeaderboardModule from "../common/leaderboard.mjs";

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await LeaderboardModule.getLeaderBoard(id);
    res.json({ botConfigId: id, users: result });
});

router.get('/:id/userStats', async (req, res) => {
    const { id } = req.params;
    const { userStats } = await LeaderboardModule.getLeaderBoardStats(id, req.context.fid);
    res.json({ botConfigId: id, ...userStats });
});

export default router;