import "dotenv/config";
import CallrApi from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}
const callrApi = new CallrApi(process.env.CALLR_API_KEY);

try {
  const response = await callrApi.Request("system.get_timestamp");
  console.log("PING OK, timestamp:", response);
} catch (e) {
  console.error(e);
}
