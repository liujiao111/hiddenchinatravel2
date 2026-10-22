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
  unifiedSocialCreditCode: "91530111MACHXW95XT",
} as const;

const teamRoot = "/assets/partners/meizhen";
const vehicleRoot = "/assets/partners/vehicles";
const credentialsRoot = "/assets/partners/meizhen";

const localTeamSlides: ProofSlide[] = [
  { src: `${teamRoot}/guides/zhang-zihang.webp`, alt: "Portrait of Zhang Zihang", title: "Zhang Zihang (Jason)", detail: "English-speaking driver-guide · Final assignment depends on your dates", copy: "A profile from the local team. The person on your journey is confirmed in writing." },
  { src: `${teamRoot}/guides/kuang-jintao.webp`, alt: "Portrait of Kuang Jintao", title: "Kuang Jintao (Taozi)", detail: "Chinese-speaking driver-guide · 8 years of experience", copy: "Experienced with private and custom journeys." },
  { src: `${teamRoot}/guides/huang-qun.webp`, alt: "Portrait of Huang Qun", title: "Huang Qun (Daxiang)", detail: "Chinese-speaking driver-guide · 7 years of experience", copy: "Experienced with private and educational journeys." },
];

export const driverGuideProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR DRIVER-GUIDE",
  title: "A person who knows the route",
  copy: "A Chinese- or English-speaking driver-guide is included throughout. One local host drives, coordinates the route and offers context. This is not a separate attraction lecturer inside every site. A specialist site guide can be added in your proposal. These profiles are examples from the team. The final assignment depends on your dates and is confirmed in writing.",
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

const hotelRoot = "/assets/partners/hotels";

export const hotelProof: TrustCopy & { groups: { id: string; label: string; carouselLabel: string; slides: ProofSlide[] }[] } = {
  kicker: "03 / YOUR HOTELS",
  title: "Stays named in your proposal.",
  copy: "Comfort, Premium or Luxury sets the style. These are examples from the hotel catalog we use on Yunnan journeys, not a promise of one exact property. The hotel in each city is named in your written proposal.",
  groups: [
    {
      id: "dali",
      label: "DALI",
      carouselLabel: "Dali hotel examples",
      slides: [
        { src: `${hotelRoot}/dali-liuheyunyan.webp`, alt: "Example of a Dali hotel stay: LiuHeYunYan Hotel or equivalent", title: "LiuHeYunYan Hotel", detail: "Example · Dali", copy: "LiuHeYunYan Hotel, or an equivalent, is named in your proposal." },
        { src: `${hotelRoot}/dali-courtyard.webp`, alt: "Example of a Dali courtyard hotel stay: Courtyard Hotel or equivalent", title: "Courtyard Hotel", detail: "Example · Dali courtyard", copy: "A courtyard stay near the old town, or an equivalent in the same style." },
      ],
    },
    {
      id: "lijiang",
      label: "LIJIANG",
      carouselLabel: "Lijiang hotel examples",
      slides: [
        { src: `${hotelRoot}/lijiang-gelle-freres.webp`, alt: "Example of a Lijiang hotel stay: Gellé Frères Garden Hotel or equivalent", title: "Gellé Frères Garden Hotel", detail: "Example · Lijiang · Shuhe", copy: "Gellé Frères Garden Hotel, or an equivalent, is named in your proposal." },
        { src: `${hotelRoot}/lijiang-international.webp`, alt: "Example of a Lijiang hotel stay: Lijiang International Hotel or equivalent", title: "Lijiang International Hotel", detail: "Example · Lijiang old town", copy: "A stay near the old town, or an equivalent in the same class." },
      ],
    },
    {
      id: "kunming",
      label: "KUNMING",
      carouselLabel: "Kunming hotel examples",
      slides: [
        { src: `${hotelRoot}/kunming-linyin-mixc.webp`, alt: "Example of a Kunming hotel stay: Linyin Hotel at MixC or equivalent", title: "Linyin Hotel, MixC", detail: "Example · Kunming", copy: "Used when a Kunming night is in the route. Linyin Hotel at MixC, or an equivalent, is named in your proposal." },
        { src: `${hotelRoot}/kunming-mehood-lestie.webp`, alt: "Example of a Kunming hotel stay: Mehood Lestie Hotel or equivalent", title: "Mehood Lestie Hotel", detail: "Example · Kunming", copy: "Another Kunming example from the catalog. The named property is confirmed in writing." },
      ],
    },
    {
      id: "shaxi",
      label: "SHAXI",
      carouselLabel: "Shaxi hotel examples",
      slides: [
        { src: `${hotelRoot}/shaxi-boutique-courtyard.webp`, alt: "Example of a Shaxi boutique courtyard hotel stay", title: "Shaxi boutique courtyard", detail: "Example · Shaxi", copy: "One night on the 6-day route is in Shaxi. The property is a boutique courtyard stay, named in your proposal." },
        { src: `${hotelRoot}/shaxi-boutique-lanes.webp`, alt: "Example of a Shaxi town hotel stay", title: "Shaxi town stay", detail: "Example · Shaxi lanes", copy: "Cars stop at the edge of town. The hotel is reached on foot." },
      ],
    },
    {
      id: "shangri-la",
      label: "SHANGRI-LA",
      carouselLabel: "Shangri-La hotel examples",
      slides: [
        { src: `${hotelRoot}/shangri-la-highland.webp`, alt: "Example of a Shangri-La highland hotel stay", title: "Shangri-La highland hotel", detail: "Example · Shangri-La", copy: "Used on the 8-day route. The named highland hotel is confirmed in your proposal." },
        { src: `${hotelRoot}/shangri-la-lakeside.webp`, alt: "Example of a Shangri-La lakeside hotel stay", title: "Shangri-La lakeside stay", detail: "Example · Shangri-La", copy: "A further plateau example. The final property depends on dates and hotel style." },
      ],
    },
  ],
};

