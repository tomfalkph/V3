/**
 * Content collections (Astro v5 Content Layer). Add a service, town, or post by
 * dropping ONE markdown file into the matching folder — layout, SEO, and schema
 * come free (rules §2). Zod schemas below enforce the SEO rules at build time:
 * a title over 60 chars or a meta over 160 will FAIL the build, by design.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared SEO fields every routable page must supply.
const seoFields = {
  // Title: 50–60 chars, service+location first, brand last, hyphens, NO ampersand.
  // Enforced tight so an off-spec title FAILS the build (the whole point).
  title: z.string().min(50).max(60).regex(/^[^&|]+$/, 'no ampersands or pipes in titles'),
  // Meta: 140–150 chars (mobile-safe), front-loaded. Small tolerance so a 1-char
  // drift doesn't break the build, but anything clearly off-spec fails.
  description: z.string().min(140).max(152),
  draft: z.boolean().default(false),
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    ...seoFields,
    h1: z.string(),
    // Short line used on hub / homepage service cards.
    cardSummary: z.string(),
    // Pillar groups services under a hub page. 'heating-cooling' | 'plumbing'.
    pillar: z.enum(['heating-cooling', 'plumbing']),
    // Money pages (installs / high-margin) get priority + Service schema emphasis.
    isMoneyPage: z.boolean().default(false),
    // Intent helps ordering + internal linking: 'install' | 'repair' | 'maintain'.
    intent: z.enum(['install', 'repair', 'maintain', 'info']).default('info'),
    order: z.number().default(99),
    // [FLAG] Real photo from Trevor. Leave null -> renders a "needs photo" flag.
    heroImage: z.string().nullable().default(null),
    heroImageAlt: z.string().nullable().default(null),
    // Optional visible FAQ -> FAQPage schema ONLY when present (rules §1).
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

const towns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/towns' }),
  schema: z.object({
    ...seoFields,
    // Town titles use the short HVAC-forward pattern "Plumbing and HVAC in {Town}
    // PA - Tom Falk" (deliberately under the service pages' 50-char floor), and
    // descriptions follow the documented 70-160 rule. Override the tighter
    // shared seoFields bounds for towns only.
    title: z.string().min(30).max(60).regex(/^[^&|]+$/, 'no ampersands or pipes in titles'),
    description: z.string().min(70).max(160),
    h1: z.string(),
    townName: z.string(),
    // The primary money page this town links to (slug in services collection).
    primaryService: z.string().default('hvac-installation-replacement'),
    // Featured services for this town: service slugs rendered as clean topical
    // anchors (the service's real title). Replaces the old generic "Popular in".
    relatedServices: z.array(z.string()).default([]),
    order: z.number().default(99),
    heroImage: z.string().nullable().default(null),
    heroImageAlt: z.string().nullable().default(null),
    // Optional visible FAQ -> FAQPage schema ONLY when present (rules §1).
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    ...seoFields,
    h1: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Buyer-intent only (rules: blog starts fresh, buyer-intent posts).
    heroImage: z.string().nullable().default(null),
    heroImageAlt: z.string().nullable().default(null),
  }),
});

export const collections = { services, towns, posts };
