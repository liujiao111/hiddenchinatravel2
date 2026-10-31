import { getSearchIndex } from "@/lib/search-index";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const locale = new URL(request.url).searchParams.get("locale") === "zh" ? "zh" : "en";
  return Response.json(getSearchIndex(locale), {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
