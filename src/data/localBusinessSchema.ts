/**
 * Site-wide LocalBusiness (HVACBusiness) JSON-LD, built from the single source
 * of truth in consts.ts. Clean JSON-LD, STRUCTURED address (rules §1). This is
 * the head-code schema block from 20-COWORK-START-PROMPT.md, now generated so it
 * can never drift from the NAP the rest of the site uses.
 *
 * [FLAG: logo + image point at PLACEHOLDER local paths — Trevor supplies the real
 * logo SVG/PNG and a real job photo; drop them at the paths below.]
 */
import { BUSINESS } from '../consts';

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': `${BUSINESS.siteUrl}/#localbusiness`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.siteUrl,
    // PLACEHOLDER asset paths — self-hosted in this repo once real files land.
    logo: `${BUSINESS.siteUrl}/images/PLACEHOLDER-logo.png`,
    image: `${BUSINESS.siteUrl}/images/PLACEHOLDER-van.jpg`,
    telephone: BUSINESS.phoneTel,
    priceRange: BUSINESS.priceRange,
    foundingDate: String(BUSINESS.foundingYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: BUSINESS.county },
      ...BUSINESS.areaServedCities.map((name) => ({ '@type': 'City', name })),
    ],
    sameAs: [...BUSINESS.sameAs],
  };
}
