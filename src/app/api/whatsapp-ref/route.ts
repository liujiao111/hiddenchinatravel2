import { parseWhatsAppSource, saveWhatsAppSource } from "@/lib/whatsapp-ref-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(message: string, status: number) {
  return Response.json({ error: message }, {
    status,
    headers: { "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}

export async function POST(request: Request) {
  // Only same-origin browser clicks should send a record. Never accept referrer,
  // source or PII as trusted just because this public endpoint receives them.
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if ((origin && origin !== url.origin) ||
      (fetchSite && fetchSite !== "same-origin") ||
      (!origin && fetchSite !== "same-origin")) {
    return json("Forbidden", 403);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json("Recording unavailable", 503);
  const size = Number(request.headers.get("content-length") || 0);
  if (size > 10_000) return json("Payload too large", 413);
  let data: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 10_000) return json("Payload too large", 413);
    data = JSON.parse(raw);
  } catch {
    return json("Invalid JSON", 400);
  }
  const record = parseWhatsAppSource(data);
  if (!record) return json("Invalid reference or attribution", 400);
  try {
    await saveWhatsAppSource(record);
    return Response.json({ saved: true }, {
      status: 201,
      headers: { "cache-control": "no-store", "x-robots-tag": "noindex" },
    });
  } catch (error) {
    console.error("WhatsApp Ref persistence failed", error instanceof Error ? error.message : "unknown");
    return json("Recording unavailable", 503);
  }
}
