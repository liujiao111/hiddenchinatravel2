import "server-only";

import { getAllContent } from "@/lib/content";
import type { AppLocale } from "@/lib/i18n-seo";
import { getAllJourneys } from "@/lib/journeys";
import type { SearchItem } from "@/lib/search-types";
import { getTravelJournals } from "@/lib/travel-journals";

function getZhSearchIndex(): SearchItem[] {
  const pages: SearchItem[] = [
    { id: "home", title: "Hidden China Travel 中文首页", href: "/", description: "云南私家团、定制旅行，以及面向海外华语游客的实用行前建议。", type: "page", keywords: ["首页", "中国", "云南", "私家团", "定制旅行"] },
    { id: "journeys", title: "云南私家行程", href: "/journeys", description: "从昆明、大理、丽江到香格里拉，选择一条可按你的日期和节奏调整的私家路线。", type: "page", keywords: ["云南行程", "私家团", "昆明", "大理", "丽江", "香格里拉"] },
    { id: "about", title: "认识 Joy 与 Hidden China Travel", href: "/about-us", description: "认识在云南长大的旅行顾问 Joy，了解我们的规划方式与持牌旅行社履约安排。", type: "page", keywords: ["Joy Liu", "关于我们", "云南本地", "旅行社"] },
    { id: "contact", title: "联系 Hidden China Travel", href: "/contact", description: "直接与 Joy 沟通云南旅行、首次来华准备和私家行程规划。", type: "page", keywords: ["联系我们", "Joy Liu", "WhatsApp", "行程咨询"] },
    { id: "custom-tour", title: "云南定制旅行", href: "/custom-china-tour", description: "围绕你的日期、兴趣和节奏，设计一趟云南私家之旅。", type: "page", keywords: ["云南定制", "私人定制", "私家行程", "路线规划"] },
  ];

  const journeys = getAllJourneys("zh").map<SearchItem>((journey) => ({
    id: `journey-${journey.slug}`,
    title: journey.frontmatter.title,
    href: `/journeys/${journey.slug}`,
    description: journey.frontmatter.excerpt,
    type: "journey",
    keywords: [journey.frontmatter.route, ...journey.frontmatter.travelStyles],
    image: journey.frontmatter.coverImage,
  }));

  return [...pages, ...journeys];
}

export function getSearchIndex(locale: AppLocale = "en"): SearchItem[] {
  if (locale === "zh") return getZhSearchIndex();

  const pages: SearchItem[] = [
    { id: "home", title: "Hidden China Travel", href: "/", description: "Private journeys, local knowledge and practical travel guides for China.", type: "page", keywords: ["home", "China", "Yunnan", "journeys"] },
    { id: "about", title: "About Hidden China Travel", href: "/about-us", description: "Meet Joy Liu and learn about our personal approach to travel in China.", type: "page", keywords: ["Joy Liu", "about", "local travel"] },
    { id: "traveler-stories", title: "Traveler Stories", href: "/traveler-stories", description: "Notes from families, couples and first-time visitors on private Yunnan journeys.", type: "page", keywords: ["traveler stories", "reviews", "testimonials", "private Yunnan", "Joy Liu"] },
    ...getTravelJournals().map<SearchItem>((journal) => ({
      id: `journal-${journal.slug}`,
      title: journal.title,
      href: `/traveler-stories/${journal.slug}`,
      description: journal.description,
      type: "article",
      keywords: [journal.traveler, journal.country, journal.travelStyle, journal.route, "travel journal", "Yunnan", "Stone Forest", "Dali", "Lijiang"],
      image: journal.heroImage,
    })),
    { id: "contact", title: "Contact Hidden China Travel", href: "/contact", description: "Talk directly with Joy Liu about Yunnan, China travel and trip planning.", type: "page", keywords: ["contact", "Joy Liu", "WhatsApp", "China travel planning"] },
    { id: "yunnan-guide", title: "Yunnan Travel Guide", href: "/china-destinations/yunnan", description: "Plan a first Yunnan journey through Kunming, Dali, Shaxi and Lijiang.", type: "hub", keywords: ["Yunnan travel guide", "Yunnan itinerary", "Kunming", "Dali", "Shaxi", "Lijiang"] },
    { id: "custom-tour", title: "Tailor-Made Yunnan", href: "/custom-china-tour", description: "Private Journey Designed Around You", type: "page", keywords: ["Tailor-Made Yunnan", "custom Yunnan", "private itinerary"] },
  ];

  const content = getAllContent().map<SearchItem>((item) => ({
    id: item.slug,
    title: item.frontmatter.title,
    href: `/${item.slug}`,
    description: item.frontmatter.excerpt || item.frontmatter.description || item.frontmatter.metaDescription || "",
    type: item.kind === "legal" ? "page" : item.kind,
    keywords: [item.frontmatter.section || "", ...(item.frontmatter.keywords || [])].filter(Boolean),
    image: item.frontmatter.coverImage,
  }));

  const journeys = getAllJourneys().map<SearchItem>((journey) => ({
    id: `journey-${journey.slug}`,
    title: journey.frontmatter.title,
    href: `/journeys/${journey.slug}`,
    description: journey.frontmatter.excerpt,
    type: "journey",
    keywords: [journey.frontmatter.route, ...journey.frontmatter.travelStyles],
    image: journey.frontmatter.coverImage,
  }));

  return [...pages, ...journeys, ...content];
}
