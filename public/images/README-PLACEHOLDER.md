# Image assets — REAL photos only (rules §1)

Claude does NOT generate images or logos. Trevor drops real files here. Referenced
placeholder paths the code currently points at (replace with real files, same names
or update the refs):

- `PLACEHOLDER-logo.png`   — real logo (from the vector PDF export) for schema `logo`
- `PLACEHOLDER-van.jpg`    — real wrapped-van / job photo for schema `image` + OG
- `PLACEHOLDER-og-image.jpg` — social share image (a real job photo)
- `/favicon.svg` (in /public) — the F-box mark, isolated + exported square

Per-page hero photos are referenced from each markdown file's `heroImage` field
(currently `null`, which renders a visible "needs photo" flag). Add a real photo,
set `heroImage` + `heroImageAlt` (location-aware alt text), and the flag disappears.
