/**
 * Lead capture — Netlify Function.
 * -------------------------------------------------------------------------
 * Receives the site's quote form (POST /api/lead), validates, drops obvious
 * bots, and inserts a row into the Supabase `leads` table Trevor owns.
 *
 * Deliberately DEPENDENCY-FREE: talks to Supabase over its REST (PostgREST)
 * endpoint with fetch, so there's nothing to npm-install for this function and
 * nothing extra shipped to the browser (static-first, no bloat — rules §1).
 *
 * ENV (set in Netlify + local .env — see .env.example):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (service role: server-side only)
 *   LEAD_NOTIFY_EMAIL                          (used by the notify TODO below)
 *
 * REQUIRED TABLE (create in Supabase — see README "Supabase leads table"):
 *   leads(id uuid pk default gen_random_uuid(), created_at timestamptz default now(),
 *         name text, phone text, email text, town text, message text, source text)
 *
 * [FLAG/TODO: notification (email/text alert) is stubbed — wire in a later
 *  session. Insert works today once env keys are set.]
 */

const json = (status, body) => ({
  statusCode: status,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

function parseBody(event) {
  const type = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';
  if (type.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  // urlencoded or multipart form-data both arrive as query-string-ish pairs for
  // simple fields; URLSearchParams handles urlencoded. FormData (multipart) is
  // parsed field-by-field below.
  if (type.includes('multipart/form-data')) {
    const out = {};
    const boundary = type.split('boundary=')[1];
    if (boundary) {
      for (const part of raw.split('--' + boundary)) {
        const m = part.match(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n$/);
        if (m) out[m[1]] = m[2];
      }
    }
    return out;
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const data = parseBody(event);

  // Honeypot: bots fill "company"; humans don't. Pretend success, insert nothing.
  if (data.company) return json(200, { ok: true });

  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  if (!name || !phone) return json(400, { error: 'Name and phone are required.' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !KEY) {
    // Misconfigured env — don't lose the lead silently; log for Netlify function logs.
    console.error('[lead] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return json(500, { error: 'Server not configured.' });
  }

  const row = {
    name,
    phone,
    email: (data.email || '').trim() || null,
    town: (data.town || '').trim() || null,
    message: (data.message || '').trim() || null,
    source: (data.source || 'site').trim(),
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: KEY,
        authorization: `Bearer ${KEY}`,
        prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[lead] Supabase insert failed', res.status, text);
      return json(502, { error: 'Could not save lead.' });
    }

    // TODO(notify): send email/text to LEAD_NOTIFY_EMAIL. Stubbed for now.
    return json(200, { ok: true });
  } catch (err) {
    console.error('[lead] Unexpected error', err);
    return json(500, { error: 'Unexpected error.' });
  }
}
