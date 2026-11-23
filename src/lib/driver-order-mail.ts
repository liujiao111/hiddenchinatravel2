// Plain-text operational emails: concise, scannable, no duplicated form dumps.
type MailInfo = {
  id: string; ref: string; name: string; email?: string; whatsapp?: string;
  service: string; route?: string; travelDate: string; pickup?: string; dropoff?: string;
  vehicle?: string; travellers: number; totalCents: number; dueCents: number;
  orderUrl: string; testOnly?: boolean; deposit?: boolean;
};
export function driverUnpaidEmail(v: MailInfo) {
  const tag = v.testOnly ? "[TEST][UNPAID]" : "[UNPAID]";
  const money = (c: number) => "USD " + (c/100).toFixed(2);
  return {
    subject: `${tag} Driver checkout — ${v.id.slice(0,8)} · ${v.name}`,
    text: [
      `${v.testOnly ? "INTERNAL PAYMENT TEST — NO TRANSPORT SERVICE" : "PRIVATE DRIVER ORDER"} | NOT PAID`,
      "Do not dispatch or confirm service before verifying payment and availability.",
      "",
      "ORDER",
      "Order ID: " + v.id,
      "Reference: " + v.ref,
      "Service: " + v.service,
      ...(v.route && !v.testOnly ? ["Route: " + v.route] : []),
      ...(v.testOnly ? [] : ["Date: " + v.travelDate, "Pickup: " + (v.pickup||"Pending"),
        "Drop-off: " + (v.dropoff||"Pending"), "Vehicle: " + (v.vehicle||"Pending"),
        "Travellers: " + v.travellers]),
      "",
      "CUSTOMER",
      "Name: " + v.name,
      "Email: " + (v.email||"Not provided"),
      "WhatsApp: " + (v.whatsapp||"Not provided"),
      "",
      "PAYMENT",
      "Order total: " + money(v.totalCents),
      "Due now: " + money(v.dueCents) + (v.deposit ? " (20% deposit)" : " (full payment)"),
      "Status: UNPAID — Checkout opened, no payment confirmed",
      "",
      "NEXT ACTION",
      v.testOnly ? "Wait for live US$1 test payment; never arrange a driver."
        : "Wait for the paid notification; then confirm availability and coordinate pickup.",
      "Private order page: " + v.orderUrl,
    ].join("\n"),
  };
}
export function driverPaidOperatorEmail(v: {
  orderId: string; service: string; paidCents: number; totalCents: number;
  paymentType: string; testOnly: boolean; checkoutId: string; paymentIntentId?: string;
  payerEmail?: string; orderUrl?: string;
}) {
  const money=(c:number)=>"USD "+(c/100).toFixed(2);
  return {
    subject: `${v.testOnly?"[TEST][PAID]":"[PAID]"} Driver payment — ${v.orderId.slice(0,8)} · ${money(v.paidCents)}`,
    text: [
      v.testOnly ? "INTERNAL LIVE PAYMENT VERIFICATION — NO TRANSPORT OR DISPATCH" : "PRIVATE DRIVER PAYMENT RECEIVED",
      "",
      "Status: PAID (confirmed by Stripe)",
      "Order ID: " + v.orderId,
      "Service: " + v.service,
      "Paid now: " + money(v.paidCents) + (v.paymentType==="deposit"?" (20% deposit)":""),
      "Order total: " + money(v.totalCents),
      "Remaining balance: " + money(Math.max(0,v.totalCents-v.paidCents)),
      "Payer email: " + (v.payerEmail||"Not provided"),
      "",
      "NEXT ACTION",
      v.testOnly ? "Verify order page and emails. Do not dispatch a driver."
        : "Contact the customer, confirm vehicle and driver arrangements, and send pickup instructions.",
      ...(v.orderUrl?["Private order page: "+v.orderUrl]:[]),
      "",
      "Stripe checkout: " + v.checkoutId,
      ...(v.paymentIntentId ? ["Stripe payment intent: "+v.paymentIntentId] : []),
    ].join("\n"),
  };
}
