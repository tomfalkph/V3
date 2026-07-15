# Tom Falk Plumbing & Heating — website (Astro)

Owned rebuild of tomfalkph.com. **Parallel foundation — NOT launched.** Octane stays
live until a deliberate DNS cutover. This repo is governed by the source-of-truth
rules in the "Tom Falk Website and SEO/build-rules" folder. If it's not written
there, it's not decided.

## Stack
Astro (static-first) · Netlify (hosting + Functions) · Supabase (leads) · git-based CMS (planned).

## Run it locally
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output -> dist/
npm run preview    # serve the built site
npm run check      # astro type/diagnostics check
```
> Node 22+. First `npm install` pulls Astro + Sharp + sitemap.

## Project shape
```
src/
  consts.ts                  # SINGLE SOURCE OF TRUTH: NAP + confirmed facts
  content.config.ts          # collections: services, towns, posts (Zod enforces SEO limits)
  data/localBusinessSchema.ts# site-wide HVACBusiness JSON-LD (built from consts)
  data/reviews.ts            # REAL reviews only (empty until supplied)
  layouts/BaseLayout.astro   # SEO head, canonical (non-www), JSON-LD, sticky call bar
  components/                # Header, Footer, CTABlock, Reviews, ServiceCard, LeadForm
  content/services/*.md      # add a service = one markdown file
  content/towns/*.md         # add a town = one markdown file (routes /service-areas/[town])
  content/posts/*.md         # blog starts fresh, buyer-intent only
  pages/                     # index, services/, service-areas/, blog/, 404
netlify/functions/lead.mjs   # form -> Supabase leads table (dependency-free fetch)
```

## Decisions locked (2026-07-15)
- Town URLs: `/service-areas/[town]` (clean hierarchy, root uncluttered).
- Blog: start fresh, buyer-intent posts only.
- Launch on current address (430 N George St); update at Tom's retirement.
- Canonical: non-www apex, enforced in `netlify.toml`.

## Supabase leads table
Run once in the Supabase SQL editor (project that the env keys point at):
```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  town text,
  message text,
  source text
);
-- Inserts happen server-side via the Netlify function using the SERVICE ROLE key,
-- so RLS can stay ON with no public policies (nothing client-side touches this table).
alter table public.leads enable row level security;
```
Set env vars locally (`.env`, see `.env.example`) and in Netlify:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `LEAD_NOTIFY_EMAIL`.

## Open placeholders (grep `PLACEHOLDER` / `[FLAG` )
- Logo (text wordmark stands in), favicon, hero/job photos, OG image — Trevor supplies real files.
- Business hours in the footer.
- Brand red hex (approx `#b3121a`) — confirm from logo.
- Lead-notify email/text alert — stubbed TODO in the function.
- Address will change at retirement.
