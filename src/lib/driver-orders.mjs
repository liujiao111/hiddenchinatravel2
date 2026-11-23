import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { get, put, BlobPreconditionFailedError } from "@vercel/blob";
import { mergeDriverPaymentRecords } from "./driver-payment-records.mjs";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const options = { access: /** @type {const} */ ("private") };
export const driverOrdersEnabled = () =>
  Boolean(process.env.BLOB_READ_WRITE_TOKEN && (process.env.DRIVER_ORDER_LINK_SECRET?.length ?? 0) >= 32);

/** @param {string} id */
function orderPath(id) {
  if (!idPattern.test(id)) throw new Error("Invalid order ID");
  const environment = process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV || "development";
  if (!["preview", "production", "development"].includes(environment)) throw new Error("Invalid order environment");
  return `driver-orders/${environment}/${id}.json`;
}

/** @param {string} id */
export function driverOrderAccess(id) {
  if (!driverOrdersEnabled() || !idPattern.test(id)) return null;
  const secret = process.env.DRIVER_ORDER_LINK_SECRET;
  if (!secret) return null;
  return `${id}.${createHmac("sha256", secret).update(orderPath(id)).digest("hex")}`;
}

/** @param {string} access */
export function driverOrderId(access) {
  const id = access.split(".")[0];
  const expected = driverOrderAccess(id);
  if (!expected || access.length !== expected.length || !/^[0-9a-f.-]+$/.test(access)) return null;
  return timingSafeEqual(Buffer.from(access), Buffer.from(expected)) ? id : null;
}

/** @param {string} id */
export async function readDriverOrder(id) {
  const result = await get(orderPath(id), { ...options, useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { order: await mergeDriverPaymentRecords(await new Response(result.stream).json()), etag: result.blob.etag };
}

/** @param {string} id @param {object} summary @param {string} submissionKey @param {object} [initialFields] */
export async function saveDriverRequest(id, summary, submissionKey, initialFields = {}) {
  if (!idPattern.test(submissionKey)) throw new Error("Invalid submission key");
  const submissionHash = createHash("sha256").update(submissionKey).digest("hex");
  const path = orderPath(id);
  const current = await readDriverOrder(id);
  if (current) return current.order.submissionHash === submissionHash ? current.order : null;
  const order = { id, summary, access: driverOrderAccess(id), submissionHash, createdAt: new Date().toISOString(), ...initialFields };
  try {
    await put(path, JSON.stringify(order), { ...options, allowOverwrite: false, contentType: "application/json" });
    return order;
  } catch (error) {
    // Duplicate requests can race to create the same immutable initial record.
    // A fresh origin read (with a short backoff) resolves idempotent submissions.
    if (!(error instanceof BlobPreconditionFailedError)) throw error;
    for (let attempt = 0; attempt < 7; attempt++) {
      const saved = await readDriverOrder(id);
      if (saved) return saved.order.submissionHash === submissionHash ? saved.order : null;
      await new Promise(resolve => setTimeout(resolve, Math.min(35 * 2 ** attempt, 600)));
    }
    throw new Error("Your booking is being saved. Please retry the same request.");
  }
}

/** @param {string} id @param {(order: any) => any} change */
export async function updateDriverOrder(id, change) {
  // Multiple Vercel functions (Checkout, webhook, retries) can edit one order at once.
  // Retry genuine ETag conflicts against a fresh origin read with bounded backoff;
  // immediate tight-loop retries can repeatedly lose to the same concurrent writers.
  const attempts = 12;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const current = await readDriverOrder(id);
    if (!current) return null;
    const order = change(current.order);
    if (order === current.order) return order;
    try {
      await put(orderPath(id), JSON.stringify(order), {
        ...options, allowOverwrite: true, ifMatch: current.etag, contentType: "application/json",
      });
      return order;
    } catch (error) {
      if (!(error instanceof BlobPreconditionFailedError)) throw error;
      if (attempt === attempts - 1) {
        console.error("[driver-orders] Persistent ETag contention after bounded retries", { attempts });
        throw new Error("Your booking is busy. Please try again; no duplicate payment is needed.");
      }
      await new Promise(resolve => setTimeout(resolve,
        Math.min(40 * 2 ** Math.min(attempt, 5), 900) + Math.floor(Math.random() * 50)));
    }
  }
}

/** @param {string} url */
export function isDriverCheckoutUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.host === "checkout.stripe.com" && parsed.pathname.startsWith("/c/pay/");
  } catch {
    return false;
  }
}
