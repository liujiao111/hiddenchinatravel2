import { toCanonicalCountryName } from "./country-aliases";
import { fillTemplate, getVisaCopy, type VisaLang } from "./i18n";
import {
  getCountryDisplayName,
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

const VISA_FREE_PURPOSES = new Set([
  "tourism",
  "business",
  "family_visit",
  "exchange",
  "transit",
  "other",
]);

const SPECIAL_VISA_PURPOSES = new Set(["work", "study", "journalism"]);

function portLabel(
  port: Transit240Port | undefined,
  portId: string,
  lang: VisaLang,
): string {
  if (!port) return portId || "—";
  const copy = getVisaCopy(lang);
  const city = copy.portCityLabels[port.city] ?? port.city;
  const name = copy.portNameLabels[port.portName] ?? port.portName;
  return `${city} · ${name}`;
}

function portName(port: Transit240Port, lang: VisaLang): string {
  const copy = getVisaCopy(lang);
  return copy.portNameLabels[port.portName] ?? port.portName;
}

function stayArea(area: string, lang: VisaLang): string {
  const copy = getVisaCopy(lang);
  return copy.stayAreaLabels[area] ?? area;
}

function baseMeta(input: VisaCheckInput, port: Transit240Port | undefined, lang: VisaLang) {
  const copy = getVisaCopy(lang);
  return {
    nationality: getCountryDisplayName(input.nationality, lang) || input.nationality,
    purpose: copy.purposeLabels[input.purpose] ?? input.purpose,
    stayLabel:
      copy.stayLabels[String(input.stayDays)] ??
      fillTemplate(copy.texts.stayDaysFallback, { days: input.stayDays }),
    transitLabel: copy.transitLabels[input.transitRoute] ?? input.transitRoute,
    portLabel: portLabel(port, input.portId, lang),
  };
}

function visaFreeResult(
  input: VisaCheckInput,
  rule: VisaFreeRule,
  port: Transit240Port | undefined,
  lang: VisaLang,
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const isMutual = rule.ruleType === "mutual_visa_free";
  const policy = copy.policyTypeLabels[rule.policyType] ?? rule.policyType.toLowerCase();
  const country = getCountryDisplayName(rule.country, lang);
  return {
    outcome: "visa_free",
    kicker: isMutual ? copy.texts.visaFreeKickerMutual : copy.texts.visaFreeKickerUnilateral,
    headline: fillTemplate(copy.texts.visaFreeHeadline, { days: rule.maxStayDays }),
    summary: fillTemplate(copy.texts.visaFreeSummary, {
      country,
      policy,
      days: rule.maxStayDays,
    }),
    note: copy.texts.visaFreeNote,
    checklist: copy.lists.visaFreeChecklist.map((item) =>
      fillTemplate(item, { days: rule.maxStayDays }),
    ),
    meta: baseMeta(input, port, lang),
    policy: {
      policyType: rule.policyType,
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
    },
    primaryCta: {
      label: copy.texts.ctaVisaFree,
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: copy.texts.ctaOfficial,
      href: "#official-sources",
    },
  };
}

function hainan30Result(
  input: VisaCheckInput,
  rule: Hainan30CountryRule,
  port: Transit240Port,
  lang: VisaLang,
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const country = getCountryDisplayName(rule.country, lang);
  return {
    outcome: "hainan_30",
    kicker: copy.texts.hainanKicker,
    headline: fillTemplate(copy.texts.hainanHeadline, { days: rule.maxStayDays }),
    summary: fillTemplate(copy.texts.hainanSummary, {
      country,
      days: rule.maxStayDays,
    }),
    note:
      copy.requirementLabels[rule.requirement] ?? rule.requirement,
    checklist: copy.lists.hainanChecklist.map((item) =>
      fillTemplate(item, { port: portName(port, lang), days: rule.maxStayDays }),
    ),
    meta: baseMeta(input, port, lang),
    policy: {
      policyType: copy.texts.hainanPolicyType,
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      requirement: copy.requirementLabels[rule.requirement] ?? rule.requirement,
      allowedStayArea: stayArea("Hainan Province", lang),
    },
    primaryCta: {
      label: copy.texts.ctaHainan,
      href: "#official-sources",
    },
    secondaryCta: {
      label: copy.texts.ctaOfficial,
      href: "#official-sources",
    },
  };
}

function transit240Result(
  input: VisaCheckInput,
  rule: Transit240CountryRule,
  port: Transit240Port,
  lang: VisaLang,
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const country = getCountryDisplayName(rule.country, lang);
  const area = stayArea(port.allowedStayArea, lang);
  return {
    outcome: "transit_240",
    kicker: copy.texts.transitKicker,
    headline: fillTemplate(copy.texts.transitHeadline, {
      hours: rule.maxStayHours,
      days: rule.maxStayDays,
    }),
    summary: fillTemplate(copy.texts.transitSummary, {
      country,
      port: portName(port, lang),
      area,
    }),
    note: copy.requirementLabels[rule.requirement] ?? rule.requirement,
    checklist: copy.lists.transitChecklist.map((item) =>
      fillTemplate(item, {
        port: portName(port, lang),
        area,
        hours: rule.maxStayHours,
        days: rule.maxStayDays,
      }),
    ),
    meta: baseMeta(input, port, lang),
    policy: {
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      maxStayHours: rule.maxStayHours,
      requirement: copy.requirementLabels[rule.requirement] ?? rule.requirement,
      allowedStayArea: area,
    },
    primaryCta: {
      label: copy.texts.ctaTransit,
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: copy.texts.ctaOfficial,
      href: "#official-sources",
    },
  };
}

function nearMiss240Result(
  input: VisaCheckInput,
  rule: Transit240CountryRule,
  missing: string[],
  port: Transit240Port | undefined,
  lang: VisaLang,
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const country = getCountryDisplayName(rule.country, lang);
  const area = port ? stayArea(port.allowedStayArea, lang) : undefined;
  return {
    outcome: "near_miss_240",
    kicker: copy.texts.nearMissKicker,
    headline: copy.texts.nearMissHeadline,
    summary: fillTemplate(copy.texts.nearMissSummary, { country }),
    missingConditions: missing.map((item) =>
      fillTemplate(item, {
        days: rule.maxStayDays,
        hours: rule.maxStayHours,
      }),
    ),
    note: copy.requirementLabels[rule.requirement] ?? rule.requirement,
    checklist: copy.lists.nearMissChecklist,
    meta: baseMeta(input, port, lang),
    policy: {
      ruleType: rule.ruleType,
      maxStayDays: rule.maxStayDays,
      maxStayHours: rule.maxStayHours,
      requirement: copy.requirementLabels[rule.requirement] ?? rule.requirement,
      allowedStayArea: area,
    },
    primaryCta: {
      label: copy.texts.ctaSeeTransit,
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: copy.texts.ctaOfficial,
      href: "#official-sources",
    },
  };
}

function visaRequiredResult(
  input: VisaCheckInput,
  reason: string,
  port: Transit240Port | undefined,
  lang: VisaLang,
  extras?: { kicker?: string; headline?: string; checklist?: string[]; note?: string },
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const special = SPECIAL_VISA_PURPOSES.has(input.purpose);
  return {
    outcome: "visa_required",
    kicker: extras?.kicker
      ? extras.kicker
      : special
        ? copy.texts.requiredKickerSpecial
        : copy.texts.requiredKicker,
    headline: extras?.headline
      ? extras.headline
      : special
        ? copy.texts.requiredHeadlineSpecial
        : copy.texts.requiredHeadline,
    summary: reason,
    note: extras?.note
      ? extras.note
      : extras?.checklist
        ? copy.texts.requiredNoteSpecial
        : copy.texts.requiredNoteStandard,
    checklist: extras?.checklist
      ? extras.checklist
      : special
      ? copy.lists.requiredChecklistSpecial
      : copy.lists.requiredChecklistStandard,
    meta: baseMeta(input, port, lang),
    primaryCta: {
      label: copy.texts.ctaBrowseGuides,
      href: "/do-i-need-a-visa-for-china",
    },
    secondaryCta: {
      label: copy.texts.ctaOfficial,
      href: "#official-sources",
    },
  };
}

export function evaluateVisa(
  input: VisaCheckInput,
  lang: VisaLang = "en",
): VisaEvaluationResult {
  const copy = getVisaCopy(lang);
  const port = input.portId ? getPortById(input.portId) : undefined;
  const nationality = toCanonicalCountryName(input.nationality);
  const nationalityLabel = getCountryDisplayName(nationality, lang) || nationality;

  if (!nationality || !input.purpose || !input.stayDays || !input.transitRoute) {
    return visaRequiredResult(
      input,
      copy.texts.incompleteDetails,
      port,
      lang,
    );
  }

  if (SPECIAL_VISA_PURPOSES.has(input.purpose)) {
    return visaRequiredResult(
      input,
      fillTemplate(copy.texts.specialPurposeSummary, {
        purpose: copy.purposeLabels[input.purpose] ?? input.purpose,
      }),
      port,
      lang,
    );
  }

  const visaFree = getVisaFreeRule(nationality);
  if (
    visaFree &&
    VISA_FREE_PURPOSES.has(input.purpose) &&
    input.stayDays <= visaFree.maxStayDays
  ) {
    return visaFreeResult(input, visaFree, port, lang);
  }

  const hainan = getHainan30Rule(nationality);
  if (
    hainan &&
    isHainanPort(port) &&
    port &&
    VISA_FREE_PURPOSES.has(input.purpose) &&
    input.stayDays <= hainan.maxStayDays
  ) {
    return hainan30Result(input, hainan, port, lang);
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
      missing.push(copy.lists.nearMissConditions[0]);
    }
    if (input.stayDays > transitRule.maxStayDays) {
      missing.push(
        fillTemplate(copy.lists.nearMissConditions[1], {
          days: transitRule.maxStayDays,
          hours: transitRule.maxStayHours,
        }),
      );
    }
    if (!port) {
      missing.push(copy.lists.nearMissConditions[2]);
    }

    const qualifies =
      input.transitRoute === "third_country_confirmed" &&
      input.stayDays <= transitRule.maxStayDays &&
      Boolean(port);

    if (qualifies && port) {
      return transit240Result(input, transitRule, port, lang);
    }

    return nearMiss240Result(input, transitRule, missing, port, lang);
  }

  if (visaFree && input.stayDays > visaFree.maxStayDays) {
    const stayLabel =
      copy.stayLabels[String(input.stayDays)] ??
      fillTemplate(copy.texts.stayDaysFallback, { days: input.stayDays });
    return visaRequiredResult(
      input,
      fillTemplate(copy.texts.overstaySummary, {
        days: visaFree.maxStayDays,
        stay: stayLabel,
      }),
      port,
      lang,
    );
  }

  if (transitRule && input.transitRoute === "no_transit") {
    if (hainan) {
      return visaRequiredResult(
        input,
        fillTemplate(copy.texts.twoPathsSummary, { country: nationalityLabel }),
        port,
        lang,
        {
          kicker: copy.texts.twoPathsKicker,
          headline: copy.texts.twoPathsHeadline,
          checklist: copy.lists.twoPathsChecklist,
        },
      );
    }
    return visaRequiredResult(
      input,
      fillTemplate(copy.texts.standaloneSummary, {
        purpose: copy.purposeLabels[input.purpose] ?? "trip",
        country: nationalityLabel,
      }),
      port,
      lang,
      {
        kicker: copy.texts.standaloneKicker,
        headline: copy.texts.standaloneHeadline,
        checklist: copy.lists.standaloneChecklist,
      },
    );
  }

  return visaRequiredResult(
    input,
    fillTemplate(copy.texts.noMatchSummary, { country: nationalityLabel }),
    port,
    lang,
  );
}

export { PURPOSE_LABELS, TRANSIT_LABELS, STAY_LABELS } from "./i18n";
