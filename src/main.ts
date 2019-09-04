import * as core from "@actions/core";
import STS from "aws-sdk/clients/sts";

async function run() {
  try {
    const accessKeyId = core.getInput("accessKeyId", { required: true });
    const secretAccessKey = core.getInput("secretAccessKey", {
      required: true
    });
    const roleArn = core.getInput("roleArn", { required: true });
    const roleSessionName = core.getInput("roleSessionName", {
      required: true
    });

    core.debug(`accessKeyId: ${accessKeyId}`);
    core.debug(`secretAccessKey: ${secretAccessKey}`);
    core.debug(`roleArn: ${roleArn}`);
    core.debug(`roleSessionName: ${roleSessionName}`);

    const stsClient = new STS({
      accessKeyId,
      secretAccessKey,
      apiVersion: "2011-06-15"
    });

    const response = await stsClient
      .assumeRole({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName,
        DurationSeconds: 3600
      })
      .promise();

    core.debug(`assumeRole Response: ${JSON.stringify(response)}`);

    if (response.Credentials) {
      core.setOutput("stsAccessKeyID", response.Credentials.AccessKeyId);
      core.setOutput(
        "stsSecretAccessKey",
        response.Credentials.SecretAccessKey
      );
      core.setOutput("stsSessionToken", response.Credentials.SessionToken);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
