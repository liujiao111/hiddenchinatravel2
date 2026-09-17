import fs from "fs";
import path from "path";
import { evaluateVisa, type VisaEvaluationResult } from "./evaluate";
import {
  getHainan30Rule,
  getTransit240Rule,
  getVisaFreeRule,
  type Hainan30CountryRule,
  type Transit240CountryRule,
  type VisaFreeRule,
} from "./load-rules";

export type CountryPolicyBucket =
  | "visa_free"
  | "transit_240_only"
  | "visa_required";

export type CountryPageEditorial = {
  slug: string;
  iso2: string;
  canonicalName: string;
  displayName: string;
  demonym: string;
  demonymSingular: string;
  priority: "phase1" | "later" | string;
  lastReviewed: string;
  uniqueNotes: string[];
  commonRoutes: string;
  faqOverrides?: { question: string; answer: string }[];
};

export type CountryPageFaq = {
  id: string;
  question: string;
  answer: string;
};

export type CountryPageModel = {
  editorial: CountryPageEditorial;
  bucket: CountryPolicyBucket;
  hasVisaFree: boolean;
  hasTransit240: boolean;
  hasHainan30: boolean;
  visaFree?: VisaFreeRule;
  transit240?: Transit240CountryRule;
  hainan30?: Hainan30CountryRule;
  conclusionChecklist: string[];
  /** Primary tourism / no-transit evaluation (matches article “do I need a visa?” framing). */
  primaryResult: VisaEvaluationResult;
  /** Optional transit path when passport is on 240h list. */
  transitResult?: VisaEvaluationResult;
  title: string;
  description: string;
  h1: string;
  conclusionHeadline: string;
  conclusionSummary: string;
  faqs: CountryPageFaq[];
  relatedSlugs: string[];
};

const DATA_PATH = path.join(process.cwd(), "data", "visa-country-pages.json");

/** Common alternate URLs → canonical slug. */
export const COUNTRY_SLUG_ALIASES: Record<string, string> = {
  usa: "united-states",
  us: "united-states",
  uk: "united-kingdom",
  britain: "united-kingdom",
  "great-britain": "united-kingdom",
  korea: "south-korea",
  "republic-of-korea": "south-korea",
  "south-korea-republic-of": "south-korea",
  kyrgyz: "kyrgyzstan",
  "kyrgyz-republic": "kyrgyzstan",
  "viet-nam": "vietnam",
};

let editorialCache: CountryPageEditorial[] | null = null;

function loadEditorial(): CountryPageEditorial[] {
  if (editorialCache) return editorialCache;
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  editorialCache = JSON.parse(raw) as CountryPageEditorial[];
  return editorialCache;
}

export function getAllCountryPageEditorials(): CountryPageEditorial[] {
  return loadEditorial();
}

export function getPhase1CountryEditorials(): CountryPageEditorial[] {
  return loadEditorial().filter((e) => e.priority === "phase1");
}

export function resolveCountrySlug(param: string): string {
  const key = param.trim().toLowerCase();
  return COUNTRY_SLUG_ALIASES[key] ?? key;
}

export function getCountryEditorialBySlug(
  slug: string,
): CountryPageEditorial | undefined {
  const resolved = resolveCountrySlug(slug);
  return loadEditorial().find((e) => e.slug === resolved);
}

function deriveBucket(
  visaFree: VisaFreeRule | undefined,
  transit240: Transit240CountryRule | undefined,
): CountryPolicyBucket {
  if (visaFree) return "visa_free";
  if (transit240) return "transit_240_only";
  return "visa_required";
}

