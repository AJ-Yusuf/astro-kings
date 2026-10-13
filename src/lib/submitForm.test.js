import { describe, it, expect, vi, afterEach } from 'vitest';
import { submitForm, checkAge, EMAIL_RE, PHONE_RE } from './submitForm.js';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('submitForm', () => {
  it('sends nothing when the honeypot is filled', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await expect(submitForm({ name: 'bot' }, { honeypot: 'x' })).resolves.toBe('blocked');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('passes the Turnstile token as cf-turnstile-response', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetch);
    await expect(submitForm({ name: 'Ann' }, { token: 'tok' })).resolves.toBe('sent');
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toEqual({ name: 'Ann', 'cf-turnstile-response': 'tok' });
  });

  it('never reports success when the endpoint rejects the submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    await expect(submitForm({ name: 'Ann' })).rejects.toThrow();
  });
});

describe('checkAge', () => {
  it.each([
    ['', 'missing'], ['  ', 'missing'], [undefined, 'missing'],
    ['abc', 'invalid'], ['1e2', 'invalid'], ['-5', 'invalid'], ['999', 'invalid'],
    ['17', 'under'], ['0', 'under'],
    ['18', 'ok'], [' 42 ', 'ok'],
  ])('%j -> %s', (raw, want) => {
    expect(checkAge(raw, 18)).toBe(want);
  });
});

describe('input patterns', () => {
  it('rejects malformed emails and phone numbers', () => {
    expect(EMAIL_RE.test('a@b.co')).toBe(true);
    expect(EMAIL_RE.test('a b@c.d')).toBe(false);
    expect(PHONE_RE.test('07700 900123')).toBe(true);
    expect(PHONE_RE.test('<script>')).toBe(false);
  });
});
