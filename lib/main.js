"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const sts_1 = __importDefault(require("aws-sdk/clients/sts"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const stsClient = new sts_1.default({
                accessKeyId,
                secretAccessKey,
                apiVersion: "2011-06-15"
            });
            const response = yield stsClient
                .assumeRole({
                RoleArn: roleArn,
                RoleSessionName: roleSessionName,
                DurationSeconds: 3600
            })
                .promise();
            core.debug(`assumeRole Response: ${JSON.stringify(response)}`);
            if (response.Credentials) {
                core.setOutput("stsAccessKeyID", response.Credentials.AccessKeyId);
                core.setOutput("stsSecretAccessKey", response.Credentials.SecretAccessKey);
                core.setOutput("stsSessionToken", response.Credentials.SessionToken);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
