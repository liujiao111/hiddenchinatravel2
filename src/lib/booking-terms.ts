import { licensedOperator } from "@/lib/journey-trust";

export const brandIdentity = {
  short: "Hidden China Travel is an independent China travel brand founded by Joy Liu and the official international-facing brand for our licensed partner’s Yunnan inbound journeys.",
  consultant: `Joy handles initial enquiries and route planning. For Yunnan private journeys, ${licensedOperator.nameEn} handles subsequent quotations, contracting and on-the-ground arrangements, as agreed in the written proposal and contract.`,
  footer: `Yunnan tour operator: ${licensedOperator.nameEn} · Permit ${licensedOperator.permitNumber} · ${licensedOperator.unifiedSocialCreditCode}`,
  address: `Yunnan operator’s office: ${licensedOperator.addressEn} · ${licensedOperator.addressZh}`,
  registryHref: licensedOperator.creditRegistryUrl,
} as const;

export const driverGuideCopy = {
  name: "Driver-guide throughout",
  short: "A Chinese- or English-speaking driver-guide is included throughout.",
  full: "A Chinese- or English-speaking driver-guide is included throughout. One local host drives, coordinates the route and offers context. This is not a separate attraction lecturer inside every site. A specialist site guide can be added in your proposal.",
} as const;

export const insuranceCopy = {
  inclusion: "Your own international travel insurance, bought before you travel",
  full: "Travel-agency liability insurance is included in the Yunnan journey and arranged by the licensed operator. The operator will provide the applicable insurer, policy terms and coverage details before the booking is confirmed. Travelers are registered with their real name and passport information as required. Agency liability coverage is not a substitute for personal travel medical or emergency evacuation insurance.",
} as const;

export const paymentCopy = {
  deposit: "20% deposit after you confirm the written itinerary and travel contract; fully refundable more than 7 full days before departure",
  balance: "The remaining 80% is normally due after you arrive in Kunming and meet your guide; supplier-heavy itineraries may require payment 7–14 days before departure when disclosed in writing",
  methods: "Pay securely by Visa, Mastercard, Apple Pay or Google Pay through Stripe, or by Alipay or WeChat Pay. We add no payment-method surcharge.",
  product: `After you confirm the written itinerary and travel contract, pay a 20% deposit to secure your vehicle and begin confirming hotels. It is fully refundable when you cancel more than 7 full days before departure. Pay securely by Visa, Mastercard, Apple Pay or Google Pay through Stripe, or by Alipay or WeChat Pay. The remaining 80% is normally due after you arrive in Kunming and meet your guide. If an itinerary requires advance supplier settlement, a date 7–14 days before departure is disclosed in writing before you pay.`,
  full: `After you confirm the written itinerary and travel contract, pay a 20% deposit to secure your vehicle and begin confirming hotels. It is fully refundable when you cancel more than 7 full days before departure. Pay securely by Visa, Mastercard, Apple Pay or Google Pay through Stripe, or by Alipay or WeChat Pay. The remaining 80% is normally due after you arrive in Kunming and meet your guide. If an itinerary requires advance supplier settlement, a date 7–14 days before departure is disclosed in writing before you pay.`,
} as const;

export const cancellationCopy = {
  full: "Cancel more than 7 full days before the journey starts and the 20% deposit is refunded in full to the original payment method. At 7 days or fewer, the deposit is non-refundable. One date change has no administration fee for a documented flight cancellation, sudden serious illness or comparable event outside your reasonable control; availability, seasonal price differences and unrecoverable supplier costs still apply.",
} as const;

export const contractCopy = {
  full: `The travel contract and all payments are with ${licensedOperator.nameEn} (${licensedOperator.nameZh}). Its travel agency permit number is ${licensedOperator.permitNumber}.`,
} as const;

export const bookingFaq = {
  question: "How do payment and cancellation work?",
  answer: `${paymentCopy.product} ${cancellationCopy.full}`,
};

export const operatorFaq = {
  question: "Who do I book with?",
  answer: `${brandIdentity.short} ${brandIdentity.consultant} ${contractCopy.full}`,
};

export const bookingSteps = [
  ["01", "Share your plans", "Send your dates, group size and what you would like the journey to feel like."],
  ["02", "Review the written proposal", "Joy helps shape the route. The licensed Yunnan operator confirms the written itinerary, inclusions and quotation for you to review before booking."],
  ["03", "Confirm and pay the deposit", "Sign the travel contract with the licensed agency and pay a 20% deposit. It is fully refundable when cancelled more than 7 full days before departure."],
  ["04", "Travel, then settle the balance", "The remaining 80% is normally due after you arrive in Kunming and meet your guide; any earlier due date is disclosed before booking."],
] as const;

export const bookingDocumentHref = "/booking";

export const bookingTermCards = [
  ["Who you contract with", contractCopy.full],
  ["How you pay", paymentCopy.product],
  ["If plans change", cancellationCopy.full],
  ["Insurance", insuranceCopy.full],
] as const;
