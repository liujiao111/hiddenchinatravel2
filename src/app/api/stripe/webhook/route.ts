import Stripe from "stripe";
import { getEnquiryMailConfig } from "@/lib/enquiry-mail";
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
  const isQuote = metadata?.purpose === "driver_quote_payment";
  const isLiveTest = event.livemode
    && metadata?.purpose === "production_payment_verification"
    && session.payment_link === process.env.STRIPE_DRIVER_LIVE_TEST_PAYMENT_LINK_ID;
  const productId = metadata?.purpose === "driver_test_deposit"
    ? metadata.product_id
    : isLiveTest
      ? session.client_reference_id?.match(/^driver_live_test_(.+)$/)?.[1]
    : session.payment_link
      ? session.client_reference_id?.match(/^driver_test_(.+)$/)?.[1]
      : undefined;

  let subject: string;
  let details: string[];
  let notificationOrder: { id: string; stage: "initial" | "balance" } | undefined;
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
      || session.amount_total !== due || session.currency !== "usd"
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
        if (updated.paid?.[stage]?.notificationSentAt && (!updated.summary?.email || updated.paid?.[stage]?.customerNotificationSentAt)) return Response.json({ received: true });
        notificationOrder = { id: metadata.order_id, stage };
      } catch {
        console.error("[stripe-driver] Could not record paid order", { eventId: event.id });
        return new Response("Could not record order payment.", { status: 503 });
      }
    }
    subject = metadata.test_only === "1"
      ? `[Stripe ${event.livemode ? "LIVE" : "sandbox"} TEST] US$1 full-order verification paid — ${metadata.order_id}`
      : `${event.livemode ? "[Stripe]" : "[Stripe sandbox]"} Driver payment received — ${metadata.order_id}`;
    details = [
      ...(metadata.test_only === "1" ? ["PAYMENT VERIFICATION ONLY — NO TRANSPORT OR BOOKING TO DISPATCH"] : []),
      `Order: ${metadata.order_id}`,
      `Service: ${metadata.service}`,
      `Payment: ${type} · USD ${(due / 100).toFixed(2)}`,
      `Quoted total: USD ${(total / 100).toFixed(2)}`,
      ...(type === "deposit" ? [`Balance: USD ${((total - due) / 100).toFixed(2)} · Due: ${metadata.balance_due}`] : []),
    ];
  } else {
    if (session.amount_total !== 100 || session.currency !== "usd" || !isDriverProductId(productId)
      || (event.livemode ? !isLiveTest : metadata?.purpose === "production_payment_verification")) {
      return Response.json({ received: true });
    }
    subject = `${event.livemode ? "[Stripe production test]" : "[Stripe sandbox]"} Driver payment received — ${productId}`;
    details = event.livemode ? [
      "Stripe verified a real USD 1.00 production payment. Refund this verification charge after review.",
      `Service: ${productId}`,
      "This verification payment is not a valid booking or deposit.",
    ] : [
      "Stripe verified a USD 1.00 sandbox payment. This is not a paid booking.",
      `Service: ${productId}`,
      "The test checkout carries no order number or pickup details.",
    ];
  }

  const { apiKey, from, to } = getEnquiryMailConfig();
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
    if (notificationOrder) {
      const { id, stage } = notificationOrder;
      const updated = await updateDriverOrder(id, current => ({
        ...current,
        paid: { ...current.paid, [stage]: {
          ...current.paid[stage], notificationSentAt: new Date().toISOString(),
        } },
      }));
      if (!updated) throw new Error("Could not record notification delivery");
      const recipient = typeof updated.summary?.email === "string" ? updated.summary.email : "";
      if (recipient && !updated.paid?.[stage]?.customerNotificationSentAt) {
        const link = "https://hiddenchinatravel.com/driver-order/" + updated.access;
        const isZh = updated.summary?.locale === "zh";
        const testOnly = updated.quote?.testOnly === true && metadata?.test_only === "1";
        const message = (testOnly
          ? (isZh ? "已收到 US$1 正式测试款。此订单仅验证支付系统，不包含包车、接送或有效预订。金额：" : "Your US$1 LIVE payment verification succeeded. This is a test only: NO transport or booking is included. Paid amount: ")
          : (isZh ? "已收到您的包车付款。金额：" : "Your private-driver payment has been received. Paid amount: "))
          + "USD " + (Number(metadata?.due_fen) / 100).toFixed(2)
          + (isZh ? "；订单总价：" : "; total: ") + "USD " + (Number(metadata?.total_fen) / 100).toFixed(2)
          + "\\n" + (isZh ? "订单与接车信息：" : "Order and pickup details: ") + link
          + (testOnly ? "" : "\\n" + (isZh ? "付款不代表已安排司机，待确认车辆；无法提供服务会退款。" : "Vehicle and driver allocation are pending. If unavailable, your payment will be refunded."));
        const guestResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json",
            "Idempotency-Key": "driver-payment-guest-" + session.id },
          body: JSON.stringify({ from, to: [recipient], reply_to: to,
            subject: testOnly ? (isZh ? "Hidden China Travel · US$1 测试支付成功" : "Hidden China Travel — US$1 payment verification successful") : (isZh ? "Hidden China Travel 包车付款确认" : "Hidden China Travel — driver payment received"),
            text: message }),
          signal: AbortSignal.timeout(5_000),
        });
        if (!guestResponse.ok) {
          console.error("[stripe-driver] Guest payment email rejected", { status: guestResponse.status });
          return new Response("Could not notify guest of payment.", { status: 502 });
        }
        const receipt = await updateDriverOrder(id, current => ({
          ...current,
          paid: { ...current.paid, [stage]: {
            ...current.paid[stage], customerNotificationSentAt: new Date().toISOString(),
          } },
        }));
        if (!receipt) throw new Error("Could not record guest payment email");
      }
    }
  } catch {
    console.error("[stripe-test] Payment notification request failed");
    return new Response("Could not send payment notification.", { status: 502 });
  }

  return Response.json({ received: true });
}
