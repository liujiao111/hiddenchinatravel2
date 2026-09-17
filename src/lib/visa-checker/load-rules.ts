import fs from "fs";
import path from "path";
import {
  normalizeCountryKey,
  toCanonicalCountryName,
} from "./country-aliases";

const DATA_DIR = path.join(process.cwd(), "data");

export const RULE_FILES = {
  countries: "countries.csv",
  visaFree:
    "china_visa_for_foreigners_countries - visa_free_rules.csv",
  transit240Countries:
    "china_visa_for_foreigners_countries - transit_240_country_rules.csv",
  transit240Ports:
    "china_visa_for_foreigners_countries - transit_240_ports.csv",
  hainan30Countries:
    "china_visa_for_foreigners_countries - hainan_30_country_rules.csv",
} as const;

export type CountryOption = {
  name: string;
  iso2: string;
};

export type VisaFreeRule = {
  country: string;
  region: string;
  ruleType: "unilateral_visa_free" | "mutual_visa_free" | string;
  policyType: string;
  maxStayDays: number;
};

export type Transit240CountryRule = {
  country: string;
  region: string;
  ruleType: string;
  maxStayHours: number;
  maxStayDays: number;
  requirement: string;
};

export type Transit240Port = {
  portId: string;
  province: string;
  city: string;
  portName: string;
  portType: string;
  allowedStayArea: string;
  ruleType: string;
};

/** Island-only Hainan 30-day visa-free — not nationwide mainland entry. */
export type Hainan30CountryRule = {
  country: string;
  region: string;
  ruleType: string;
  maxStayDays: number;
  requirement: string;
};

function readCsv(fileName: string): string[][] {
  const raw = fs.readFileSync(path.join(DATA_DIR, fileName), "utf8");
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) return [];

  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    rows.push(parseCsvLine(line));
  }
  return rows;
}

/** Minimal CSV line parser supporting quoted fields. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (row[i] ?? "").trim();
    });
    return obj;
  });
}

let cache: {
  countries: CountryOption[];
  visaFreeByKey: Map<string, VisaFreeRule>;
  transit240ByKey: Map<string, Transit240CountryRule>;
  hainan30ByKey: Map<string, Hainan30CountryRule>;
  ports: Transit240Port[];
  portsById: Map<string, Transit240Port>;
} | null = null;

function buildCache() {
  const countryRows = rowsToObjects(readCsv(RULE_FILES.countries));
  const countries: CountryOption[] = countryRows
    .map((r) => ({
      name: r.name || r.Country || "",
      iso2: (r.iso2 || r.ISO2 || "").toUpperCase(),
    }))
    .filter((c) => c.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  const visaFreeByKey = new Map<string, VisaFreeRule>();
  for (const r of rowsToObjects(readCsv(RULE_FILES.visaFree))) {
    const country = r.Country;
    if (!country) continue;
    const rule: VisaFreeRule = {
      country,
      region: r.Region,
      ruleType: r.rule_type,
      policyType: r["Policy Type"],
      maxStayDays: Number(r["Max Stay Days"]) || 30,
    };
    visaFreeByKey.set(normalizeCountryKey(country), rule);
  }

  const transit240ByKey = new Map<string, Transit240CountryRule>();
  for (const r of rowsToObjects(readCsv(RULE_FILES.transit240Countries))) {
    const country = r.Country;
    if (!country) continue;
    const rule: Transit240CountryRule = {
      country,
      region: r.Region,
      ruleType: r.rule_type,
      maxStayHours: Number(r["Max Stay Hours"]) || 240,
      maxStayDays: Number(r["Max Stay Days"]) || 10,
      requirement: r.Requirement,
    };
    transit240ByKey.set(normalizeCountryKey(country), rule);
  }

  const hainan30ByKey = new Map<string, Hainan30CountryRule>();
  for (const r of rowsToObjects(readCsv(RULE_FILES.hainan30Countries))) {
    const country = r.Country;
    if (!country) continue;
    const rule: Hainan30CountryRule = {
      country,
      region: r.Region,
      ruleType: r.rule_type,
      maxStayDays: Number(r["Max Stay Days"]) || 30,
      requirement: r.Requirement,
    };
    hainan30ByKey.set(normalizeCountryKey(country), rule);
  }

  const ports: Transit240Port[] = rowsToObjects(
    readCsv(RULE_FILES.transit240Ports),
  )
    .map((r) => ({
      portId: r["Port ID"],
      province: r["Province or Municipality"],
      city: r.City,
      portName: r["Port Name"],
      portType: r["Port Type"],
      allowedStayArea: r["Allowed Stay Area"],
      ruleType: r.rule_type,
    }))
    .filter((p) => p.portId && p.portName);

  const portsById = new Map(ports.map((p) => [p.portId, p]));

  return {
    countries,
    visaFreeByKey,
    transit240ByKey,
    hainan30ByKey,
    ports,
    portsById,
  };
}

function getCache() {
  if (!cache) cache = buildCache();
  return cache;
}

export function getCountryOptions(): CountryOption[] {
  return getCache().countries;
}

export function getPortOptions(): Transit240Port[] {
  return getCache().ports;
}

export function getPortById(portId: string): Transit240Port | undefined {
  return getCache().portsById.get(portId);
}

export function getVisaFreeRule(
  countryName: string,
): VisaFreeRule | undefined {
  const canonical = toCanonicalCountryName(countryName);
  return getCache().visaFreeByKey.get(normalizeCountryKey(canonical));
}

export function getTransit240Rule(
  countryName: string,
): Transit240CountryRule | undefined {
  const canonical = toCanonicalCountryName(countryName);
  return getCache().transit240ByKey.get(normalizeCountryKey(canonical));
}

export function getHainan30Rule(
  countryName: string,
): Hainan30CountryRule | undefined {
  const canonical = toCanonicalCountryName(countryName);
  return getCache().hainan30ByKey.get(normalizeCountryKey(canonical));
}

export function isHainanPort(port: Transit240Port | undefined): boolean {
  return Boolean(port && /hainan/i.test(port.province));
}

export type SelectOption = {
  value: string;
  label: string;
  searchText?: string;
};

export function getCountrySelectOptions(): SelectOption[] {
  const seen = new Set<string>();
  return getCountryOptions()
    .filter((c) => {
      const k = c.name.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((c) => ({
      value: c.name,
      label: c.name,
      searchText: `${c.name} ${c.iso2}`,
    }));
}

export function getPortSelectOptions(): SelectOption[] {
  return getPortOptions().map((p) => ({
    value: p.portId,
    label: `${p.city} · ${p.portName}`,
    searchText: `${p.city} ${p.portName} ${p.province} ${p.portType} ${p.allowedStayArea}`,
  }));
}
