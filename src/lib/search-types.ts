export type SearchItem = {
  id: string;
  title: string;
  href: string;
  description: string;
  type: "article" | "hub" | "journey" | "page";
  keywords: string[];
  image?: string;
};

export type SearchMatch = SearchItem & { score: number };

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function matchSearchItems(items: SearchItem[], query: string, limit?: number): SearchMatch[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(" ").filter(Boolean);

  const matches = items.flatMap((item) => {
    const title = normalize(item.title);
    const description = normalize(item.description);
    const keywords = normalize(item.keywords.join(" "));
    const searchable = `${title} ${description} ${keywords}`;
    if (!terms.every((term) => searchable.includes(term))) return [];

    let score = 0;
    if (title === normalizedQuery) score += 100;
    if (title.startsWith(normalizedQuery)) score += 55;
    if (title.includes(normalizedQuery)) score += 35;
    for (const term of terms) {
      if (title.includes(term)) score += 14;
      if (keywords.includes(term)) score += 7;
      if (description.includes(term)) score += 3;
    }
    return [{ ...item, score }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return typeof limit === "number" ? matches.slice(0, limit) : matches;
}
