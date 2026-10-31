"use server";

import { evaluateVisa, type VisaCheckInput } from "@/lib/visa-checker/evaluate";
import { getCountryOptions, getPortById } from "@/lib/visa-checker/load-rules";

export async function checkVisaEligibility(input: VisaCheckInput) {
  const nationality = input.nationality?.trim() || "";
  const stayDays = Number(input.stayDays);
  if (!getCountryOptions().some((country) => country.name === nationality)) {
    throw new Error("Select a passport country from the list.");
  }
  if (!Number.isInteger(stayDays) || stayDays < 1 || stayDays > 365) {
    throw new Error("Enter a stay between 1 and 365 days.");
  }
  if (input.portId && !getPortById(input.portId)) {
    throw new Error("Select a listed arrival port.");
  }
  return evaluateVisa({ ...input, nationality, stayDays });
}
