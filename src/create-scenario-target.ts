import fs from "fs";
import YAML from "yaml";
import "dotenv/config";

import CallrApi, { App } from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 4) {
  console.error("Usage: create-scenario-target.js [phone-target] [url]");
  process.exit(1);
}

if (!process.argv[2].match(/^\+[1-9][0-9]+$/)) {
  console.error("Invalid phone number format, must be E.164: +1234567890");
  process.exit(1);
}

if (!process.argv[3].match(/^https?:\/\//)) {
  console.error("Invalid URL format, must be http:// or https://");
  process.exit(1);
}

const target = process.argv[2];
const url = process.argv[3];
const callrApi = new CallrApi(process.env.CALLR_API_KEY);
const file = fs.readFileSync("src/scenarios/forwarding-record.yaml", "utf8");
const script = YAML.parse(file);

// set the $target and $url variables from the CLI args
script.variables.$target = target;
script.variables.$url = url;
// you may update any other part of the script here

try {
  // https://docs.callr.com/api/services/apps/#apps.create
  const response = await callrApi.Request<App>("apps.create", [
    "ACTIONS10",
    `Call Forwarding to ${target}`,
    {
      format: "YAML",
      script: YAML.stringify(script),
    },
  ]);
  console.table([
    {
      id: response.hash,
      name: response.name,
      created: response.date_creation,
    },
  ]);
} catch (e) {
  console.error(e);
}
