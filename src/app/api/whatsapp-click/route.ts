// Retired: WhatsApp button clicks are tracked in GA4 only.
// No email is sent until an actual enquiry reaches the enquiry endpoint.
export async function POST() {
  return Response.json({ error: "Click email notifications disabled" }, { status: 410 });
}
