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
  addressEn: "Room 1915, Floor 19, Building 4, Dadu Motian Shopping Center, Xiaobanqiao Subdistrict, Guandu District, Kunming, Yunnan",
  addressZh: "云南省昆明市官渡区小板桥街道大都摩天购物中心四栋19楼1915室",
  creditRegistryUrl: "https://www.gsxt.gov.cn/",
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
  copy: "These photographs show hotel options for each destination. They are examples, not a promise of one property. Your confirmed hotel is named in the written proposal; alternatives of a similar standard may be offered depending on dates and availability.",
  groups: [
    {
      id: "dali",
      label: "DALI",
      carouselLabel: "Dali hotel examples",
      slides: [
        { src: `${hotelRoot}/IMG_5952.jpeg`, alt: "Liuheyun Hotel in Dali, an example accommodation option", title: "Liuheyun Hotel", detail: "Example · Dali", copy: "Liuheyun Hotel is one accommodation option for Dali. The confirmed property depends on your dates and is named in your written proposal." },
        { src: `${hotelRoot}/IMG_5953.jpeg`, alt: "Guest room at Liuheyun Hotel in Dali", title: "Liuheyun Hotel", detail: "Example · Dali · guest room", copy: "A guest-room view of the Dali hotel option. The final hotel is confirmed in your proposal." },
        { src: `${hotelRoot}/IMG_5954.jpeg`, alt: "Interior detail at Liuheyun Hotel in Dali", title: "Liuheyun Hotel", detail: "Example · Dali · interior", copy: "An additional view of the Dali hotel option. Similar-standard alternatives may be offered if needed." },
        { src: `${hotelRoot}/IMG_5955.jpeg`, alt: "Facilities at Liuheyun Hotel in Dali", title: "Liuheyun Hotel", detail: "Example · Dali · facilities", copy: "Hotel facilities shown as a reference; the confirmed stay is listed in the written proposal." },
        { src: `${hotelRoot}/IMG_5956.jpeg`, alt: "Interior of Liuheyun Hotel in Dali", title: "Liuheyun Hotel", detail: "Example · Dali", copy: "An example of the Dali accommodation option. Availability and final room category are confirmed in writing." },
        { src: `${hotelRoot}/IMG_5957.jpeg`, alt: "Another view of Liuheyun Hotel in Dali", title: "Liuheyun Hotel", detail: "Example · Dali", copy: "A further view of the Dali hotel option. Your final hotel is named in your proposal." },
      ],
    },
    {
      id: "kunming",
      label: "KUNMING",
      carouselLabel: "Kunming hotel examples",
      slides: [
        { src: `${hotelRoot}/IMG_5946.jpeg`, alt: "Exterior of Linyin Hotel, MixC branch, in Kunming", title: "Linyin Hotel · MixC Branch", detail: "Example · Kunming", copy: "Linyin Hotel at the MixC branch is one possible Kunming stay. Mehao Lizhi Hotel (Haile World branch) or another hotel of a similar standard may be offered depending on dates and availability." },
        { src: `${hotelRoot}/IMG_5947.jpeg`, alt: "Guest room at Linyin Hotel, MixC branch, in Kunming", title: "Linyin Hotel · MixC Branch", detail: "Example · Kunming · guest room", copy: "A guest-room view of Linyin Hotel. The confirmed hotel is named in your written proposal." },
        { src: `${hotelRoot}/IMG_5948.jpeg`, alt: "Bathroom at Linyin Hotel, MixC branch, in Kunming", title: "Linyin Hotel · MixC Branch", detail: "Example · Kunming · bathroom", copy: "An interior detail from the Linyin Hotel option in Kunming." },
        { src: `${hotelRoot}/IMG_5949.jpeg`, alt: "Breakfast area at Linyin Hotel, MixC branch, in Kunming", title: "Linyin Hotel · MixC Branch", detail: "Example · Kunming · breakfast area", copy: "A view of the hotel's breakfast area. Breakfast inclusions depend on the confirmed package." },
        { src: `${hotelRoot}/IMG_5950.jpeg`, alt: "Breakfast selection at Linyin Hotel, MixC branch, in Kunming", title: "Linyin Hotel · MixC Branch", detail: "Example · Kunming · breakfast", copy: "A sample breakfast display at Linyin Hotel. Your confirmed hotel and inclusions are specified in the proposal." },
        { src: `${hotelRoot}/IMG_5951.jpeg`, alt: "Additional view of a Kunming hotel option", title: "Kunming hotel option", detail: "Example · Kunming", copy: "A further hotel photo from the Kunming options. The named property is confirmed in writing." },
      ],
    },
    {
      id: "lijiang",
      label: "LIJIANG",
      carouselLabel: "Lijiang hotel examples",
      slides: [
        { src: `${hotelRoot}/IMG_5959.jpeg`, alt: "Exterior of Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang", copy: "Jieluofu Garden Hotel is the preferred example for Lijiang. Lijiang International Hotel or another property of a similar standard may be offered depending on dates and availability." },
        { src: `${hotelRoot}/IMG_5960.jpeg`, alt: "Guest room at Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang · guest room", copy: "A guest-room view of Jieluofu Garden Hotel. The confirmed hotel is named in your written proposal." },
        { src: `${hotelRoot}/IMG_5961.jpeg`, alt: "Interior at Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang · interior", copy: "An additional view of the preferred Lijiang hotel option." },
        { src: `${hotelRoot}/IMG_5962.jpeg`, alt: "Hotel facilities at Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang · facilities", copy: "A view of the hotel's facilities. Final availability and room category are confirmed in writing." },
        { src: `${hotelRoot}/IMG_5963.jpeg`, alt: "Another view of Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang", copy: "A further view of Jieluofu Garden Hotel. Lijiang International Hotel or a similar-standard alternative may be used if needed." },
        { src: `${hotelRoot}/IMG_5964.jpeg`, alt: "Guest facilities at Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang · facilities", copy: "Hotel facilities shown for reference; the final property is listed in the proposal." },
        { src: `${hotelRoot}/IMG_5965.jpeg`, alt: "Interior view at Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang · interior", copy: "An additional hotel view from the Lijiang option." },
        { src: `${hotelRoot}/IMG_5966.jpeg`, alt: "Further view of Jieluofu Garden Hotel in Lijiang", title: "Jieluofu Garden Hotel", detail: "Example · Lijiang", copy: "A further reference photo. The hotel actually arranged for your dates will be confirmed in writing." },
      ],
    },
    {
      id: "shangri-la",
      label: "SHANGRI-LA",
      carouselLabel: "Shangri-La hotel examples",
      slides: [
        { src: `${hotelRoot}/shangri-la-songtsam-field.webp`, alt: "Songtsam Linka Retreat in Shangri-La, stone lodges above a field of yellow flowers", title: "Songtsam Linka", detail: "Example · Shangri-La", copy: "Songtsam Linka, a highland lodge. Used as an example on routes with a Shangri-La night. The named hotel is confirmed in your proposal. Photo: 活着不动, CC BY-SA 3.0." },
        { src: `${hotelRoot}/shangri-la-songtsam-hill.webp`, alt: "Stone lodges of Songtsam Linka stepped up a green hillside in Shangri-La", title: "Songtsam Linka", detail: "Example · Shangri-La · hillside", copy: "The same lodge from the hillside. Photo: Black necked Crane, CC BY-SA 4.0." },
        { src: `${hotelRoot}/shangri-la-paradise.webp`, alt: "Entrance of Paradise Hotel, Tianjie Shenchuan, in Shangri-La", title: "Paradise Hotel", detail: "Example · Shangri-La", copy: "Paradise Hotel in Shangri-La. A further example. The final property depends on dates and hotel style. Photo: 瑞丽江的河水, CC BY-SA 4.0." },
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
  copy: `${licensedOperator.nameEn} (${licensedOperator.nameZh}) is the licensed travel agency behind Hidden China Travel. The office is ${licensedOperator.addressEn} (${licensedOperator.addressZh}). It issues the travel contract, receives payment to its corporate account and operates the journey. Its travel agency permit number is ${licensedOperator.permitNumber}. Its unified social credit code is ${licensedOperator.unifiedSocialCreditCode}.`,
  documents: [
    { href: `${credentialsRoot}/credentials/business-license.jpg`, src: `${credentialsRoot}/credentials/business-license.jpg`, alt: `Business license of ${licensedOperator.nameEn}`, label: "View business license ↗", width: 2000, height: 1454 },
    { href: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, src: `${credentialsRoot}/credentials/travel-agency-permit.jpg`, alt: `Travel agency business permit ${licensedOperator.permitNumber} for ${licensedOperator.nameEn}`, label: "View travel agency permit ↗", width: 2000, height: 1434 },
  ],
};
