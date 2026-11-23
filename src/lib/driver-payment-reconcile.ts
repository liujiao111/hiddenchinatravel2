import Stripe from "stripe";
import { getEnquiryMailConfig } from "@/lib/enquiry-mail";
import { driverPaidOperatorEmail } from "@/lib/driver-order-mail";
import { createDriverPaymentRecord, getDriverPaymentRecord } from "@/lib/driver-payment-records.mjs";
import { readDriverOrder } from "@/lib/driver-orders.mjs";

type StoredOrder = { id:string; quote?:any; summary?:any; access?:string; paid?:any };

/**
 * Repair an order from the Stripe API after a webhook delivery failed.
 * Only call after validating the HMAC signed private order URL. A browser redirect
 * alone is never considered proof of payment. Nothing is charged here.
 */
export async function reconcileVerifiedDriverPayment(order: StoredOrder) {
  const stage = "initial";
  const quote = order.quote?.initial;
  if (!quote?.id || typeof quote.id !== "string") return;
  const existingPaid = await getDriverPaymentRecord(order.id,stage,"paid");
  if (!existingPaid && !process.env.STRIPE_SECRET_KEY?.startsWith(
    process.env.VERCEL_ENV === "production" ? "sk_live_" : "sk_test_")) return;

  let session: Stripe.Checkout.Session;
  if (existingPaid) {
    // With an immutable paid receipt, keep working on unsent emails only.
    const [operator,guest] = await Promise.all([
      getDriverPaymentRecord(order.id,stage,"operator-email"),
      getDriverPaymentRecord(order.id,stage,"customer-email"),
    ]);
    if (operator && (!order.summary?.email || guest)) return;
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  session = await stripe.checkout.sessions.retrieve(quote.id);
  const metadata = session.metadata;
  const due = quote.dueFen;
  const total = order.quote.totalFen;
  if (session.payment_status !== "paid" || session.status !== "complete") return;
  if (session.id !== quote.id || session.client_reference_id !== order.id
    || session.currency !== "usd" || session.amount_total !== due
    || session.livemode !== (process.env.VERCEL_ENV === "production")
    || metadata?.purpose !== "driver_quote_payment"
    || metadata.order_id !== order.id || metadata.linked_driver_order !== "1"
    || Number(metadata.due_fen) !== due || Number(metadata.total_fen) !== total
    || metadata.payment_type !== quote.type
    || (metadata.test_only === "1") !== (order.quote.testOnly === true)
    || (quote.type === "deposit" && due !== Math.round(total/5))) {
    console.error("[driver-reconcile] Rejected mismatched Stripe session",{orderId:order.id});
    return;
  }
  if (!existingPaid) {
    const record = await createDriverPaymentRecord(order.id,stage,"paid",{
      type: quote.type,amount:due,sessionId:session.id,
      eventId:"stripe-api-confirmed:"+session.id,
      paidAt:new Date((session.created || Math.floor(Date.now()/1000))*1000).toISOString(),
    });
    if (record.sessionId !== session.id || record.amount !== due) throw new Error("Conflicting payment receipt");
  }
  const {apiKey,from,to} = getEnquiryMailConfig();
  if (!apiKey || !from || !to) {
    console.error("[driver-reconcile] Email service is not configured");
    return;
  }
  const operatorSent = await getDriverPaymentRecord(order.id,stage,"operator-email");
  if (!operatorSent) {
    const paymentIntentId = typeof session.payment_intent==="string" ? session.payment_intent : session.payment_intent?.id;
    const mail = driverPaidOperatorEmail({
      orderId:order.id,service:String(metadata.service || order.summary?.service || ""),
      paidCents:due,totalCents:total,paymentType:quote.type,
      testOnly:order.quote.testOnly===true,checkoutId:session.id,
      paymentIntentId,payerEmail:session.customer_details?.email || session.customer_email || undefined,
      orderUrl:"https://hiddenchinatravel.com/driver-order/"+order.access,
    });
    const sent = await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json",
        "Idempotency-Key":"driver-quote-payment-"+session.id},
      body:JSON.stringify({from,to:[to],subject:mail.subject,text:mail.text}),
      signal:AbortSignal.timeout(5000),
    });
    if (!sent.ok) {
      console.error("[driver-reconcile] Operator payment email rejected",{status:sent.status});
      return;
    }
    await createDriverPaymentRecord(order.id,stage,"operator-email",{at:new Date().toISOString(),sessionId:session.id});
  }
  const guestSent=await getDriverPaymentRecord(order.id,stage,"customer-email");
  const recipient=String(order.summary?.email || "").trim();
  if (recipient && !guestSent) {
    const zh=order.summary?.locale==="zh";
    const testOnly=order.quote.testOnly===true;
    const message = (testOnly
      ? (zh ? "US$1 正式测试支付成功。此订单不包含任何交通或旅行服务。" :
        "US$1 live payment test successful. No transportation or reservation is included.")
      : (zh ? "已收到您的包车付款。车辆和司机安排尚待确认。" :
        "Your private-driver payment was received. Driver allocation is pending."))
      + "\n" + (zh ? "本次付款：" : "Paid now: ") + "USD " + (due/100).toFixed(2)
      + "\n" + (zh ? "订单总价：" : "Order total: ") + "USD " + (total/100).toFixed(2)
      + "\n" + (zh ? "查看订单：" : "View order: ")
      + "https://hiddenchinatravel.com/driver-order/"+order.access;
    const sent=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json",
        "Idempotency-Key":"driver-payment-guest-"+session.id},
      body:JSON.stringify({from,to:[recipient],reply_to:to,
        subject:testOnly
          ? (zh?"Hidden China Travel · US$1 测试支付成功":"Hidden China Travel — US$1 payment verification successful")
          : (zh?"Hidden China Travel 包车付款确认":"Hidden China Travel — driver payment received"),
        text:message}),
      signal:AbortSignal.timeout(5000),
    });
    if(!sent.ok) {
      console.error("[driver-reconcile] Guest payment email rejected",{status:sent.status});
      return;
    }
    await createDriverPaymentRecord(order.id,stage,"customer-email",{at:new Date().toISOString(),sessionId:session.id});
  }
}
