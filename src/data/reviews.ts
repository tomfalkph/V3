/**
 * FALLBACK reviews only. The site pulls reviews LIVE from Google at build time
 * (see src/lib/googleReviews.ts). This list is the "last known good" set used only
 * when the Google Places API key/Place ID aren't configured or the API call fails,
 * so the page is never empty and local dev still renders. Verbatim from the live
 * site / Google as of 2026-07-15 (4.9 / 46).
 *
 * DO NOT treat this as the source of truth for the rating — the live pull is. Keep
 * these as an honest snapshot; don't invent testimonials.
 */
export interface Review {
  quote: string;
  name: string;
  source?: string;
  authorUrl?: string;
  rating?: number;
}

export const FALLBACK_REVIEWS: Review[] = [
  { quote: 'Fantastic company! They have done plumbing repairs and have installed a new HVAC system.', name: 'Susan Frese', source: 'Google' },
  { quote: 'Tom Falk plumbing has helped us for over 20 years. Their response to calls is very prompt.', name: 'Carl Pike', source: 'Google' },
  { quote: 'Jim and Jeff from Tom Falk Plumbing and Heating did an excellent job of installing a new HVAC system and a tankless water heating system.', name: 'Nadine Shaw', source: 'Google' },
  { quote: 'Everything has turned out so great! And less than those bigger companies and a lot nicer to talk to!', name: 'Malinda Rodriguez-Fryberger', source: 'Google' },
  { quote: 'The crew at TFPH have been super to work with and are my first call if plumbing issues arise.', name: 'Tina Anderson', source: 'Google' },
  { quote: 'Trevor, Jim and Jeff make a great team. Their work is excellent.', name: 'Pat Stockwell', source: 'Google' },
  { quote: 'Jeff was great. He installed the toilet and made sure everything was working good.', name: 'Elaine Teare', source: 'Google' },
  { quote: 'Tom Falk plumbing came to the house and checked out the heating, cooling & thermostat. He was prompt and finished quickly.', name: 'Candae Deen', source: 'Google' },
];
