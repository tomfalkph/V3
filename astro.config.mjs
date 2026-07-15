// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static-first per the source-of-truth rules: no SSR adapter, ship as little JS
// as possible. Lead form posts to a Netlify Function (netlify/functions/lead.mjs),
// which Netlify serves alongside the static build — no adapter required.
//
// SITE: canonical is the NON-WWW apex. This enforces the single-version rule that
// the Octane build failed. Do not change to www.
export default defineConfig({
  site: 'https://tomfalkph.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    // Clean URLs: /services/hvac-installation-replacement (not .../index.html)
    format: 'file',
  },
  // Astro's built-in Sharp image optimization (WebP, resize, lazy-load) is the
  // default service — no config needed. Real photos drop into src/assets and get
  // imported through <Image />/<Picture /> in a later pass once Trevor supplies them.
});
