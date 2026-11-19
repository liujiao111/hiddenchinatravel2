import Stripe from "stripe";
import { driverOrdersEnabled, updateDriverOrder } from "@/lib/driver-orders.mjs";
import { isDriverProductId } from "@/lib/stripe-test";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const testSecret = process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED === "true"
    ? process.env.STRIPE_WEBHOOK_SECRET : undefined;
  const liveSecret = process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET;
  const signingKeys = [
    { secret: liveSecret, live: true },
    { secret: testSecret, live: false },
  ];
  if (!signingKeys.some(({ secret }) => secret?.startsWith("whsec_"))) {
    return new Response("Stripe webhook is disabled.", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing Stripe signature.", { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event | undefined;
  for (const { secret, live } of signingKeys) {
    if (!secret?.startsWith("whsec_")) continue;
    try {
      const verified = Stripe.webhooks.constructEvent(payload, signature, secret);
      if (verified.livemode === live) {
        event = verified;
        break;
      }
    } catch {
      // The other endpoint may be responsible for this event.
    }
  }
  if (!event) return new Response("Invalid Stripe signature.", { status: 400 });
  if (event.type !== "checkout.session.completed"
    && event.type !== "checkout.session.async_payment_succeeded") {
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") return Response.json({ received: true });
  const metadata = session.metadata;
  // Stripe Test Payment Link checkout carries order ID in client_reference_id rather
  // than metadata; this is the original sandbox mechanism from the old branch.
  if (!event.livemode && session.payment_link && metadata?.purpose !== "kunming_transfer_preview_checkout"
      && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.client_reference_id || "")
      && session.amount_total === 100 && session.currency === "usd") {
    const orderId = session.client_reference_id!;
    try {
      if (!driverOrdersEnabled()) throw new Error("Order storage missing");
      const updated = await updateDriverOrder(orderId, current => {
        if (current.summary?.productId !== "kunming-arrival"
            || current.testCheckout?.paymentMethod !== "test_payment_link"
            || current.testCheckout?.amount !== 100 || current.testCheckout?.currency !== "usd") {
          throw new Error("Test payment link does not belong to Kunming order");
        }
        if (current.paid?.test) return current;
        return {
          ...current,
          testCheckout: { ...current.testCheckout, status: "paid", sessionId: session.id },
          paid: { ...current.paid, test: {
            type: "sandbox", amount: 100, currency: "usd", sessionId: session.id,
            eventId: event.id, paidAt: new Date(event.created * 1000).toISOString(),
          } },
        };
      });
      if (!updated) throw new Error("Missing driver order");
      return Response.json({ received: true });
    } catch (error) {
      console.error("[kunming-test-payment-link] Order reconciliation failed", {
        eventId: event.id, reason: error instanceof Error ? error.message : "unknown",
      });
      return new Response("Could not record sandbox order payment.", { status: 503 });
    }
  }
  if (metadata?.purpose === "kunming_transfer_preview_checkout") {
    const orderId = metadata.order_id ?? "";
    if (event.livemode || session.livemode || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)
        || metadata.product_id !== "kunming-arrival" || metadata.environment !== "preview"
        || session.client_reference_id !== orderId || session.amount_total !== 100 || session.currency !== "usd"
        || !/^HCT-\d{8}-[A-F0-9]{16}$/.test(metadata.lead_ref ?? "")) {
      console.error("[kunming-preview] Unexpected signed checkout", { eventId: event.id });
      return new Response("Preview checkout does not match order.", { status: 422 });
    }
    try {
      if (!driverOrdersEnabled()) throw new Error("Order storage unavailable");
      const updated = await updateDriverOrder(orderId, current => {
        if (current.summary?.productId !== "kunming-arrival" || current.summary?.ref !== metadata.lead_ref
            || current.testCheckout?.sessionId !== session.id || current.testCheckout?.amount !== 100
            || current.testCheckout?.currency !== "usd") throw new Error("Saved order mismatch");
        if (current.paid?.test) return current; // webhook retries must not double-book or double-count
        return {
          ...current,
          testCheckout: { ...current.testCheckout, status: "paid" },
          paid: { ...current.paid, test: {
            type: "sandbox", amount: 100, currency: "usd", sessionId: session.id,
            eventId: event.id, paidAt: new Date(event.created * 1000).toISOString(),
          } },
        };
      });
      if (!updated) throw new Error("No matching saved order");
    } catch (error) {
      console.error("[kunming-preview] Could not persist payment", { eventId: event.id, reason: error instanceof Error ? error.message : "unknown" });
      return new Response("Could not persist sandbox payment.", { status: 503 });
    }
    // Payment is already recorded. Email notification is secondary and must not undo it.
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CUSTOM_JOURNEY_FROM_EMAIL || process.env.ENQUIRY_FROM_EMAIL;
    if (apiKey && from) {
      try {
        const mail = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json",
            "Idempotency-Key": `kunming-preview-payment-${session.id}`,
          },
          body: JSON.stringify({
            from, to: [process.env.CUSTOM_JOURNEY_TO_EMAIL || "joy.liu@hiddenchinatravel.com"],
            subject: `[Stripe sandbox] Kunming test order paid — ${orderId}`,
            text: [
              "Stripe confirmed a USD 1.00 SANDBOX payment. No real transfer has been booked.",
              `Order: ${orderId}`, `Ref: ${metadata.lead_ref}`,
              `Product: ${metadata.product_id}`, `Checkout: ${session.id}`,
              `Customer email: ${session.customer_details?.email || session.customer_email || "Not available"}`,
            ].join("\n"),
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!mail.ok) console.error("[kunming-preview] Payment alert email rejected", mail.status);
      } catch {
        console.error("[kunming-preview] Payment alert email unavailable");
      }
    }
    return Response.json({ received: true });
  }
  const isQuote = metadata?.purpose === "driver_quote_payment";
  const productId = metadata?.purpose === "driver_test_deposit"
    ? metadata.product_id
    : session.payment_link
      ? session.client_reference_id?.match(/^driver_test_(.+)$/)?.[1]
      : undefined;

  let subject: string;
  let details: string[];
  if (isQuote && metadata) {
    const total = Number(metadata.total_fen);
    const due = Number(metadata.due_fen);
    const deposit = Math.round(total / 5);
    const type = metadata.payment_type;
    const expected = type === "full" ? total : type === "deposit" ? deposit
      : type === "balance" ? total - deposit : 0;
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(metadata.order_id ?? "")
      || session.client_reference_id !== metadata.order_id
      || !Number.isSafeInteger(total) || total < 5 || due <= 0 || due !== expected
      || session.amount_total !== due || session.currency !== "cny"
      || (type !== "full" && !metadata.balance_due?.trim())) {
      console.error("[stripe-driver] Quote payment needs reconciliation", { eventId: event.id });
      return new Response("Quote payment needs reconciliation.", { status: 422 });
    }
    if (metadata.linked_driver_order === "1") {
      try {
        if (!driverOrdersEnabled()) throw new Error("Order storage unavailable");
        const stage = type === "balance" ? "balance" : "initial";
        const updated = await updateDriverOrder(metadata.order_id, current => {
          const payment = current.quote?.[stage];
          if (current.quote?.totalFen !== total || payment?.id !== session.id || payment.dueFen !== due
            || payment.type !== type || payment.live !== event.livemode) {
            throw new Error("Payment does not match saved order");
          }
          if (current.paid?.[stage]) return current;
          return { ...current, paid: { ...current.paid, [stage]: {
            type, amount: due, eventId: event.id, paidAt: new Date(event.created * 1000).toISOString(),
          } } };
        });
        if (!updated) throw new Error("Order not found");
      } catch {
        console.error("[stripe-driver] Could not record paid order", { eventId: event.id });
        return new Response("Could not record order payment.", { status: 503 });
      }
    }
    subject = `${event.livemode ? "[Stripe]" : "[Stripe sandbox]"} Driver payment received — ${metadata.order_id}`;
    details = [
      `Order: ${metadata.order_id}`,
      `Service: ${metadata.service}`,
      `Payment: ${type} · CNY ${(due / 100).toFixed(2)}`,
      `Quoted total: CNY ${(total / 100).toFixed(2)}`,
      ...(type === "deposit" ? [`Balance: CNY ${((total - due) / 100).toFixed(2)} · Due: ${metadata.balance_due}`] : []),
    ];
  } else {
    if (event.livemode || session.amount_total !== 100
      || session.currency !== "usd" || !isDriverProductId(productId)) {
      return Response.json({ received: true });
    }
    subject = `[Stripe sandbox] Driver payment received — ${productId}`;
    details = [
      "Stripe verified a USD 1.00 sandbox payment. This is not a paid booking.",
      `Service: ${productId}`,
      "The test checkout carries no order number or pickup details.",
    ];
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
        "Idempotency-Key": `driver-${isQuote ? "quote" : "test"}-payment-${session.id}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: [
          ...details,
          `Checkout session: ${session.id}`,
          `Payment intent: ${paymentIntentId || "Unavailable"}`,
          `Payer email: ${session.customer_details?.email || session.customer_email || "Unavailable"}`,
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
