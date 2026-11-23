const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const crypto = require("node:crypto");

const filename = path.resolve(__dirname, "../src/lib/driver-orders.mjs");
class BlobPreconditionFailedError extends Error {}
let db, puts, conflicts;
const blobMock = {
  BlobPreconditionFailedError,
  get: async pathname => {
    const entry = db.get(pathname);
    return entry ? { statusCode: 200, stream: new Blob([entry.body]).stream(),
      blob: { etag: entry.etag } } : null;
  },
  put: async (pathname, body, opts) => {
    puts.push({pathname, opts});
    const entry = db.get(pathname);
    if (entry && !opts.allowOverwrite) throw new BlobPreconditionFailedError("Precondition failed: ETag mismatch.");
    if (conflicts > 0 && opts.ifMatch) {
      conflicts--;
      db.set(pathname, {body:entry.body, etag:'"concurrently-changed"'});
      throw new BlobPreconditionFailedError("ETag was changed by another writer");
    }
    if (entry && opts.ifMatch !== entry.etag) throw new BlobPreconditionFailedError("ETag mismatch");
    db.set(pathname, {body:String(body),etag:'"v' + puts.length + '"'});
    return {etag:'"v' + puts.length + '"'};
  },
};
// Load the small ESM module with a local in-memory Blob adapter only.
const moduleSource = fs.readFileSync(filename, "utf8")
  .replace(/^import .*;\s*$/gm, "")
  .replace(/\bexport\s+(?=(?:async\s+)?function|const)/g, "");
const loadOrders = new Function("createHash", "createHmac", "timingSafeEqual",
  "get", "put", "BlobPreconditionFailedError", "mergeDriverPaymentRecords",
  moduleSource + "\nreturn {saveDriverRequest,updateDriverOrder,readDriverOrder};");
const {saveDriverRequest,updateDriverOrder,readDriverOrder} = loadOrders(
  crypto.createHash,crypto.createHmac,crypto.timingSafeEqual,
  blobMock.get,blobMock.put,BlobPreconditionFailedError,async order=>order);

const oldEnv = {VERCEL_ENV:process.env.VERCEL_ENV,BLOB_READ_WRITE_TOKEN:process.env.BLOB_READ_WRITE_TOKEN,
  DRIVER_ORDER_LINK_SECRET:process.env.DRIVER_ORDER_LINK_SECRET};
test.beforeEach(()=>{
  db = new Map();puts=[];conflicts=0;
  process.env.VERCEL_ENV="production";
  process.env.BLOB_READ_WRITE_TOKEN="fake-local-test-token";
  process.env.DRIVER_ORDER_LINK_SECRET="only-for-mocked-tests-value-over-32-chars";
});
test.after(()=>{
  for(const [k,v] of Object.entries(oldEnv)) if(v===undefined) delete process.env[k];else process.env[k]=v;
});

test("new private order can be updated with ETag and explicit overwrite", async()=>{
  const id=crypto.randomUUID(), submissionKey=crypto.randomUUID();
  const saved=await saveDriverRequest(id,{email:"test@example.test"},submissionKey);
  assert.equal(saved.id,id);
  assert.equal(puts[0].opts.allowOverwrite,false);
  assert.equal(puts[0].opts.access,"private");
  const updated=await updateDriverOrder(id,old=>({...old,quote:{totalFen:12800}}));
  assert.equal(updated.quote.totalFen,12800);
  assert.equal(puts[1].opts.allowOverwrite,true);
  assert.equal(puts[1].opts.ifMatch, '"v1"');
  assert.equal((await readDriverOrder(id)).order.quote.totalFen,12800);
});
test("ETag concurrency conflict retries with fresh ETag without losing order",async()=>{
  const id=crypto.randomUUID();
  await saveDriverRequest(id,{email:"test@example.test"},crypto.randomUUID());
  conflicts=1;
  const updated=await updateDriverOrder(id,old=>({...old,paid:{initial:{amount:21000}}}));
  assert.equal(updated.paid.initial.amount,21000);
  assert.equal(puts.length,3);
  assert.equal(puts[2].opts.ifMatch,'"concurrently-changed"');
});
