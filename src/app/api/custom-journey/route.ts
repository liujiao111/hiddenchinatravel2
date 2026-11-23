import { isTransferClaimSpam } from "@/lib/enquiry-spam";
import { prepareFormRecord, saveFormRecord } from "@/lib/lead-ref";
import { createHash } from "node:crypto";
import { driverDirectPrices, DRIVER_FULL_ORDER_TEST_ID, DRIVER_FULL_ORDER_TEST_ROUTE, DRIVER_FULL_ORDER_TEST_USD_CENTS } from "@/lib/driver-direct-prices";
import { driverUsdCents, driverMultiDayTotalUsd } from "@/lib/driver-usd-prices";
import { createDirectDriverCheckout } from "@/lib/driver-direct-checkout";
import { getEnquiryMailConfig } from "@/lib/enquiry-mail";
import { chinaServiceDate, parseAirportTransfer } from "@/lib/driver-airport-transfers";
import { driverOrderAccess, driverOrdersEnabled, saveDriverRequest } from "@/lib/driver-orders.mjs";
import { enquiryEmailText, parseCustomJourneyEnquiry } from "@/lib/custom-journey-enquiry";
import { driverUnpaidEmail } from "@/lib/driver-order-mail";

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
  let driverOrder;
  try {
    const text = await request.text();
    if (text.length > 12_000) return Response.json({ error: "Your message is too long." }, { status: 413 });
    const payload = JSON.parse(text);
    parsedBody = payload;
    enquiry = parseCustomJourneyEnquiry(payload);
    driverOrder = payload?.driverOrder;
  } catch { return Response.json({ error: "Please check your details and try again." }, { status: 400 }); }
  if (!enquiry) return Response.json({ error: "Please check your name, email, traveler numbers and consent." }, { status: 400 });
  if (isTransferClaimSpam(enquiry.notes)) {
    return Response.json({ error: "Please describe your travel plans and try again." }, { status: 422 });
  }
  const locale = driverOrder?.locale === "zh" ? "zh" : "en";
  const airportTransfer = driverOrder?.airportTransfer === undefined ? undefined
    : parseAirportTransfer(driverOrder.airportTransfer, enquiry.travelTiming, enquiry.adults, enquiry.children, locale);
  if (airportTransfer === null) {
    return Response.json({ error: locale === "zh" ? "请核对接送日期、时间、交通信息、人数和行李。" : "Check your transfer date, time, transport details, passenger and luggage counts." }, { status: 400 });
  }
  const tracking = parsedBody.tracking && typeof parsedBody.tracking === "object" ? parsedBody.tracking as Record<string, unknown> : {};
  if (driverOrder?.checkout === true) {
    const productId = String(driverOrder.productId || "");
    const product = Object.hasOwn(driverDirectPrices, productId) ? driverDirectPrices[productId] : undefined;
    const vehicle = driverOrder.vehicleCode;
    const size = vehicle === "Five-seat car" ? "five" : vehicle === "Seven-seat car" ? "seven" : null;
    const date = new Date(enquiry.travelTiming + "T00:00:00Z");
    const directRate = product && size ? product[size] : undefined;
    const multi = productId === "multi-short" || productId === "multi-long";
    const fullOrderTest = productId === DRIVER_FULL_ORDER_TEST_ID;
    const validFullOrderTest = !fullOrderTest || (driverOrder.checkoutTest === true && size === "five"
      && driverOrder.directionCode === DRIVER_FULL_ORDER_TEST_ROUTE && !driverOrder.deposit);
    const days = Number(driverOrder.days);
    const validMulti = multi && Number.isInteger(days) && days >= (productId === "multi-long" ? 7 : 1)
      && days <= (productId === "multi-long" ? 45 : 6) && driverOrder.deposit === true;
    const endDate = typeof driverOrder.endDate === "string" ? driverOrder.endDate : "";
    const expectedEnd = new Date(enquiry.travelTiming + "T00:00:00Z");
    if (Number.isFinite(expectedEnd.getTime()) && validMulti) expectedEnd.setUTCDate(expectedEnd.getUTCDate() + days - 1);
    const validEnd = !multi || (!endDate || (Number.isFinite(expectedEnd.getTime()) && endDate === expectedEnd.toISOString().slice(0, 10)));
    // Reprice independently of the browser. All live Checkout amounts are in USD cents.
    const totalFen = fullOrderTest ? DRIVER_FULL_ORDER_TEST_USD_CENTS : airportTransfer?.guideFen !== undefined && airportTransfer?.guideFen !== null
      ? driverUsdCents(airportTransfer.guideFen / 100)
      : validMulti && size ? driverMultiDayTotalUsd(days, size === "seven") * 100
      : productId.endsWith("-day") && typeof directRate === "number" ? driverUsdCents(directRate)
      : typeof directRate === "number" ? driverUsdCents(directRate) : null;
    if (!/^\/(?:zh\/|en\/)?yunnan-private-driver\/?$/.test(enquiry.conversionPage || "")
      || !size || !totalFen || !Number.isSafeInteger(totalFen) || !validFullOrderTest || (multi && (!validMulti || !validEnd))
      || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== enquiry.travelTiming || enquiry.travelTiming < chinaServiceDate()
      || !Number.isInteger(driverOrder.luggage) || driverOrder.luggage < 0 || driverOrder.luggage > 20
      || (size === "five" && (enquiry.adults + enquiry.children > 3 || Number(driverOrder.luggage) > 3))
      || (size === "seven" && enquiry.adults + enquiry.children > 6)
      || (airportTransfer && driverOrder.airportTransfer.productId !== productId)
      || (airportTransfer && driverOrder.airportTransfer.vehicle !== vehicle)
      || (product?.routes && !product.routes.includes(String(driverOrder.directionCode)))
      || ((multi || productId.endsWith("-day")) && (typeof driverOrder.route !== "string" || !driverOrder.route.trim()))
      || (!airportTransfer && !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(driverOrder.pickupTime || "")))
      || (size === "seven" && driverOrder.luggage > 5)
      || typeof driverOrder.pickup !== "string" || !driverOrder.pickup.trim()
      || typeof driverOrder.dropoff !== "string" || !driverOrder.dropoff.trim()) {
      return Response.json({ error: "Please check the route, date, vehicle and passenger details before payment." }, { status: 400 });
    }
    try {
      const result = await createDirectDriverCheckout({ id: enquiry.requestId, submissionKey: driverOrder.submissionKey, totalFen, origin, deposit: multi, testOnly: fullOrderTest,
        summary: { locale, productId, gaClientId: typeof driverOrder.analyticsClientId === "string" && /^\d{5,15}\.\d{5,15}$/.test(driverOrder.analyticsClientId) ? driverOrder.analyticsClientId : undefined, testOnly: fullOrderTest, service: fullOrderTest ? "US$1 full-order payment verification — NO TRANSPORT" : productId, date: enquiry.travelTiming, pickupTime: airportTransfer?.time || String(driverOrder.pickupTime || ""), ...(multi ? { days } : {}), route: String(driverOrder.route || "").slice(0, 700),
          pickup: String(driverOrder.pickup).slice(0, 150), dropoff: String(driverOrder.dropoff).slice(0, 150), vehicle,
          party: enquiry.adults + enquiry.children, email: enquiry.email, name: enquiry.name, whatsapp: enquiry.whatsapp,
          notes: typeof driverOrder.notes === "string" ? driverOrder.notes.trim().slice(0,1100) : "", ...(airportTransfer || {}), currency: "usd", guideFen: totalFen } });
      // A Stripe redirect is NOT a paid booking. Persist and notify the operator of
      // the lead now, so abandoned/cancelled checkouts are not silently lost.
      const formRecord = prepareFormRecord(tracking, "https://hiddenchinatravel.com" + (enquiry.conversionPage || "/yunnan-private-driver"), "yunnan_driver_product", enquiry.requestId);
      try { await saveFormRecord(formRecord); }
      catch { console.error("[driver-checkout] Lead attribution could not be saved"); }
      const { apiKey, from, to } = getEnquiryMailConfig();
      if (apiKey && from && to) {
        try {
          const mail = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json",
              "Idempotency-Key": `driver-checkout-started-${enquiry.requestId}` },
            body: JSON.stringify({ from, to: [to], ...driverUnpaidEmail({
              id: enquiry.requestId, ref: formRecord.ref, name: enquiry.name,
              email: enquiry.email, whatsapp: enquiry.whatsapp,
              service: fullOrderTest ? "US$1 payment verification (NO TRANSPORT)" : productId,
              route: String(driverOrder.route || driverOrder.directionCode || "").slice(0,300),
              travelDate: enquiry.travelTiming,
              pickup: String(driverOrder.pickup || "").slice(0,150),
              dropoff: String(driverOrder.dropoff || "").slice(0,150),
              vehicle: String(driverOrder.vehicleCode || ""),
              travellers: enquiry.adults+enquiry.children,
              totalCents: totalFen, dueCents: multi ? Math.round(totalFen/5) : totalFen,
              deposit: multi, testOnly: fullOrderTest,
              orderUrl: new URL(result.orderPath,origin).href,
            }) }),
            signal: AbortSignal.timeout(5_000),
          });
          if (!mail.ok) console.error("[driver-checkout] Operator lead notification rejected", { status: mail.status });
        } catch { console.error("[driver-checkout] Operator lead notification unavailable"); }
      } else console.error("[driver-checkout] Operator lead notification is not configured");
      return Response.json({ success: true, ...result, amountDueFen: multi ? Math.round(totalFen / 5) : totalFen, totalFen, currency: "USD", paymentType: multi ? "deposit" : "full" }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Could not open secure checkout. Please try again." }, { status: 503 });
    }
  }
  const formName = /^(?:custom_journey_enquiry|yunnan_package_enquiry|private_yunnan_enquiry|yunnan_driver_(?:custom|product))$/.test(String(tracking.form_name || ""))
    ? String(tracking.form_name) : "custom_journey_enquiry";
  const formRecord = prepareFormRecord(tracking, "https://hiddenchinatravel.com" + (enquiry.conversionPage || "/private-yunnan-tours"), formName, enquiry.requestId);
  const { apiKey, from, to } = getEnquiryMailConfig();
  if (!apiKey || !from) return Response.json({ error: "The enquiry form is temporarily unavailable. Please try WhatsApp or email Joy below." }, { status: 503 });
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
        ...(airportTransfer || {}),
      }, driverOrder.submissionKey);
      if (!saved || saved.summary.email !== enquiry.email) {
        return Response.json({ error: "This request has already been submitted. Please start a new request." }, { status: 409 });
      }
      orderPath = `/driver-order/${access}`;
      orderUrl = new URL(orderPath, origin).href;
    }
    const orderLine = orderUrl ? `\nGuest order link: ${orderUrl}` : "";
    const body = { from, to: [to], ...(enquiry.email ? { reply_to: enquiry.email } : {}), subject: `Custom journey enquiry — ${enquiry.name}`, text: "Ref: " + formRecord.ref + "\n\n" + enquiryEmailText(enquiry) + (airportTransfer ? `\nValidated transfer price: ${airportTransfer.manualQuote ? "manual quote required" : `CNY ${(airportTransfer.guideFen! / 100).toFixed(2)} per vehicle (reference only)`}` : "") + orderLine };
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
    await saveFormRecord(formRecord);
    return Response.json({ success: true, ref: formRecord.ref, orderPath }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "We could not send your enquiry. Your details are still here; please try again or contact Joy below." }, { status: 502 }); }
}
