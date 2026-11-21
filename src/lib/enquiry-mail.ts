import { siteConfig } from "./site-config";

// Both names already exist in deployed/legacy site configurations. Keep every
// enquiry and payment notification compatible without requiring renamed secrets.
export function getEnquiryMailConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    apiKey: env.RESEND_API_KEY?.trim(),
    from: env.ENQUIRY_FROM_EMAIL?.trim() || env.CUSTOM_JOURNEY_FROM_EMAIL?.trim(),
    to: env.ENQUIRY_TO_EMAIL?.trim() || env.CUSTOM_JOURNEY_TO_EMAIL?.trim() || siteConfig.enquiryEmail,
  };
}