export const muslimFriendly = {
  kicker: "ON EVERY JOURNEY",
  title: "Muslim-friendly, as a standard.",
  copy: "Tell Joy when you enquire. We write what we can arrange into the proposal. We do not claim a certified-halal kitchen in every hotel.",
  points: [
    { title: "Breakfast you can choose", detail: "Hotel breakfast is generally included. We note your dietary needs so you can select suitable items, or skip breakfast and we help you find a nearby option." },
    { title: "Halal meals on the route", detail: "When lunch or dinner is in your quote, we arrange a halal restaurant or packed meal, or refund that meal if a suitable option cannot be confirmed. When meals are not in the quote, the driver-guide helps you find a restaurant or takeaway along the day’s route." },
    { title: "Prayer-time reminders", detail: "The driver-guide can remind you of prayer times and help find a quiet place or a mosque when the day’s route allows." },
  ],
  inclusion: "Muslim-friendly arrangements: breakfast choice, help finding halal meals along the route, and prayer-time reminders. Confirmed in your proposal.",
  faq: {
    question: "Can you arrange a Muslim-friendly journey?",
    answer: "Yes. It is a standard feature on every private journey, not a special package. Tell Joy at enquiry. Hotel breakfast is generally included and you can choose suitable items or skip it. When lunch or dinner is in the quote, we arrange a halal restaurant or packed meal, or refund that meal if we cannot confirm a suitable option. When those meals are not in the quote, the driver-guide helps you find a restaurant or takeaway. Prayer-time reminders and a quiet place or mosque can be arranged when the route allows. We do not claim certified-halal hotel kitchens.",
  },
} as const;

export const operatorCredentials: TrustCopy & { documents: CredentialDocument[] } = {
  kicker: "THE LICENSED AGENCY",
  title: "Company documents you can inspect",
  copy: `${licensedOperator.nameEn} (${licensedOperator.nameZh}) is the licensed travel agency behind Hidden China Travel. It issues the travel contract, receives payment to its corporate account and operates the journey. Its travel agency permit number is ${licensedOperator.permitNumber}. Its unified social credit code is ${licensedOperator.unifiedSocialCreditCode}.`,
  documents: [
    { href: `${credentialsRoot}/credentials/business-license.jpg`, src: `${credentialsRoot}/credentials/business-license.jpg`, alt: `Business license of ${licensedOperator.nameEn}`, label: "View business license ↗", width: 2000, height: 1454 },
    { href: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, src: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, alt: `Travel agency business permit ${licensedOperator.permitNumber} for ${licensedOperator.nameEn}`, label: "View travel agency permit ↗", width: 2000, height: 1434 },
  ],
};
