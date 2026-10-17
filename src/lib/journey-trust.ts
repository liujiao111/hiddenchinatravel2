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

const teamRoot = "/assets/partners/huatai";
const tengranRoot = "/assets/partners/tengran";

export const localGuideProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR GUIDE",
  title: "A person who knows the route",
  copy: "A local guide is included throughout the journey. Choose Chinese or English, and ask Joy about another language in advance. These profiles are examples from the guide team supporting these journeys. The final assignment depends on your dates and is confirmed in writing.",
  label: "Local guide profiles",
  slides: [
    { src: `${teamRoot}/guides/zhang-zihang.webp`, alt: "Portrait of Zhang Zihang", title: "Zhang Zihang (Jason)", detail: "English-speaking guide · English guide qualification", copy: "A profile from the local guide team. Final assignment depends on your dates." },
    { src: `${teamRoot}/guides/kuang-jintao.webp`, alt: "Portrait of Kuang Jintao", title: "Kuang Jintao (Taozi)", detail: "Chinese-speaking guide · 8 years of experience", copy: "Experienced with private and custom journeys." },
    { src: `${teamRoot}/guides/huang-qun.webp`, alt: "Portrait of Huang Qun", title: "Huang Qun (Daxiang)", detail: "Chinese-speaking guide · 7 years of experience", copy: "Experienced with private and educational journeys." },
  ],
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
        { src: `${tengranRoot}/vehicles/seven-seat-van.webp`, alt: "Example of a seven-seat passenger van, including its exterior and seating", title: "Seven-seat van", detail: "Example · passenger van", copy: "Exterior, captain seats and rear seating." },
        { src: `${tengranRoot}/vehicles/seven-seat-maxus.webp`, alt: "Example of a seven-seat Maxus MPV, cabin and luggage space", title: "Seven-seat MPV", detail: "Example · Maxus", copy: "Cabin space and luggage room for a small private party." },
        { src: `${tengranRoot}/vehicles/seven-seat-interiors.webp`, alt: "Examples of seven-seat MPV exteriors, seating and luggage areas", title: "Seven-seat interiors", detail: "Example · MPV seating", copy: "Additional interior examples. The final vehicle depends on your party and luggage." },
      ],
    },
    {
      id: "five",
      label: "5 SEATS",
      carouselLabel: "Five-seat vehicle examples",
      slides: [
        { src: `${tengranRoot}/vehicles/five-seat-hongqi.webp`, alt: "Example of a five-seat Hongqi sedan and its rear seats", title: "Five-seat sedan", detail: "Example · Hongqi", copy: "Exterior and rear seating for a smaller party." },
        { src: `${tengranRoot}/vehicles/five-seat-aion.webp`, alt: "Example of a five-seat GAC Aion SUV, passenger seats and front cabin", title: "Five-seat SUV", detail: "Example · GAC Aion", copy: "Another five-seat option, shown outside and inside." },
        { src: `${tengranRoot}/vehicles/five-seat-toyota.webp`, alt: "Example of a five-seat Toyota SUV and its passenger seating", title: "Five-seat SUV", detail: "Example · Toyota", copy: "A further five-seat example from the vehicle catalog." },
      ],
    },
  ],
};

export const operatorCredentials: TrustCopy & { documents: CredentialDocument[] } = {
  kicker: "THE LOCAL OPERATOR",
  title: "Company documents you can inspect",
  copy: "Yunnan Tengran International Travel Agency Co., Ltd. (云南腾然国际旅行社有限公司) is the licensed operator for these journeys. It confirms the services, handles the travel contract and operates the trip. Its travel agency permit number is L-YN-101846.",
  documents: [
    { href: `${tengranRoot}/credentials/business-license.webp`, src: `${tengranRoot}/credentials/business-license.webp`, alt: "Business license of Yunnan Tengran International Travel Agency Co., Ltd.", label: "View business license ↗", width: 2000, height: 1415 },
    { href: `${tengranRoot}/credentials/travel-agency-permit.webp`, src: `${tengranRoot}/credentials/travel-agency-permit.webp`, alt: "Travel agency business permit L-YN-101846 for Yunnan Tengran International Travel Agency Co., Ltd.", label: "View travel agency permit ↗", width: 2000, height: 1499 },
  ],
};
