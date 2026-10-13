import { describe, it, expect, vi, afterEach } from 'vitest';
import { handleSubmit } from './submit.js';
import worker from './index.js';

const env = { TURNSTILE_SECRET_KEY: 's', FORMSPREE_ENDPOINT: 'https://formspree.io/f/test', ALLOWED_ORIGINS: 'https://astro-kings.com' };
const enquiry = { name: 'Sam Lee', email: 'sam@x.com', phone: '07700 900123', message: 'hi', page: 'parties',
  _subject: 'Website enquiry — parties', 'cf-turnstile-response': 'tok' };
const subs = { name: 'Sam Lee', email: 'sam@x.com', phone: '07700 900123', age: '25', days: 'Monday',
  page: 'social kicks / subs bench', 'cf-turnstile-response': 'tok' };

const req = (body, { origin = 'https://astro-kings.com', type = 'application/json', method = 'POST' } = {}) =>
  new Request('https://astro-kings.com/api/submit', {
    method, headers: { Origin: origin, 'Content-Type': type },
    body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });

/* fake Cloudflare siteverify + Formspree; returns what reached Formspree */
function mockServices(captchaOk = true){
  const sent = [];
  vi.stubGlobal('fetch', vi.fn(async (url, opt) => {
    if (String(url).includes('siteverify')) return new Response(JSON.stringify({ success: captchaOk }));
    sent.push(JSON.parse(opt.body)); return new Response('{}', { status: 200 });
  }));
  return sent;
}

afterEach(() => { vi.unstubAllGlobals(); });

describe('/api/submit', () => {
  it('forwards a valid enquiry with only known fields', async () => {
    const sent = mockServices();
    const res = await handleSubmit(req({ ...enquiry, _cc: 'spam@x.com', _replyto: 'evil@x.com' }), env);
    expect(res.status).toBe(200);
    expect(sent).toEqual([{ name: 'Sam Lee', email: 'sam@x.com', phone: '07700 900123', message: 'hi', page: 'parties',
      _subject: 'Website enquiry — parties', _replyto: 'sam@x.com' }]);
  });

  it.each([
    ['failed captcha', () => req(enquiry), false, 403],
    ['missing captcha token', () => req({ ...enquiry, 'cf-turnstile-response': '' }), true, 403],
    ['another site', () => req(enquiry, { origin: 'https://evil.example' }), true, 403],
    ['no Origin header', () => req(enquiry, { origin: '' }), true, 403],
    ['bad email', () => req({ ...enquiry, email: 'nope' }), true, 400],
    ['bad phone', () => req({ ...enquiry, phone: '<script>' }), true, 400],
    ['not JSON', () => req('a=b', { type: 'application/x-www-form-urlencoded' }), true, 415],
    ['oversized body', () => req({ ...enquiry, message: 'x'.repeat(20000) }), true, 413],
    ['Subs Bench under 18', () => req({ ...subs, age: '17' }), true, 400],
    ['Subs Bench without age', () => req({ ...subs, age: '' }), true, 400],
    ['GET', () => req(null, { method: 'GET' }), true, 405],
  ])('refuses: %s', async (_, make, captchaOk, status) => {
    const sent = mockServices(captchaOk);
    expect((await handleSubmit(make(), env)).status).toBe(status);
    expect(sent).toEqual([]);
  });

  it('accepts an adult Subs Bench sign-up', async () => {
    const sent = mockServices();
    expect((await handleSubmit(req(subs), env)).status).toBe(200);
    expect(sent[0]).toMatchObject({ age: '25', days: 'Monday', _subject: 'Website enquiry — social kicks / subs bench' });
  });

  it('pretends success but sends nothing when the honeypot is filled', async () => {
    const sent = mockServices();
    expect((await handleSubmit(req({ ...enquiry, _gotcha: 'x' }), env)).status).toBe(200);
    expect(sent).toEqual([]);
  });

  it('refuses everything until the secrets are set', async () => {
    const sent = mockServices();
    expect((await handleSubmit(req(enquiry), {})).status).toBe(503);
    expect(sent).toEqual([]);
  });

  it('strips line breaks from single-line fields', async () => {
    const sent = mockServices();
    await handleSubmit(req({ ...enquiry, name: 'A\r\nBcc: x@y.com', _subject: 'Hi\nBcc: x@y.com' }), env);
    expect(sent[0].name).toBe('A Bcc: x@y.com');
    expect(sent[0]._subject).toBe('Hi Bcc: x@y.com');
  });

  it('reports a Formspree failure instead of success', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => String(url).includes('siteverify')
      ? new Response(JSON.stringify({ success: true })) : new Response('', { status: 500 })));
    expect((await handleSubmit(req(enquiry), env)).status).toBe(502);
  });
});

describe('worker routing', () => {
  it('sends /api/submit to the form handler and everything else to static assets', async () => {
    mockServices();
    const ASSETS = { fetch: vi.fn(async () => new Response('asset', { status: 404 })) };
    expect((await worker.fetch(req(enquiry), { ...env, ASSETS })).status).toBe(200);
    expect(ASSETS.fetch).not.toHaveBeenCalled();
    await worker.fetch(new Request('https://astro-kings.com/nope'), { ...env, ASSETS });
    expect(ASSETS.fetch).toHaveBeenCalledTimes(1);
  });
});
