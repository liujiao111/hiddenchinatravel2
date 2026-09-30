import { getVisitorCountry, selectYunnanCountryGuide } from "@/lib/yunnan-country-guides";
import { getPublishedYunnanCountryGuides } from "@/lib/yunnan-country-guides.server";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const guide = selectYunnanCountryGuide(
    getVisitorCountry(request.headers),
    getPublishedYunnanCountryGuides(),
  );

  // Country-specific responses must never be shared across visitors.
  // No raw IP is read, stored or sent to the browser or a third party.
  return Response.json({ countryCode: guide.countryCode }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
