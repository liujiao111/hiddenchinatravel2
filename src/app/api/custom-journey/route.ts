import { createHash } from "node:crypto";
import { enquiryEmailText, parseCustomJourneyEnquiry } from "@/lib/custom-journey-enquiry";

export const runtime = "nodejs";

// A warm-instance burst guard complements honeypot and same-origin checks.
const recentRequests = new Map<string, { count: number; expires: number }>();

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const expectedOrigin = `${requestUrl.protocol}//${request.headers.get("host") || requestUrl.host}`;
  if (!origin || origin !== expectedOrigin) return Response.json({ error: "Please submit from our website." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "Invalid request." }, { status: 415 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  for (const [key, value] of recentRequests) if (value.expires <= now) recentRequests.delete(key);
  const limit = recentRequests.get(ip);
  if (limit && limit.count >= 5) return Response.json({ error: "Please wait a few minutes before trying again." }, { status: 429, headers: { "Retry-After": "600" } });
  recentRequests.set(ip, { count: (limit?.count || 0) + 1, expires: limit?.expires || now + 600_000 });
  if (recentRequests.size > 2000) recentRequests.delete(recentRequests.keys().next().value!);
  let enquiry;
  try {
    const text = await request.text();
    if (text.length > 12_000) return Response.json({ error: "Your message is too long." }, { status: 413 });
    enquiry = parseCustomJourneyEnquiry(JSON.parse(text));
  } catch { return Response.json({ error: "Please check your details and try again." }, { status: 400 }); }
  if (!enquiry) return Response.json({ error: "Please check your name, email, traveler numbers and consent." }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CUSTOM_JOURNEY_FROM_EMAIL;
  const to = process.env.CUSTOM_JOURNEY_TO_EMAIL || "joy.liu@hiddenchinatravel.com";
  if (!apiKey || !from) return Response.json({ error: "The enquiry form is temporarily unavailable. Your details have been kept here; please try WhatsApp or email Joy below." }, { status: 503 });
  try {
    const body = { from, to: [to], reply_to: enquiry.email, subject: `Custom journey enquiry — ${enquiry.name}`, text: enquiryEmailText(enquiry) };
    const digest = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0,32);
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `custom-journey-${enquiry.requestId}-${digest}` },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
    });
    const response = await result.json();
    if (!result.ok || typeof response.id !== "string") return Response.json({ error: "We could not send your enquiry. Please try again or contact Joy below." }, { status: 502 });
    return Response.json({ success: true });
  } catch { return Response.json({ error: "We could not send your enquiry. Your details are still here; please try again or contact Joy below." }, { status: 502 }); }
}
