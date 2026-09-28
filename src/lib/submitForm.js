/* submitForm.js — one place that sends every website form to ENQUIRY_ENDPOINT
   (Formspree). The endpoint is public by design; never put a secret API key
   in config.js or any VITE_ variable — everything here ships to the browser.

   - Honeypot: forms render a hidden `_gotcha` input. Real people never see it;
     bots fill it, and then nothing is sent (the bot still sees "sent", so it
     learns nothing). This only stops simple bots — client-side checks are not
     security; Formspree's own spam filtering is the server-side layer.
   - Turnstile: pass the widget token and it is sent as `cf-turnstile-response`.
     It only protects anything once it is verified server-side (see config.js).
   - Times out after 15s so the button can't hang on "sending…" forever.
   - Never logs form contents: personal data must not end up in the console. */

import { ENQUIRY_ENDPOINT } from './config.js';

const TIMEOUT_MS = 15000;

/* shared limits + checks — mirror these on the inputs (maxLength / type / pattern) */
export const LIMITS = { name:100, email:254, phone:20, message:2000 };
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[0-9 +()-]{7,20}$/;
export const PHONE_PATTERN = '[0-9 +\\(\\)\\-]{7,20}';   // HTML pattern attribute version

/* resolves 'sent' | 'blocked' (honeypot tripped — pretend nothing happened);
   throws on network error, timeout or a non-2xx reply */
export async function submitForm(data, { honeypot = '', token = '' } = {}){
  if (honeypot) return 'blocked';
  if (!ENQUIRY_ENDPOINT) throw new Error('no endpoint');

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENQUIRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...data, ...(token ? { 'cf-turnstile-response': token } : {}) }),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error('send failed');
    return 'sent';
  } finally {
    clearTimeout(timer);
  }
}

/* visually hidden honeypot input — spread onto an <input> */
export const HONEYPOT_PROPS = {
  type: 'text', name: '_gotcha', tabIndex: -1, autoComplete: 'off', 'aria-hidden': true,
  className: 'absolute -left-[9999px] h-px w-px opacity-0',
};
