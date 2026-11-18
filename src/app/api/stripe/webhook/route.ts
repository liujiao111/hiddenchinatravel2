import Stripe from "stripe";

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
  } catch (error) {
    console.error("[stripe-test] Invalid webhook signature", error);
    return new Response("Invalid Stripe signature.", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed"
    || event.type === "checkout.session.async_payment_succeeded"
    || event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.purpose === "driver_test_deposit") {
      console.info("[stripe-test] Driver checkout event", {
        eventId: event.id,
        eventType: event.type,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        productId: session.metadata.product_id,
      });
    }
  }

  return Response.json({ received: true });
}
