import { createHash } from "node:crypto";
import { driverOrderAccess, driverOrdersEnabled, saveDriverRequest } from "@/lib/driver-orders.mjs";
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
  let driverOrder;
  try {
    const text = await request.text();
    if (text.length > 12_000) return Response.json({ error: "Your message is too long." }, { status: 413 });
    const payload = JSON.parse(text);
    enquiry = parseCustomJourneyEnquiry(payload);
    driverOrder = payload?.driverOrder;
  } catch { return Response.json({ error: "Please check your details and try again." }, { status: 400 }); }
  if (!enquiry) return Response.json({ error: "Please check your name, email, traveler numbers and consent." }, { status: 400 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CUSTOM_JOURNEY_FROM_EMAIL;
  const to = process.env.CUSTOM_JOURNEY_TO_EMAIL || "joy.liu@hiddenchinatravel.com";
  if (!apiKey || !from) return Response.json({ error: "The enquiry form is temporarily unavailable. Your details have been kept here; please try WhatsApp or email Joy below." }, { status: 503 });
  try {
    let orderPath: string | undefined;
    let orderUrl: string | undefined;
    if (driverOrdersEnabled() && driverOrder && /^\/(?:zh\/|en\/)?yunnan-private-driver\/?$/.test(enquiry.conversionPage || "")) {
      const access = driverOrderAccess(enquiry.requestId);
      if (!access || typeof driverOrder.submissionKey !== "string") {
        return Response.json({ error: "Invalid driver order request." }, { status: 400 });
      }
      const value = (key: string) => typeof driverOrder[key] === "string" ? driverOrder[key].trim().slice(0, 700) : "";
      const saved = await saveDriverRequest(enquiry.requestId, {
        locale: driverOrder.locale === "zh" ? "zh" : "en",
        service: value("service"), route: value("route"), pickup: value("pickup"), dropoff: value("dropoff"),
        vehicle: value("vehicle"), date: enquiry.travelTiming, party: enquiry.adults + enquiry.children,
        guideFen: Number.isSafeInteger(driverOrder.guideFen) && driverOrder.guideFen > 0 && driverOrder.guideFen < 10000000
          ? driverOrder.guideFen : null,
        email: enquiry.email,
      }, driverOrder.submissionKey);
      if (!saved || saved.summary.email !== enquiry.email) {
        return Response.json({ error: "This request has already been submitted. Please start a new request." }, { status: 409 });
      }
      orderPath = `/driver-order/${access}`;
      orderUrl = new URL(orderPath, origin).href;
    }
    const orderLine = orderUrl ? `\nGuest order link: ${orderUrl}` : "";
    const body = { from, to: [to], ...(enquiry.email ? { reply_to: enquiry.email } : {}), subject: `Custom journey enquiry — ${enquiry.name}`, text: enquiryEmailText(enquiry) + orderLine };
    const digest = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0,32);
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `custom-journey-${enquiry.requestId}-${digest}` },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
    });
    const response = await result.json();
    if (!result.ok || typeof response.id !== "string") return Response.json({ error: "We could not send your enquiry. Please try again or contact Joy below." }, { status: 502 });
    if (orderUrl && enquiry.email) {
      const zh = driverOrder.locale === "zh";
      try {
        const acknowledgement = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `driver-request-ack-${enquiry.requestId}` },
          body: JSON.stringify({ from, to: [enquiry.email], reply_to: to,
            subject: zh ? "Hidden China Travel 已收到包车申请" : "Hidden China Travel received your driver request",
            text: zh ? `我们会核实车源并联系你。用此专属链接查看申请、报价及接送安排：\n${orderUrl}`
              : `We will check availability and contact you. Use your private link to view your request, quote and pickup details:\n${orderUrl}` }),
          signal: AbortSignal.timeout(5_000),
        });
        if (!acknowledgement.ok) console.error("[driver-orders] Acknowledgement rejected", { status: acknowledgement.status });
      } catch {
        console.error("[driver-orders] Acknowledgement unavailable");
      }
    }
    return Response.json({ success: true, orderPath }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "We could not send your enquiry. Your details are still here; please try again or contact Joy below." }, { status: 502 }); }
}
