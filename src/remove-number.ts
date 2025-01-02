import "dotenv/config";

import CallrApi from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Usage: remove-number.js [id]");
  process.exit(1);
}

const callrApi = new CallrApi(process.env.CALLR_API_KEY);
const id = process.argv[2];

try {
  await callrApi.Request("did/store.cancel_subscription", [id]);
  console.log("REMOVE OK");
} catch (e) {
  console.error(e);
}
