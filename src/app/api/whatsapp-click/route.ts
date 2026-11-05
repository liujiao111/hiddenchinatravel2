import { Resend } from "resend";
import { cleanTracking, detectSource, externalReferrer, parseAttribution, TRACKING_KEYS, type Touch } from "@/lib/attribution";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
const recent = new Map<string, { count: number; expires: number }>();
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
  const text = [
    "WhatsApp click — message NOT confirmed sent.",
    "Match the Ref in an incoming WhatsApp message to this record. A click alone is not an enquiry.",
    "", "Attribution", `Lead ID: ${body.lead_id}`, "Lead type: whatsapp_click",
    `Source: ${last?.source_label || "Unknown"}`, `First source: ${first?.source || "N/A"}`, `First medium: ${first?.medium || "N/A"}`,
    `First campaign: ${first?.params.utm_campaign || "N/A"}`, `Last source: ${last?.source || "N/A"}`, `Last medium: ${last?.medium || "N/A"}`,
    `Last campaign: ${last?.params.utm_campaign || "N/A"}`, `Search term: ${last?.params.utm_term || "N/A"}`,
    `First landing page: ${first?.landing_page || "N/A"}`, `Conversion page: ${page.startsWith("/") && !page.startsWith("//") ? page : "N/A"}`,
    `First visit time: ${first?.time || "N/A"}`, `GCLID: ${last?.params.gclid || first?.params.gclid || "N/A"}`,
    `WhatsApp location: ${location || "N/A"}`, `CTA: ${cleanTracking(body.cta_location, 100) || "N/A"}`,
    `Device: ${cleanTracking(body.device_type, 20) || "N/A"}`, `Language: ${cleanTracking(body.browser_language, 40) || "N/A"}`,
    "", "Full attribution (client-reported, sanitized; not proof of ad eligibility):", JSON.stringify({ first, last, session }, null, 2),
  ].join("\n");
  // The existing Resend inbox is the durable record; no database is introduced.
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL || process.env.CUSTOM_JOURNEY_FROM_EMAIL;
  if (!key || !from) return Response.json({ error: "Click record unavailable" }, { status: 503 });
  try {
    const { error } = await new Resend(key).emails.send({ from, to: process.env.ENQUIRY_TO_EMAIL || siteConfig.enquiryEmail, subject: `[WhatsApp click — unconfirmed] ${body.lead_id}`, text }, { idempotencyKey: `whatsapp-${body.lead_id}` });
    if (error) return Response.json({ error: "Click record unavailable" }, { status: 502 });
    return Response.json({ recorded: true, lead_id: body.lead_id });
  } catch { return Response.json({ error: "Click record unavailable" }, { status: 502 }); }
}
