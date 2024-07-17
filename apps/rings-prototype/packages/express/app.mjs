import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import envConfig from '@tipster/express/env-loader/index.mjs';

const PORT = envConfig.SERVER_PORT || 3001;

const app = express();
app.use(helmet());

app.use(cors());
app.use('/api/public', (_, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/api', express.static('assets'));

app.use(
  bodyParser.json({
    limit: '20mb',
    type: ['application/json'],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text()); // needed for bots/:id/webhook endpoint hit up by Neynar

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

export { app, server };
