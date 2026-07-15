/**
 * Preview-noindex guard (P0 from the pre-launch audit).
 * -------------------------------------------------------------------------
 * The same repo serves the Netlify preview (*.netlify.app) AND, at cutover, the
 * production apex (tomfalkph.com). Every canonical/OG/JSON-LD URL points at
 * tomfalkph.com, so if search engines index the netlify.app preview it competes
 * with the eventual real site. This adds `X-Robots-Tag: noindex, nofollow` to any
 * response whose host is NOT the production apex.
 *
 * Self-resolving: once DNS points tomfalkph.com at this Netlify site, requests to
 * tomfalkph.com have host === 'tomfalkph.com' and get NO noindex header — the real
 * site indexes normally. No code change needed at launch.
 */
export default async (request, context) => {
  const res = await context.next();
  const host = new URL(request.url).hostname.toLowerCase();
  if (host !== 'tomfalkph.com') {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
};

export const config = { path: '/*' };
