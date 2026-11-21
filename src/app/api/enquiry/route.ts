import { Resend } from "resend";
import { enquiryEmailText, enquirySubject, parseEnquiry } from "@/lib/enquiry";
import { getEnquiryMailConfig } from "@/lib/enquiry-mail";

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
  const { apiKey: key, from, to } = getEnquiryMailConfig();

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[enquiry]\n", text);
      return Response.json({ ok: true });
    }
    console.error("[enquiry] RESEND_API_KEY is not configured.");
    return Response.json({ error: "Enquiry email is temporarily unavailable. Please use WhatsApp instead." }, { status: 503 });
  }

  // All enquiries and payment notifications reuse this verified sender.
  if (!from) {
    console.error("[enquiry] No verified sender configured.");
    return Response.json({ error: "Enquiry email is temporarily unavailable. Please use WhatsApp instead." }, { status: 503 });
  }

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: parsed.email,
      subject: enquirySubject(parsed),
      text,
    });

    if (error) {
      console.error("[enquiry] Resend rejected the email:", {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
      return Response.json({ error: "We could not send this just now. Please try WhatsApp." }, { status: 502 });
    }
  } catch (error) {
    console.error("[enquiry] Resend request failed:", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "We could not send this just now. Please try WhatsApp." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
