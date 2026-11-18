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
  "dali-day",
  "lijiang-day",
  "shangri-la-day",
] as const;

export type DriverProductId = (typeof driverProductIds)[number];

export function isDriverProductId(value: unknown): value is DriverProductId {
  return typeof value === "string" && driverProductIds.includes(value as DriverProductId);
}

export function isDriverStripeTestEnabled() {
  return process.env.STRIPE_DRIVER_TEST_CHECKOUT_ENABLED === "true"
    && process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") === true;
}

export function getStripeTestClient() {
  if (!isDriverStripeTestEnabled()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY as string);
}

export function getSiteUrl(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return (fallbackOrigin || "http://localhost:3000").replace(/\/$/, "");
}
