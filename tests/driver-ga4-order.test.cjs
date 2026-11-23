const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const code = fs.readFileSync(path.resolve(__dirname,"../public/driver-order-analytics.js"),"utf8");
function run(env={}) {
  const calls = [], storage = env.storage || new Map(), listeners = [];
  const dataset = {measurement:"G-TEST1234",paid:"1",purchases:JSON.stringify(env.purchases||[
    {transaction_id:"cs_live_one123",amount_cents:100,item_id:"driver-full-order-usd1-test",payment_type:"full",stage:"initial"},
  ])};
  const root = {dataset};
  const document = {
    title:"Driver order",
    getElementById:id=>id==="driver-order-analytics"?root:null,
    addEventListener:(name,fn)=>listeners.push({name,fn}),
    querySelectorAll:()=>[],
  };
  const analytics = {gtag:(...args)=>calls.push(args),dataLayer:[],google_tag_data:undefined};
  const ctx={document,window:analytics,location:{origin:"https://hiddenchinatravel.com"},navigator:{globalPrivacyControl:env.denied||false},
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,v)=>storage.set(key,v)},
    IntersectionObserver:undefined,Number,JSON,Date,Array,RegExp};
  vm.runInNewContext(code,ctx);
  return {calls,storage,listeners};
}
test("confirmed US$1 test product counts as a normal GA4 purchase, with USD 1 revenue",()=>{
  const r=run();
  const purchase=r.calls.filter(a=>a[1]==="purchase");
  assert.equal(purchase.length,1);
  assert.equal(purchase[0][2].value,1);
  assert.equal(purchase[0][2].currency,"USD");
  assert.equal(purchase[0][2].transaction_id,"cs_live_one123");
  assert.equal(purchase[0][2].items[0].item_id,"driver-full-order-usd1-test");
});
test("reload deduplicates purchase, while later paid balance is separate GA4 revenue",()=>{
  const storage=new Map();
  const purchases=[
    {transaction_id:"cs_live_one123",amount_cents:100,item_id:"driver-full-order-usd1-test",payment_type:"full",stage:"initial"},
    {transaction_id:"cs_live_two123",amount_cents:200,item_id:"multi-long",payment_type:"balance",stage:"balance"},
  ];
  const a=run({storage,purchases});
  assert.equal(a.calls.filter(x=>x[1]==="purchase").length,2);
  const b=run({storage,purchases});
  assert.equal(b.calls.filter(x=>x[1]==="purchase").length,0);
});
test("explicit analytics denial never records purchase or contact events",()=>{
  assert.equal(run({denied:true}).calls.length,0);
});
test("invalid or unverified purchase payload is never counted",()=>{
  const purchases=[{transaction_id:"invalid",amount_cents:100,item_id:"driver",payment_type:"full",stage:"initial"}];
  assert.equal(run({purchases}).calls.filter(x=>x[1]==="purchase").length,0);
});
