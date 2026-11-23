import type { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  getDriverLiveTestPaymentLink,
  getDriverTestPaymentLink,
  getDriverStripeTestMode,
  getSiteUrl,
  getStripeTestClient,
  isDriverProductId,
} from "@/lib/stripe-test";

export const runtime = "nodejs";

const productNames: Record<string, string> = {
  "kunming-arrival": "Kunming arrival transfer",
  "dali-arrival": "Dali arrival transfer",
  "lijiang-arrival": "Lijiang arrival transfer",
  "shangri-la-arrival": "Shangri-La arrival transfer",
  "dali-lijiang-direct": "Dali to Lijiang direct transfer",
  "dali-lijiang-shaxi": "Dali to Lijiang via Shaxi",
  "lijiang-shangri-la": "Lijiang to Shangri-La transfer",
  "lijiang-tlg-shangri-la": "Lijiang to Shangri-La via Tiger Leaping Gorge",
  "kunming-day": "Kunming private day trip",
  "dali-day": "Dali private day trip",
  "lijiang-day": "Lijiang private day trip",
  "shangri-la-day": "Shangri-La private day trip",
};

export async function POST(request: NextRequest) {
  const mode = getDriverStripeTestMode();
  const stripe = getStripeTestClient();
  const paymentLink = mode === "live" ? getDriverLiveTestPaymentLink() : getDriverTestPaymentLink();
  if (!mode || (!stripe && !paymentLink)) {
    return Response.json({ error: "Stripe test checkout is disabled." }, { status: 503 });
  }
  if (mode === "live") {
    const expected = process.env.STRIPE_DRIVER_LIVE_TEST_TOKEN || "";
    const supplied = request.headers.get("x-driver-test-token") || "";
    if (!expected || expected.length !== supplied.length
      || !timingSafeEqual(Buffer.from(expected), Buffer.from(supplied))) {
      return Response.json({ error: "Production payment verification is unavailable." }, { status: 404 });
    }
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = input as { productId?: unknown; locale?: unknown };
  if (!isDriverProductId(body.productId)) {
    return Response.json({ error: "Unknown driver product." }, { status: 400 });
  }

  const locale = body.locale === "zh" ? "zh" : "en";
  const siteUrl = getSiteUrl(request.nextUrl.origin);
  const metadata = {
    purpose: "driver_test_deposit",
    product_id: body.productId,
    environment: "test",
  };

  if (!stripe && paymentLink) {
    paymentLink.searchParams.set("client_reference_id", `${mode === "live" ? "driver_live_test" : "driver_test"}_${body.productId}`);
    return Response.json({ url: paymentLink.toString(), mode });
  }

  if (!stripe) {
    return Response.json({ error: "Stripe test checkout is disabled." }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: 100,
        product_data: {
          name: "TEST — Yunnan Private Driver Deposit",
          description: `${productNames[body.productId]} · Stripe integration test only`,
          metadata,
        },
      },
    }],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${siteUrl}/${locale}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/yunnan-private-driver?payment=cancelled#standard-transfers`,
    custom_text: {
      submit: { message: "TEST MODE: this USD 1 checkout is not a valid booking or deposit." },
    },
  });

  if (!session.url) {
    return Response.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
  }

  return Response.json({ url: session.url });
}
