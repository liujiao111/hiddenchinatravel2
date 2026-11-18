import Stripe from "stripe";
import { isDriverProductId } from "@/lib/stripe-test";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED !== "true"
    || !webhookSecret?.startsWith("whsec_")) {
    return new Response("Stripe test webhook is disabled.", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing Stripe signature.", { status: 400 });

  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    console.error("[stripe-test] Invalid webhook signature");
    return new Response("Invalid Stripe signature.", { status: 400 });
  }

  if (event.livemode || (
    event.type !== "checkout.session.completed"
    && event.type !== "checkout.session.async_payment_succeeded"
  )) {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const productId = session.metadata?.purpose === "driver_test_deposit"
    ? session.metadata.product_id
    : session.payment_link
      ? session.client_reference_id?.match(/^driver_test_(.+)$/)?.[1]
      : undefined;

  if (session.payment_status !== "paid" || session.amount_total !== 100
    || session.currency !== "usd" || !isDriverProductId(productId)) {
    return Response.json({ received: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CUSTOM_JOURNEY_FROM_EMAIL || process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.CUSTOM_JOURNEY_TO_EMAIL || "joy.liu@hiddenchinatravel.com";
  if (!apiKey || !from) {
    console.error("[stripe-test] Payment notification email is not configured");
    return new Response("Payment notification email is not configured.", { status: 503 });
  }

  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `driver-test-payment-${session.id}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[Stripe sandbox] Driver payment received — ${productId}`,
        text: [
          "Stripe verified a USD 1.00 sandbox payment. This is not a paid booking.",
          `Service: ${productId}`,
          `Checkout session: ${session.id}`,
          `Payment intent: ${paymentIntentId || "Unavailable"}`,
          `Payer email: ${session.customer_details?.email || session.customer_email || "Unavailable"}`,
          "The test checkout carries no order number or pickup details.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      console.error("[stripe-test] Payment notification rejected", { status: response.status });
      return new Response("Could not send payment notification.", { status: 502 });
    }
  } catch {
    console.error("[stripe-test] Payment notification request failed");
    return new Response("Could not send payment notification.", { status: 502 });
  }

  return Response.json({ received: true });
}
