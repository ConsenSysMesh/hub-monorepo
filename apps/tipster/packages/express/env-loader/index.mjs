import loadEnvConfig from "@tipster/express/env-loader/config-loader.mjs";
import loadSecrets from "@tipster/express/env-loader/secrets-loader.mjs";
import dotenv from "dotenv";

const env = process.env.APP_ENV || "development";

/**
 * This function loads all env settings, including secrets from AWS Secrets Manager
 * and caches them in the module. This module is meant to be THE source of truth for
 * all env settings. It should be imported and used in place of process.env.
 * @returns {Promise<{[p: string]: *}>}
 */
const loadCompleteEnvConfig = async () => {
  // get plain-text env settings
  const config = loadEnvConfig(env);
  // add secrets
  const secrets = await loadSecrets({
    env,
    ...config,
  });

  // get local .env overrides
  const dotenvConfig = dotenv.config().parsed;

  return {
    APP_ENV: env,
    ...config,
    ...secrets,
    ...dotenvConfig,
  };
};

const completeConfig = await loadCompleteEnvConfig();

export default completeConfig;
