import "dotenv/config";

import callr, { Number, SearchResult } from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

const callrApi = new callr(process.env.CALLR_API_KEY);

try {
  const result = await callrApi.Request<SearchResult<Number>>("did.search", [
    {},
    {},
  ]);
  // output table with columns: id, intl_number, type, app.name, app.id
  console.table(
    result.hits.map(({ hash, intl_number, type, assigned_at, app }) => ({
      id: hash,
      intl_number,
      type,
      assigned_at,
      app_name: app?.name || null,
      app_id: app?.hash || null,
    }))
  );
  if (result.has_more) {
    console.log("More numbers available");
  }
} catch (e) {
  console.error(e);
}
