import { licensedOperator } from "@/lib/journey-trust";

export const brandIdentity = {
  short: `Hidden China Travel is the English-language site of ${licensedOperator.nameEn} (${licensedOperator.nameZh}), a licensed travel agency in Kunming.`,
  consultant: "Joy Liu is your travel consultant. You speak with Joy from the first enquiry through the journey.",
  footer: `${licensedOperator.nameEn} · Permit ${licensedOperator.permitNumber} · ${licensedOperator.unifiedSocialCreditCode}`,
  address: `${licensedOperator.addressEn} · ${licensedOperator.addressZh}`,
  registryHref: licensedOperator.creditRegistryUrl,
} as const;

export const driverGuideCopy = {
  name: "Driver-guide throughout",
  short: "A Chinese- or English-speaking driver-guide is included throughout.",
  full: "A Chinese- or English-speaking driver-guide is included throughout. One local host drives, coordinates the route and offers context. This is not a separate attraction lecturer inside every site. A specialist site guide can be added in your proposal.",
} as const;

export const insuranceCopy = {
  inclusion: "Your own international travel insurance, bought before you travel",
  full: "The agency holds 2026 travel-agency liability insurance with China Pacific Property Insurance, policy AKUM0AC10625QAAA1R9T, up to RMB 1.8 million per person for injury it is legally responsible for. It applies to you only after your name and passport number are registered. Buy your own international medical and evacuation insurance. It is not included.",
} as const;

export const paymentCopy = {
  deposit: "20% deposit to the licensed agency’s corporate account after you confirm the written itinerary and travel contract",
  balance: "The remaining 80% is due after your first pickup, when the journey starts",
  methods: `Pay by Alipay, WeChat, or bank transfer to ${licensedOperator.nameEn}. The account name matches the company on the contract.`,
  product: `After you confirm the written itinerary and travel contract, pay a 20% deposit to ${licensedOperator.nameEn}’s corporate account by Alipay, WeChat, or bank transfer. The account name matches the company on the contract. We then book hotels, tickets and the vehicle. The remaining 80% is due after your first pickup, when the journey starts.`,
  full: `After you confirm the written itinerary and travel contract, pay a 20% deposit to ${licensedOperator.nameEn}’s corporate account by Alipay, WeChat, or bank transfer. The account name matches the company on the contract. We then book hotels, tickets and the vehicle. The remaining 80% is due after your first pickup, when the journey starts.`,
} as const;

export const cancellationCopy = {
  full: "Cancel more than 7 days before the journey starts and the deposit is refunded, minus hotel or ticket costs that have already been booked and cannot be recovered. Cancellations 7 days or fewer before departure keep the deposit.",
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
  ["02", "Review the written proposal", "Joy sends an itinerary, inclusions and a quote you can adjust before anything is booked."],
  ["03", "Confirm and pay the deposit", "Sign the travel contract with the licensed agency and pay a 20% deposit to its corporate account."],
  ["04", "Travel, then settle the balance", "Hotels, tickets and the vehicle are arranged after the deposit. The remaining 80% is due after your first pickup."],
] as const;

export const bookingDocumentHref = "/booking";

export const bookingTermCards = [
  ["Who you contract with", contractCopy.full],
  ["How you pay", paymentCopy.product],
  ["If plans change", cancellationCopy.full],
  ["Insurance", insuranceCopy.full],
] as const;
