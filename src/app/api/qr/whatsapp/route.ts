import { buildWhatsAppUrl, generateLeadId } from "@/lib/whatsapp";
import { createServerScanRecord } from "@/lib/lead-ref";
import { findWhatsAppSource, saveWhatsAppSource, WHATSAPP_REF_PATTERN } from "@/lib/whatsapp-ref-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// A desktop QR scan hands the desktop acquisition touch to a fresh phone Ref.
// The scan itself is not proof that a WhatsApp message was sent.
export async function GET(request: Request) {
  const ref = new URL(request.url).searchParams.get("ref")?.trim().toUpperCase() || "";
  if (!WHATSAPP_REF_PATTERN.test(ref)) {
    return new Response("Invalid QR reference", {
      status: 400, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" },
    });
  }
  let parent = null;
  try {
    parent = await findWhatsAppSource(ref);
  } catch (error) {
    console.error("QR source lookup failed", error instanceof Error ? error.message : "unknown");
  }
  const refForPhone = generateLeadId();
  const href = buildWhatsAppUrl(refForPhone);
  if (parent?.status === "qr_view" && parent.channel === "whatsapp") {
    try {
      await saveWhatsAppSource(createServerScanRecord(parent, refForPhone));
    } catch (error) {
      console.error("QR handoff persistence failed", error instanceof Error ? error.message : "unknown");
    }
  }
  return new Response(null, {
    status: 307,
    headers: {
      location: href, "cache-control": "no-store, private",
      "x-robots-tag": "noindex, nofollow", "referrer-policy": "no-referrer",
    },
  });
}
