import "dotenv/config";

import callr, { StoreReservation, StoreOrder } from "./callr.js";

if (process.env.CALLR_API_KEY === undefined) {
  console.error("Missing CALLR_API_KEY environment variable");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Usage: buy-phone-number.js [area_code_id]");
  process.exit(1);
}

const areaCodeId = process.argv[2];
const quantity = 1;
const callrApi = new callr(process.env.CALLR_API_KEY);

let token = "";

try {
  const reservation = await callrApi.Request<StoreReservation>(
    "did/store.reserve",
    [areaCodeId, "CLASSIC", quantity, "RANDOM"]
  );
  token = reservation.token;
} catch (e) {
  console.error(e);
  process.exit(1);
}

try {
  const response = await callrApi.Request<StoreOrder>("did/store.buy_order", [
    token,
  ]);
  console.table(
    response.success.map((item) => ({
      token,
      id: item.hash,
      number: item.intl_number,
    }))
  );
} catch (e) {
  console.error(e);
}

console.log("\nYou may now run attach-number-to-scenario.js");
