import assert from "node:assert/strict";
import test from "node:test";
import {
  getVisitorCountry,
  selectYunnanCountryGuide,
  yunnanCountryGuides,
} from "../src/lib/yunnan-country-guides.ts";

const publishedGuides = yunnanCountryGuides.filter((guide) => guide.countryCode !== "MY");

test("supported Vercel countries select their published guide", () => {
  for (const country of ["SG", "US", "AU", "GB"]) {
    const headers = new Headers({ "x-vercel-ip-country": country.toLowerCase() });
    assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, country);
  }
});

test("unknown, unavailable and malformed countries fall back to Singapore", () => {
  for (const country of ["JP", "CN", "MY", "XX", "T1", "USA", "US,GB", ""]) {
    const headers = new Headers({ "x-vercel-ip-country": country });
    assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, "SG");
  }
  assert.equal(selectYunnanCountryGuide(getVisitorCountry(new Headers()), publishedGuides).countryCode, "SG");
});

test("Cloudflare visitor country takes precedence over Vercel proxy country", () => {
  const headers = new Headers({ "cf-ray": "example", "cf-ipcountry": "GB", "x-vercel-ip-country": "US" });
  assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, "GB");
});

test("unknown Cloudflare visitors never inherit the proxy's country", () => {
  for (const country of ["JP", "XX", "T1", ""]) {
    const headers = new Headers({ "cf-ray": "example", "cf-ipcountry": country, "x-vercel-ip-country": "US" });
    assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, "SG");
  }
  const headers = new Headers({ "cf-ray": "example", "x-vercel-ip-country": "US" });
  assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, "SG");
});

test("a Cloudflare country header alone does not override direct Vercel geolocation", () => {
  const headers = new Headers({ "cf-ipcountry": "GB", "x-vercel-ip-country": "AU" });
  assert.equal(selectYunnanCountryGuide(getVisitorCountry(headers), publishedGuides).countryCode, "AU");
});

test("Malaysia becomes selectable when its guide is available", () => {
  assert.equal(selectYunnanCountryGuide("MY", yunnanCountryGuides).slug, "yunnan-travel-from-malaysia");
});
