import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ContentFooter } from "@/components/content-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "Contact Hidden China Travel | Talk With Joy Liu" },
  description: "Have questions about Yunnan, China travel, visas, payments, or trip planning? Contact Joy Liu directly and start the conversation.",
  alternates: { canonical: "/contact" },
};

const whatsapp = `https://wa.me/${siteConfig.whatsappNumber}?text=Hi%20Joy%2C%20I%27d%20like%20to%20talk%20about%20my%20China%20journey.`;

const steps = [
  ["01", "Tell us about your plans", "Share your dates, destinations, and questions."],
  ["02", "We'll review everything personally", "Every inquiry is reviewed by Joy Liu.\n\nNo automated travel templates.\n\nNo outsourced sales teams."],
  ["03", "We'll explore the possibilities", "If one of our journeys is a good fit, we'll prepare recommendations and next steps."],
  ["04", "You decide", "No sales pressure.\n\nNo obligation to book."],
];

const questions = [
  "Is Yunnan a good first destination in China?",
  "How many days should I spend in Dali, Shaxi, or Lijiang?",
  "Do I need a visa?",
  "Can I customize a journey?",
  "Is China easy to travel independently?",
  "What should I prepare before arriving?",
  "Which hotels do you recommend?",
  "Do I need Alipay, WeChat Pay, or an eSIM?",
];

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />

      <section className="contact-hero">
        <div className="shell contact-hero-copy">
          <p className="contact-kicker">A PERSONAL CONVERSATION</p>
          <h1>Let&apos;s Talk About Your China Journey</h1>
          <p>Whether you&apos;re planning your first trip to China, exploring Yunnan, or simply looking for practical advice, we&apos;d love to hear from you.</p>
          <div className="contact-hero-emphasis"><span>No pressure.</span><span>No obligation.</span><strong>Just a conversation.</strong></div>
          <Link className="button button-blue" href={whatsapp}>Chat with Joy on WhatsApp</Link>
          <small>Usually replies within 24 hours.</small>
        </div>
      </section>

      <section className="contact-process section">
        <div className="shell">
          <header className="contact-section-heading">
            <p className="contact-kicker">WHAT HAPPENS NEXT?</p>
            <h2>Here&apos;s how it works</h2>
          </header>
          <div className="contact-step-grid">
            {steps.map(([number, title, body]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                {body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-founder">
        <div className="contact-founder-image">
          <Image src="/brand/founder/portrait.webp" alt="Joy Liu, founder of Hidden China Travel" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="contact-founder-copy">
          <p className="contact-kicker">YOUR LOCAL CONTACT</p>
          <h2>You&apos;ll Be Speaking Directly With Joy Liu</h2>
          <p>Born and raised in Yunnan.</p>
          <p>Years spent living abroad helped me understand how unfamiliar a new country can feel.</p>
          <p>That&apos;s why Hidden China Travel exists: to make exploring China feel more comfortable, more personal, and more approachable.</p>
          <p>Whether you have questions about Yunnan, visas, payments, transportation, or trip planning, I&apos;m always happy to help where I can.</p>
          <strong>— Joy Liu</strong>
          <span>Founder, Hidden China Travel</span>
        </div>
      </section>

      <section className="contact-form-section section">
        <div className="shell contact-form-layout">
          <header>
            <p className="contact-kicker">START THE CONVERSATION</p>
            <h2>Tell Us About Your Trip</h2>
            <p>The more we know, the better advice we can give.</p>
          </header>
          <ContactForm />
        </div>
      </section>

      <section className="contact-questions section">
        <div className="shell contact-questions-layout">
          <header>
            <p className="contact-kicker">WHY TRAVELERS CONTACT US</p>
            <h2>Common Questions</h2>
          </header>
          <ul>{questions.map((question) => <li key={question}><span>✓</span>{question}</li>)}</ul>
        </div>
      </section>

      <section className="contact-alternatives section">
        <div className="shell">
          <header className="contact-section-heading">
            <p className="contact-kicker">ALTERNATIVE CONTACT METHODS</p>
            <h2>Other Ways to Reach Us</h2>
          </header>
          <div className="contact-method-grid">
            <article><span>01</span><h3>WhatsApp</h3><p>The fastest way to reach us.</p><Link href={whatsapp}>Chat on WhatsApp →</Link></article>
            <article><span>02</span><h3>Email</h3><p>For detailed questions or attachments.</p><a href="mailto:joy.liu@hiddenchinatravel.com">joy.liu@hiddenchinatravel.com</a></article>
            <article><span>03</span><h3>Response Time</h3><p>Usually within 24 hours.</p></article>
          </div>
        </div>
      </section>

      <section className="contact-final">
        <div className="narrow">
          <h2>Not Sure Where to Start?</h2>
          <p>That&apos;s completely normal.</p>
          <p>Many travelers contact us before they&apos;ve decided on dates, destinations, or even whether China is the right fit.</p>
          <p>Tell us where you&apos;re at.<br />We&apos;ll help from there.</p>
          <Link className="button button-light" href={whatsapp}>Chat with Joy on WhatsApp</Link>
        </div>
      </section>

      <ContentFooter />
    </main>
  );
}
