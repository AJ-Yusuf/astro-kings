/* worker/submit.js — POST /api/submit: the server side of every website form.

   The forms used to post straight to Formspree, so the Turnstile captcha was
   only checked in the browser — a bot could skip the page and post to
   Formspree directly. Now every form posts here instead, and this:
     1. Checks the request came from our own site (Origin header).
     2. Verifies the Turnstile token with Cloudflare (/siteverify). No valid
        token, nothing is sent. Tokens are single-use.
     3. Re-checks the fields with the same rules as the browser
        (src/lib/submitForm.js) — including the Subs Bench minimum age, which
        a bot could otherwise skip.
     4. Forwards only the known fields to Formspree.

   Worker settings (Cloudflare → Workers → astro-kings → Settings → Variables
   and Secrets), all as type "Secret":
     TURNSTILE_SECRET_KEY  the Turnstile widget's secret key
     FORMSPREE_ENDPOINT    https://formspree.io/f/XXXXXXXX — a form whose URL
                           has never been published in the site's code
     ALLOWED_ORIGINS       comma-separated site origins, e.g.
                           https://astro-kings.com,https://www.astro-kings.com
   If any is missing, every submission is refused (fails closed). */

import { LIMITS, EMAIL_RE, PHONE_RE, checkAge } from '../src/lib/submitForm.js';
import { SUBS_BENCH_MIN_AGE } from '../src/lib/config.js';

const MAX_BODY = 16 * 1024;
const MAX = { ...LIMITS, age: 3, days: 80, page: 60, subject: 120 };

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

/* trimmed string, or '' — never trust types from the client */
const str = (v, max) => (typeof v === 'string' ? v.trim() : '').slice(0, max);
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ');

export async function handleSubmit(request, env){
  if (request.method !== 'POST') return json(405, { error: 'method' });

  const { TURNSTILE_SECRET_KEY, FORMSPREE_ENDPOINT, ALLOWED_ORIGINS } = env;
  if (!TURNSTILE_SECRET_KEY || !FORMSPREE_ENDPOINT || !ALLOWED_ORIGINS) return json(503, { error: 'not configured' });

  const origins = ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  if (!origins.includes(request.headers.get('Origin'))) return json(403, { error: 'origin' });

  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return json(415, { error: 'type' });
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { error: 'too large' });
  let data;
  try { data = JSON.parse(raw); } catch { return json(400, { error: 'json' }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json(400, { error: 'json' });

  // honeypot filled → a bot; answer "ok" so it learns nothing
  if (str(data._gotcha, 200)) return json(200, { ok: true });

  // 1. captcha
  const token = str(data['cf-turnstile-response'], 2048);
  if (!token) return json(403, { error: 'captcha' });
  const form = new FormData();
  form.append('secret', TURNSTILE_SECRET_KEY);
  form.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);
  let verdict;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    verdict = await r.json();
  } catch { return json(502, { error: 'captcha unavailable' }); }
  if (!verdict || verdict.success !== true) return json(403, { error: 'captcha' });

  // 2. fields — same rules as the browser
  const f = {
    name:    oneLine(str(data.name, MAX.name)),
    email:   oneLine(str(data.email, MAX.email)),
    phone:   oneLine(str(data.phone, MAX.phone)),
    message: str(data.message, MAX.message),
    age:     oneLine(str(data.age, MAX.age)),
    days:    oneLine(str(data.days, MAX.days)),
    page:    oneLine(str(data.page, MAX.page)),
  };
  if (!f.name || !EMAIL_RE.test(f.email)) return json(400, { error: 'fields' });
  if (f.phone && !PHONE_RE.test(f.phone)) return json(400, { error: 'fields' });
  // a Subs Bench sign-up (it carries age/days) must meet the minimum age
  const subsBench = 'age' in data || 'days' in data || /subs bench/i.test(f.page);
  if (subsBench && checkAge(f.age, SUBS_BENCH_MIN_AGE) !== 'ok') return json(400, { error: 'age' });

  // 3. forward to Formspree — reply-to is the validated address, never the client's _replyto
  const out = Object.fromEntries(Object.entries(f).filter(([, v]) => v));
  out._subject = oneLine(str(data._subject, MAX.subject)) || `Website enquiry — ${f.page || 'website'}`;
  out._replyto = f.email;
  try {
    const r = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(out),
    });
    if (!r.ok) return json(502, { error: 'send failed' });
  } catch { return json(502, { error: 'send failed' }); }

  return json(200, { ok: true });
}
