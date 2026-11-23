import { getDriverCheckoutConfigStatus } from "@/lib/driver-direct-checkout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Operational readiness only: never expose keys or the names of failing secrets.
export async function GET() {
  const status = getDriverCheckoutConfigStatus();
  if (!status.ready) console.error("[driver-checkout] Readiness check failed", status);
  return Response.json({ checkoutReady: status.ready }, {
    status: status.ready ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
