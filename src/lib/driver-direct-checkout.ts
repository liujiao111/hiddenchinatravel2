import Stripe from "stripe";
import { createHash } from "node:crypto";
import { driverOrdersEnabled, driverOrderAccess, readDriverOrder, saveDriverRequest, updateDriverOrder } from "@/lib/driver-orders.mjs";

export function getDriverCheckoutConfigStatus() {
  const live = (process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV) === "production";
  const key = process.env.STRIPE_SECRET_KEY;
  const webhook = live ? process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET;
  const checks = {
    orderStorage: driverOrdersEnabled(),
    stripeKey: Boolean(key?.startsWith(live ? "sk_live_" : "sk_test_")),
    webhook: Boolean(webhook?.startsWith("whsec_")),
    environment: live || process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED === "true",
  };
  return { ready: Object.values(checks).every(Boolean), checks, environment: live ? "production" : "nonproduction" };
}

export async function createDirectDriverCheckout(input: {
  id: string; submissionKey: string; summary: Record<string, unknown>; totalFen: number; origin: string; deposit?: boolean; testOnly?: boolean;
}) {
  const key = process.env.STRIPE_SECRET_KEY;
  const live = (process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV) === "production";
  const webhook = live ? process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET;
  const config = getDriverCheckoutConfigStatus();
  if (!config.ready) {
    console.error("[driver-checkout] Checkout environment validation failed", config);
    throw new Error("Online payment is not configured for this environment. Please contact Joy to arrange payment.");
  }
  // Never create a fresh order record and then immediately overwrite it.
  // A fresh checkout is created first but the URL stays private until its quote
  // and order are atomically persisted together in one immutable Blob write.
  const access = driverOrderAccess(input.id);
  if (!access) throw new Error("Order links are not configured.");
  const orderPath = `/driver-order/${access}`;
  const orderUrl = new URL(orderPath, input.origin).href;
  const stripe = new Stripe(key!);
  const previous = await readDriverOrder(input.id);
  if (previous) {
    const submissionHash = createHash("sha256").update(input.submissionKey).digest("hex");
    if (previous.order.submissionHash !== submissionHash
      || JSON.stringify(previous.order.summary) !== JSON.stringify(input.summary)) {
      throw new Error("This request changed. Please start a new booking.");
    }
    if (previous.order.paid?.initial) return { orderPath, checkoutUrl: orderUrl };
    if (previous.order.quote?.initial) {
      const existing = await stripe.checkout.sessions.retrieve(previous.order.quote.initial.id);
      if (existing.status === "open" && existing.url) return { orderPath, checkoutUrl: existing.url };
      if (existing.status === "complete") return { orderPath, checkoutUrl: orderUrl };
      throw new Error("This payment link expired. Please start a new booking.");
    }
  }
  if (input.testOnly && (input.totalFen !== 100 || input.deposit || input.summary.testOnly !== true)) {
    throw new Error("Invalid payment verification order.");
  }
  const description = input.testOnly ? "US$1 FULL ORDER PAYMENT TEST — NO TRANSPORT OR BOOKING" : String(input.summary.service).slice(0, 400);
  const dueFen = input.deposit ? Math.round(input.totalFen / 5) : input.totalFen;
  const paymentType = input.deposit ? "deposit" : "full";
  const balanceDue = input.deposit ? "As confirmed in the booking terms before the trip" : "";
  const cancellationTerms = input.testOnly ? "Real USD 1.00 payment verification only. NO private driver, pickup, transport service, deposit toward a trip, or booking is included. Contact Hidden China Travel to discuss test-charge refunds." : "Prices are in USD and include the agreed vehicle, driver, fuel, tolls and parking with no hidden transport charges. Deposit bookings require the remaining 80% according to written booking terms. Tickets, meals, personal expenses, new route requests and approved overtime are not included. If we cannot provide the service, your payment is refunded in full.";
  const metadata = { purpose: "driver_quote_payment", test_only: input.testOnly ? "1" : "0", order_id: input.id, payment_type: paymentType, due_fen: String(dueFen), total_fen: String(input.totalFen), linked_driver_order: "1", service: description, balance_due: balanceDue };
  const session = await stripe.checkout.sessions.create({
    mode: "payment", client_reference_id: input.id, metadata, payment_intent_data: { metadata },
    ...(input.summary.email ? { customer_email: String(input.summary.email) } : {}),
    success_url: orderUrl + "?payment=returned", cancel_url: orderUrl + "?payment=cancelled",
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: dueFen, product_data: { name: description } } }],
    custom_text: { submit: { message: cancellationTerms } },
  }, { idempotencyKey: `driver-direct-${input.id}` });
  if (!session.url) throw new Error("Stripe did not return a payment link.");
  const quote = { direct: true, testOnly: input.testOnly === true, bookingType: input.testOnly ? "verification" : "transfer", totalFen: input.totalFen, currency: "usd",
    description, cancellationTerms, balanceDue,
    initial: { id: session.id, url: session.url, dueFen, type: paymentType, live: session.livemode,
      expiresAt: new Date(session.expires_at * 1000).toISOString() } };
  const order = await saveDriverRequest(input.id, input.summary, input.submissionKey, {quote});
  if (!order || JSON.stringify(order.summary) !== JSON.stringify(input.summary)) {
    throw new Error("This request changed. Please start a new booking.");
  }
  // Legacy requests may have persisted an empty order before Stripe was configured.
  // New checkout requests avoid this update entirely, so no ETag overwrite is needed.
  if (!order.quote?.initial) {
    const updated = await updateDriverOrder(input.id, current => {
      if (current.paid?.initial) return current;
      if (current.quote?.initial) {
        if (current.quote.initial.id !== session.id) throw new Error("A payment already exists for this booking.");
        return current;
      }
      return { ...current, quote };
    });
    if (!updated) throw new Error("Could not persist your payment details.");
  } else if (order.quote.initial.id !== session.id) {
    throw new Error("A different payment session already exists for this booking.");
  }
  return { orderPath, checkoutUrl: session.url, checkoutAmount: dueFen / 100, checkoutCurrency: "USD", checkoutPaymentType: paymentType };
}
