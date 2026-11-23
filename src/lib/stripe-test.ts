import "server-only";
import Stripe from "stripe";

export const driverProductIds = [
  "kunming-arrival",
  "dali-arrival",
  "lijiang-arrival",
  "shangri-la-arrival",
  "dali-lijiang-direct",
  "dali-lijiang-shaxi",
  "lijiang-shangri-la",
  "lijiang-tlg-shangri-la",
  "kunming-day",
  "dali-day",
  "lijiang-day",
  "shangri-la-day",
] as const;

export type DriverProductId = (typeof driverProductIds)[number];

export function isDriverProductId(value: unknown): value is DriverProductId {
  return typeof value === "string" && driverProductIds.includes(value as DriverProductId);
}

export function isDriverStripeTestEnabled() {
  return getDriverStripeTestMode() !== null;
}

export type DriverStripeTestMode = "sandbox" | "live";

export function getDriverStripeTestMode(): DriverStripeTestMode | null {
  if (process.env.VERCEL_ENV === "production"
    && process.env.STRIPE_DRIVER_LIVE_TEST_CHECKOUT_ENABLED === "true"
    && getDriverLiveTestPaymentLink()) return "live";
  if (process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED === "true"
    && (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") === true
      || getDriverTestPaymentLink())) return "sandbox";
  return null;
}

export function getStripeTestClient() {
  if (process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED !== "true"
    || process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") !== true) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}

export function getDriverTestPaymentLink() {
  const configured = process.env.STRIPE_DRIVER_TEST_PAYMENT_LINK_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:"
      || url.hostname !== "buy.stripe.com"
      || !url.pathname.startsWith("/test_")) return null;
    return url;
  } catch {
    return null;
  }
}

export function getDriverLiveTestPaymentLink() {
  const configured = process.env.STRIPE_DRIVER_LIVE_TEST_PAYMENT_LINK_URL?.trim();
  if (!configured) return null;

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:"
      || url.hostname !== "buy.stripe.com"
      || url.pathname.startsWith("/test_")) return null;
    return url;
  } catch {
    return null;
  }
}

export function getSiteUrl(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return (fallbackOrigin || "http://localhost:3000").replace(/\/$/, "");
}
