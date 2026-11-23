const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

require.extensions[".ts"] = (mod, filename) => mod._compile(ts.transpileModule(
  fs.readFileSync(filename, "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }
).outputText, filename);

const prices = require("../src/lib/driver-direct-prices.ts");
const usd = require("../src/lib/driver-usd-prices.ts");
const stored = [];
const checkouts = [];
const emails = [];
const nativeLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === "@/lib/enquiry-spam") return {isTransferClaimSpam: () => false};
  if (request === "@/lib/lead-ref") return {
    prepareFormRecord: (_tracking, _url, _form, requestId) => ({ref: "TEST-" + requestId}),
    saveFormRecord: async record => { stored.push(record); },
  };
  if (request === "@/lib/driver-direct-prices") return prices;
  if (request === "@/lib/driver-usd-prices") return usd;
  if (request === "@/lib/driver-order-mail") return require("../src/lib/driver-order-mail.ts");
  if (request === "@/lib/driver-direct-checkout") return {
    createDirectDriverCheckout: async details => {
      checkouts.push(details);
      return {orderPath: "/driver-order/test", checkoutUrl: "https://checkout.stripe.com/c/pay/mock"};
    },
  };
  if (request === "@/lib/enquiry-mail") return {
    getEnquiryMailConfig: () => ({apiKey:"mock", from:"hello@example.test", to:"operator@example.test"}),
  };
  if (request === "@/lib/driver-airport-transfers") return {
    chinaServiceDate: () => "2026-11-23", parseAirportTransfer: () => undefined,
  };
  if (request === "@/lib/driver-orders.mjs") return {
    driverOrderAccess: () => "test", driverOrdersEnabled: () => true,
    saveDriverRequest: async () => null,
  };
  if (request === "@/lib/custom-journey-enquiry") return {
    parseCustomJourneyEnquiry: value => value,
    enquiryEmailText: value => "Guest: " + value.name,
  };
  return nativeLoad.call(this, request, parent, isMain);
};
const {POST} = require("../src/app/api/custom-journey/route.ts");
Module._load = nativeLoad;

const originalFetch = global.fetch;
test.beforeEach(() => {
  stored.length = 0; checkouts.length = 0; emails.length = 0;
  global.fetch = async (_url, init) => {
    emails.push(JSON.parse(init.body));
    return {ok:true,status:200};
  };
});
test.after(() => { global.fetch = originalFetch; });

const sample = (productId, vehicle, options = {}) => ({
  requestId: crypto.randomUUID(), name:"Test Guest", email:"guest@example.test", whatsapp:"",
  travelTiming:"2027-01-12", adults:2, children:0, notes:"Test route",
  conversionPage:"/yunnan-private-driver", tracking:{},
  driverOrder:{
    checkout:true, productId, vehicleCode:vehicle, luggage:1,
    submissionKey:crypto.randomUUID(), directionCode: "Dali → Lijiang direct",
    route:"Dali → Lijiang direct", pickup:"Dali Hotel",dropoff:"Lijiang Hotel", pickupTime:"09:30",
    ...options,
  },
});
const send = payload => POST(new Request("https://hiddenchinatravel.com/api/custom-journey", {
  method:"POST", headers:{origin:"https://hiddenchinatravel.com","content-type":"application/json",
    "x-forwarded-for":"203.0.113."+Math.floor(1+Math.random()*200)},
  body:JSON.stringify(payload),
}));

test("standard 7-seat form uses SERVER USD price and captures unpaid enquiry", async () => {
  const response = await send(sample("dali-lijiang-direct", "Seven-seat car"));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.success, true);
  assert.match(data.checkoutUrl, /^https:\/\/checkout\.stripe\.com/);
  assert.equal(checkouts.length, 1);
  assert.equal(checkouts[0].totalFen, 12800);
  assert.equal(checkouts[0].deposit, false);
  assert.equal(stored.length, 1);
  assert.equal(emails.length, 1);
  assert.match(emails[0].subject, /\[UNPAID\]/);
  assert.match(emails[0].text, /NOT PAID/);
  assert.match(emails[0].text, /USD 128/);
});

test("seven-day seven-seat multi-day form submits 20 percent deposit intent", async () => {
  const response = await send(sample("multi-long", "Seven-seat car", {
    directionCode:"", route:"Kunming Dali Lijiang", days:7, deposit:true, endDate:"2027-01-18",
  }));
  assert.equal(response.status, 200);
  assert.equal(checkouts[0].totalFen, 126000);
  assert.equal(checkouts[0].deposit, true);
  assert.equal(checkouts[0].summary.days, 7);
  assert.match(emails[0].text, /USD 252/);
});

test("mismatched multi-day end date is rejected before Stripe creation", async () => {
  const response = await send(sample("multi-long", "Seven-seat car", {
    directionCode:"", route:"Kunming Dali", days:7, deposit:true, endDate:"2027-01-20",
  }));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
  assert.equal(emails.length, 0);
});

test("tampered intercity route is rejected before Stripe creation", async () => {
  const response = await send(sample("dali-lijiang-direct", "Five-seat car", {
    directionCode:"Dali → Lhasa direct",
  }));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
});

test("missing pickup time cannot create an under-specified booking", async () => {
  const response = await send(sample("dali-lijiang-direct", "Five-seat car", {pickupTime:""}));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
});

test("seven-seat booking with excessive luggage is refused before charge", async () => {
  const response = await send(sample("dali-lijiang-direct", "Seven-seat car", {luggage:6}));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
});

test("hidden internal full-order test produces a real checkout for exactly USD 1", async () => {
  const response = await send(sample("driver-full-order-usd1-test", "Five-seat car", {
    directionCode: "PAYMENT TEST ONLY - NO TRANSPORT SERVICE",
    checkoutTest: true, route: "PAYMENT TEST ONLY - NO TRANSPORT SERVICE",
    pickup:"No pickup - payment test", dropoff:"No dropoff - payment test",
  }));
  assert.equal(response.status, 200, await response.clone().text());
  assert.equal(checkouts.length, 1);
  assert.equal(checkouts[0].totalFen, 100);
  assert.equal(checkouts[0].deposit, false);
  assert.equal(checkouts[0].testOnly, true);
  assert.equal(checkouts[0].summary.testOnly, true);
});

test("a forged USD 1 test product without explicit test purpose is rejected", async () => {
  const response = await send(sample("driver-full-order-usd1-test", "Five-seat car", {
    directionCode:"PAYMENT TEST ONLY - NO TRANSPORT SERVICE",
    checkoutTest:false,
  }));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
});

test("a USD 1 test product cannot use seven-seat transport or deposit payments", async () => {
  const response = await send(sample("driver-full-order-usd1-test", "Seven-seat car", {
    directionCode:"PAYMENT TEST ONLY - NO TRANSPORT SERVICE",
    checkoutTest:true, deposit:true,
  }));
  assert.equal(response.status, 400);
  assert.equal(checkouts.length, 0);
});
