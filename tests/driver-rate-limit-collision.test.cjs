const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const source=fs.readFileSync(path.join(__dirname,"../src/lib/driver-distributed-rate-limit.mjs"),"utf8").replace(/^import .*;\s*$/gm,"").replace("export async function","async function").replace("if (process.env.NODE_TEST_CONTEXT)","if (false)");
class BlobPreconditionFailedError extends Error{}
function limiter({fail=false,precondition=false}={}){
 const db=new Set();let writes=0;
 const put=async(key,body,opts)=>{assert.equal(opts.allowOverwrite,false);assert.equal(opts.access,"private");writes++;if(fail)throw new Error("storage offline");if(db.has(key))throw precondition?new BlobPreconditionFailedError():new Error("Blob already exists");db.add(key);};
 const get=async(key,opts)=>{assert.equal(opts.useCache,false);return db.has(key)?{statusCode:200}:null;};
 const run=new Function("createHmac","get","put","BlobPreconditionFailedError","process",source+"\nreturn checkDriverRateLimit;")(crypto.createHmac,get,put,BlobPreconditionFailedError,{env:{VERCEL_ENV:"production",BLOB_READ_WRITE_TOKEN:"mock",DRIVER_ORDER_LINK_SECRET:"mock-secret-123456789012345678901234567890"}});
 return {run,db,writes:()=>writes};
}
const req=new Request("https://example.test",{headers:{"x-real-ip":"192.0.2.1"}});
test("real experience limiter handles generic duplicate blob errors and denies seventh request",async()=>{const {run,db}=limiter();for(let i=0;i<6;i++)assert.equal((await run(req,"experience-live-test")).allowed,true);assert.equal(db.size,6);assert.equal((await run(req,"experience-live-test")).allowed,false);});
test("ETag duplicate behavior remains intact for driver checkout",async()=>{const {run,db}=limiter({precondition:true});for(let i=0;i<6;i++)assert.equal((await run(req,"driver-checkout")).allowed,true);assert.equal((await run(req,"driver-checkout")).allowed,false);assert.equal(db.size,6);});
test("storage outage fails closed and cannot start checkout",async()=>{const {run}=limiter({fail:true});await assert.rejects(run(req,"experience-live-test"),/storage offline/);});
