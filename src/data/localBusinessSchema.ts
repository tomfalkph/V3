/**
 * Site-wide LocalBusiness (HVACBusiness) JSON-LD, built from the single source
 * of truth in consts.ts. Clean JSON-LD, STRUCTURED address (rules §1). Generated
 * so it can never drift from the NAP the rest of the site uses.
 *
 * logo + image now point at real self-hosted assets (the vector logo and a real
 * job-photo share card in public/images).
 * [FLAG: sameAs includes the Google profile URL — replace the placeholder Maps-search
 * URL in consts.googleProfileUrl with the REAL Google Business Profile URL.]
 */
import { BUSINESS } from '../consts';

export function localBusinessSchema() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': `${BUSINESS.siteUrl}/#localbusiness`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.siteUrl,
    // Real self-hosted brand assets: the vector logo + a real job photo.
    logo: `${BUSINESS.siteUrl}/images/logo-tomfalk.svg`,
    image: `${BUSINESS.siteUrl}/images/og-tomfalk-1200x630.jpg`,
    telephone: BUSINESS.phoneTel,
    priceRange: BUSINESS.priceRange,
    paymentAccepted: BUSINESS.paymentAccepted,
    foundingDate: String(BUSINESS.foundingYear),
    // Founders as Person entities (verified: Jim & Edna Falk).
    founder: [
      { '@type': 'Person', name: 'Jim Falk' },
      { '@type': 'Person', name: 'Edna Falk' },
    ],
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
    // Ties the services to the business entity (relevance signal for local rank).
    makesOffer: BUSINESS.serviceTypes.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s },
    })),
    // sameAs: verified profiles + the Google profile (placeholder until real GBP URL).
    sameAs: [...BUSINESS.sameAs, BUSINESS.googleProfileUrl],
  };

  // Only emit hours once confirmed — never publish unverified hours as a claim.
  if (BUSINESS.hoursConfirmed) {
    schema.openingHoursSpecification = BUSINESS.businessHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }

  return schema;
}

/**
 * BreadcrumbList JSON-LD. Pass ordered crumbs (name + absolute or root-relative path);
 * emits schema Google uses for breadcrumb rich results. Paths are resolved to the
 * production site URL so they match canonicals.
 */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: new URL(c.path, BUSINESS.siteUrl).href,
    })),
  };
}
