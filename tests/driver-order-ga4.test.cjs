const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const code = fs.readFileSync(path.join(__dirname, "../public/driver-order-analytics.js"), "utf8");
function harness(purchases, persisted = new Map(), denyConsent = false) {
  const events = [], handlers = {}, observers = [];
  const dataset = {measurement:"G-TEST123",paid:purchases.length?"1":"0",purchases:JSON.stringify(purchases)};
  const root = {dataset};
  const window = {
    dataLayer:denyConsent ? [["consent","default",{analytics_storage:"denied"}]] : [],
    gtag: (command,event,details) => { events.push({command,event,details}); },
  };
  const doc = {
    title: "Paid order",
    getElementById: id => id==="driver-order-analytics"?root:null,
    addEventListener: (event, fn) => {handlers[event]=fn},
    querySelectorAll: () => [],
  };
  const localStorage = {
    getItem: key => persisted.get(key)||null,
    setItem: (key,val) => persisted.set(key,val),
  };
  const context = {window,document:doc,location:{origin:"https://hiddenchinatravel.com"},
    navigator:{globalPrivacyControl:false},localStorage,
    IntersectionObserver:class {constructor(callback){observers.push(callback)} observe(){} unobserve(){}},
    Element:class {},Date,JSON,Number};
  vm.runInNewContext(code,context);
  return {events,handlers,persisted};
}
function eventNames(h,name) {return h.events.filter(x=>x.command==="event"&&x.event===name).map(x=>x.details)}
const receipt={transaction_id:"cs_live_abcXYZ123",amount_cents:100,
  item_id:"driver-full-order-usd1-test",payment_type:"full",stage:"initial"};
test("verified USD1 purchase is reported once with safe GA4 identifiers",()=>{
  const h=harness([receipt]);
  const purchases=eventNames(h,"purchase");
  assert.equal(purchases.length,1);
  assert.equal(purchases[0].value,1);
  assert.equal(purchases[0].currency,"USD");
  assert.equal(purchases[0].transaction_id,receipt.transaction_id);
  assert.equal(purchases[0].items[0].item_id,receipt.item_id);
  assert.equal(purchases[0].page_location,"https://hiddenchinatravel.com/driver-order/paid");
  assert.equal(eventNames(h,"driver_payment_success").length,1);
  assert.equal(JSON.stringify(h.events).includes("62713326-7626"),false);
});
test("repeat paid order view does not duplicate purchase in this browser",()=>{
  const persisted=new Map();
  harness([receipt],persisted);
  const second=harness([receipt],persisted);
  assert.equal(eventNames(second,"purchase").length,0);
  assert.equal(eventNames(second,"driver_payment_success").length,0);
});
test("deposit and later balance are recorded as separate received amounts",()=>{
  const h=harness([{
    transaction_id:"cs_live_deposit123",amount_cents:25000,item_id:"multi-long",payment_type:"deposit",stage:"initial",
  },{
    transaction_id:"cs_live_balance123",amount_cents:100000,item_id:"multi-long",payment_type:"balance",stage:"balance",
  }]);
  assert.equal(eventNames(h,"purchase").length,2);
  assert.deepEqual(Array.from(eventNames(h,"purchase"),x=>x.value),[250,1000]);
});
test("invalid receipt and unpaid page never send purchase",()=>{
  assert.equal(eventNames(harness([]),"purchase").length,0);
  assert.equal(eventNames(harness([{...receipt,amount_cents:0}]),"purchase").length,0);
  assert.equal(eventNames(harness([{...receipt,transaction_id:"personal-contact@example.com"}]),"purchase").length,0);
});
test("explicit analytics denial suppresses all tracking",()=>{
  const h=harness([receipt],new Map(),true);
  assert.equal(eventNames(h,"page_view").length,0);
  assert.equal(eventNames(h,"purchase").length,0);
});
