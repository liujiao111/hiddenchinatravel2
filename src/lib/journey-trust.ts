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
  nameEn: "Kunming Dianguoguo International Travel Agency Co., Ltd.",
  nameZh: "昆明滇果果国际旅行社有限公司",
  permitNumber: "L-YN-101848",
  unifiedSocialCreditCode: "91530111MAE1HH0X2K",
  addressEn: "Room 12-B-05, 12/F, Tower A, Yunnan Chengtou Building, No. 400 Minhang Road, Guanshang Subdistrict, Guandu District, Kunming, Yunnan, China",
  addressZh: "云南省昆明市官渡区关上街道办事处民航路400号云南城投大厦A座12楼12-B-05",
  legalRepresentativeZh: "段振涛",
  businessScopeEn: "Domestic tourism; inbound tourism",
  businessScopeZh: "境内旅游业务；入境旅游业务",
  permitIssueDate: "2026-01-23",
  licensingAuthorityEn: "Kunming Municipal Bureau of Culture and Tourism",
  licensingAuthorityZh: "昆明市文化和旅游局",
  tourismComplaintHotline: "0871-12345",
  creditRegistryUrl: "https://www.gsxt.gov.cn/",
} as const;

const vehicleRoot = "/assets/partners/vehicles";
// The previous agency certificate scans must not be shown as the new operator.

// Previous partner guide photos are withheld until the new operator confirms its own team.\nconst localTeamSlides: ProofSlide[] = [];

export const driverGuideProof: TrustCopy & { label: string; slides: ProofSlide[] } = {
  kicker: "01 / YOUR DRIVER-GUIDE",
  title: "A person who knows the route",
  copy: "A Chinese- or English-speaking driver-guide can be arranged as specified in the written proposal. The licensed operator will confirm the actual person, language and scope before booking.",
  label: "Local team profiles",
  slides: localTeamSlides,
};

