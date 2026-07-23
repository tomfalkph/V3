/**
 * SINGLE SOURCE OF TRUTH for business facts, NAP, and confirmed claims.
 * -------------------------------------------------------------------------
 * Everything the site says about the business reads from here. Nothing about
 * the business is hard-coded in a component. This is how NAP stays IDENTICAL
 * everywhere (site rule §1) and how we guarantee "every claim traces to a
 * verified fact."
 *
 * DO NOT add a claim to this file unless it is confirmed true (rules §1).
 * If Tom's retirement changes the address, change it HERE only. [FLAG: address
 * will change at retirement — pre-launch update item, open question #3.]
 */

export const BUSINESS = {
  // --- NAP: must match GBP + every citation EXACTLY. No variations. ---
  // Display name = what Google Business Profile shows (NAP consistency for the map
  // pack). [FLAG: confirm GBP spelling is exactly this — no "Inc." — before launch.]
  name: 'Tom Falk Plumbing & Heating',
  // Legal entity name — used in schema `legalName` + the footer copyright, NOT as the
  // visible NAP (adding "Inc." to the NAP would break GBP/citation consistency).
  legalName: 'Tom Falk Plumbing & Heating, Inc.',
  streetAddress: '430 N George St',
  addressLocality: 'Millersville',
  addressRegion: 'PA',
  postalCode: '17551',
  addressCountry: 'US',

  // Phone — always rendered as a tel: link via PHONE_TEL below.
  phoneDisplay: '(717) 872-2850',
  phoneTel: '+17178722850',

  // --- Canonical web identity (non-www apex — the locked single version) ---
  siteUrl: 'https://tomfalkph.com',

  // --- Geo (from head-code schema block) ---
  geo: { latitude: 40.0026, longitude: -76.3552 },

  // --- Confirmed trust facts (rules §1 — verified only) ---
  foundingYear: 1961,
  founders: 'Jim and Edna Falk', // verified from live site
  // Amana + Rheem authorized dealer, real Manual-J load calcs,
  // 1-yr labor guarantee (extendable to 10), Synchrony financing.
  brandsAuthorized: ['Amana', 'Rheem'],
  laborGuaranteeYears: 1,
  laborGuaranteeMaxYears: 10,
  financingPartner: 'Synchrony',
  // Verified from live site: licensed master and journeymen plumbers.
  credentials: 'Licensed master and journeymen plumbers',
  // Real rating shown on the live site (Google). Displayed as content; see
  // reviews.ts. [FLAG: keep this in sync with the live Google count before launch;
  // AggregateRating JSON-LD intentionally NOT emitted from self-hosted markup.]
  ratingValue: 4.9,
  reviewCount: 46,

  priceRange: '$$',
  // Payment methods (schema paymentAccepted). [FLAG: confirm before launch.]
  paymentAccepted: 'Cash, Check, Credit Card, Financing through Synchrony',

  // --- Licenses — DISPLAY these (trust + a wedge vs unlicensed/subcontractor crews).
  // [FLAG: fill the REAL numbers before launch. Empty = a "needs license #" flag renders,
  // never a fake number.] ---
  // PA Home Improvement Contractor registration — the checkable state credential
  // (PA has no statewide plumber license). Displayed in the footer as "PA HIC #...".
  licenseHIC: 'PA026729',
  licenseMasterPlumber: '', // Master plumber license # (PA issues none statewide; leave empty)

  // --- Hours for openingHoursSpecification schema + footer.
  // [FLAG: PLACEHOLDER hours. hoursConfirmed stays FALSE until Trevor confirms — while
  // false, NO hours are emitted in schema (never publish unverified hours as a claim).] ---
  hoursConfirmed: false,
  businessHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  ],

  // Main service types — feed schema makesOffer and reinforce the entity for local rank.
  serviceTypes: [
    'HVAC Installation and Replacement',
    'Air Conditioning Installation',
    'Furnace Installation',
    'Heat Pump Installation',
    'Boiler Installation',
    'Ductless Mini-Split Installation',
    'Water Heater Installation',
    'Tankless Water Heater Installation',
    'Well Pump Repair',
    'Drain Cleaning',
    'Water Treatment',
  ],

  // --- Service area (Lancaster County + towns we actually serve) ---
  county: 'Lancaster County',
  // Verified against the live site's Service Area nav + footer. These feed the
  // LocalBusiness areaServed schema and the /service-areas hub. Towns with their
  // own page live in src/content/towns.
  areaServedCities: [
    'Millersville',
    'Lancaster',
    'Columbia',
    'Marietta',
    'Leola',
    'Quarryville',
    'Ephrata',
    'Elizabethtown',
    'New Holland',
    'Denver',
    'Lititz',
    'Manheim',
  ],

  // --- Verified external profiles (rules head-code block) ---
  sameAs: [
    'https://www.facebook.com/tomfalkph',
    'https://www.linkedin.com/company/tom-falk-plumbing-and-heating/',
    'https://www.yelp.com/biz/falk-tom-plumbing-and-heating-millersville',
  ],

  // Link out to the full Google reviews profile ("See all reviews on Google").
  // [FLAG: PLACEHOLDER — replace with the real Google Business Profile / Maps URL.
  // The Place ID also feeds the live reviews pull; see .env.example + googleReviews.ts.]
  googleProfileUrl: 'https://www.google.com/maps/search/?api=1&query=Tom+Falk+Plumbing+%26+Heating+Millersville+PA',
} as const;

/** Derived "since 1961" trust anchor + current years-in-business. */
export const YEARS_IN_BUSINESS = new Date().getFullYear() - BUSINESS.foundingYear;

/** Convenience one-liner used in CTAs. */
export const SINCE_LINE = `Since ${BUSINESS.foundingYear}`;

/**
 * SEO defaults. Titles: 50–60 chars, service+location first, brand LAST,
 * HYPHENS not pipes, NO ampersands. Metas: 140–150 chars, front-loaded.
 */
export const SEO = {
  brandSuffix: ' - Tom Falk', // appended last, hyphen, no ampersand
  defaultTitle: 'Plumbing and Heating in Lancaster County PA - Tom Falk',
  defaultDescription:
    'Family plumbing, heating, and cooling in Millersville and Lancaster County PA. Honest work, sized right, since 1961. Call for a free quote today.',
  // Social share card: real 1200x630 crop of the branded-van / AC-install photo
  // (public/images/og-tomfalk-1200x630.jpg).
  ogImage: '/images/og-tomfalk-1200x630.jpg',
} as const;
