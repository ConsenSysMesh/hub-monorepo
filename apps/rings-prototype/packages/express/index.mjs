import "./instrument.mjs";

import * as Sentry from "@sentry/node";

import { app } from '@tipster/express/app.mjs';
import '@tipster/express/middleware/auth.mjs';

import '@tipster/express/routes/index.mjs';

import envConfig from '@tipster/express/env-loader/index.mjs';

if (envConfig.SENTRY_DNS) {
    // Add this after all routes,
    // but before any and other error-handling middlewares are defined
    Sentry.setupExpressErrorHandler(app);
}

// TODO: auth middleware
// our custom error handler must come after all API endpoint declarations
import '@tipster/express/error-handler.mjs';

import '@tipster/express/jobs/index.mjs';
