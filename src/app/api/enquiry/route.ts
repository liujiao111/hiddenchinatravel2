import { Resend } from "resend";
import { enquiryMessage, parseEnquiry } from "@/lib/enquiry";
import { siteConfig } from "@/lib/site-config";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Unable to read this enquiry." }, { status: 400 });
  }

  const parsed = parseEnquiry(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const text = enquiryMessage(parsed);
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry]\n", text);
      return Response.json({ ok: true });
    }
    return Response.json({ error: "Enquiry email is not configured yet. Please use WhatsApp instead." }, { status: 503 });
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL || "Hidden China Travel <beth.t@example.com>",
    to: process.env.ENQUIRY_TO_EMAIL || siteConfig.enquiryEmail,
    replyTo: parsed.email,
    subject: `New enquiry from ${parsed.name}`,
    text,
  });

  if (error) {
    console.error("[enquiry]", error);
    return Response.json({ error: "We could not send this just now. Please try WhatsApp." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