function buildFaqs(
  editorial: CountryPageEditorial,
  bucket: CountryPolicyBucket,
  visaFree: VisaFreeRule | undefined,
  transit240: Transit240CountryRule | undefined,
  hainan30: Hainan30CountryRule | undefined,
): CountryPageFaq[] {
  const { demonym, demonymSingular, displayName } = editorial;
  const faqs: CountryPageFaq[] = [];

  if (bucket === "visa_free" && visaFree) {
    faqs.push({
      id: "need-visa",
      question: `Do ${demonym} need a visa for China?`,
      answer: `Usually no for short tourism or business stays. ${demonymSingular.replace(/^a /i, "A ").replace(/^an /i, "An ")} with an ordinary passport may enter visa-free for up to ${visaFree.maxStayDays} days under China’s ${visaFree.policyType.toLowerCase()} policy. Work, study, journalism, and longer trips still need a visa.`,
    });
    faqs.push({
      id: "how-long",
      question: `How long can ${demonym} stay in China visa-free?`,
      answer: `Up to ${visaFree.maxStayDays} days under the current published rule for ${displayName}. Extensions are generally not available — leave on time or arrange a visa for a longer stay.`,
    });
  } else if (bucket === "transit_240_only" && transit240) {
    faqs.push({
      id: "need-visa",
      question: `Do ${demonym} need a visa for China?`,
      answer: hainan30
        ? `Not for two published visa-free paths. From 20 August 2026 ${demonym} may use 240-hour transit with a confirmed third-country ticket, or stay up to ${hainan30.maxStayDays} days in Hainan Province after entering through a Hainan open port. A round-trip mainland holiday that starts and ends at home still needs a visa.`
        : `For a standalone China trip (no third-country transit), yes — ${demonym} are not on the 30-day visa-free list and should apply for a tourist or other visa before travel. A separate path exists: ${transit240.maxStayHours}-hour (${transit240.maxStayDays}-day) visa-free transit when you have a confirmed onward ticket to a third country via an eligible port.`,
    });
    faqs.push({
      id: "transit",
      question: `Can ${demonym} use China’s 240-hour transit visa-free policy?`,
      answer: `Yes, if conditions are met: confirmed onward ticket to a different third country/region, entry through an eligible port, stay within ${transit240.maxStayHours} hours, and remaining inside the allowed stay area for that port. A simple round-trip home–China–home itinerary does not qualify.`,
    });
  } else {
    faqs.push({
      id: "need-visa",
      question: `Do ${demonym} need a visa for China?`,
      answer: `Yes. ${displayName} is not on China’s published 30-day visa-free list or the 240-hour transit country list in our rules data. ${demonymSingular.replace(/^a /i, "A ").replace(/^an /i, "An ")} should apply for the correct visa (often tourist L) before flying.`,
    });
    faqs.push({
      id: "how-to-apply",
      question: `How should ${demonym} apply for a China visa?`,
      answer: `Apply through a Chinese embassy, consulate, or authorized visa application center in your country. Start several weeks before departure, and confirm photo, invitation, and appointment rules for your city.`,
    });
  }

  if (transit240 && bucket === "visa_free") {
    faqs.push({
      id: "transit-also",
      question: `Are ${demonym} also eligible for 240-hour transit?`,
      answer: `Yes — ${displayName} appears on the 240-hour transit list as well. Most short holidays use the ${visaFree?.maxStayDays ?? 30}-day visa-free path instead. Use transit rules only when you are genuinely connecting to a third country.`,
    });
  }

  // Country-specific FAQs first (stronger differentiation than shared boilerplate).
  if (editorial.faqOverrides?.length) {
    editorial.faqOverrides.forEach((item, i) => {
      faqs.push({
        id: `override-${i}`,
        question: item.question,
        answer: item.answer,
      });
    });
  }

  // Skip the generic emergency-passport FAQ when a country already covers that topic.
  const overrideText = (editorial.faqOverrides ?? [])
    .map((item) => `${item.question} ${item.answer}`.toLowerCase())
    .join(" ");
  const hasEmergencyOverride = /emergency|temporary passport|travel document|notpass|laissez-passer|titre de voyage/.test(
    overrideText,
  );

  if (!hasEmergencyOverride) {
    faqs.push({
      id: "emergency-passport",
      question: `Can ${demonym} enter visa-free on an emergency passport?`,
      answer: `Generally no. China’s short-stay visa-free and transit visa-free policies typically require an ordinary passport. If you hold an emergency or limited-validity travel document, plan to apply for a visa.`,
    });
  }

  faqs.push({
    id: "verify",
    question: "Is this official immigration advice?",
    answer:
      "No. This page summarizes published policy for trip planning only. Rules change — confirm with the National Immigration Administration, your airline, and a Chinese embassy or consulate before you book non-refundable travel.",
  });

  return faqs;
}