export const vehicleProof: TrustCopy & { groups: { id: "seven"; label: string; carouselLabel: string; slides: ProofSlide[] }[] } = {
  kicker: "02 / YOUR VEHICLE",
  title: "Five or seven seats, matched to your party.",
  copy: "A seven-seat vehicle gives more room for people and luggage; a five-seat vehicle may suit a smaller party. The photos show one seven-seat MPV example. Your actual vehicle is selected for your group and luggage, then confirmed in your written proposal.",
  groups: [
    {
      id: "seven",
      label: "7-SEAT MPV EXAMPLE",
      carouselLabel: "Seven-seat MPV exterior and interior photos",
      slides: [
        { src: `${vehicleRoot}/seven-seat-mpv-exterior-three-quarter.webp`, alt: "Black seven-seat MPV photographed from the front and side", title: "Seven-seat MPV · exterior", detail: "Example · three-quarter view", copy: "A full view of the example vehicle." },
        { src: `${vehicleRoot}/seven-seat-mpv-exterior-front.webp`, alt: "Front view of the black seven-seat MPV", title: "Seven-seat MPV · front", detail: "Example · front view", copy: "A closer look at the same vehicle." },
        { src: `${vehicleRoot}/seven-seat-mpv-front-seats.webp`, alt: "Driver's seat and front passenger seat inside the seven-seat MPV", title: "Front seats", detail: "Example · front cabin", copy: "Front cabin and seating layout." },
        { src: `${vehicleRoot}/seven-seat-mpv-dashboard.webp`, alt: "Dashboard and front cabin of the seven-seat MPV", title: "Dashboard", detail: "Example · front cabin", copy: "Dashboard and center console." },
        { src: `${vehicleRoot}/seven-seat-mpv-captain-seats.webp`, alt: "Two individual passenger seats in the seven-seat MPV", title: "Passenger seating", detail: "Example · second row", copy: "Individual seats in the second row." },
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
      id: "dali",
      label: "DALI",
      carouselLabel: "Dali hotel examples",
      slides: [
        { src: `${hotelRoot}/IMG_5952.jpeg`, alt: "Liuhe Yunyan Hotel in Dali, an example accommodation option", title: "Liuhe Yunyan Hotel", detail: "Example · Dali", copy: "Liuhe Yunyan Hotel is one accommodation option for Dali. The confirmed property depends on your dates and is named in your written proposal." },
        { src: `${hotelRoot}/IMG_5953.jpeg`, alt: "Guest room at Liuhe Yunyan Hotel in Dali", title: "Liuhe Yunyan Hotel", detail: "Example · Dali · guest room", copy: "A guest-room view of the Dali hotel option. The final hotel is confirmed in your proposal." },
        { src: `${hotelRoot}/IMG_5954.jpeg`, alt: "Interior detail at Liuhe Yunyan Hotel in Dali", title: "Liuhe Yunyan Hotel", detail: "Example · Dali · interior", copy: "An additional view of the Dali hotel option. Similar-standard alternatives may be offered if needed." },
        { src: `${hotelRoot}/IMG_5955.jpeg`, alt: "Facilities at Liuhe Yunyan Hotel in Dali", title: "Liuhe Yunyan Hotel", detail: "Example · Dali · facilities", copy: "Hotel facilities shown as a reference; the confirmed stay is listed in the written proposal." },
        { src: `${hotelRoot}/IMG_5956.jpeg`, alt: "Interior of Liuhe Yunyan Hotel in Dali", title: "Liuhe Yunyan Hotel", detail: "Example · Dali", copy: "An example of the Dali accommodation option. Availability and final room category are confirmed in writing." },
        { src: `${hotelRoot}/IMG_5957.jpeg`, alt: "Another view of Liuhe Yunyan Hotel in Dali", title: "Liuhe Yunyan Hotel", detail: "Example · Dali", copy: "A further view of the Dali hotel option. Your final hotel is named in your proposal." },
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
        { src: `${hotelRoot}/yiting-exterior.webp`, alt: "Exterior of Yiting Hotel in Shangri-La at night", title: "Yiting Hotel", detail: "Example · Shangri-La", copy: "Yiting Hotel is the preferred example for Shangri-La. Lanou Hotel or another property of a similar standard may be offered depending on dates and availability." },
        { src: `${hotelRoot}/yiting-twin-room-view.webp`, alt: "Twin room at Yiting Hotel in Shangri-La, looking toward the mountains", title: "Yiting Hotel", detail: "Example · Shangri-La · guest room", copy: "A twin room at Yiting Hotel with a view toward the town and mountains. The confirmed hotel is named in your written proposal." },
        { src: `${hotelRoot}/yiting-twin-room.webp`, alt: "Twin room at Yiting Hotel in Shangri-La", title: "Yiting Hotel", detail: "Example · Shangri-La · guest room", copy: "Another view of a Yiting Hotel guest room. Lanou Hotel or a similar-standard alternative may be used if needed." },
        { src: `${hotelRoot}/yiting-bathroom.webp`, alt: "Bathroom and shower at Yiting Hotel in Shangri-La", title: "Yiting Hotel", detail: "Example · Shangri-La · bathroom", copy: "The bathroom in a Yiting Hotel guest room. The final property is listed in the proposal." },
        { src: `${hotelRoot}/yiting-vanity.webp`, alt: "Vanity, wardrobe and minibar at Yiting Hotel in Shangri-La", title: "Yiting Hotel", detail: "Example · Shangri-La · bathroom", copy: "Vanity, wardrobe and minibar in a Yiting Hotel room." },
        { src: `${hotelRoot}/yiting-breakfast.webp`, alt: "Breakfast at Yiting Hotel in Shangri-La, with mountains outside the window", title: "Yiting Hotel", detail: "Example · Shangri-La · breakfast", copy: "A breakfast setting at Yiting Hotel. Breakfast inclusions depend on the confirmed package." },
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
  title: "Licensed operator details",
  copy: `${licensedOperator.nameEn} (${licensedOperator.nameZh}) is the licensed operator of Yunnan journeys. Permit ${licensedOperator.permitNumber}; unified social credit code ${licensedOperator.unifiedSocialCreditCode}. It confirms quotations, signs travel contracts, receives payments and organizes the contracted tours. Newly supplied certificate images will appear here after publication-ready files have been uploaded.`,
  documents: [],
};
