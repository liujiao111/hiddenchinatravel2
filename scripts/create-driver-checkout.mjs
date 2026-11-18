import { readFile } from "node:fs/promises";
import Stripe from "stripe";

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
  total_fen: String(totalFen),
  service: description,
  balance_due: deposit ? balanceDue : "",
};
const balanceNotice = paymentType === "deposit"
  ? ` Balance: CNY ${((totalFen - dueFen) / 100).toFixed(2)}. Due: ${balanceDue}.` : "";
const stripe = new Stripe(key);
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  payment_method_types: ["card"],
  client_reference_id: orderId,
  ...(email ? { customer_email: email } : {}),
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
}, { idempotencyKey: `driver-checkout-${orderId}-${paymentType}` });

console.log(JSON.stringify({
  mode: key.startsWith("sk_live_") ? "live" : "test",
  orderId, paymentType, dueFen, balanceFen: paymentType === "deposit" ? totalFen - depositFen : 0,
  checkoutUrl: session.url, sessionId: session.id,
  expiresAt: new Date(session.expires_at * 1000).toISOString(),
}, null, 2));
