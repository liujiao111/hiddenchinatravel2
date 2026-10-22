import { licensedOperator } from "@/lib/journey-trust";

export const brandIdentity = {
  short: `Hidden China Travel is the English-language site of ${licensedOperator.nameEn} (${licensedOperator.nameZh}), a licensed travel agency in Kunming.`,
  consultant: "Joy Liu is your travel consultant. You speak with Joy from the first enquiry through the journey.",
  footer: `${licensedOperator.nameEn} · Permit ${licensedOperator.permitNumber} · ${licensedOperator.unifiedSocialCreditCode}`,
} as const;

export const driverGuideCopy = {
  name: "Driver-guide throughout",
  short: "A Chinese- or English-speaking driver-guide is included throughout.",
  full: "A Chinese- or English-speaking driver-guide is included throughout. One local host drives, coordinates the route and offers context. This is not a separate attraction lecturer inside every site. A specialist site guide can be added in your proposal.",
} as const;

export const insuranceCopy = {
  inclusion: "Travel insurance for the confirmed journey period",
  full: "Travel insurance for the confirmed journey period is included. It does not replace your own international travel insurance.",
} as const;

export const paymentCopy = {
  deposit: "20% deposit to the licensed agency’s corporate account after you confirm the written itinerary and travel contract",
  balance: "The remaining 80% is due after airport pickup, when the journey starts",
  methods: "Pay by Alipay or WeChat. Stripe is a backup if those are not set up. Stripe charges currently appear under a personal name until the agency’s business merchant account is approved.",
  full: `After you confirm the written itinerary and travel contract, pay a 20% deposit to ${licensedOperator.nameEn}’s corporate account by Alipay or WeChat. We then book hotels, tickets and the vehicle. The remaining 80% is due after your airport pickup, when the journey starts. Stripe is a backup if Alipay or WeChat are not set up. Stripe charges currently appear under a personal name until the agency’s business merchant account is approved.`,
} as const;

export const cancellationCopy = {
  full: "Cancel more than 7 days before the journey starts and the deposit is refunded, minus hotel or ticket costs that have already been booked and cannot be recovered. Cancellations 7 days or fewer before departure keep the deposit.",
} as const;

export const contractCopy = {
  full: `The travel contract and all payments are with ${licensedOperator.nameEn} (${licensedOperator.nameZh}). Its travel agency permit number is ${licensedOperator.permitNumber}.`,
} as const;

export const bookingFaq = {
  question: "How do payment and cancellation work?",
  answer: `${paymentCopy.full} ${cancellationCopy.full}`,
};

export const operatorFaq = {
  question: "Who do I book with?",
  answer: `${brandIdentity.short} ${brandIdentity.consultant} ${contractCopy.full}`,
};

export const bookingSteps = [
  ["01", "Share your plans", "Send your dates, group size and what you would like the journey to feel like."],
  ["02", "Review the written proposal", "Joy sends an itinerary, inclusions and a quote you can adjust before anything is booked."],
  ["03", "Confirm and pay the deposit", "Sign the travel contract with the licensed agency and pay a 20% deposit to its corporate account."],
  ["04", "Travel, then settle the balance", "Hotels, tickets and the vehicle are arranged after the deposit. The remaining 80% is due after airport pickup."],
] as const;

export const bookingTermCards = [
  ["Who you contract with", contractCopy.full],
  ["How you pay", paymentCopy.full],
  ["If plans change", cancellationCopy.full],
  ["Insurance", insuranceCopy.full],
] as const;
