// Production readiness check. Prints only boolean statuses; never secret values.
const isProd = process.env.VERCEL_ENV === "production";
if (!isProd) process.exit(0);
const checks = {
  stripeKey: Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")),
  webhook: Boolean(process.env.STRIPE_DRIVER_LIVE_WEBHOOK_SECRET?.startsWith("whsec_")),
  orderLink: Boolean((process.env.DRIVER_ORDER_LINK_SECRET?.length ?? 0) >= 32),
  blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
};
for (const [key, passed] of Object.entries(checks)) console.log("[driver-checkout-config]", key, passed ? "PASS" : "FAIL");
