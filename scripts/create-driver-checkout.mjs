import { readFile } from "node:fs/promises";
import Stripe from "stripe";
import { readDriverOrder, updateDriverOrder } from "../src/lib/driver-orders.mjs";

const [filename, stage = "initial"] = process.argv.slice(2);
const key = process.env.STRIPE_SECRET_KEY;
if (!filename || !["initial", "balance"].includes(stage) || !/^sk_(test|live)_/.test(key ?? "")) {
  throw new Error("Set STRIPE_SECRET_KEY and run: node scripts/create-driver-checkout.mjs <confirmed-quote.json> [initial|balance]");
}

const quote = JSON.parse(await readFile(filename, "utf8"));
const { orderId, bookingType, totalFen, description, cancellationTerms, balanceDue, email } = quote;
if (typeof orderId !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(orderId)
  || !["transfer", "fixed-day", "flexible"].includes(bookingType)
  || !Number.isSafeInteger(totalFen) || totalFen < 5 || totalFen > 99999999
  || typeof description !== "string" || !description.trim() || description.length > 500
  || typeof cancellationTerms !== "string" || !cancellationTerms.trim() || cancellationTerms.length > 500) {
  throw new Error("A confirmed quote needs an order ID, booking type, total in CNY fen, service description and cancellation terms.");
}

const linked = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const order = linked ? (await readDriverOrder(orderId))?.order : null;
if (linked && !order) throw new Error("The booking request was not found in this environment.");
if (linked && (key.startsWith("sk_live_") !== ((process.env.VERCEL_ENV || process.env.DRIVER_ORDER_ENV) === "production"))) {
  throw new Error("Use a live key only for production orders and a test key for preview or development orders.");
}
if (linked && stage === "balance" && order.paid?.initial?.type !== "deposit") {
  throw new Error("The linked deposit must be confirmed by Stripe before issuing a balance link.");
}
if (order?.paid?.[stage]) throw new Error("This stage has already been paid.");
if (order?.quote && (order.quote.totalFen !== totalFen || order.quote.bookingType !== bookingType
  || order.quote.description !== description || order.quote.cancellationTerms !== cancellationTerms
  || order.quote.balanceDue !== (balanceDue || ""))) {
  throw new Error("The saved quote differs. Review the existing quote before issuing another checkout.");
}
const stripe = new Stripe(key);
const previousPayment = order?.quote?.[stage];
if (previousPayment) {
  const previousSession = await stripe.checkout.sessions.retrieve(previousPayment.id);
  if (previousSession.status !== "expired" || previousSession.payment_status !== "unpaid") {
    throw new Error("An existing Checkout session is open or paid. Review it in Stripe before reissuing.");
  }
}
const orderAccess = order?.access;
if (linked && !orderAccess) throw new Error("The order has no guest access link.");
const siteUrl = process.env.DRIVER_ORDER_SITE_URL;
if (orderAccess && !siteUrl) throw new Error("Set DRIVER_ORDER_SITE_URL to the site hosting the guest order page.");
const orderUrl = orderAccess ? new URL(`/driver-order/${orderAccess}`, siteUrl).href : null;

const deposit = bookingType === "flexible";
if (stage === "balance" && !deposit) throw new Error("Full-payment bookings have no balance.");
if (deposit && (typeof balanceDue !== "string" || !balanceDue.trim() || balanceDue.length > 160)) {
  throw new Error("Specify the agreed balance deadline in the quote.");
}

const depositFen = Math.round(totalFen / 5);
const paymentType = !deposit ? "full" : stage === "balance" ? "balance" : "deposit";
const dueFen = paymentType === "full" ? totalFen : paymentType === "deposit" ? depositFen : totalFen - depositFen;
const metadata = {
  purpose: "driver_quote_payment",
  order_id: orderId,
  payment_type: paymentType,
  due_fen: String(dueFen),
  ...(linked ? { linked_driver_order: "1" } : {}),
  total_fen: String(totalFen),
  service: description,
  balance_due: deposit ? balanceDue : "",
};
const balanceNotice = paymentType === "deposit"
  ? ` Balance: CNY ${((totalFen - dueFen) / 100).toFixed(2)}. Due: ${balanceDue}.` : "";
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  client_reference_id: orderId,
  ...(email || order?.summary.email ? { customer_email: email || order.summary.email } : {}),
  ...(orderUrl ? { success_url: orderUrl, cancel_url: orderUrl } : {}),
  metadata,
  payment_intent_data: { metadata },
  line_items: [{
    quantity: 1,
    price_data: {
      currency: "cny",
      unit_amount: dueFen,
      product_data: { name: `Yunnan private driver · ${orderId} · ${paymentType}`, description },
    },
  }],
  custom_text: { submit: { message: cancellationTerms + balanceNotice } },
}, { idempotencyKey: `driver-checkout-${orderId}-${paymentType}${previousPayment ? `-${previousPayment.id}` : ""}` });

if (!session.url) throw new Error("Stripe returned no checkout URL.");
if (linked) {
  const checkout = { id: session.id, url: session.url, dueFen, type: paymentType,
    live: session.livemode, expiresAt: new Date(session.expires_at * 1000).toISOString() };
  const updated = await updateDriverOrder(orderId, current => {
    const currentId = current.quote?.[stage]?.id;
    if (current.paid?.[stage] || (currentId !== previousPayment?.id && currentId !== session.id)) {
      throw new Error("Another payment session was already saved for this order.");
    }
    return { ...current, quote: { ...current.quote, bookingType, totalFen, description, cancellationTerms,
      balanceDue: balanceDue || "", [stage]: checkout } };
  });
  if (!updated) throw new Error("The quote could not be linked to the order.");
}

console.log(JSON.stringify({
  mode: key.startsWith("sk_live_") ? "live" : "test",
  orderId, paymentType, dueFen, balanceFen: paymentType === "deposit" ? totalFen - depositFen : 0,
  checkoutUrl: session.url, sessionId: session.id, ...(orderUrl ? { orderUrl } : {}),
  expiresAt: new Date(session.expires_at * 1000).toISOString(),
}, null, 2));
