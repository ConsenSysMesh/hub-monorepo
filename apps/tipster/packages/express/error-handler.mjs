import { app } from '@tipster/express/app.mjs';
import logger from '@tipster/express/logger.mjs';

// Logging all unhandled API errors using our logger rather than express's default.
// NOTE: this middleware must have 4 params in order to be considered error handler.
app.use((err, req, res) => {
  logger.error(err);
  res.status(500).send(err?.message || 'Internal Server Error');
});
