import { cleanTracking, detectSource, externalReferrer, parseAttribution, TRACKING_KEYS, type Touch } from "@/lib/attribution";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
const recent = new Map<string, { count: number; expires: number }>();
const loggedReferences = new Map<string, number>();
function validateTouch(touch: Touch) {
  const params = Object.fromEntries(TRACKING_KEYS.flatMap(key => {
    const value = cleanTracking(touch.params[key]);
    return value ? [[key, value]] : [];
  }));
  const referrer = externalReferrer(touch.referrer, new URL(siteConfig.url).hostname);
  const classified = detectSource(params, referrer);
  const path = cleanTracking(touch.landing_page, 500).split(/[?#]/)[0];
  return { ...classified, params, referrer, landing_page: path.startsWith("/") && !path.startsWith("//") ? path : "N/A", time: Number.isFinite(Date.parse(touch.time)) ? new Date(touch.time).toISOString() : "N/A" };
}
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ error: "Invalid origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "Invalid content type" }, { status: 415 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  for (const [key, value] of recent) if (value.expires < now) recent.delete(key);
  const limit = recent.get(ip);
  if (limit && limit.count >= 12) return Response.json({ error: "Rate limited" }, { status: 429 });
  if (recent.size >= 2000) recent.delete(recent.keys().next().value!);
  recent.set(ip, { count: (limit?.count || 0) + 1, expires: limit?.expires || now + 600_000 });
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return Response.json({ error: "Too large" }, { status: 413 });
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid body");
  } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  if (typeof body.lead_id !== "string" || !/^HCT-\d{8}-[A-F0-9]{16}$/.test(body.lead_id)) return Response.json({ error: "Invalid reference" }, { status: 400 });
  const attribution = parseAttribution(body.attribution);
  const first = attribution ? validateTouch(attribution.first) : null;
  const last = attribution ? validateTouch(attribution.last) : null;
  const session = attribution ? validateTouch(attribution.session) : null;
  const page = cleanTracking(body.conversion_page, 500).split(/[?#]/)[0];
  const location = cleanTracking(body.whatsapp_location, 40).replace(/[^a-z_]/g, "");
  // Clicks are diagnostics, not enquiries. Never invoke Resend or send a
  // notification here. Keep a bounded, sanitized server log for Ref matching.
  // Provider log retention applies; this is not a durable CRM/database record.
  for (const [id, expires] of loggedReferences) if (expires <= now) loggedReferences.delete(id);
  if (!loggedReferences.has(body.lead_id)) {
    if (loggedReferences.size >= 2000) loggedReferences.delete(loggedReferences.keys().next().value!);
    console.info("[whatsapp_click]", JSON.stringify({
      lead_id: body.lead_id,
      lead_type: "whatsapp_click",
      message_sent: "unconfirmed",
      source_label: last?.source_label || "Unknown",
      conversion_page: page.startsWith("/") && !page.startsWith("//") ? page : "N/A",
      whatsapp_location: location || "N/A",
      cta_location: cleanTracking(body.cta_location, 100),
      device_type: cleanTracking(body.device_type, 20),
      browser_language: cleanTracking(body.browser_language, 40),
      attribution: { first, last, session },
    }));
    loggedReferences.set(body.lead_id, now + 600_000);
  }
  return Response.json({ logged: true, lead_id: body.lead_id });
}
