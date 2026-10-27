/**
 * Template for every published traveler story.
 *
 * Fill each field from the trip record. Use "Not published" when a fact
 * such as the travel month cannot be stated. Do not invent a driver-guide,
 * a travel month, hotel names, or screenshots that are not in the source.
 * Evidence images stay empty until the original file can be shown.
 */
export type CaseStudyEvidenceKind = "map" | "whatsapp" | "itinerary" | "driver-guide";

export type CaseStudyEvidence = {
  kind: CaseStudyEvidenceKind;
  title: string;
  detail: string;
};

export type TravelerCaseStudy = {
  snapshot: {
    traveler: string;
    country: string;
    travelStyle: string;
    duration: string;
    travelMonth: string;
    route: string[];
    support: string[];
  };
  beforeTrip: {
    paragraphs: string[];
    quote?: string;
  };
  planning: {
    intro: string;
    image?: { src: string; alt: string; position?: string };
    steps: { title: string; text: string }[];
  };
  evidence: [
    CaseStudyEvidence,
    CaseStudyEvidence,
    CaseStudyEvidence,
    CaseStudyEvidence,
  ];
  journeyIntro: string;
  whatChanged: {
    before: string[];
    after: string[];
  };
};
