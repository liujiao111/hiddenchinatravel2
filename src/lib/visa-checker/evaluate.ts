import { toCanonicalCountryName } from "./country-aliases";
import {
  getHainan30Rule,
  getPortById,
  getTransit240Rule,
  getVisaFreeRule,
  isHainanPort,
  type Hainan30CountryRule,
  type Transit240CountryRule,
  type Transit240Port,
  type VisaFreeRule,
} from "./load-rules";

export type VisaPurpose =
  | "tourism"
  | "business"
  | "family_visit"
  | "exchange"
  | "transit"
  | "study"
  | "work"
  | "journalism"
  | "other";

export type TransitRoute =
  | "no_transit"
  | "third_country_confirmed"
  | "same_country_return"
  | "not_sure";

export type VisaOutcome =
  | "visa_free"
  | "hainan_30"
  | "transit_240"
  | "near_miss_240"
  | "visa_required";

export type VisaCheckInput = {
  nationality: string;
  purpose: VisaPurpose | string;
  stayDays: number;
  transitRoute: TransitRoute | string;
  portId: string;
};

export type VisaEvaluationResult = {
  outcome: VisaOutcome;
  kicker: string;
  headline: string;
  summary: string;
  note?: string;
  missingConditions?: string[];
  checklist: string[];
  meta: {
    nationality: string;
    purpose: string;
    stayLabel: string;
    transitLabel: string;
    portLabel: string;
  };
  policy?: {
    policyType?: string;
    ruleType?: string;
    maxStayDays?: number;
    maxStayHours?: number;
    requirement?: string;
    allowedStayArea?: string;
  };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

const PURPOSE_LABELS: Record<string, string> = {
  tourism: "Tourism",
  business: "Business",
  family_visit: "Family / Friends Visit",
  exchange: "Exchange / Short Visit",
  transit: "Transit",
  study: "Study",
  work: "Work",
  journalism: "Journalism",
  other: "Other / Not Sure",
};

const TRANSIT_LABELS: Record<string, string> = {
  no_transit: "No transit",
  third_country_confirmed: "Third country/region with confirmed onward ticket",
  same_country_return: "Returning to the same country/region",
  not_sure: "Not sure yet",
};

const STAY_LABELS: Record<number, string> = {
  3: "1–3 days",
  10: "4–10 days",
  30: "11–30 days",
  31: "More than 30 days",
};

const VISA_FREE_PURPOSES = new Set([
  "tourism",
  "business",
  "family_visit",
  "exchange",
  "transit",
  "other",
]);

const SPECIAL_VISA_PURPOSES = new Set(["work", "study", "journalism"]);

function portLabel(port: Transit240Port | undefined, portId: string): string {
  if (!port) return portId || "—";
  return `${port.city} · ${port.portName}`;
}

function baseMeta(input: VisaCheckInput, port?: Transit240Port) {
  return {
    nationality: toCanonicalCountryName(input.nationality) || input.nationality,
    purpose: PURPOSE_LABELS[input.purpose] ?? input.purpose,
    stayLabel: STAY_LABELS[input.stayDays] ?? `${input.stayDays} days`,
    transitLabel: TRANSIT_LABELS[input.transitRoute] ?? input.transitRoute,
    portLabel: portLabel(port, input.portId),
  };
}

function visaFreeResult(
  input: VisaCheckInput,
  rule: VisaFreeRule,
  port?: Transit240Port,
): VisaEvaluationResult {
  const isMutual = rule.ruleType === "mutual_visa_free";
  return {
    outcome: "visa_free",
    kicker: isMutual
      ? "Likely eligible · Mutual visa-free"
      : "Likely eligible · Unilateral visa-free",
    headline: `You may enter China visa-free for up to ${rule.maxStayDays} days`,
    summary: `Based on your passport (${rule.country}), you appear to qualify under China’s ${rule.policyType.toLowerCase()} policy for short stays of up to ${rule.maxStayDays} days.`,
    note: "Immigration officers make the final decision at the border. Carry a valid passport and supporting itinerary documents.",
    checklist: [
      `Passport valid for at least the length of your stay (policy max: ${rule.maxStayDays} days)`,
      "Purpose of visit should match permitted short-stay activities",
      "Round-trip or onward ticket may be requested",
      "Hotel / police registration within 24 hours if required",
      "Do not overstay — extensions are generally not available under visa-free entry",
    ],
    meta: baseMeta(input, port),
    policy: {
      policyType: rule.policyType,
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
    },
    primaryCta: {
      label: "Read visa-free arrival guide",
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: "Official sources",
      href: "#official-sources",
    },
  };
}

function hainan30Result(
  input: VisaCheckInput,
  rule: Hainan30CountryRule,
  port: Transit240Port,
): VisaEvaluationResult {
  return {
    outcome: "hainan_30",
    kicker: "May qualify · Hainan 30-day visa-free",
    headline: `You may stay in Hainan visa-free for up to ${rule.maxStayDays} days`,
    summary: `From 20 August 2026, ${rule.country} ordinary-passport holders may enter through a Hainan open port and stay up to ${rule.maxStayDays} days inside Hainan Province only. This is not nationwide mainland visa-free entry.`,
    note: rule.requirement,
    checklist: [
      "Hold an ordinary passport",
      `Enter through a Hainan open port — you selected ${port.portName}`,
      "Remain inside Hainan Province for the whole stay",
      `Leave within ${rule.maxStayDays} days`,
      "Tourism, business, family visits, and similar short activities only — work, study, and journalism still need a visa in advance",
    ],
    meta: baseMeta(input, port),
    policy: {
      policyType: "Hainan 30-day visa-free (island only)",
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      requirement: rule.requirement,
      allowedStayArea: "Hainan Province",
    },
    primaryCta: {
      label: "Read Hainan stay notes",
      href: "#official-sources",
    },
    secondaryCta: {
      label: "Official sources",
      href: "#official-sources",
    },
  };
}

function transit240Result(
  input: VisaCheckInput,
  rule: Transit240CountryRule,
  port: Transit240Port,
): VisaEvaluationResult {
  return {
    outcome: "transit_240",
    kicker: "May qualify · 240-hour visa-free transit",
    headline: `You may qualify for ${rule.maxStayHours}-hour (${rule.maxStayDays}-day) transit without a visa`,
    summary: `Your passport (${rule.country}) is on China’s 240-hour transit visa-free list. Entering via ${port.portName} allows a stay within ${port.allowedStayArea}, subject to transit conditions.`,
    note: rule.requirement,
    checklist: [
      "Confirmed onward ticket to a third country or region (not returning to the same origin)",
      `Enter through an eligible port — you selected ${port.portName}`,
      `Remain within the allowed stay area: ${port.allowedStayArea}`,
      `Leave within ${rule.maxStayHours} hours (${rule.maxStayDays} days)`,
      "Do not treat transit as a substitute for a tourist visa if your trip is a round-trip holiday",
    ],
    meta: baseMeta(input, port),
    policy: {
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      maxStayHours: rule.maxStayHours,
      requirement: rule.requirement,
      allowedStayArea: port.allowedStayArea,
    },
    primaryCta: {
      label: "Read transit visa-free guide",
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: "Official sources",
      href: "#official-sources",
    },
  };
}

function nearMiss240Result(
  input: VisaCheckInput,
  rule: Transit240CountryRule,
  missing: string[],
  port?: Transit240Port,
): VisaEvaluationResult {
  return {
    outcome: "near_miss_240",
    kicker: "Almost · 240-hour transit conditions incomplete",
    headline: "Your passport may qualify for 240-hour transit — but not with these details",
    summary: `${rule.country} is on the 240-hour transit visa-free list, but your current trip details do not fully meet the published conditions.`,
    missingConditions: missing,
    note: rule.requirement,
    checklist: [
      "Confirm an onward ticket to a different third country/region",
      "Choose an eligible 240-hour transit port of entry",
      "Keep your stay within 10 days (240 hours)",
      "Stay only within the allowed regional area for that port",
      "If you cannot meet transit rules, apply for a tourist visa instead",
    ],
    meta: baseMeta(input, port),
    policy: {
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      maxStayHours: rule.maxStayHours,
      requirement: rule.requirement,
      allowedStayArea: port?.allowedStayArea,
    },
    primaryCta: {
      label: "See how transit visa-free works",
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: "Official sources",
      href: "#official-sources",
    },
  };
}

function visaRequiredResult(
  input: VisaCheckInput,
  reason: string,
  port?: Transit240Port,
  extras?: { kicker?: string; headline?: string; checklist?: string[] },
): VisaEvaluationResult {
  const special = SPECIAL_VISA_PURPOSES.has(input.purpose);
  return {
    outcome: "visa_required",
    kicker: extras?.kicker
      ? extras.kicker
      : special
        ? "Visa required · Special purpose"
        : "Visa likely required",
    headline: extras?.headline
      ? extras.headline
      : special
        ? "You will need the correct visa category before travel"
        : "You will probably need a China visa before travel",
    summary: reason,
    note: extras?.checklist
      ? "Immigration officers make the final decision. Work, study, and journalism still need a visa in advance."
      : "Apply at a Chinese embassy, consulate, or authorized visa application center. Processing times vary by country and season.",
    checklist: extras?.checklist
      ? extras.checklist
      : special
      ? [
          "Confirm the correct visa type (e.g. Z work, X study, J journalism)",
          "Gather invitation letters and supporting documents early",
          "Do not travel on a tourist (L) visa for work or long study",
          "Check biometrics / interview requirements for your country",
          "Avoid non-refundable tickets until the visa is issued",
        ]
      : [
          "Typical tourist visa is category L; business is often M",
          "Prepare passport, photo, itinerary, and invitations if needed",
          "Apply several weeks before departure",
          "Some nationalities use visa centers or online pre-applications",
          "Confirm entry requirements with your airline before check-in",
        ],
    meta: baseMeta(input, port),
    primaryCta: {
      label: "Browse visa application guides",
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: "Official sources",
      href: "#official-sources",
    },
  };
}

export function evaluateVisa(input: VisaCheckInput): VisaEvaluationResult {
  const port = input.portId ? getPortById(input.portId) : undefined;
  const nationality = toCanonicalCountryName(input.nationality);

  if (!nationality || !input.purpose || !input.stayDays || !input.transitRoute) {
    return visaRequiredResult(
      input,
      "Incomplete trip details — please complete all fields and try again.",
      port,
    );
  }

  if (SPECIAL_VISA_PURPOSES.has(input.purpose)) {
    return visaRequiredResult(
      input,
      `Your purpose (${PURPOSE_LABELS[input.purpose] ?? input.purpose}) generally requires a dedicated China visa and is not covered by short-stay visa-free or transit policies.`,
      port,
    );
  }

  const visaFree = getVisaFreeRule(nationality);
  if (
    visaFree &&
    VISA_FREE_PURPOSES.has(input.purpose) &&
    input.stayDays <= visaFree.maxStayDays
  ) {
    return visaFreeResult(input, visaFree, port);
  }

  const hainan = getHainan30Rule(nationality);
  if (
    hainan &&
    isHainanPort(port) &&
    port &&
    VISA_FREE_PURPOSES.has(input.purpose) &&
    input.stayDays <= hainan.maxStayDays
  ) {
    return hainan30Result(input, hainan, port);
  }

  // Visa-free country but stay too long
  if (visaFree && input.stayDays > visaFree.maxStayDays) {
    // Fall through — may still qualify for 240h if stay ≤ 10, else required
  }

  const transitRule = getTransit240Rule(nationality);
  // Only evaluate 240h transit when the traveler's answers suggest a transit itinerary.
  // Tourism + "no transit" must not surface near-miss transit warnings (Sarah UX bug).
  const shouldEvaluateTransit240 =
    Boolean(transitRule) &&
    input.transitRoute !== "no_transit" &&
    (input.purpose === "transit" ||
      input.transitRoute === "third_country_confirmed" ||
      input.transitRoute === "same_country_return" ||
      input.transitRoute === "not_sure");

  if (transitRule && shouldEvaluateTransit240) {
    const missing: string[] = [];
    if (input.transitRoute !== "third_country_confirmed") {
      missing.push(
        "Confirmed onward ticket to a third country/region (not a same-country return)",
      );
    }
    if (input.stayDays > transitRule.maxStayDays) {
      missing.push(
        `Stay within ${transitRule.maxStayDays} days (${transitRule.maxStayHours} hours)`,
      );
    }
    if (!port) {
      missing.push("Enter through an eligible 240-hour transit port");
    }

    const qualifies =
      input.transitRoute === "third_country_confirmed" &&
      input.stayDays <= transitRule.maxStayDays &&
      Boolean(port);

    if (qualifies && port) {
      return transit240Result(input, transitRule, port);
    }

    return nearMiss240Result(input, transitRule, missing, port);
  }

  if (visaFree && input.stayDays > visaFree.maxStayDays) {
    return visaRequiredResult(
      input,
      `Your passport may qualify for ${visaFree.maxStayDays}-day visa-free entry, but your planned stay (${STAY_LABELS[input.stayDays] ?? input.stayDays + " days"}) exceeds that limit. Apply for a visa for longer trips.`,
      port,
    );
  }

  if (transitRule && input.transitRoute === "no_transit") {
    if (hainan) {
      return visaRequiredResult(
        input,
        `From 20 August 2026, ${nationality} ordinary-passport holders have two visa-free paths: (1) 240-hour transit with a confirmed onward ticket to a third country through a designated port, or (2) up to 30 days in Hainan Province only after entering through a Hainan open port. A mainland round-trip holiday that starts and ends at home still needs a visa.`,
        port,
        {
          kicker: "Two visa-free paths · mainland holiday still needs a visa",
          headline:
            "240-hour transit and Hainan 30-day stay — not nationwide visa-free",
          checklist: [
            "Hainan 30-day stay: enter through Haikou, Sanya, or another Hainan open port and remain on the island",
            "240-hour transit: confirmed onward ticket to a third country through a designated port",
            "A mainland round-trip holiday that starts and ends at home still needs a visa",
            "Tourism, business, visits, and family stays only — work, study, and journalism need a visa in advance",
            "Ordinary passport required",
          ],
        },
      );
    }
    return visaRequiredResult(
      input,
      `For a standalone ${PURPOSE_LABELS[input.purpose] ?? "trip"} to China (no third-country transit), ${nationality} passport holders typically need a China visa before travel. 240-hour transit is a separate path only when you have a confirmed onward ticket to a third country.`,
      port,
      {
        kicker: "240-hour transit possible · mainland holiday needs a visa",
        headline:
          "A mainland holiday still needs a visa — 240-hour transit is a separate path",
        checklist: [
          "Confirmed onward ticket to a third country or region (not a same-country return)",
          "Enter through an eligible 240-hour port",
          "Stay within 240 hours and inside the allowed region for that port",
          "A standalone holiday that starts and ends at home still needs a tourist visa",
          "Confirm entry requirements with your airline before check-in",
        ],
      },
    );
  }

  return visaRequiredResult(
    input,
    `We did not find a short-stay visa-free or 240-hour transit match for ${nationality} with your trip details. Plan to apply for a China visa before travel.`,
    port,
  );
}

export { PURPOSE_LABELS, TRANSIT_LABELS, STAY_LABELS };
