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

const raw = process.env.STRIPE_SECRET_KEY || "";
const trimmed = raw.trim();
const unquoted = trimmed.replace(/^["']|["']$/g, "");
console.log("[driver-checkout-config] stripeKeyDiagnostics", JSON.stringify({
  present: raw.length > 0,
  trimmedKeyValid: trimmed.startsWith("sk_live_"),
  unquotedKeyValid: unquoted.startsWith("sk_live_"),
  testModeKey: trimmed.startsWith("sk_test_"),
  restrictedKey: trimmed.startsWith("rk_live_"),
  hasWhitespaceAtEnds: raw !== trimmed,
  hasWrappingQuotes: trimmed !== unquoted,
  lengthCategory: raw.length > 30 ? "long" : raw.length > 0 ? "short" : "empty",
}));
