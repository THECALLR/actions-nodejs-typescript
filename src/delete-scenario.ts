import "dotenv/config";
import CallrApi from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Usage: delete-scenario.js <phone-target>");
  process.exit(1);
}

const id = process.argv[2];
const callrApi = new CallrApi(process.env.CALLR_API_KEY);

try {
  await callrApi.Request("apps.delete", [id]);
  console.log("DELETE OK, id:", id);
} catch (e) {
  console.error(e);
}
