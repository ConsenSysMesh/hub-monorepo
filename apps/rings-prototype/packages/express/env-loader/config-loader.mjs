import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Intentionally logging to console since we need to load up our env settings before instantiating
// our real Logger
/* eslint-disable no-console */
const configDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../config"
);

const loadEnvSpecificConfig = (envName, config) => {
  const envConfigPath = `${configDir}/${envName}/env.json`;
  console.debug(
    `[config loader] ... attempting to read config from '${envConfigPath}'`
  );
  if (fs.existsSync(envConfigPath)) {
    const envConfig = JSON.parse(fs.readFileSync(envConfigPath));
    Object.assign(config, envConfig);
  }
  return config;
};

/**
 * This function loads up plain-text environment settings by scanning over
 * several standard config file locations, as well as the local .env file.
 * @param env
 * @returns {Promise<*>}
 */
export default function loadEnvConfig(env = process.env.APP_ENV) {
  console.log(`[config-loader] ... loading config for APP_ENV=${env}`);
  let config = loadEnvSpecificConfig("base", {});
  config = loadEnvSpecificConfig(env, config);
  return config;
}