function buildCopy(
  editorial: CountryPageEditorial,
  bucket: CountryPolicyBucket,
  visaFree: VisaFreeRule | undefined,
  transit240: Transit240CountryRule | undefined,
  hainan30: Hainan30CountryRule | undefined,
  primary: VisaEvaluationResult,
): Pick<
  CountryPageModel,
  "title" | "description" | "h1" | "conclusionHeadline" | "conclusionSummary"
> {
  const { demonym, displayName } = editorial;
  const year = "2026";

  if (bucket === "visa_free" && visaFree) {
    return {
      title: `Do ${demonym} need a visa for China? (${year} Visa-Free Policy)`,
      description: `${demonym} may enter China visa-free for up to ${visaFree.maxStayDays} days in ${year}. See stay limits, passport rules, 240-hour transit notes, and when you still need a visa.`,
      h1: `Do ${demonym} need a visa for China?`,
      conclusionHeadline: primary.headline,
      conclusionSummary: primary.summary,
    };
  }

  if (bucket === "transit_240_only" && transit240) {
    if (hainan30) {
      return {
        title: `Do ${demonym} need a visa for China? (${year} Transit & Hainan)`,
        description: `From 20 August 2026, ${demonym} may use 240-hour visa-free transit or stay up to ${hainan30.maxStayDays} days in Hainan. A mainland round-trip holiday still needs a visa.`,
        h1: `Do ${demonym} need a visa for China?`,
        conclusionHeadline:
          "Two visa-free paths — not nationwide 30-day entry",
        conclusionSummary: `From 20 August 2026, ${demonym} with an ordinary passport may (1) stay up to 240 hours visa-free when transiting to a third country through a designated port, or (2) stay up to ${hainan30.maxStayDays} days inside Hainan Province after entering through a Hainan open port. A round-trip holiday around mainland China still needs a visa.`,
      };
    }
    return {
      title: `Do ${demonym} need a visa for China? (${year} Rules & 240-Hour Transit)`,
      description: `${demonym} are not on China’s 30-day visa-free list. 240-hour transit visa-free can apply with a third-country ticket; a standalone holiday still needs a visa.`,
      h1: `Do ${demonym} need a visa for China?`,
      conclusionHeadline:
        "240-hour transit is available — a standalone holiday still needs a visa",
      conclusionSummary: `${displayName} is not on China’s nationwide 30-day visa-free list. You may stay up to ${transit240.maxStayHours} hours visa-free when transiting to a third country with a confirmed onward ticket through a designated port. A round-trip holiday that starts and ends at home still needs a visa.`,
    };
  }

  return {
    title: `Do ${demonym} need a visa for China? (${year} Application Guide)`,
    description: `${demonym} generally need a China visa before travel. See why ${displayName} is not on the visa-free lists, how to prepare, and what to do next.`,
    h1: `Do ${demonym} need a visa for China?`,
    conclusionHeadline: primary.headline,
    conclusionSummary: primary.summary,
  };
}

