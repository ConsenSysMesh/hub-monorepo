import Agenda from 'agenda';
import envConfig from '@tipster/express/env-loader/index.mjs';
import logger from '@tipster/express/logger.mjs';
import { allDefinitions } from '@tipster/express/jobs/definitions/index.mjs';

// establised a connection to our mongoDB database.
const agenda = new Agenda({
    db: {
        address: envConfig.MONGO_URL,
        collection: 'jobs',
    },
});

// listen for the ready or error event.
agenda
    .on('ready', () => logger.info("Agenda started!"))
    .on('error', () => logger.info("Agenda connection error!"));

// define all agenda jobs
allDefinitions(agenda);

// logs all registered jobs
logger.info({ jobs: agenda._definitions });

(async () => {
    await agenda.start();
    await agenda.every("0 0-23 * * *", "update-eligibility-and-allowance", {}, { timezone: 'UTC' })
    // await agenda.schedule("in 2 seconds", "update-eligibility-and-allowance", {});
})();

export default agenda;
