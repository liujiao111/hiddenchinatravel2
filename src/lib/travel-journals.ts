import type { TravelerCaseStudy } from "@/lib/traveler-case-study";

export type JournalBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "emphasis"; text: string }
  | { type: "list"; items: string[] };

export type JournalSection = {
  id: string;
  title: string;
  blocks: JournalBlock[];
  image?: { src: string; alt: string; position?: string };
};

export type JournalPlace = {
  title: string;
  href: string;
  image: string;
  alt: string;
  note: string;
  position?: string;
};

export type TravelJournal = {
  slug: string;
  category: "Travel Journal";
  featured: boolean;
  traveler: string;
  country: string;
  travelStyle: string;
  theme: string;
  readingTime: string;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  heroImage: string;
  heroAlt: string;
  sections: JournalSection[];
  related: JournalPlace[];
  caseStudy: TravelerCaseStudy;
};

const stoneForest = "/assets/blog/kunming-travel-guide/cover-stone-forest.webp";

export const travelJournals: TravelJournal[] = [
  {
    slug: "from-chinas-cities-to-yunnans-landscapes",
    category: "Travel Journal",
    featured: true,
    traveler: "Matthew",
    country: "Canada",
    travelStyle: "Independent Explorer",
    theme: "First Visit to China",
    readingTime: "7 min",
    title: "From China's Cities to Yunnan's Landscapes",
    subtitle: "How We Designed a Journey That Changed One Traveler's View of China",
    description: "Matthew had already traveled through Shanghai, Suzhou, Nanjing and Wuhan. Hidden China designed his first Yunnan journey from Kunming and the Stone Forest to Dali and Lijiang.",
    route: "Kunming → Stone Forest → Dali → Lijiang",
    heroImage: stoneForest,
    heroAlt: "Karst pinnacles of the Stone Forest reflected in a still pool near Kunming",
    caseStudy: {
      snapshot: {
        traveler: "Matthew",
        country: "Canada",
        travelStyle: "Independent explorer",
        duration: "Yunnan chapter of a three-week China trip",
        travelMonth: "Not published",
        route: ["Kunming", "Stone Forest", "Dali", "Lijiang"],
        support: [
          "Route design",
          "China preparation pack",
          "eSIM guidance",
          "VPN recommendations",
          "Mobile payment preparation",
          "Transportation advice",
          "Custom travel map",
        ],
      },
      beforeTrip: {
        paragraphs: [
          "Matthew wrote halfway through three weeks he had arranged himself. Shanghai, Suzhou, Nanjing and Wuhan were already behind him. The cities had been his own project. What he asked for next was a China that did not resemble them.",
          "A first visit still carried the practical questions under that request. Payments, mobile data, trains and the apps of an ordinary day are a different system from the one he had left at home. He contacted Joy because another list of sights would have repeated the trip he had already taken.",
        ],
        quote: "I've seen China's cities. Before flying home, I'd like to experience a different side of China.",
      },
      planning: {
        intro: "The route was talked through, then shaped around how he actually travels: photography, local culture, and days that were allowed to slow down. Each place had a job. None of them was added because it was famous.",
        image: {
          src: "/assets/blog/kunming-travel-guide/kunming-city.webp",
          alt: "Autumn trees reflected in a Kunming lake",
          position: "center 50%",
        },
        steps: [
          {
            title: "The route, revised in conversation",
            text: "Kunming opens the province. It is the gateway, and it is not the whole of Yunnan. The Stone Forest follows while the contrast with the cities is still sharp. Dali is held open on purpose: time at Erhai, villages, an hour without a ticket. Lijiang comes after that change of pace, and opens the mountains of the northwest.",
          },
          {
            title: "Hotels, after the pace was clear",
            text: "Hotels were not the first question. They were chosen once the rhythm of the days was settled, so the nights followed the route instead of leading it.",
          },
          {
            title: "A China preparation pack",
            text: "A personal guide went out a week before his flight. It covered the apps he would actually open, transport, and the practical points that usually take the first day.",
          },
          {
            title: "Payments, data and access",
            text: "The same guide included eSIM setup, VPN recommendations and mobile payment preparation, so those tasks were handled before he needed them.",
          },
          {
            title: "A map of this journey",
            text: "He also received a map drawn around these places, the travel days, and the experience that justified each one. Months later he said it was one of the things he kept returning to.",
          },
        ],
      },
      evidence: [
        {
          kind: "map",
          title: "Custom travel map",
          detail: "The map made for this route, linking Kunming, the Stone Forest, Dali and Lijiang. The original is added here when it can be published. This frame is not a redraw of it.",
        },
        {
          kind: "whatsapp",
          title: "WhatsApp conversation",
          detail: "His note from Lijiang is quoted in the story. The screenshot of that exchange is added only with permission. Nothing in this frame is a reconstructed chat.",
        },
        {
          kind: "itinerary",
          title: "Personalised itinerary",
          detail: "The written route he received. A page from that document belongs here. The day-by-day file is not recreated for the website.",
        },
        {
          kind: "driver-guide",
          title: "Driver-guide introduction",
          detail: "This card is used when a named driver-guide was part of the journey. Matthew's published story does not name one, so the portrait stays empty.",
        },
      ],
      journeyIntro: "The route was already decided. What follows is how the days felt once he was in them.",
      whatChanged: {
        before: [
          "China, for him, was the cities he had already managed alone.",
          "Payments, data, trains and everyday apps were still an open question.",
          "Another sequence of famous stops would have repeated the trip he had taken.",
        ],
        after: [
          "At the Stone Forest he said it felt like walking through another world.",
          "From Lijiang he wrote that this was not the China he had expected.",
          "The map was still the thing he returned to, months later.",
          "Afterwards the journey read as an introduction, not a finished list.",
        ],
      },
    },
    sections: [
      {
        id: "stone-forest",
        title: "The Moment Yunnan Became Real",
        image: {
          src: stoneForest,
          alt: "Karst pinnacles of the Stone Forest reflected in a still pool near Kunming",
          position: "center 46%",
        },
        blocks: [
          { type: "paragraph", text: "The first major turning point came at Stone Forest." },
          { type: "paragraph", text: "Before arriving, Matthew had seen photographs online." },
          { type: "paragraph", text: "What he didn't expect was the scale." },
          { type: "paragraph", text: "Walking among towering limestone formations felt less like visiting a scenic attraction and more like stepping into another landscape entirely." },
          { type: "paragraph", text: "The pathways twisted between massive stone pillars." },
          { type: "paragraph", text: "Every turn revealed new shapes and perspectives." },
          { type: "paragraph", text: "Hours passed without him noticing." },
          { type: "paragraph", text: "Later he would tell us:" },
          { type: "quote", text: "It felt like walking through another world." },
          { type: "paragraph", text: "As travel designers, these are the moments we look for." },
          { type: "paragraph", text: "Not simply beautiful places." },
          { type: "paragraph", text: "But places capable of changing expectations." },
        ],
      },
      {
        id: "dali",
        title: "Slowing Down in Dali",
        image: {
          src: "/assets/blog/yunnan-travel-from-uk/dali-erhai.webp",
          alt: "Sunset over Erhai Lake near Dali, Yunnan",
          position: "center 60%",
        },
        blocks: [
          { type: "paragraph", text: "By the time Matthew arrived in Dali, the journey had already begun to shift." },
          { type: "paragraph", text: "For weeks he had moved between major cities, airports, train stations and urban environments." },
          { type: "paragraph", text: "Dali provided a pause." },
          { type: "paragraph", text: "Instead of filling every hour with sightseeing, we intentionally built space into the itinerary." },
          { type: "paragraph", text: "Time to cycle near Erhai Lake." },
          { type: "paragraph", text: "Time to wander through villages." },
          { type: "paragraph", text: "Time to sit in a lakeside café and watch life pass by." },
          { type: "paragraph", text: "Many travelers initially underestimate these slower moments." },
          { type: "paragraph", text: "Yet they often become the memories people treasure most when they return home." },
          { type: "paragraph", text: "Dali wasn't designed as another stop." },
          { type: "paragraph", text: "It was designed as a change of rhythm." },
        ],
      },
      {
        id: "lijiang",
        title: "“This Doesn't Feel Like the China I Expected.”",
        image: {
          src: "/assets/blog/yunnan-travel-from-uk/lijiang-old-town.webp",
          alt: "A canal lane in Lijiang Old Town",
          position: "center 55%",
        },
        blocks: [
          { type: "paragraph", text: "When Matthew reached Lijiang, he sent us a message:" },
          { type: "quote", text: "Honestly, this doesn't feel like the China I expected." },
          { type: "paragraph", text: "We've heard similar words many times." },
          { type: "paragraph", text: "For many international travelers, China is associated with megacities, skyscrapers and rapid development." },
          { type: "paragraph", text: "Yunnan offers a different perspective." },
          {
            type: "list",
            items: [
              "Snow-capped mountains.",
              "Ancient towns.",
              "Minority cultures.",
              "Open landscapes.",
              "A slower relationship with time.",
            ],
          },
          { type: "paragraph", text: "That contrast is often what makes Yunnan the most memorable part of a wider China journey." },
        ],
      },
      {
        id: "unplanned",
        title: "The Best Travel Memories Are Rarely Planned",
        blocks: [
          { type: "paragraph", text: "Ironically, one of Matthew's favourite stories had nothing to do with the itinerary." },
          { type: "paragraph", text: "While visiting Kunming Zoo, a curious monkey suddenly jumped onto him." },
          { type: "paragraph", text: "The encounter lasted only a few seconds." },
          { type: "paragraph", text: "But months later, it remained one of the stories he told most often." },
          { type: "paragraph", text: "It's a reminder of something we strongly believe." },
          { type: "paragraph", text: "The purpose of a well-designed itinerary is not to control every moment." },
          { type: "paragraph", text: "It's to create space for moments that cannot be planned." },
          { type: "paragraph", text: "Because the most memorable parts of a journey are often the ones nobody expected." },
        ],
      },
      {
        id: "looking-back",
        title: "Looking Back",
        blocks: [
          { type: "paragraph", text: "After returning home, Matthew shared photos from Yunnan online." },
          { type: "paragraph", text: "What followed was revealing." },
          { type: "paragraph", text: "Instead of commenting on where he had been, people focused on where he hadn't gone." },
          {
            type: "list",
            items: ["Shangri-La.", "Tiger Leaping Gorge.", "Yubeng.", "Meili Snow Mountain."],
          },
          { type: "paragraph", text: "Again and again, the same message appeared:" },
          { type: "quote", text: "You've only just started discovering Yunnan." },
          { type: "paragraph", text: "Perhaps that's exactly why so many travelers fall in love with this region." },
          { type: "paragraph", text: "The first visit rarely feels complete." },
          { type: "paragraph", text: "It feels like an introduction." },
        ],
      },
      {
        id: "reflection",
        title: "Our Reflection",
        blocks: [
          { type: "paragraph", text: "When we designed Matthew's journey, the objective wasn't to show him more attractions." },
          { type: "paragraph", text: "It was to reveal a different side of China." },
          { type: "paragraph", text: "A side defined by landscapes, slower travel, personal discovery and a deeper connection to place." },
          { type: "paragraph", text: "Looking back, that's exactly what happened." },
          { type: "paragraph", text: "And that's why we believe custom travel matters." },
          { type: "paragraph", text: "Not because every itinerary should be unique." },
          { type: "paragraph", text: "But because every traveler already is." },
        ],
      },
    ],
    related: [
      {
        title: "Kunming",
        href: "/kunming-travel-guide",
        image: "/assets/blog/kunming-travel-guide/kunming-city.webp",
        alt: "Autumn trees reflected in a Kunming lake",
        note: "The gateway, not the whole of Yunnan",
      },
      {
        title: "Dali",
        href: "/dali-travel-guide",
        image: "/assets/destinations/yunnan/dali.webp",
        alt: "Dali Ancient Town beneath the Cangshan mountains",
        note: "A pause beside Erhai Lake",
      },
      {
        title: "Lijiang",
        href: "/lijiang-travel-guide",
        image: "/assets/destinations/yunnan/lijiang.webp",
        alt: "Grey tiled roofs of Lijiang Old Town with mountains beyond",
        note: "The door to northwestern Yunnan",
      },
      {
        title: "Shangri-La",
        href: "/shangri-la-travel-guide",
        image: "/assets/destinations/yunnan/shangri-la.webp",
        alt: "A highland lake and forested hills near Shangri-La",
        note: "One of the places still ahead",
        position: "center 78%",
      },
    ],
  },
];

export function getTravelJournals() {
  return travelJournals;
}

export function getFeaturedJournals() {
  return travelJournals.filter((journal) => journal.featured);
}

export function getTravelJournal(slug: string) {
  return travelJournals.find((journal) => journal.slug === slug);
}
