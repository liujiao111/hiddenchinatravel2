export type ClientVoice = {
  quote: string;
  name: string;
  trip: string;
  sourceUrl?: string;
  sourceLabel?: string;
};

/**
 * Real traveler feedback only.
 *
 * Add an entry here only once you have a traveler's actual words and their
 * permission to publish them (a first name or initials is normally enough).
 * If the feedback is already public (Google, WhatsApp, email thread you have
 * permission to quote), link to it with sourceUrl/sourceLabel so visitors can
 * verify it themselves.
 *
 * Leave this array empty and the <ClientVoices /> section hides itself
 * automatically — do not fill it with placeholder or example quotes.
 */
export const clientVoices: ClientVoice[] = [];
