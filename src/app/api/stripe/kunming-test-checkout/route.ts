import type { NextRequest } from "next/server";
import { parseCustomJourneyEnquiry } from "@/lib/custom-journey-enquiry";
import { parseAirportTransfer } from "@/lib/driver-airport-transfers";
import { driverOrderAccess, driverOrdersEnabled, readDriverOrder, saveDriverRequest, updateDriverOrder } from "@/lib/driver-orders.mjs";
import { prepareFormRecord, saveFormRecord } from "@/lib/lead-ref";
import { getStripeTestClient, getDriverTestPaymentLink, isKunmingStripePreviewEnabled } from "@/lib/stripe-test";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Pending checkout notices are informational only. Never claim payment has succeeded. */
async function notifyPendingKunmingTestOrder(id: string, origin: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CUSTOM_JOURNEY_FROM_EMAIL || process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.CUSTOM_JOURNEY_TO_EMAIL || "joy.liu@hiddenchinatravel.com";
  if (!apiKey || !from) {
    console.error("[kunming-preview] Pending-order email is not configured");
    return;
  }
  try {
    const stored = (await readDriverOrder(id))?.order;
    if (!stored?.testCheckout || (stored.notifications?.checkoutEmail?.orderId === id && (!stored.summary.email || stored.notifications?.guestCheckoutEmail?.orderId === id))) return;
    const summary = stored.summary;
    if (summary?.productId !== "kunming-arrival" || stored.testCheckout.amount !== 100
        || stored.testCheckout.currency !== "usd" || !driverOrderAccess(id)) return;
    const orderUrl = new URL(`/driver-order/${driverOrderAccess(id)}`, origin).toString();
    const lines = [
      "PREVIEW TEST ORDER CREATED — PAYMENT NOT YET VERIFIED",
      "This email confirms a sandbox checkout was opened, NOT that payment succeeded.",
      "No vehicle or actual booking will be arranged.",
      "",
      `Order ID: ${id}`, `HCT Ref: ${summary.ref || "N/A"}`,
      "Test price: USD 1.00",
      `Service: ${summary.service}`, `Travel date: ${summary.date}`,
      `Route: ${summary.route}`, `Time (China): ${summary.time || "N/A"}`,
      `Flight/train: ${summary.transportNumber || "N/A"}`,
      `Vehicle: ${summary.vehicle || "N/A"}`,
      `Passengers: ${summary.party}`, `Large suitcases: ${summary.luggage ?? "N/A"}`,
      `Name: ${summary.name || "N/A"}`, `Email: ${summary.email || "N/A"}`,
      `WhatsApp: ${summary.whatsapp || "N/A"}`,
      `Notes: ${summary.notes || "None"}`,
      `Private test order: ${orderUrl}`,
    ];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": `kunming-preview-checkout-start-${id}`,
      },
      body: JSON.stringify({
        from, to: [to],
        subject: `[TEST ORDER — Payment pending] Kunming transfer US$1 — ${id}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[kunming-preview] Pending checkout email rejected", { status: response.status, orderId: id });
      return;
    }
    const accepted = await response.json() as { id?: string };
    await updateDriverOrder(id, current => current.notifications?.checkoutEmail?.orderId === id
      ? current : { ...current, notifications: { ...current.notifications, checkoutEmail: {
        orderId: id, resendId: accepted.id || "", acceptedAt: new Date().toISOString(),
      } } });
    console.info("[kunming-preview] Pending checkout email accepted", { orderId: id });
    // A separate, clearly labelled receipt of the *test request* to the guest.
    // It must not claim payment succeeded or that transport has been booked.
    if (typeof summary.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(summary.email)
        && stored.notifications?.guestCheckoutEmail?.orderId !== id) {
      const zh = summary.locale === "zh";
      const guestMail = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Idempotency-Key": `kunming-test-guest-checkout-${id}`,
        },
        body: JSON.stringify({
          from, to: [summary.email], reply_to: to,
          subject: zh ? "昆明接送测试订单已创建（待付款）｜Hidden China Travel" : "Kunming test checkout created (payment pending) — Hidden China Travel",
          text: [
            zh ? `你好，${summary.name || "旅客"}：` : `Hello ${summary.name || "traveller"},`,
            "",
            zh ? "我们收到了你的 US$1 昆明接送沙盒测试订单。尚未验证付款；不会产生真实预订或安排车辆。" :
              "We received your US$1 Kunming transfer sandbox test order. Payment has not been verified. No real vehicle or transfer will be arranged.",
            "",
            `Order ID: ${id}`, `HCT Ref: ${summary.ref || "N/A"}`,
            `Service: ${summary.service}`, `Date: ${summary.date}`,
            `Route: ${summary.route}`, `Test amount: USD 1.00`,
            `Private test order: ${orderUrl}`,
            "",
            zh ? "这是测试订单通知，不是付款成功凭证。" : "This is a test-order acknowledgement, not a payment receipt.",
          ].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (guestMail.ok) {
        const acceptedGuest = await guestMail.json() as { id?: string };
        await updateDriverOrder(id, current => current.notifications?.guestCheckoutEmail?.orderId === id
          ? current : { ...current, notifications: { ...current.notifications, guestCheckoutEmail: {
            orderId: id, resendId: acceptedGuest.id || "", acceptedAt: new Date().toISOString(),
          } } });
      } else {
        console.error("[kunming-preview] Guest test-order email rejected", { status: guestMail.status, orderId: id });
      }
    }
  } catch {
    // Checkout must still proceed: an email outage cannot turn a sandbox checkout into a failed order.
    console.error("[kunming-preview] Pending checkout email could not be sent", { orderId: id });
  }
}

export async function POST(request: NextRequest) {
  if (!isKunmingStripePreviewEnabled()) {
    return Response.json({ error: "Kunming sandbox checkout is not enabled on this Preview." }, { status: 503, headers: jsonHeaders });
  }
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return Response.json({ error: "Submit from the Preview website." }, { status: 403, headers: jsonHeaders });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "Invalid content type." }, { status: 415, headers: jsonHeaders });
  }
  if (!driverOrdersEnabled()) {
    return Response.json({ error: "Preview order storage is not configured." }, { status: 503, headers: jsonHeaders });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return Response.json({ error: "Request too large." }, { status: 413, headers: jsonHeaders });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid input");
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid booking details." }, { status: 400, headers: jsonHeaders });
  }

  const enquiry = parseCustomJourneyEnquiry(body);
  const orderInput = body.driverOrder as Record<string, unknown> | undefined;
  if (!enquiry || !uuidV4.test(enquiry.requestId)
      || orderInput?.locale !== "en" && orderInput?.locale !== "zh"
      || typeof orderInput?.submissionKey !== "string" || !uuidV4.test(orderInput.submissionKey)
      || enquiry.conversionPage !== `/${orderInput.locale}/yunnan-private-driver`
      || body.tracking === undefined) {
    return Response.json({ error: "Please check your booking and contact details." }, { status: 400, headers: jsonHeaders });
  }
  const inputTransfer = orderInput.airportTransfer as Record<string, unknown> | undefined;
  if (inputTransfer?.productId !== "kunming-arrival") {
    return Response.json({ error: "Only Kunming airport and station transfers are enabled for this test." }, { status: 400, headers: jsonHeaders });
  }
  const locale = orderInput.locale;
  const transfer = parseAirportTransfer(inputTransfer, enquiry.travelTiming, enquiry.adults, enquiry.children, locale);
  if (!transfer || !["Five-seat car", "Seven-seat car"].includes(inputTransfer.vehicle as string)) return Response.json({ error: "Choose a five-seat or seven-seat vehicle and check the transfer details." }, { status: 400, headers: jsonHeaders });

  const stripe = getStripeTestClient();
  const paymentLink = getDriverTestPaymentLink();
  if (!stripe && !paymentLink) {
    return Response.json({ error: "Stripe sandbox Checkout is not configured for this Preview." }, { status: 503, headers: jsonHeaders });
  }

  const source = prepareFormRecord(body.tracking, `https://hiddenchinatravel.com/${locale}/yunnan-private-driver`, "yunnan_driver_test_booking", enquiry.requestId, "kunming-arrival");
  const summary = {
    locale, productId: "kunming-arrival", service: locale === "zh" ? "昆明机场与火车站接送" : "Kunming Airport & Railway Station Transfer",
    date: enquiry.travelTiming, name: enquiry.name, email: enquiry.email, whatsapp: enquiry.whatsapp,
    ref: source.ref, party: enquiry.adults + enquiry.children,
    ...transfer, // Validated route and travel details; prices below are *not* taken from browser input.
    guideFen: null, manualQuote: false,
  };
  try {
    const saved = await saveDriverRequest(enquiry.requestId, summary, orderInput.submissionKey);
    if (!saved || saved.summary?.productId !== "kunming-arrival" || saved.summary?.ref !== source.ref) {
      return Response.json({ error: "This booking ID is already used. Please start a new booking." }, { status: 409, headers: jsonHeaders });
    }
    const checkout = saved.testCheckout;
    if (saved.paid?.test) return Response.json({ error: "This test order has already been paid." }, { status: 409, headers: jsonHeaders });
    if (checkout?.url && Date.parse(checkout.expiresAt) > Date.now() && checkout.amount === 100 && checkout.currency === "usd") {
      await notifyPendingKunmingTestOrder(enquiry.requestId, request.nextUrl.origin);
      return Response.json({ url: checkout.url, orderPath: `/driver-order/${driverOrderAccess(enquiry.requestId)}`, ref: source.ref }, { headers: jsonHeaders });
    }
    if (checkout) return Response.json({ error: "The previous test checkout expired. Please start a new booking." }, { status: 409, headers: jsonHeaders });

    if (!stripe && paymentLink) {
      const url = new URL(paymentLink.toString());
      url.searchParams.set("client_reference_id", enquiry.requestId);
      const linked = await updateDriverOrder(enquiry.requestId, current => current.testCheckout ? current : ({
        ...current, testCheckout: {
          status: "pending_payment", amount: 100, currency: "usd",
          paymentMethod: "test_payment_link", url: url.toString(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
      }));
      if (!linked?.testCheckout || linked.testCheckout.url !== url.toString()) {
        return Response.json({ error: "Could not link this sandbox payment to the order." }, { status: 503, headers: jsonHeaders });
      }
      await saveFormRecord(source);
      await notifyPendingKunmingTestOrder(enquiry.requestId, request.nextUrl.origin);
      return Response.json({
        url: url.toString(), orderPath: `/driver-order/${driverOrderAccess(enquiry.requestId)}`,
        ref: source.ref, orderId: enquiry.requestId,
      }, { headers: jsonHeaders });
    }

    if (!stripe) return Response.json({ error: "Stripe is not configured." }, { status: 503, headers: jsonHeaders });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: enquiry.requestId,
      customer_email: enquiry.email || undefined,
      line_items: [{
        price_data: {
          currency: "usd", unit_amount: 100,
          product_data: {
            name: "TEST ONLY — Kunming Airport & Railway Transfer",
            description: "USD 1 sandbox test. No vehicle will be booked.",
          },
        },
        quantity: 1,
      }],
      metadata: {
        purpose: "kunming_transfer_preview_checkout", order_id: enquiry.requestId,
        product_id: "kunming-arrival", lead_ref: source.ref, environment: "preview",
      },
      payment_intent_data: { metadata: { purpose: "kunming_transfer_preview_checkout", order_id: enquiry.requestId } },
      success_url: `${request.nextUrl.origin}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/${locale}/yunnan-private-driver?payment=cancelled#driver-quote-form`,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      custom_text: { submit: { message: "TEST MODE — no driver booking or actual service will be arranged." } },
    }, { idempotencyKey: `kunming-preview-${enquiry.requestId}` });
    if (!session.url || session.livemode || session.amount_total !== 100 || session.currency !== "usd") {
      throw new Error("Stripe returned an unexpected sandbox checkout.");
    }
    const updated = await updateDriverOrder(enquiry.requestId, current => {
      if (current.testCheckout) return current;
      return {
        ...current,
        testCheckout: { status: "pending_payment", amount: 100, currency: "usd",
          sessionId: session.id, url: session.url, expiresAt: new Date(session.expires_at * 1000).toISOString() },
      };
    });
    if (updated?.testCheckout?.sessionId !== session.id) throw new Error("Checkout could not be linked to the saved order.");
    await saveFormRecord(source);
    await notifyPendingKunmingTestOrder(enquiry.requestId, request.nextUrl.origin);
    return Response.json({
      url: session.url, orderPath: `/driver-order/${driverOrderAccess(enquiry.requestId)}`,
      ref: source.ref, orderId: enquiry.requestId,
    }, { headers: jsonHeaders });
  } catch (error) {
    console.error("[kunming-preview-checkout]", error instanceof Error ? error.message : "Unexpected error");
    return Response.json({ error: "Could not prepare the sandbox payment. Please try again." }, { status: 503, headers: jsonHeaders });
  }
}
