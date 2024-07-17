import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

/**
 * Gets app secrets from AWS Secrets Manager
 * @param env
 * @param awsRegion
 * @param AWS_ACCESS_KEY_ID // optional override
 * @param AWS_SECRET_ACCESS_KEY // optional override
 * @returns {Promise<any>}
 */
export default async ({
  env = process.env.APP_ENV,
  AWS_REGION = "us-east-2",
  AWS_ACCESS_KEY_ID = null,
  AWS_SECRET_ACCESS_KEY = null,
}) => {
  try {
    let credentials;
    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
      credentials = {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      };
    }
    const client = new SecretsManagerClient({
      region: AWS_REGION,
      credentials,
    });

    const secretName = `tipster_${env}`;
    console.log(`[secrets-loader] ... loading secrets for ${secretName}`);
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    );
    return JSON.parse(response.SecretString);
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.error(
      `[secrets-loader] Error retrieving secrets for env ${env}`,
      error
    );
    throw error;
  }
};