function conclusionChecklistFor(
  bucket: CountryPolicyBucket,
  transit240: Transit240CountryRule | undefined,
  hainan30: Hainan30CountryRule | undefined,
  primary: VisaEvaluationResult,
): string[] {
  if (bucket === "transit_240_only" && transit240) {
    const items = [
      hainan30
        ? `Hainan ${hainan30.maxStayDays}-day stay: enter through a Hainan open port and remain in Hainan Province`
        : null,
      "240-hour transit: confirmed onward ticket to a third country or region",
      "Enter through an eligible 240-hour port and stay inside that port’s allowed area",
      "A mainland round-trip holiday that starts and ends at home still needs a visa",
    ];
    return items.filter((item): item is string => Boolean(item));
  }
  return primary.checklist.slice(0, 5);
}

function relatedFor(
  editorial: CountryPageEditorial,
  bucket: CountryPolicyBucket,
): string[] {
  const all = getPhase1CountryEditorials();
  const same = all.filter(
    (e) =>
      e.slug !== editorial.slug &&
      deriveBucket(
        getVisaFreeRule(e.canonicalName),
        getTransit240Rule(e.canonicalName),
      ) === bucket,
  );
  return same.slice(0, 5).map((e) => e.slug);
}

/** Build the full SEO page model for a country slug. */
export function getCountryVisaPage(slug: string): CountryPageModel | null {
  const editorial = getCountryEditorialBySlug(slug);
  if (!editorial) return null;

  const visaFree = getVisaFreeRule(editorial.canonicalName);
  const transit240 = getTransit240Rule(editorial.canonicalName);
  const hainan30 = getHainan30Rule(editorial.canonicalName);
  const bucket = deriveBucket(visaFree, transit240);

  const primaryResult = evaluateVisa({
    nationality: editorial.canonicalName,
    purpose: "tourism",
    stayDays: 10,
    transitRoute: "no_transit",
    portId: "",
  });

  let transitResult: VisaEvaluationResult | undefined;
  if (transit240) {
    // Port ID 11 = Shanghai Pudong — representative eligible airport for examples
    transitResult = evaluateVisa({
      nationality: editorial.canonicalName,
      purpose: "transit",
      stayDays: 10,
      transitRoute: "third_country_confirmed",
      portId: "11",
    });
  }

  const copy = buildCopy(
    editorial,
    bucket,
    visaFree,
    transit240,
    hainan30,
    primaryResult,
  );

  return {
    editorial,
    bucket,
    hasVisaFree: Boolean(visaFree),
    hasTransit240: Boolean(transit240),
    hasHainan30: Boolean(hainan30),
    visaFree,
    transit240,
    hainan30,
    primaryResult,
    transitResult,
    ...copy,
    conclusionChecklist: conclusionChecklistFor(
      bucket,
      transit240,
      hainan30,
      primaryResult,
    ),
    faqs: buildFaqs(editorial, bucket, visaFree, transit240, hainan30),
    relatedSlugs: relatedFor(editorial, bucket),
  };
}

export function getCountryPagesGrouped(): {
  visaFree: CountryPageEditorial[];
  transit240Only: CountryPageEditorial[];
  visaRequired: CountryPageEditorial[];
} {
  const visaFree: CountryPageEditorial[] = [];
  const transit240Only: CountryPageEditorial[] = [];
  const visaRequired: CountryPageEditorial[] = [];

  for (const e of getPhase1CountryEditorials()) {
    const bucket = deriveBucket(
      getVisaFreeRule(e.canonicalName),
      getTransit240Rule(e.canonicalName),
    );
    if (bucket === "visa_free") visaFree.push(e);
    else if (bucket === "transit_240_only") transit240Only.push(e);
    else visaRequired.push(e);
  }

  const byName = (a: CountryPageEditorial, b: CountryPageEditorial) =>
    a.displayName.localeCompare(b.displayName);

  return {
    visaFree: visaFree.sort(byName),
    transit240Only: transit240Only.sort(byName),
    visaRequired: visaRequired.sort(byName),
  };
}

export function countryPagePath(slug: string): string {
  return `/china-visa-checker/${slug}`;
}
