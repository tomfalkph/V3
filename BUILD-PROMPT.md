# BUILD PROMPT — for Claude Code (read this and execute)

You are Claude Code, running on Trevor's machine, pointed at this folder
(`tomfalk-site`). This is the new **Tom Falk Plumbing & Heating** website — an Astro
site built in a Cowork session that could not push it (that session's sandbox had no
write access to the repo and could not run `npm`). Your job is to **verify it builds,
then push it to the existing GitHub repo so Netlify deploys it.** Trevor will type
"read build prompt and execute" — that means do the steps below, in order.

---

## Context you must respect (do not drift)
- This site is a **parallel foundation. It is NOT launched.** The current Octane site
  stays live. Pushing here deploys to a Netlify **preview** URL only (the target
  Netlify project `jolly-bombolone-9900aa` has **no custom domain**), so nothing
  customer-facing changes. Do not point DNS, do not touch the live site.
- The build is governed by the source-of-truth rules in Trevor's Desktop folder
  `Tom Falk Website and SEO/build-rules/` (00-SOURCE-OF-TRUTH.md, 10-ASSET-INVENTORY.md,
  30-DESIGN-PRINCIPLES.md). If you read them, treat them as binding.
- **Verified claims only. Do NOT invent** stats, prices, reviews, or facts. **Do NOT
  generate images or logos** — real photos are Trevor's to supply; every image is a
  flagged placeholder on purpose. **Do not expand scope** — your task is build + push +
  verify + fix build errors, not add features or rewrite content.

---

## STEP 1 — Verify it builds (fix only what blocks the build)
```bash
npm install
npm run build
```
This site was authored in an environment that could not run `npm`, so this is the
first real build. If it fails:
- Read the error, fix the **minimal** thing that unblocks it, rebuild. Repeat until
  `npm run build` succeeds and `npm run preview` serves the site.
- Likely-fragile spots to check first: Astro version differences in the content
  collections API (`glob` loader in `src/content.config.ts`, `render()` in the
  `[slug]` pages), and the `@astrojs/sitemap` integration in `astro.config.mjs`.
- Do NOT change site copy, structure, or rules to make it build — fix code/config only.
- If a fix would require inventing content or a claim, STOP and leave a note instead.

Optionally spot-check `npm run dev` (http://localhost:4321) and glance at the home,
a service page, a town page, and the lead form.

## STEP 2 — Push to the V3 repo (clean slate, keep history)
The target repo is **https://github.com/tomfalkph/V3.git** — the old, abandoned CRM
proof-of-concept, already connected to Netlify `jolly-bombolone-9900aa`. We are
repurposing it. Replace its old contents with this site while keeping its history.

If this folder is NOT already a clone of V3 (it was authored as its own git repo),
the clean way is to clone V3, replace its files with this scaffold, and push:
```bash
# from the parent directory of tomfalk-site
git clone https://github.com/tomfalkph/V3.git v3-push && cd v3-push
BRANCH=$(git rev-parse --abbrev-ref HEAD)      # auto-detect main vs master
git ls-files -z | xargs -0 git rm -q --ignore-unmatch   # remove old CRM files
# copy this scaffold in (exclude its .git):
( cd ../tomfalk-site && tar --exclude='./.git' --exclude='./node_modules' --exclude='./dist' -cf - . ) | tar -xf -
git add -A
git commit -m "Repurpose V3 -> Tom Falk Astro site (clean slate; old CRM POC removed)"
git push origin "$BRANCH"
```
Match whatever branch Netlify builds (usually `main` or `master` — the auto-detect
above handles it). Keep history; do not force-push unless the branch protection makes a
normal push impossible (ask Trevor first if so).

## STEP 3 — Verify the deploy
- Netlify will build automatically from the push. Confirm the build **succeeds** at
  https://app.netlify.com/projects/jolly-bombolone-9900aa (fix any Netlify build error
  the same minimal way as Step 1 and push again).
- Report the preview URL (https://jolly-bombolone-9900aa.netlify.app) and a short list
  of what to check.

---

## After it's live, report to Trevor
1. Confirm build + deploy succeeded and give the preview URL.
2. List the **placeholders** still needing him (grep `PLACEHOLDER` and `[FLAG`): real
   logo + favicon, real job photos per page, business hours, exact brand-red hex, the
   Supabase env keys + `leads` table (see README "Supabase leads table") for the lead
   form to store leads, and the **live Google reviews** setup below.
3. **Live Google reviews** — reviews pull from the Google Places API at BUILD time
   (static, no client JS). Until configured, the site shows the saved fallback set and
   flags it. To go live, set these Netlify env vars: `GOOGLE_PLACES_API_KEY` (Places API
   enabled), `GOOGLE_PLACE_ID` (Tom Falk's Place ID), and `BUILD_HOOK_URL` (a Netlify
   build hook) so the daily scheduled function (`refresh-reviews`, cadence in
   netlify.toml) rebuilds and refreshes them automatically. Also replace
   `BUSINESS.googleProfileUrl` in `src/consts.ts` with the real Google profile link.
3. Note anything you had to change to make it build, and anything you flagged rather
   than guessed.

Do not do more than this without asking. This is a foundation going up on a preview URL —
deliberate and reversible, exactly as the rules require.
