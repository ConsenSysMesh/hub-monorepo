import { MongoClient } from 'mongodb';
import logger from '@tipster/express/logger.mjs';
import envConfig from '@tipster/express/env-loader/index.mjs';

export const client = new MongoClient(envConfig.MONGO_URL);

const getDb = async () => {
  try {
    const conn = await client.connect();
    logger.info('Connected to mongo successfully');

    return conn.db('tipster');
  } catch (e) {
    logger.error(e);
  }
}

export default getDb;