import { createDriverPaymentRecord, getDriverPaymentRecord } from "@/lib/driver-payment-records.mjs";

type PaidOrder = {
  id: string; summary?: { productId?: string; gaClientId?: string };
  quote?: { totalFen?: number; initial?: { id?: string }; balance?: { id?: string } };
  paid?: { initial?: { amount?: number }; balance?: { amount?: number } };
};

/**
 * Optional GA4 Measurement Protocol delivery. The browser return page provides a
 * same-transaction fallback until GA4_MP_API_SECRET is configured in Vercel.
 * NEVER treat a Stripe redirect or front-end input as proof of payment.
 */
export async function reportVerifiedDriverPurchase(
  order: PaidOrder, stage: "initial" | "balance", stripeSessionId: string,
  amountFen: number, paymentType: "full" | "deposit" | "balance",
) {
  const secret = process.env.GA4_MP_API_SECRET;
  const measurement = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clientId = order.summary?.gaClientId;
  if (!secret || !/^G-[A-Z0-9]+$/.test(measurement || "")
    || !/^\d{5,15}\.\d{5,15}$/.test(clientId || "")) return false;
  if (!/^cs_(live|test)_[A-Za-z0-9_]+$/.test(stripeSessionId)
    || !Number.isSafeInteger(amountFen) || amountFen <= 0
    || order.quote?.[stage]?.id !== stripeSessionId || order.paid?.[stage]?.amount !== amountFen) return false;
  const marker = await getDriverPaymentRecord(order.id,stage,"ga4-purchase");
  if (marker) return true;
  const productId = String(order.summary?.productId || "private-driver").replace(/[^a-z0-9_-]/g,"").slice(0,80);
  const value = amountFen / 100;
  const url = new URL("https://www.google-analytics.com/mp/collect");
  url.searchParams.set("measurement_id",measurement!);
  url.searchParams.set("api_secret",secret);
  const response = await fetch(url,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({client_id:clientId,events:[{name:"purchase",params:{
      transaction_id:stripeSessionId,currency:"USD",value,payment_type:paymentType,
      engagement_time_msec:1,items:[{item_id:productId,item_name:productId,price:value,quantity:1}],
    }}]}),
    signal:AbortSignal.timeout(3500),cache:"no-store",
  });
  if (!response.ok) throw new Error("GA4 MP rejected verified purchase with HTTP "+response.status);
  await createDriverPaymentRecord(order.id,stage,"ga4-purchase",{at:new Date().toISOString(),sessionId:stripeSessionId});
  return true;
}
