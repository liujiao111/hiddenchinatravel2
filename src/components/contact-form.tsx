"use client";

import type { FormEvent } from "react";
import { siteConfig } from "@/lib/site-config";

const travelWindows = ["Within 1 month", "1–3 months", "3–6 months", "More than 6 months", "Just researching"];
const interests = ["Yunnan Journey", "Private Travel", "Custom Trip Planning", "China Travel Advice", "Not Sure Yet"];

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Hi Joy, I'd like to talk about my China trip.",
      "",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `WhatsApp: ${data.get("whatsapp") || "Not provided"}`,
      `Travel timing: ${data.get("travelWindow")}`,
      `Interested in: ${data.get("interest")}`,
      "",
      "My plans:",
      String(data.get("plans") || ""),
    ].join("\n");

    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-field-row">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>

      <label>
        <span>WhatsApp <small>(recommended)</small></span>
        <input name="whatsapp" type="tel" autoComplete="tel" />
      </label>

      <fieldset>
        <legend>When are you planning to travel?</legend>
        <div className="contact-options">
          {travelWindows.map((option, index) => (
            <label key={option}>
              <input name="travelWindow" type="radio" value={option} defaultChecked={index === 4} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>What are you interested in?</legend>
        <div className="contact-options">
          {interests.map((option, index) => (
            <label key={option}>
              <input name="interest" type="radio" value={option} defaultChecked={index === 4} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label>
        <span>Tell Us About Your Plans</span>
        <textarea
          name="plans"
          rows={7}
          placeholder={"Where would you like to go?\nHow many days are you considering?\nWhat questions can we help answer?"}
          required
        />
      </label>

      <button className="button button-blue" type="submit">Start the Conversation</button>
      <p className="contact-form-note">Your answers will open in WhatsApp, ready for you to review and send.</p>
    </form>
  );
}
