import envConfig from '@tipster/express/env-loader/index.mjs';
import {MongoClient} from "mongodb";
import logger from "@tipster/express/logger.mjs";
import {ELIGIBILITY_TYPES} from "@tipster/express/constants/index.mjs";

const run = async () => {
    const client = new MongoClient(envConfig.MONGO_URL);
    const conn = await client.connect();
    logger.info('Connected to mongo successfully');

    const col = conn.db('tipster').collection('botConfigs');

    await col.updateMany({}, [
        {
            $set: {
                eligibilityType: ELIGIBILITY_TYPES.ALLOW_LIST,
                eligibilityCriteria: {
                    allowList: "$eligibilityCriteria.users"
                },
                adminEligibilityType: ELIGIBILITY_TYPES.ALLOW_LIST,
                adminEligibilityCriteria: {
                    allowList: ["$ownerId"]
                }
            },
        },
        {
            $unset: ["eligibilityCriteria.users"]
        }
    ]);
}

run();