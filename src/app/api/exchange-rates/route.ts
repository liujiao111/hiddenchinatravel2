import { getExchangeRates } from "@/lib/currency-converter/get-rates";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const payload = await getExchangeRates();
  if (!payload.ok) {
    return NextResponse.json(payload, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
