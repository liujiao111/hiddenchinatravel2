import { readFile } from "node:fs/promises";
import { updateDriverOrder } from "../src/lib/driver-orders.mjs";

const [, , id, filename] = process.argv;
if (!id || !filename || !process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("Load the order environment and run: node scripts/confirm-driver-pickup.mjs <order-id> <pickup.json>");
}
const { pickup, driver } = JSON.parse(await readFile(filename, "utf8"));
if ([pickup, driver].some(value => typeof value !== "string" || !value.trim() || value.length > 1500)) {
  throw new Error("Provide a pickup time and meeting point, plus driver contact details.");
}
const updated = await updateDriverOrder(id, order => {
  if (!order.paid?.initial) throw new Error("Verify the initial Stripe payment before confirming the booking.");
  return { ...order, dispatch: { pickup: pickup.trim(), driver: driver.trim() } };
});
if (!updated) throw new Error("Order not found.");
console.log("Pickup arrangements saved for " + id);
