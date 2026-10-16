export const travelWindows = ["Within 1 month", "1–3 months", "3–6 months", "More than 6 months", "Just researching"] as const;
export const interests = ["Yunnan Journey", "Private Travel", "Custom Trip Planning", "China Travel Advice", "Not Sure Yet"] as const;

export type Enquiry = {
  name: string;
  email: string;
  whatsapp: string;
  travelWindow: string;
  interest: string;
  plans: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEnquiry(input: Record<string, unknown>): Enquiry | { error: string } {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const whatsapp = String(input.whatsapp ?? "").trim();
  const travelWindow = String(input.travelWindow ?? "").trim();
  const interest = String(input.interest ?? "").trim();
  const plans = String(input.plans ?? "").trim();
  const honeypot = String(input.company ?? "").trim();

  if (honeypot) return { error: "Unable to send this enquiry." };
  if (name.length < 2) return { error: "Please add your name." };
  if (!emailPattern.test(email)) return { error: "Please add a valid email address." };
  if (!travelWindows.includes(travelWindow as (typeof travelWindows)[number])) return { error: "Please choose when you are thinking of traveling." };
  if (!interests.includes(interest as (typeof interests)[number])) return { error: "Please choose what you are hoping to plan." };
  if (plans.length < 10) return { error: "Please tell us a little about your plans." };
  if (plans.length > 4000) return { error: "Please keep your note under 4,000 characters." };

  return { name, email, whatsapp, travelWindow, interest, plans };
}

export function enquiryMessage(enquiry: Enquiry) {
  return [
    "Hi Joy, I'd like to talk about my China trip.",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `WhatsApp: ${enquiry.whatsapp || "Not provided"}`,
    `Travel timing: ${enquiry.travelWindow}`,
    `Interested in: ${enquiry.interest}`,
    "",
    "My plans:",
    enquiry.plans,
  ].join("\n");
}

export function contactHref(interest?: string) {
  const path = interest ? `/contact?interest=${encodeURIComponent(interest)}` : "/contact";
  return `${path}#enquire`;
}
