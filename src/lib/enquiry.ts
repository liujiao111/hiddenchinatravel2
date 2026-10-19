export const travelWindows = ["Within 1 month", "1–3 months", "3–6 months", "More than 6 months", "Just researching"] as const;
export const interests = ["Yunnan Journey", "Private Travel", "Custom Trip Planning", "China Travel Advice", "Not Sure Yet"] as const;
export const partySizes = ["Just me", "2 travelers", "3–4 travelers", "5 or more", "Not sure yet"] as const;
export const budgetBands = ["Please advise", "Under US$1,500", "US$1,500–2,500", "US$2,500–4,000", "US$4,000+"] as const;

const tripInterests = new Set<string>(["Yunnan Journey", "Private Travel", "Custom Trip Planning"]);

export type Enquiry = {
  name: string;
  email: string;
  whatsapp: string;
  travelWindow: string;
  interest: string;
  plans: string;
  source: string;
  travelers: string;
  budget: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optionalChoice(value: string, allowed: readonly string[]) {
  if (!value) return "";
  if (!allowed.includes(value)) return null;
  return value;
}

function cleanSource(value: string) {
  const source = value.trim().slice(0, 180);
  if (!source.startsWith("/") || /[\s<>]/.test(source)) return "";
  return source;
}

export function isTripPlanningSection(section?: string) {
  const value = section?.toLowerCase() ?? "";
  return value.includes("itinerary") || value.includes("destination");
}

export function parseEnquiry(input: Record<string, unknown>): Enquiry | { error: string } {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim();
  const whatsapp = String(input.whatsapp ?? "").trim();
  const travelWindow = optionalChoice(String(input.travelWindow ?? "").trim(), travelWindows);
  const interest = String(input.interest ?? "").trim();
  const plans = String(input.plans ?? "").trim();
  const travelers = optionalChoice(String(input.travelers ?? "").trim(), partySizes);
  const budget = optionalChoice(String(input.budget ?? "").trim(), budgetBands);
  const honeypot = String(input.company ?? "").trim();

  if (honeypot) return { error: "Unable to send this enquiry." };
  if (name.length < 2 || /[\r\n]/.test(name)) return { error: "Please add your name." };
  if (!emailPattern.test(email) || /[\r\n]/.test(email)) return { error: "Please add a valid email address." };
  if (travelWindow === null) return { error: "Please choose when you are thinking of traveling." };
  if (!interests.includes(interest as (typeof interests)[number])) return { error: "Please choose what you are hoping to plan." };
  if (travelers === null) return { error: "Please choose a group size." };
  if (budget === null) return { error: "Please choose a budget range." };
  if (plans.length < 10) return { error: "Please tell us a little about your plans." };
  if (plans.length > 4000) return { error: "Please keep your note under 4,000 characters." };
  if (whatsapp.length > 40) return { error: "Please check the WhatsApp number." };

  return { name, email, whatsapp, travelWindow, interest, plans, source: cleanSource(String(input.source ?? "")), travelers, budget };
}

export function missingQuoteFacts(enquiry: Enquiry) {
  const missing: string[] = [];
  if (!enquiry.travelWindow || enquiry.travelWindow === "Just researching") missing.push("travel timing");
  if (!enquiry.travelers || enquiry.travelers === "Not sure yet") missing.push("party size");
  if (!enquiry.budget || enquiry.budget === "Please advise") missing.push("budget per person");
  return missing;
}

export function isQuoteReady(enquiry: Enquiry) {
  return tripInterests.has(enquiry.interest) && missingQuoteFacts(enquiry).length === 0;
}

export function enquirySubject(enquiry: Enquiry) {
  const label = isQuoteReady(enquiry) ? "Quote-ready" : "New enquiry";
  return `${label}: ${enquiry.name.replace(/[\r\n]/g, " ")} · ${enquiry.interest}`;
}

export function enquiryMessage(enquiry: Enquiry) {
  return [
    "Hi Joy, I'd like to talk about my China trip.",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `WhatsApp: ${enquiry.whatsapp || "Not provided"}`,
    `Travel timing: ${enquiry.travelWindow || "Not provided"}`,
    `Party: ${enquiry.travelers || "Not provided"}`,
    `Budget per person: ${enquiry.budget || "Not provided"}`,
    `Interested in: ${enquiry.interest}`,
    ...(enquiry.source ? [`Page: ${enquiry.source}`] : []),
    "",
    "My plans:",
    enquiry.plans,
  ].join("\n");
}

export function enquiryEmailText(enquiry: Enquiry) {
  const missing = missingQuoteFacts(enquiry);
  const ready = isQuoteReady(enquiry);
  const firstReply = ready
    ? "Send a short route sketch for these dates and this party, with a price range, inclusions, and one next step. Ask another question only if their note conflicts with the facts above."
    : `Answer their note first. Ask only for what is missing: ${missing.join(", ") || "whether they want a private Yunnan trip"}.`;

  return [
    enquiryMessage(enquiry),
    "",
    ready ? "Status: enough to send a route and a price range." : `Status: still need ${missing.join(", ") || "a clearer trip intent"} before a quote.`,
    "",
    "Suggested first reply:",
    firstReply,
  ].join("\n");
}

export function contactHref(interest?: string) {
  const path = interest ? `/contact?interest=${encodeURIComponent(interest)}` : "/contact";
  return `${path}#enquire`;
}
