// One-time non-PII Blob write/read/ETag canary on production build.
// Uses a random throwaway object and deletes it in finally. Never logs tokens or ETags.
import { randomUUID } from "node:crypto";
import { put, get, del } from "@vercel/blob";

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
  } catch (error) {
    console.error("[blob-canary] FAIL", error instanceof Error ? error.name+":"+error.message : "unknown error");
    throw error;
  } finally {
    try {await del(path);} catch {console.error("[blob-canary] Cleanup failed");}
  }
}
