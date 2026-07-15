/**
 * Scheduled rebuild so the live Google reviews never go stale.
 * -------------------------------------------------------------------------
 * Reviews are pulled at BUILD time (static-first). To refresh them without a
 * human, this scheduled function pings a Netlify Build Hook once a day, which
 * kicks off a rebuild that re-fetches the latest rating + reviews from Google.
 *
 * SETUP (Trevor / Claude Code):
 *   1. Netlify -> Project -> Build & deploy -> Build hooks -> "Add build hook"
 *      (name it e.g. "daily-reviews-refresh"). Copy the URL.
 *   2. Set env var BUILD_HOOK_URL to that URL (Netlify -> Environment variables).
 *   3. The schedule is declared in netlify.toml ([functions."refresh-reviews"]).
 *
 * If BUILD_HOOK_URL isn't set, this no-ops safely (logs and exits).
 */
export default async () => {
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.log('[refresh-reviews] BUILD_HOOK_URL not set — skipping.');
    return new Response('no build hook configured', { status: 200 });
  }
  try {
    const res = await fetch(hook, { method: 'POST' });
    console.log('[refresh-reviews] triggered rebuild, status', res.status);
    return new Response('rebuild triggered', { status: 200 });
  } catch (err) {
    console.error('[refresh-reviews] failed to trigger rebuild', err);
    return new Response('failed', { status: 500 });
  }
};

// Netlify reads the cadence from netlify.toml ([functions."refresh-reviews"].schedule).
