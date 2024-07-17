import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import envConfig from '@tipster/express/env-loader/index.mjs';

// Ensure to call this before importing any other modules!
if (envConfig.SENTRY_DNS) {
    Sentry.init({
        dsn: envConfig.SENTRY_DNS,
        integrations: [
            // Add our Profiling integration
            nodeProfilingIntegration(),
        ],
        // Add Performance Monitoring by setting tracesSampleRate
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,

        // Set sampling rate for profiling
        // This is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
}
