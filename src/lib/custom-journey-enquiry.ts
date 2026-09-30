export const journeyInterests = ["Local culture", "Food & markets", "Photography", "Nature & walking", "Family time", "A slower pace", "Tea & crafts", "Not sure yet"] as const;
export const journeyBudgets = ["Please advise", "Under US$1,500", "US$1,500–2,500", "US$2,500–4,000", "US$4,000+"] as const;
export const journeyComfort = ["Please advise", "Comfortable hotels", "Boutique stays", "Luxury stays", "A mix"] as const;

export type CustomJourneyEnquiry = {
  name: string; email: string; whatsapp: string; travelTiming: string; tripLength: string;
  adults: number; children: number; destinations: string; budget: string; comfort: string;
  interests: string[]; notes: string; consent: boolean; website: string; requestId: string;
};

export function parseCustomJourneyEnquiry(value: unknown): CustomJourneyEnquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const limits: Record<string, number> = { name: 100, email: 254, whatsapp: 40, travelTiming: 100, tripLength: 80, destinations: 700, budget: 60, comfort: 60, notes: 3000, website: 200, requestId: 36 };
  const fields: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof input[key] !== "string" || input[key].length > limit) return null;
    fields[key] = input[key].trim();
  }
  if (!fields.name || /[\r\n]/.test(fields.name + fields.email) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return null;
  if (input.consent !== true || fields.website || !/^[0-9a-f-]{36}$/i.test(fields.requestId)) return null;
  if (!Number.isInteger(input.adults) || Number(input.adults) < 1 || Number(input.adults) > 30 || !Number.isInteger(input.children) || Number(input.children) < 0 || Number(input.children) > 20) return null;
  if (!journeyBudgets.includes(fields.budget as typeof journeyBudgets[number]) || !journeyComfort.includes(fields.comfort as typeof journeyComfort[number])) return null;
  if (!Array.isArray(input.interests) || input.interests.length > journeyInterests.length || input.interests.some(item => typeof item !== "string" || !journeyInterests.includes(item as typeof journeyInterests[number]))) return null;
  return { ...fields, adults: Number(input.adults), children: Number(input.children), interests: [...new Set(input.interests)] as string[], consent: true } as CustomJourneyEnquiry;
}

export function enquiryEmailText(enquiry: CustomJourneyEnquiry) {
  return ["New tailor-made journey enquiry from /custom-china-tour", "", `Name: ${enquiry.name}`, `Email: ${enquiry.email}`, `WhatsApp: ${enquiry.whatsapp || "Not provided"}`, `Travel dates: ${enquiry.travelTiming || "Flexible / not decided"}`, `Trip length: ${enquiry.tripLength || "Not decided"}`, `Travelers: ${enquiry.adults} adults, ${enquiry.children} children`, `Destinations: ${enquiry.destinations || "Please suggest"}`, `Budget per person (USD, excluding international flights): ${enquiry.budget}`, `Hotels: ${enquiry.comfort}`, `Interests: ${enquiry.interests.join(", ") || "Not specified"}`, "", "Additional notes:", enquiry.notes || "None", "", "Consent: enquiry follow-up only; no marketing subscription."].join("\n");
}
