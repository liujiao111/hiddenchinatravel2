const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
require.extensions[".ts"] = (mod, filename) => mod._compile(ts.transpileModule(
  fs.readFileSync(filename, "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }
).outputText, filename);

const { driverDirectPrices } = require("../src/lib/driver-direct-prices.ts");
const { driverUsd, driverUsdCents, driverMultiDayTotalUsd } = require("../src/lib/driver-usd-prices.ts");

test("all intercity and day hire five/seven rates use the approved uplift", () => {
  for (const [id, five, seven] of [
    ["dali-lijiang-direct", 700, 850],
    ["dali-lijiang-shaxi", 900, 1100],
    ["lijiang-shangri-la", 700, 850],
    ["lijiang-tlg-shangri-la", 900, 1100],
    ["kunming-day", 1000, 1200],
    ["dali-day", 1000, 1200],
    ["lijiang-day", 1000, 1200],
    ["shangri-la-day", 1000, 1200],
  ]) {
    assert.equal(driverDirectPrices[id].five, five, id);
    assert.equal(driverDirectPrices[id].seven, seven, id);
  }
});

test("USD retail prices are consistent and rounded up before checkout", () => {
  assert.equal(driverUsd(700), 105);
  assert.equal(driverUsd(850), 128);
  assert.equal(driverUsd(900), 135);
  assert.equal(driverUsd(1100), 165);
  assert.equal(driverUsd(1200), 180);
  assert.equal(driverUsd(1400), 210);
  assert.equal(driverUsdCents(850), 12800);
});

test("multi-day USD totals respect the 6-day boundary and 7-seat uplift", () => {
  assert.equal(driverMultiDayTotalUsd(1, false), 180);
  assert.equal(driverMultiDayTotalUsd(1, true), 210);
  assert.equal(driverMultiDayTotalUsd(6, false), 1080);
  assert.equal(driverMultiDayTotalUsd(6, true), 1260);
  assert.equal(driverMultiDayTotalUsd(7, false), 1050);
  assert.equal(driverMultiDayTotalUsd(7, true), 1260);
});

let captures = [];
let order;
class StripeStub {
  constructor(key) { assert.equal(key, "sk_test_a_mock_key"); }
  checkout = {
    sessions: {
      create: async (payload, options) => {
        captures.push({ payload, options });
        return { id: "cs_test_mock", livemode: false, url: "https://checkout.stripe.com/c/pay/mock",
          expires_at: Math.floor(Date.now() / 1000) + 3600 };
      },
      retrieve: async () => { throw new Error("unexpected retrieve"); },
    },
  };
}
const nativeLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === "stripe") return StripeStub;
  if (request === "@/lib/driver-orders.mjs") return {
    driverOrdersEnabled: () => true,
    saveDriverRequest: async (id, summary) => {
      order = { id, access: "fake.private.link", summary };
      return order;
    },
    updateDriverOrder: async (_id, update) => { order = update(order); return order; },
  };
  return nativeLoad.call(this, request, parent, isMain);
};
const { createDirectDriverCheckout } = require("../src/lib/driver-direct-checkout.ts");
Module._load = nativeLoad;

const envBefore = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_DRIVER_TEST_CHECKOUT_ENABLED: process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED,
  DRIVER_ORDER_ENV: process.env.DRIVER_ORDER_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
};
test.beforeEach(() => {
  captures = [];
  order = null;
  process.env.STRIPE_SECRET_KEY = "sk_test_a_mock_key";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock";
  process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED = "true";
  process.env.DRIVER_ORDER_ENV = "preview";
  delete process.env.VERCEL_ENV;
});
test.after(() => {
  for (const [key, value] of Object.entries(envBefore)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const opts = (totalFen, deposit) => ({
  id: crypto.randomUUID(), submissionKey: crypto.randomUUID(),
  summary: { service: "mock", email: "checkout@example.test" },
  totalFen, origin: "https://example.com", deposit,
});
test("standard transfer checkout charges full USD amount, never CNY", async () => {
  await createDirectDriverCheckout(opts(12800, false));
  const { payload } = captures[0];
  assert.equal(payload.line_items[0].price_data.currency, "usd");
  assert.equal(payload.line_items[0].price_data.unit_amount, 12800);
  assert.equal(payload.metadata.payment_type, "full");
  assert.equal(payload.metadata.due_fen, "12800");
  assert.equal(order.quote.initial.type, "full");
  assert.equal(order.quote.currency, "usd");
});
test("multi-day checkout charges exactly a 20% USD deposit and stores 80% balance", async () => {
  await createDirectDriverCheckout(opts(126000, true));
  const { payload } = captures[0];
  assert.equal(payload.line_items[0].price_data.currency, "usd");
  assert.equal(payload.line_items[0].price_data.unit_amount, 25200);
  assert.equal(payload.metadata.payment_type, "deposit");
  assert.equal(payload.metadata.total_fen, "126000");
  assert.equal(payload.metadata.due_fen, "25200");
  assert.equal(order.quote.initial.dueFen, 25200);
  assert.equal(order.quote.totalFen, 126000);
  assert.ok(order.quote.balanceDue);
});
