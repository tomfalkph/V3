/**
 * LIVE Google reviews, pulled at BUILD TIME (static-first — no client JS, no widget,
 * no API key ever shipped to the browser). The result is baked into static HTML when
 * the site builds; a scheduled daily rebuild (see netlify/functions/refresh-reviews.mjs
 * + netlify.toml) keeps it fresh so it never goes stale.
 *
 * Configure in Netlify (and .env for local): GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID.
 * If they're missing or the call fails, we fall back to the last-known-good snapshot
 * in src/data/reviews.ts — the build NEVER breaks on reviews.
 *
 * NOTE: the Google Places API returns up to 5 reviews (Google chooses "most relevant")
 * plus the true rating and total count. That's intentionally live, not a stale grab.
 * "See all reviews on Google" links out to the full profile.
 */
import { FALLBACK_REVIEWS, type Review } from '../data/reviews';
import { BUSINESS } from '../consts';

export interface ReviewsData {
  rating: number;
  count: number;
  reviews: Review[];
  live: boolean;
}

// Read from process.env (Netlify build) or Vite's import.meta.env (astro dev/build),
// guarded so importing this module never throws outside a Vite context.
const ENV: Record<string, string | undefined> =
  (typeof process !== 'undefined' && process.env) ||
  ((import.meta as any)?.env ?? {});
const API_KEY = ENV.GOOGLE_PLACES_API_KEY || (import.meta as any)?.env?.GOOGLE_PLACES_API_KEY;
const PLACE_ID = ENV.GOOGLE_PLACE_ID || (import.meta as any)?.env?.GOOGLE_PLACE_ID;

async function fetchLive(): Promise<ReviewsData> {
  if (!API_KEY || !PLACE_ID) {
    return { rating: BUSINESS.ratingValue, count: BUSINESS.reviewCount, reviews: FALLBACK_REVIEWS, live: false };
  }
  try {
    // Places API (New): GET the place resource with a field mask. The API key
    // travels in a header, never the URL. Returns the true rating + total count
    // and up to 5 Google-chosen reviews.
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}`;
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
    });
    const data = await res.json();
    if (res.ok && (data.rating != null || Array.isArray(data.reviews))) {
      const reviews: Review[] = (data.reviews || [])
        .map((rv: any) => ({
          quote: (rv.originalText?.text ?? rv.text?.text ?? '').trim(),
          name: rv.authorAttribution?.displayName ?? 'Google reviewer',
          source: 'Google',
          authorUrl: rv.authorAttribution?.uri,
          rating: rv.rating,
        }))
        .filter((rv: Review) => rv.quote);
      if (reviews.length > 0) {
        return {
          rating: data.rating ?? BUSINESS.ratingValue,
          count: data.userRatingCount ?? BUSINESS.reviewCount,
          reviews,
          live: true,
        };
      }
    }
    console.warn('[reviews] Places API (New) returned no usable reviews (HTTP ' + res.status + '); using fallback.');
  } catch (err) {
    console.warn('[reviews] Places API (New) fetch failed; using fallback.', err);
  }
  return { rating: BUSINESS.ratingValue, count: BUSINESS.reviewCount, reviews: FALLBACK_REVIEWS, live: false };
}

// Memoize for the whole build so we hit Google once, not once per page.
let cached: Promise<ReviewsData> | null = null;
export function getReviews(): Promise<ReviewsData> {
  return (cached ??= fetchLive());
}
