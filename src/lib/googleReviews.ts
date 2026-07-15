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
    const url =
      'https://maps.googleapis.com/maps/api/place/details/json' +
      `?place_id=${encodeURIComponent(PLACE_ID)}` +
      '&fields=rating,user_ratings_total,reviews' +
      '&reviews_sort=most_relevant&reviews_no_translations=true' +
      `&key=${encodeURIComponent(API_KEY)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'OK' && data.result) {
      const r = data.result;
      const reviews: Review[] = (r.reviews || [])
        .filter((rv: any) => rv.text && rv.text.trim())
        .map((rv: any) => ({
          quote: rv.text.trim(),
          name: rv.author_name,
          source: 'Google',
          authorUrl: rv.author_url,
          rating: rv.rating,
        }));
      if (reviews.length > 0) {
        return {
          rating: r.rating ?? BUSINESS.ratingValue,
          count: r.user_ratings_total ?? BUSINESS.reviewCount,
          reviews,
          live: true,
        };
      }
    }
    console.warn('[reviews] Places API returned no usable reviews (status=' + data.status + '); using fallback.');
  } catch (err) {
    console.warn('[reviews] Places API fetch failed; using fallback.', err);
  }
  return { rating: BUSINESS.ratingValue, count: BUSINESS.reviewCount, reviews: FALLBACK_REVIEWS, live: false };
}

// Memoize for the whole build so we hit Google once, not once per page.
let cached: Promise<ReviewsData> | null = null;
export function getReviews(): Promise<ReviewsData> {
  return (cached ??= fetchLive());
}
