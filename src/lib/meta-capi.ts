import { createHash } from "node:crypto";

type LeadPayload = {
  eventId?: string;
  email?: string;
  sourceUrl?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
  contentName?: string;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function cleanText(value: string | undefined, max = 500) {
  return value?.trim().slice(0, max) || "";
}

export async function sendMetaLead(payload: LeadPayload) {
  const pixelId = (process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID || "").match(/^\d+$/)?.[0];
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!pixelId || !token) return;

  const email = cleanText(payload.email, 254).toLowerCase();
  const eventId = cleanText(payload.eventId, 80);
  const userData: Record<string, unknown> = {};
  if (email && email.includes("@")) userData.em = [sha256(email)];
  if (payload.clientIp && payload.clientIp !== "unknown") userData.client_ip_address = payload.clientIp;
  if (payload.clientUserAgent) userData.client_user_agent = payload.clientUserAgent.slice(0, 512);
  if (payload.fbp?.startsWith("fb.")) userData.fbp = payload.fbp.slice(0, 120);
  if (payload.fbc?.startsWith("fb.")) userData.fbc = payload.fbc.slice(0, 180);

  const body: Record<string, unknown> = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      ...(eventId ? { event_id: eventId } : {}),
      ...(payload.sourceUrl?.startsWith("http") ? { event_source_url: payload.sourceUrl.slice(0, 500) } : {}),
      user_data: userData,
      custom_data: {
        content_name: cleanText(payload.contentName, 80) || "enquiry",
        content_category: "lead",
      },
    }],
  };
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim();
  if (testCode) body.test_event_code = testCode;

  try {
    const response = await fetch(`https://graph.facebook.com/v22.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, access_token: token }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) console.error("[meta-capi] Lead event was not accepted", response.status);
  } catch {
    console.error("[meta-capi] Lead event could not be sent");
  }
}

export function metaClickIdsFrom(body: Record<string, unknown>) {
  return {
    eventId: typeof body.eventId === "string" ? body.eventId : "",
    sourceUrl: typeof body.sourceUrl === "string" ? body.sourceUrl : "",
    fbp: typeof body.fbp === "string" ? body.fbp : "",
    fbc: typeof body.fbc === "string" ? body.fbc : "",
    contentName: typeof body.contentName === "string" ? body.contentName : "",
  };
}

export function requestClientContext(request: Request) {
  return {
    clientIp: request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "",
    clientUserAgent: request.headers.get("user-agent") || "",
  };
}
