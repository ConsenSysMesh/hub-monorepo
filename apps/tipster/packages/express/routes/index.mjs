import express from 'express';
import BotConfigRoutes from '@tipster/express/routes/bot-configs.mjs';
import UserRoutes from '@tipster/express/routes/users.mjs';
import ChannelRoutes from '@tipster/express/routes/channels.mjs';
import WebhookRoutes from '@tipster/express/routes/webhook.mjs';
import FrameRoutes from '@tipster/express/routes/frames.mjs';
import LeaderboardRoutes from '@tipster/express/routes/leaderboard.mjs';
import ActionRoutes from '@tipster/express/routes/actions.mjs';
import TipRoutes from '@tipster/express/routes/tips.mjs';
import { app } from '@tipster/express/app.mjs';

// app.get('/test', (req, res) => {
//   res.json({ message: 'Test Message' });
// });

const router = express.Router();
router.use('/bots', BotConfigRoutes);
router.use('/users', UserRoutes);
router.use('/channels', ChannelRoutes);
router.use('/webhook', WebhookRoutes);
router.use('/frames', FrameRoutes);
router.use('/leaderboards', LeaderboardRoutes);
router.use('/actions', ActionRoutes);
router.use('/tips', TipRoutes);

app.use('/api', router);

export default router;