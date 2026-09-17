import { NextResponse } from "next/server";
import destinations from "@/lib/affiliate-destinations.json";

// Destinations were migrated from hiddenchinatravel-web/data/affiliate-links.csv.
// Keep the /go/ slugs stable for existing articles and guides.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const links: Record<string, string> = destinations;
  const destination = Object.hasOwn(links, slug) ? links[slug] : undefined;
  if (!destination) return new Response("Unknown affiliate link", { status: 404 });
  return NextResponse.redirect(destination, { status: 302, headers: { "Cache-Control": "no-store", "Referrer-Policy": "strict-origin-when-cross-origin" } });
}
