import fs from "fs";
import YAML from "yaml";
import "dotenv/config";

import callr, { App } from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Usage: create-scenario-target.js [phone-target]");
  process.exit(1);
}

if (!process.argv[2].match(/^\+[1-9][0-9]+$/)) {
  console.error("Invalid phone number format, must be E.164: +1234567890");
  process.exit(1);
}

const target = process.argv[2];
const callrApi = new callr(process.env.CALLR_API_KEY);
const file = fs.readFileSync("src/scenarios/forwarding-record.yaml", "utf8");
const script = YAML.parse(file);

// set the $target variable from the CLI arg
script.variables.$target = target;
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
