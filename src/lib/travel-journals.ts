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
    sections: [
      {
        id: "before-the-flight",
        title: "Sometimes the Best Journeys Begin Before the Flight",
        blocks: [
          { type: "paragraph", text: "When Matthew first contacted Hidden China, he was already halfway through a three-week journey across China." },
          { type: "paragraph", text: "Over the previous weeks, he had explored Shanghai, Suzhou, Nanjing and Wuhan independently. He had experienced China's modern cities, historic neighbourhoods and iconic landmarks." },
          { type: "paragraph", text: "His request sounded simple:" },
          { type: "quote", text: "I've seen China's cities. Before flying home, I'd like to experience a different side of China." },
          { type: "paragraph", text: "That single sentence became the foundation of everything that followed." },
          { type: "paragraph", text: "Rather than immediately discussing hotels and attractions, we started by understanding how he likes to travel." },
          { type: "paragraph", text: "Through several conversations, we learned that he wasn't interested in checking off famous sights as quickly as possible." },
          { type: "paragraph", text: "He enjoyed photography, unusual landscapes, local culture and slower travel experiences." },
          { type: "paragraph", text: "Most importantly, he wanted places that felt genuinely different from the China he had already seen." },
          { type: "paragraph", text: "For us, that pointed naturally towards Yunnan." },
        ],
      },
      {
        id: "before-arrival",
        title: "Planning Begins Long Before Arrival",
        blocks: [
          { type: "paragraph", text: "One thing many travelers don't realise is that a great journey often starts before boarding the plane." },
          { type: "paragraph", text: "Because Matthew was visiting China for the first time, we prepared a personalised pre-departure guide and sent it a week before his flight." },
          { type: "paragraph", text: "The guide included:" },
          {
            type: "list",
            items: [
              "Recommended travel apps",
              "eSIM setup instructions",
              "VPN recommendations",
              "Mobile payment preparation",
              "Transportation tips",
              "Practical advice for navigating China smoothly",
            ],
          },
          { type: "paragraph", text: "These details may seem small, but they remove much of the uncertainty first-time visitors often experience." },
          { type: "paragraph", text: "Our goal was simple:" },
          { type: "quote", text: "Spend less time solving logistical problems.\nSpend more time enjoying the journey." },
        ],
      },
      {
        id: "the-map",
        title: "A Map Designed Around the Journey",
        blocks: [
          { type: "paragraph", text: "Before arriving in Yunnan, Matthew also received a custom-designed travel map." },
          { type: "paragraph", text: "Rather than simply sending an itinerary document, we wanted him to visualize how the journey would unfold." },
          { type: "paragraph", text: "The map connected every destination, travel day and major experience." },
          { type: "paragraph", text: "What looks like four destinations on paper becomes a travel story when viewed on a map." },
          { type: "paragraph", text: "Kunming introduced Yunnan." },
          { type: "paragraph", text: "Stone Forest revealed its geology." },
          { type: "paragraph", text: "Dali slowed the pace." },
          { type: "paragraph", text: "Lijiang opened the door to the mountains of northwestern Yunnan." },
          { type: "paragraph", text: "The map helped transform individual places into a meaningful journey." },
          { type: "paragraph", text: "Months later, Matthew told us it became one of the resources he referred back to most often during the trip." },
        ],
      },
      {
        id: "beyond-kunming",
        title: "Why We Didn't Recommend Staying Only in Kunming",
        image: {
          src: "/assets/blog/kunming-travel-guide/kunming-city.webp",
          alt: "Autumn trees reflected in a Kunming lake",
          position: "center 50%",
        },
        blocks: [
          { type: "paragraph", text: "Many first-time visitors assume Kunming and Yunnan are essentially the same thing." },
          { type: "paragraph", text: "They aren't." },
          { type: "paragraph", text: "Kunming is a wonderful city, but it's also a gateway." },
          { type: "paragraph", text: "The real magic of Yunnan lies in how dramatically the landscapes, cultures and atmosphere change as you move across the province." },
          { type: "paragraph", text: "Based on Matthew's interests, we recommended a route that gradually revealed those contrasts:" },
          { type: "emphasis", text: "Kunming → Stone Forest → Dali → Lijiang" },
          { type: "paragraph", text: "Rather than overwhelming him with too much too quickly, every destination was chosen to build upon the previous one." },
          { type: "paragraph", text: "Our objective wasn't simply to show him more places." },
          { type: "paragraph", text: "It was to create a growing sense of discovery." },
        ],
      },
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
