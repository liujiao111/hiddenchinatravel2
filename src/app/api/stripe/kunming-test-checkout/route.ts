import type { NextRequest } from "next/server";
import { parseCustomJourneyEnquiry } from "@/lib/custom-journey-enquiry";
import { parseAirportTransfer } from "@/lib/driver-airport-transfers";
import { driverOrderAccess, driverOrdersEnabled, saveDriverRequest, updateDriverOrder } from "@/lib/driver-orders.mjs";
import { prepareFormRecord, saveFormRecord } from "@/lib/lead-ref";
import { getStripeTestClient, getDriverTestPaymentLink, isKunmingStripePreviewEnabled } from "@/lib/stripe-test";

export const runtime = "nodejs";

const jsonHeaders = { "Cache-Control": "no-store" };
const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  if (!transfer) return Response.json({ error: "Check the route, date, pickup time, flight or train number, and luggage." }, { status: 400, headers: jsonHeaders });

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
    return Response.json({
      url: session.url, orderPath: `/driver-order/${driverOrderAccess(enquiry.requestId)}`,
      ref: source.ref, orderId: enquiry.requestId,
    }, { headers: jsonHeaders });
  } catch (error) {
    console.error("[kunming-preview-checkout]", error instanceof Error ? error.message : "Unexpected error");
    return Response.json({ error: "Could not prepare the sandbox payment. Please try again." }, { status: 503, headers: jsonHeaders });
  }
}
