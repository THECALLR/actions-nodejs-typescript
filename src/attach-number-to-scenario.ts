import "dotenv/config";

import CallrApi from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 4) {
  console.error("Usage: attach-number-to-scenario.js [number-id] [app-id]");
  process.exit(1);
}

const callrApi = new CallrApi(process.env.CALLR_API_KEY);
const numberId = process.argv[2];
const appId = process.argv[3];

try {
  await callrApi.Request("apps.assign_did", [appId, numberId]);
  console.log("ATTACH OK");
} catch (e) {
  console.error(e);
}
