import type { ProofSlide } from "@/components/proof-carousel";

export type TrustCopy = {
  kicker: string;
  title: string;
  copy: string;
};

export type CredentialDocument = {
  href: string;
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
};

export const licensedOperator = {
  nameEn: "Yunnan Meizhen International Travel Agency Co., Ltd.",
  nameZh: "云南美珍国际旅行社有限公司",
  permitNumber: "L-YN-1017500",
  unifiedSocialCreditCode: "9153001111MACHIXW95XT",
} as const;

const teamRoot = "/assets/partners/huatai";
const vehicleRoot = "/assets/partners/vehicles";
const credentialsRoot = "/assets/partners/meizhen";

const localTeamSlides: ProofSlide[] = [
  { src: `${teamRoot}/guides/zhang-zihang.webp`, alt: "Portrait of Zhang Zihang", title: "Zhang Zihang (Jason)", detail: "English-speaking guide · English guide qualification", copy: "A profile from the local guide team. Final assignment depends on your dates." },
  { src: `${teamRoot}/guides/kuang-jintao.webp`, alt: "Portrait of Kuang Jintao", title: "Kuang Jintao (Taozi)", detail: "Chinese-speaking guide · 8 years of experience", copy: "Experienced with private and custom journeys." },
  { src: `${teamRoot}/guides/huang-qun.webp`, alt: "Portrait of Huang Qun", title: "Huang Qun (Daxiang)", detail: "Chinese-speaking guide · 7 years of experience", copy: "Experienced with private and educational journeys." },
];

export const localGuideProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR GUIDE",
  title: "A person who knows the route",
  copy: "A local guide is included throughout the journey. Choose Chinese or English, and ask Joy about another language in advance. These profiles are examples from the guide team supporting these journeys. The final assignment depends on your dates and is confirmed in writing.",
  label: "Local guide profiles",
  slides: localTeamSlides,
};

export const driverHostProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR DRIVER-HOST",
  title: "A person who knows the route",
  copy: "A Chinese- or English-speaking driver-host is included. They handle the listed pickups, private transport and route coordination, and can offer local context and restaurant suggestions. This is not a professional attraction-guide service. The driver usually does not accompany you inside attractions. A specialist site guide can be arranged separately.",
  label: "Local team profiles",
  slides: localTeamSlides,
};

export const optionalGuideProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR LOCAL TEAM",
  title: "Driver-only or guided, confirmed in writing",
  copy: "A tailor-made journey can be driver-only or include a Chinese- or English-speaking guide. The profiles below are examples from the local team. Nothing is included until the licensed operator confirms it in your proposal.",
  label: "Local team profiles",
  slides: localTeamSlides,
};

export const vehicleProof: TrustCopy & { groups: { id: "five" | "seven"; label: string; carouselLabel: string; slides: ProofSlide[] }[] } = {
  kicker: "02 / YOUR VEHICLE",
  title: "Five or seven seats, matched to your party.",
  copy: "A seven-seat vehicle gives more room for people and luggage. A five-seat vehicle suits a smaller party. These are examples from the private-vehicle catalog, not a promise of one exact model. The final vehicle is confirmed in your written proposal.",
  groups: [
    {
      id: "seven",
      label: "7 SEATS",
      carouselLabel: "Seven-seat vehicle examples",
      slides: [
        { src: `${vehicleRoot}/seven-seat-van.webp`, alt: "Example of a seven-seat passenger van, including its exterior and seating", title: "Seven-seat van", detail: "Example · passenger van", copy: "Exterior, captain seats and rear seating." },
        { src: `${vehicleRoot}/seven-seat-maxus.webp`, alt: "Example of a seven-seat Maxus MPV, cabin and luggage space", title: "Seven-seat MPV", detail: "Example · Maxus", copy: "Cabin space and luggage room for a small private party." },
        { src: `${vehicleRoot}/seven-seat-interiors.webp`, alt: "Examples of seven-seat MPV exteriors, seating and luggage areas", title: "Seven-seat interiors", detail: "Example · MPV seating", copy: "Additional interior examples. The final vehicle depends on your party and luggage." },
      ],
    },
    {
      id: "five",
      label: "5 SEATS",
      carouselLabel: "Five-seat vehicle examples",
      slides: [
        { src: `${vehicleRoot}/five-seat-hongqi.webp`, alt: "Example of a five-seat Hongqi sedan and its rear seats", title: "Five-seat sedan", detail: "Example · Hongqi", copy: "Exterior and rear seating for a smaller party." },
        { src: `${vehicleRoot}/five-seat-aion.webp`, alt: "Example of a five-seat GAC Aion SUV, passenger seats and front cabin", title: "Five-seat SUV", detail: "Example · GAC Aion", copy: "Another five-seat option, shown outside and inside." },
        { src: `${vehicleRoot}/five-seat-toyota.webp`, alt: "Example of a five-seat Toyota SUV and its passenger seating", title: "Five-seat SUV", detail: "Example · Toyota", copy: "A further five-seat example from the vehicle catalog." },
      ],
    },
  ],
};

export const operatorCredentials: TrustCopy & { documents: CredentialDocument[] } = {
  kicker: "THE LOCAL OPERATOR",
  title: "Company documents you can inspect",
  copy: `${licensedOperator.nameEn} (${licensedOperator.nameZh}) is the licensed operator for these journeys. It confirms the services, handles the travel contract and operates the trip. Its travel agency permit number is ${licensedOperator.permitNumber}. Its unified social credit code is ${licensedOperator.unifiedSocialCreditCode}.`,
  documents: [
    { href: `${credentialsRoot}/credentials/business-license.jpg`, src: `${credentialsRoot}/credentials/business-license.jpg`, alt: `Business license of ${licensedOperator.nameEn}`, label: "View business license ↗", width: 2000, height: 1454 },
    { href: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, src: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, alt: `Travel agency business permit ${licensedOperator.permitNumber} for ${licensedOperator.nameEn}`, label: "View travel agency permit ↗", width: 2000, height: 1434 },
  ],
};
