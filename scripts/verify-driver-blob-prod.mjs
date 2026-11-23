// One-time non-PII Blob write/read/ETag canary on production build.
// Uses a random throwaway object and deletes it in finally. Never logs tokens or ETags.
import { randomUUID } from "node:crypto";
import { put, get, del } from "@vercel/blob";
import { saveDriverRequest, readDriverOrder, updateDriverOrder } from "../src/lib/driver-orders.mjs";

if (process.env.VERCEL_ENV === "production" && process.env.BLOB_READ_WRITE_TOKEN) {
  const path = "driver-orders/diagnostics/" + randomUUID() + ".json";
  try {
    const created = await put(path, JSON.stringify({stage:1}), {
      access: "private", allowOverwrite: false, contentType: "application/json",
    });
    console.log("[blob-canary] created", Boolean(created.etag));
    const read = await get(path, {access:"private",useCache:false});
    const body = read?.statusCode===200 ? await new Response(read.stream).json() : null;
    console.log("[blob-canary] read", read?.statusCode, "etag-present", Boolean(read?.blob?.etag),
      "etag-match-upload", read?.blob?.etag === created.etag, "content-correct", body?.stage === 1);
    if (!read?.blob?.etag || body?.stage !== 1) throw new Error("Initial read was not consistent");
    await put(path, JSON.stringify({stage:2}), {
      access:"private", allowOverwrite:true, ifMatch:read.blob.etag, contentType:"application/json",
    });
    console.log("[blob-canary] conditional-update PASS");
    const latest = await get(path, {access:"private",useCache:false});
    const after = latest?.statusCode === 200 ? await new Response(latest.stream).json() : null;
    console.log("[blob-canary] post-update-read", after?.stage === 2 ? "PASS":"FAIL");
    if (after?.stage !== 2) throw new Error("Post-update read is stale");
    // Exercise the actual application order helpers (not just direct SDK calls).
    const orderId = randomUUID();
    const orderBlobPath = "driver-orders/production/" + orderId + ".json";
    try {
      const submissionKey = randomUUID();
      const initial = await saveDriverRequest(orderId, {service:"canary", currency:"usd"}, submissionKey);
      console.log("[blob-canary] actual-order-create", initial?.id === orderId ? "PASS":"FAIL");
      const updated = await updateDriverOrder(orderId, old => ({...old, quote:{
        initial:{id:"cs_canary",dueFen:10500}, totalFen:10500, currency:"usd",
      }}));
      console.log("[blob-canary] actual-order-quote-update", updated?.quote?.initial?.dueFen === 10500 ? "PASS":"FAIL");
      const reread = await readDriverOrder(orderId);
      console.log("[blob-canary] actual-order-reread", reread?.order?.quote?.totalFen === 10500 ? "PASS":"FAIL");
      if (reread?.order?.quote?.totalFen !== 10500) throw new Error("Actual order path is inconsistent");
      // Trigger genuine contention to reveal whether ETag retries tolerate multi-writer bursts.
      const batch = await Promise.allSettled(Array.from({length:4}, (_,i) =>
        updateDriverOrder(orderId, old => ({...old, diagnosticLastWriter:i, diagnosticCount:(old.diagnosticCount||0)+1}))));
      console.log("[blob-canary] actual-order-concurrent-update",
        "fulfilled",batch.filter(x=>x.status==="fulfilled").length,
        "rejected",batch.filter(x=>x.status==="rejected").length);
      const finalRecord = await readDriverOrder(orderId);
      console.log("[blob-canary] final-count",finalRecord?.order?.diagnosticCount ?? null);
      for (const failed of batch.filter(x=>x.status==="rejected")) console.log("[blob-canary] concurrent-error",
        failed.reason instanceof Error ? failed.reason.name + ":" + failed.reason.message : "unknown");
      if (batch.some(x=>x.status==="rejected") || finalRecord?.order?.diagnosticCount !== 4) throw new Error("Real concurrent order writes did not all succeed");

    } finally {
      await del(orderBlobPath);
    }

  } catch (error) {
    console.error("[blob-canary] FAIL", error instanceof Error ? error.name+":"+error.message : "unknown error");
    throw error;
  } finally {
    try {await del(path);} catch {console.error("[blob-canary] Cleanup failed");}
  }
}
