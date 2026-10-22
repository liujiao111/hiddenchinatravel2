import { Resend } from "resend";
import { enquiryEmailText, enquirySubject, parseEnquiry } from "@/lib/enquiry";
import { metaClickIdsFrom, requestClientContext, sendMetaLead } from "@/lib/meta-capi";
import { siteConfig } from "@/lib/site-config";

async function readEnquiryBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return request.json() as Promise<Record<string, unknown>>;
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await readEnquiryBody(request);
  } catch {
    return Response.json({ error: "Unable to read this enquiry." }, { status: 400 });
  }

  const parsed = parseEnquiry(body);
  if ("error" in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const text = enquiryEmailText(parsed);
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry]\n", text);
      const clickIds = metaClickIdsFrom(body);
      void sendMetaLead({ ...clickIds, ...requestClientContext(request), email: parsed.email, contentName: clickIds.contentName || "quick_ask" });
      return Response.json({ ok: true });
    }
    return Response.json({ error: "Enquiry email is not configured yet. Please use WhatsApp instead." }, { status: 503 });
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL || "Hidden China Travel <beth.t@example.com>",
    to: process.env.ENQUIRY_TO_EMAIL || siteConfig.enquiryEmail,
    replyTo: parsed.email,
    subject: enquirySubject(parsed),
    text,
  });

  if (error) {
    console.error("[enquiry]", error);
    return Response.json({ error: "We could not send this just now. Please try WhatsApp." }, { status: 502 });
  }

  const clickIds = metaClickIdsFrom(body);
  const client = requestClientContext(request);
  void sendMetaLead({
    ...clickIds,
    ...client,
    email: parsed.email,
    contentName: clickIds.contentName || "quick_ask",
  });

  return Response.json({ ok: true });
}
