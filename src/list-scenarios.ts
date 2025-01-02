import "dotenv/config";

import CallrApi, { App, SearchResult } from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

const callrApi = new CallrApi(process.env.CALLR_API_KEY);

try {
  const result = await callrApi.Request<SearchResult<App>>("apps.search", [
    {},
    {},
  ]);
  // output table of apps with columns: id, name, date_creation
  console.table(
    result.hits.map(({ hash, name, date_creation }) => ({
      id: hash,
      name,
      date_creation,
    }))
  );
  if (result.has_more) {
    console.log("More apps available");
  }
} catch (e) {
  console.error(e);
}
