/** Normalize country display names to rule-CSV canonical names. */
const ALIASES: Record<string, string> = {
  // United Kingdom
  "united kingdom":
    "United Kingdom of Great Britain and Northern Ireland",
  uk: "United Kingdom of Great Britain and Northern Ireland",
  "great britain":
    "United Kingdom of Great Britain and Northern Ireland",
  britain: "United Kingdom of Great Britain and Northern Ireland",
  // Korea
  "south korea": "Republic of Korea",
  korea: "Republic of Korea",
  "korea, republic of": "Republic of Korea",
  // Russia
  russia: "Russian Federation",
  // United States
  "united states of america": "United States",
  usa: "United States",
  us: "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  // Bahamas
  bahamas: "The Bahamas",
  // Czechia
  czechia: "Czech Republic",
  // Brunei
  brunei: "Brunei Darussalam",
  // UAE
  uae: "United Arab Emirates",
  // North Macedonia
  macedonia: "North Macedonia",
  // Vietnam
  "viet nam": "Vietnam",
  // Kyrgyzstan
  kyrgyz: "Kyrgyzstan",
  "kyrgyz republic": "Kyrgyzstan",
  // Iran
  "iran, islamic republic of": "Iran",
  // Syria
  "syrian arab republic": "Syria",
  // Tanzania
  "tanzania, united republic of": "Tanzania",
  // Moldova
  "moldova, republic of": "Moldova",
  // Bolivia
  "bolivia, plurinational state of": "Bolivia",
  // Venezuela
  "venezuela, bolivarian republic of": "Venezuela",
  // Laos
  "lao people's democratic republic": "Laos",
  // Taiwan
  "taiwan, province of china": "Taiwan",
  // Palestine
  "palestine, state of": "Palestine",
  // Micronesia
  "micronesia, federated states of": "Micronesia",
  // Congo
  "congo, republic of the": "Congo",
  "congo, democratic republic of the": "Democratic Republic of the Congo",
  "drc": "Democratic Republic of the Congo",
  // Vatican
  "holy see": "Vatican City",
};

export function normalizeCountryKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.'']/g, "");
}

/**
 * Map a user-selected country name to the canonical name used in rule CSVs.
 * If no alias applies, returns the original trimmed name.
 */
export function toCanonicalCountryName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const key = normalizeCountryKey(trimmed);
  return ALIASES[key] ?? trimmed;
}

/**
 * Build a lookup key set that includes the canonical name and common aliases
 * pointing to it, so rule rows can be found from either form.
 */
export function countryLookupKeys(canonicalName: string): string[] {
  const keys = new Set<string>([normalizeCountryKey(canonicalName)]);
  for (const [alias, target] of Object.entries(ALIASES)) {
    if (normalizeCountryKey(target) === normalizeCountryKey(canonicalName)) {
      keys.add(alias);
    }
  }
  return [...keys];
}
