import Stripe from "stripe";
import { PURPOSE as EXPERIENCE_LIVE_PURPOSE, settleExperienceTest } from "@/lib/experience-live-test";
import { getEnquiryMailConfig } from "@/lib/enquiry-mail";
import { driverOrdersEnabled, readDriverOrder } from "@/lib/driver-orders.mjs";
import { createDriverPaymentRecord, getDriverPaymentRecord } from "@/lib/driver-payment-records.mjs";
import { isDriverProductId } from "@/lib/stripe-test";
import { driverPaidOperatorEmail } from "@/lib/driver-order-mail";
import { reportVerifiedDriverPurchase } from "@/lib/driver-ga4-purchase";

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
  if (metadata?.purpose === EXPERIENCE_LIVE_PURPOSE) return settleExperienceTest(session,event.livemode,event.id);
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
  let operatorAlreadySent = false;
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
        const saved = await readDriverOrder(metadata.order_id);
        if (!saved) throw new Error("Order not found");
        const payment = saved.order.quote?.[stage];
        if (saved.order.quote?.totalFen !== total || payment?.id !== session.id ||
            payment.dueFen !== due || payment.type !== type || payment.live !== event.livemode ||
            (metadata.test_only === "1") !== (saved.order.quote?.testOnly === true)) {
          throw new Error("Payment does not match saved order");
        }
        const receipt = await createDriverPaymentRecord(metadata.order_id,stage,"paid",{
          type,amount:due,eventId:event.id,sessionId:session.id,
          paidAt:new Date(event.created*1000).toISOString(),
        });
        if (receipt.sessionId !== session.id || receipt.amount !== due) {
          throw new Error("Conflicting paid receipt");
        }
        // Analytics failure must never block verified payments or customer notification.
        try {
          const verified = await readDriverOrder(metadata.order_id);
          if (verified) await reportVerifiedDriverPurchase(verified.order,stage,session.id,due,
            type as "full" | "deposit" | "balance");
        } catch {
          console.error("[stripe-driver] GA4 purchase reporting unavailable");
        }
        const operatorSent = await getDriverPaymentRecord(metadata.order_id,stage,"operator-email");
        operatorAlreadySent = Boolean(operatorSent);
        const customerSent = await getDriverPaymentRecord(metadata.order_id,stage,"customer-email");
        if (operatorSent && (!saved.order.summary?.email || customerSent)) return Response.json({received:true});
        notificationOrder = { id: metadata.order_id, stage };
      } catch {
        console.error("[stripe-driver] Could not record paid order", { eventId: event.id });
        return new Response("Could not record order payment.", { status: 503 });
      }
    }
    const opsMail = driverPaidOperatorEmail({
      orderId: metadata.order_id, service: String(metadata.service || ""),
      paidCents: due, totalCents: total, paymentType: type,
      testOnly: metadata.test_only === "1", checkoutId: session.id,
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      payerEmail: session.customer_details?.email || session.customer_email || undefined,
      orderUrl: "https://hiddenchinatravel.com/driver-order/" + (await readDriverOrder(metadata.order_id))?.order.access,
    });
    subject = opsMail.subject;
    details = [opsMail.text];
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
    if (!operatorAlreadySent) {
      const response = await fetch("https://api.resend.com/emails", {
        method:"POST",
        headers:{
          Authorization:`Bearer ${apiKey}`,
          "Content-Type":"application/json",
          "Idempotency-Key":`driver-${isQuote?"quote":"test"}-payment-${session.id}`,
        },
        body:JSON.stringify({from,to:[to],subject,text:[
          ...details,
          ...(!isQuote ? [
            `Checkout session: ${session.id}`,
            `Payment intent: ${paymentIntentId||"Unavailable"}`,
            `Payer email: ${session.customer_details?.email||session.customer_email||"Unavailable"}`,
          ]:[]),
        ].join("\n")}),
        signal:AbortSignal.timeout(5000),
      });
      if(!response.ok) {
        console.error("[stripe-driver] Operator payment email rejected",{status:response.status});
        return new Response("Could not send payment notification.",{status:502});
      }
      if(notificationOrder) await createDriverPaymentRecord(notificationOrder.id,notificationOrder.stage,
        "operator-email",{at:new Date().toISOString(),sessionId:session.id});
    }
    if (notificationOrder) {
      const { id, stage } = notificationOrder;
      const current = await readDriverOrder(id);
      if (!current) throw new Error("Order missing after payment");
      const recipient = typeof current.order.summary?.email === "string" ? current.order.summary.email : "";
      if (recipient && !current.order.paid?.[stage]?.customerNotificationSentAt) {
        const link = "https://hiddenchinatravel.com/driver-order/" + current.order.access;
        const isZh = current.order.summary?.locale === "zh";
        const testOnly = current.order.quote?.testOnly === true && metadata?.test_only === "1";
        const amount = (Number(metadata?.due_fen)/100).toFixed(2);
        const totalDisplay = (Number(metadata?.total_fen)/100).toFixed(2);
        const text = testOnly
          ? (isZh ? "US$1 正式测试支付成功。此订单不包含任何交通或旅行服务。"
            : "US$1 live payment test successful. No transportation or reservation is included.")
          : (isZh ? "已收到您的包车付款。车辆和司机安排尚待确认。"
            : "Your private-driver payment was received. Driver allocation is pending.");
        const message = text + "\\n" + (isZh ? "本次付款：" : "Paid now: ") + "USD " + amount
          + "\\n" + (isZh ? "订单总价：" : "Order total: ") + "USD " + totalDisplay
          + "\\n" + (isZh ? "查看订单：" : "View order: ") + link;
        const guestResponse = await fetch("https://api.resend.com/emails", {
          method:"POST",
          headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json",
            "Idempotency-Key":"driver-payment-guest-"+session.id},
          body:JSON.stringify({from,to:[recipient],reply_to:to,
            subject:testOnly ? (isZh ? "Hidden China Travel · US$1 测试支付成功" : "Hidden China Travel — US$1 payment verification successful")
              : (isZh ? "Hidden China Travel 包车付款确认" : "Hidden China Travel — driver payment received"),
            text:message}),
          signal:AbortSignal.timeout(5000),
        });
        if(!guestResponse.ok) {
          console.error("[stripe-driver] Guest payment email rejected",{status:guestResponse.status});
          // The operator receipt remains stored, so a Stripe retry cannot send it again.
          return new Response("Could not notify guest of payment.",{status:502});
        }
        await createDriverPaymentRecord(id,stage,"customer-email",{at:new Date().toISOString(),sessionId:session.id});
      }
    }
  } catch {
    console.error("[stripe-test] Payment notification request failed");
    return new Response("Could not send payment notification.", { status: 502 });
  }

  return Response.json({ received: true });
}
