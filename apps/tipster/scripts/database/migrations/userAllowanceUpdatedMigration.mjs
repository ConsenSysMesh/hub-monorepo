import envConfig from '@tipster/express/env-loader/index.mjs';
import {MongoClient} from "mongodb";
import logger from "@tipster/express/logger.mjs";

const run = async () => {
    const client = new MongoClient(envConfig.MONGO_URL);
    const conn = await client.connect();
    logger.info('Connected to mongo successfully');

    try {
        const col = conn.db('tipster').collection('users');

        const now = new Date();

        // Update documents based on the condition
        const updateResult = await col.updateMany(
            {isEligible: true},
            {$set: {allowanceGrantedOn: now}}
        );

        // Log the result
        console.log('Documents matched and modified:', updateResult.matchedCount, updateResult.modifiedCount);

    } finally {
        await client.close();
    }
}

run().catch(console.error);