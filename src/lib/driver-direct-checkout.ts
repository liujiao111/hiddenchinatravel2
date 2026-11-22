import Stripe from "stripe";
import { driverOrdersEnabled, saveDriverRequest, updateDriverOrder } from "@/lib/driver-orders.mjs";

export async function createDirectDriverCheckout(input: {
  id: string; submissionKey: string; summary: Record<string, unknown>; totalFen: number; origin: string;
}) {
  const key = process.env.STRIPE_SECRET_KEY;
  const live = (process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV) === "production";
  const webhook = live ? process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET;
  if (!driverOrdersEnabled() || !key?.startsWith(live ? "sk_live_" : "sk_test_") || !webhook?.startsWith("whsec_")
    || (!live && process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED !== "true")) {
    throw new Error("Online payment is not configured for this environment. Please contact Joy to arrange payment.");
  }
  const order = await saveDriverRequest(input.id, input.summary, input.submissionKey);
  if (!order || JSON.stringify(order.summary) !== JSON.stringify(input.summary)) throw new Error("This request changed. Please start a new booking.");
  const orderPath = `/driver-order/${order.access}`;
  const orderUrl = new URL(orderPath, input.origin).href;
  if (order.paid?.initial) return { orderPath, checkoutUrl: orderUrl };
  const stripe = new Stripe(key);
  if (order.quote?.initial) {
    const existing = await stripe.checkout.sessions.retrieve(order.quote.initial.id);
    if (existing.status === "open" && existing.url) return { orderPath, checkoutUrl: existing.url };
    if (existing.status === "complete") return { orderPath, checkoutUrl: orderUrl };
    throw new Error("This payment link expired. Please start a new booking.");
  }
  const description = String(input.summary.service).slice(0, 400);
  const cancellationTerms = "Payment is for the selected vehicle and route. Driver allocation is confirmed after payment. If we cannot provide the service, your payment is refunded in full. Contact us for changes or cancellations.";
  const metadata = { purpose: "driver_quote_payment", order_id: input.id, payment_type: "full", due_fen: String(input.totalFen), total_fen: String(input.totalFen), linked_driver_order: "1", service: description, balance_due: "" };
  const session = await stripe.checkout.sessions.create({
    mode: "payment", client_reference_id: input.id, metadata, payment_intent_data: { metadata },
    ...(input.summary.email ? { customer_email: String(input.summary.email) } : {}),
    success_url: orderUrl + "?payment=returned", cancel_url: orderUrl + "?payment=cancelled",
    line_items: [{ quantity: 1, price_data: { currency: "cny", unit_amount: input.totalFen, product_data: { name: description } } }],
    custom_text: { submit: { message: cancellationTerms } },
  }, { idempotencyKey: `driver-direct-${input.id}` });
  if (!session.url) throw new Error("Stripe did not return a payment link.");
  const updated = await updateDriverOrder(input.id, current => {
    if (current.quote?.initial && current.quote.initial.id !== session.id) throw new Error("A payment already exists for this booking.");
    return { ...current, quote: { direct: true, bookingType: "transfer", totalFen: input.totalFen, description, cancellationTerms, balanceDue: "",
      initial: { id: session.id, url: session.url, dueFen: input.totalFen, type: "full", live: session.livemode, expiresAt: new Date(session.expires_at * 1000).toISOString() } } };
  });
  if (!updated) throw new Error("Could not save payment details.");
  return { orderPath, checkoutUrl: session.url };
}
