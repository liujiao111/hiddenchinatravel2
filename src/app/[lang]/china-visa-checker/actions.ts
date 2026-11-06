"use server";

import { evaluateVisa, type VisaCheckInput } from "@/lib/visa-checker/evaluate";
import { getCountryOptions, getPortById } from "@/lib/visa-checker/load-rules";
import type { VisaLang } from "@/lib/visa-checker/i18n";

export async function checkVisaEligibility(
  input: VisaCheckInput & { locale?: string },
) {
  const lang: VisaLang = input.locale === "zh" ? "zh" : "en";
  const nationality = input.nationality?.trim() || "";
  const stayDays = Number(input.stayDays);
  if (!getCountryOptions().some((country) => country.name === nationality)) {
    throw new Error(
      lang === "zh"
        ? "请从列表中选择护照签发国。"
        : "Select a passport country from the list.",
    );
  }
  if (!Number.isInteger(stayDays) || stayDays < 1 || stayDays > 365) {
    throw new Error(
      lang === "zh"
        ? "请填写 1 到 365 天之间的停留时长。"
        : "Enter a stay between 1 and 365 days.",
    );
  }
  if (input.portId && !getPortById(input.portId)) {
    throw new Error(
      lang === "zh"
        ? "请选择列表中的入境口岸。"
        : "Select a listed arrival port.",
    );
  }
  return evaluateVisa({ ...input, nationality, stayDays }, lang);
}
