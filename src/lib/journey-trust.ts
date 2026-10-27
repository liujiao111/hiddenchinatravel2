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
  copy: "Comfort, Premium or Luxury sets the style. These photographs show real hotels in each place. They are examples of the style, not a promise of one property. The hotel in each city is named in your written proposal.",
  groups: [
    {
      id: "dali",
      label: "DALI",
      carouselLabel: "Dali hotel examples",
      slides: [
        { src: `${hotelRoot}/dali-linden-courtyard.webp`, alt: "Courtyard of the Linden Centre, a Bai hotel in Xizhou, Dali", title: "Linden Centre", detail: "Example · Dali · Xizhou", copy: "A Bai courtyard hotel in Xizhou. An example of the style. The stay on your route is named in the proposal. Photo: Chris DeLacy, CC BY-SA 4.0." },
        { src: `${hotelRoot}/dali-linden-entrance.webp`, alt: "Stone gateway into the Linden Centre in Xizhou, Dali", title: "Linden Centre", detail: "Example · Dali · entrance", copy: "The gateway of the same Xizhou courtyard hotel. Photo: Chris DeLacy, CC BY-SA 4.0." },
        { src: `${hotelRoot}/dali-linden-detail.webp`, alt: "Painted woodwork under the eaves at the Linden Centre in Xizhou", title: "Linden Centre", detail: "Example · Dali · courtyard detail", copy: "Carved eaves in the courtyard. Photo: Chris DeLacy, CC BY-SA 4.0." },
      ],
    },
    {
      id: "lijiang",
      label: "LIJIANG",
      carouselLabel: "Lijiang hotel examples",
      slides: [
        { src: `${hotelRoot}/lijiang-heheyuan.webp`, alt: "Wooden courtyard entrance of Heheyuan in Lijiang old town, with magnolia blossoms", title: "Heheyuan courtyard", detail: "Example · Lijiang old town", copy: "A courtyard in Lijiang old town. An example of the style. The hotel on your route is named in the proposal. Photo: 江上清风1961, CC BY 3.0." },
        { src: `${hotelRoot}/lijiang-courtyard.webp`, alt: "A woven basket and plants in a Lijiang courtyard", title: "Lijiang courtyard", detail: "Example · Lijiang", copy: "A courtyard of the kind used by old-town stays. The hotel is named in your proposal. Photo: Rod Waddington, CC BY-SA 2.0." },
      ],
    },
    {
      id: "kunming",
      label: "KUNMING",
      carouselLabel: "Kunming hotel examples",
      slides: [
        { src: `${hotelRoot}/kunming-green-lake.webp`, alt: "Entrance of Green Lake Hotel in Kunming, with the hotel name on the stone wall", title: "Green Lake Hotel", detail: "Example · Kunming", copy: "Green Lake Hotel, beside Green Lake. An example when a Kunming night is on the route. The named property is confirmed in writing. Photo: Kcx36, CC BY-SA 4.0." },
        { src: `${hotelRoot}/kunming-intercontinental.webp`, alt: "Lawn and entrance of the InterContinental Kunming at dusk", title: "InterContinental Kunming", detail: "Example · Kunming · Dianchi", copy: "InterContinental Kunming, near Dianchi Lake. Another example of the style. Photo: N509FZ, CC BY-SA 4.0." },
      ],
    },
    {
      id: "shaxi",
      label: "SHAXI",
      carouselLabel: "Shaxi hotel examples",
      slides: [
        { src: `${hotelRoot}/shaxi-old-theatre-inn.webp`, alt: "Old Theatre Inn in Shaxi at night, with the wooden theatre lit above the courtyard", title: "Old Theatre Inn", detail: "Example · Shaxi", copy: "Old Theatre Inn, a courtyard stay in Shaxi. One night on the 6-day route is here in town. The property is named in your proposal. Photo: Rod Waddington, CC BY-SA 2.0." },
        { src: `${hotelRoot}/shaxi-old-town-lane.webp`, alt: "A stone lane of wooden shopfronts in Shaxi old town", title: "Shaxi old town", detail: "Example · Shaxi lanes", copy: "Cars stop at the edge of town. Courtyard inns are reached on foot along lanes like this. Photo: Yangpeifu, CC BY-SA 4.0." },
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
