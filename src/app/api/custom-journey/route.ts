import { isTransferClaimSpam } from "@/lib/enquiry-spam";
import { prepareFormRecord, saveFormRecord } from "@/lib/lead-ref";
import { createHash } from "node:crypto";
import { parseAirportTransfer } from "@/lib/driver-airport-transfers";
import { driverOrderAccess, driverOrdersEnabled, saveDriverRequest, updateDriverOrder } from "@/lib/driver-orders.mjs";
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
  let parsedBody: Record<string, unknown> = {};
  try {
    const text = await request.text();
    if (text.length > 12_000) return Response.json({ error: "Your message is too long." }, { status: 413 });
    parsedBody = JSON.parse(text) as Record<string, unknown>;
    enquiry = parseCustomJourneyEnquiry(parsedBody);
  } catch { return Response.json({ error: "Please check your details and try again." }, { status: 400 }); }
  if (!enquiry) return Response.json({ error: "Please check your name, email, traveler numbers and consent." }, { status: 400 });
  if (isTransferClaimSpam(enquiry.notes)) {
    return Response.json({ error: "Please describe your travel plans and try again." }, { status: 422 });
  }

  const formName = (/^(?:custom_journey_enquiry|yunnan_package_enquiry|private_yunnan_enquiry|yunnan_driver_(?:custom|product))$/.test(String((parsedBody.tracking as Record<string, unknown> | undefined)?.form_name || "")))
    ? String((parsedBody.tracking as Record<string, unknown>).form_name) : "custom_journey_enquiry";
  const formRecord = prepareFormRecord(parsedBody.tracking, "https://hiddenchinatravel.com" + (enquiry.conversionPage || "/private-yunnan-tours"), formName, enquiry.requestId);
  const driverOrder = parsedBody.driverOrder as Record<string, unknown> | undefined;
  const locale = driverOrder?.locale === "zh" ? "zh" : "en";
  const airportTransfer = driverOrder?.airportTransfer === undefined ? undefined
    : parseAirportTransfer(driverOrder.airportTransfer, enquiry.travelTiming, enquiry.adults, enquiry.children, locale);
  if (airportTransfer === null) return Response.json({ error: "Check transfer date, time, passengers and luggage." }, { status: 400 });
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
        guideFen: typeof driverOrder.guideFen === "number" && Number.isSafeInteger(driverOrder.guideFen) && driverOrder.guideFen > 0 && driverOrder.guideFen < 10000000
          ? driverOrder.guideFen : null,
        name: enquiry.name, email: enquiry.email, whatsapp: enquiry.whatsapp,
        ref: formRecord.ref,
        ...(airportTransfer || {}),
      }, driverOrder.submissionKey);
      if (!saved || saved.summary.email !== enquiry.email) {
        return Response.json({ error: "This request has already been submitted. Please start a new request." }, { status: 409 });
      }
      orderPath = `/driver-order/${access}`;
      orderUrl = new URL(orderPath, origin).href;
    }
    const orderLine = orderUrl ? `\nGuest order link: ${orderUrl}` : "";
    const body = { from, to: [to], ...(enquiry.email ? { reply_to: enquiry.email } : {}), subject: `Custom journey enquiry — ${enquiry.name}`, text: "Ref: " + formRecord.ref + "\n\n" + enquiryEmailText(enquiry) + (airportTransfer ? "\nValidated transfer price: " + (airportTransfer.manualQuote ? "manual quote required" : "CNY " + (airportTransfer.guideFen! / 100).toFixed(2)) : "") + (orderUrl ? "\nGuest order link: " + orderUrl : "") };
    const digest = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0,32);
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `custom-journey-${enquiry.requestId}-${digest}` },
      body: JSON.stringify(body), signal: AbortSignal.timeout(15_000),
    });
    const response = await result.json();
    if (!result.ok || typeof response.id !== "string") return Response.json({ error: "We could not send your enquiry. Please try again or contact Joy below." }, { status: 502 });
    await saveFormRecord(formRecord);
    // Send an acknowledgement of the enquiry, NOT a vehicle or payment confirmation.
    // This applies only to driver requests with a customer email; other journey forms are unchanged.
    let acknowledgement = "not_requested";
    if (formName.startsWith("yunnan_driver_") && enquiry.email) {
      try {
        const zh = locale === "zh";
        const emailText = [
          zh ? `你好，${enquiry.name}：` : `Hello ${enquiry.name},`,
          "",
          zh ? "我们已收到你的云南私人包车咨询，正在核实车辆和路线。" :
            "We received your Yunnan private driver request. We're checking route details and vehicle availability.",
          zh ? "提交咨询不等于车辆预订成功；我们不会在确认车源、价格及条款前要求付款。" :
            "This is an enquiry, not a confirmed booking. There is no payment due until the vehicle, price and terms are confirmed.",
          "",
          `${zh ? "咨询编号" : "Enquiry reference"}: ${enquiry.requestId}`,
          `${zh ? "来源 Ref" : "HCT Ref"}: ${formRecord.ref}`,
          `${zh ? "服务" : "Service"}: ${typeof driverOrder?.service === "string" ? driverOrder.service.slice(0,100) : "Private driver"}`,
          `${zh ? "服务日期" : "Date"}: ${enquiry.travelTiming}`,
          `${zh ? "人数" : "Travellers"}: ${enquiry.adults + enquiry.children}`,
          ...(orderUrl ? [`${zh ? "查看申请" : "View your request"}: ${orderUrl}`] : []),
          "",
          zh ? "如尚未确认航班号、车次或具体接客时间，可在确认安排前补充。" :
            "You can share your flight or train number and exact pickup time later.",
          zh ? "Hidden China Travel · 本邮件仅用于回复本次咨询。" : "Hidden China Travel · Reply to this email about this enquiry only.",
        ].join("\n");
        const ack = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json",
            "Idempotency-Key": `driver-enquiry-ack-${enquiry.requestId}`,
          },
          body: JSON.stringify({
            from, to: [enquiry.email], reply_to: to,
            subject: zh ? "已收到你的云南私人包车咨询｜Hidden China Travel" : "Your private driver enquiry — Hidden China Travel",
            text: emailText,
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (ack.ok) {
          acknowledgement = "accepted";
          const response = await ack.json() as { id?: string };
          if (orderPath && driverOrdersEnabled()) {
            try {
              await updateDriverOrder(enquiry.requestId, current => ({
                ...current,
                notifications: { ...current.notifications, enquiryAcknowledgement: {
                  resendId: response.id || "", acceptedAt: new Date().toISOString(),
                } },
              }));
            } catch {
              console.error("[driver-enquiry] Acknowledgement accepted, order marker not saved");
            }
          }
        } else {
          acknowledgement = "failed";
          console.error("[driver-enquiry] Guest acknowledgement rejected", { status: ack.status });
        }
      } catch {
        acknowledgement = "failed";
        console.error("[driver-enquiry] Guest acknowledgement unavailable");
      }
    }
    return Response.json({ success: true, ref: formRecord.ref, orderPath, acknowledgement }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "We could not send your enquiry. Your details are still here; please try again or contact Joy below." }, { status: 502 }); }
}
