import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* `vite preview` serves the same security headers as production, read straight
   from public/.htaccess (every active `Header always set` line) so the two can
   never drift apart. */
const htaccessHeaders = () => Object.fromEntries(
  [...readFileSync('public/.htaccess', 'utf8').matchAll(/^\s*Header always set ([\w-]+) "([^"]*)"/gm)]
    .map(([, name, value]) => [name, value])
);

/* The live site is on Vercel, which reads vercel.json and ignores .htaccess.
   Refuse to run if the two header sets differ, so neither host is left behind. */
const vercelHeaders = () => Object.fromEntries(
  JSON.parse(readFileSync('vercel.json', 'utf8')).headers.find(h => h.source === '/(.*)').headers.map(h => [h.key, h.value])
);
/* Cloudflare Pages reads public/_headers ("  Name: value" lines under "/*"). */
const cloudflareHeaders = () => Object.fromEntries(
  readFileSync('public/_headers', 'utf8').split('\n')
    .filter(l => /^\s+[\w-]+: /.test(l))
    .map(l => { const i = l.indexOf(': '); return [l.slice(0, i).trim(), l.slice(i + 2).trim()]; })
);
const headers = htaccessHeaders();
const expected = JSON.stringify(vercelHeaders());
if (JSON.stringify(headers) !== expected || JSON.stringify(cloudflareHeaders()) !== expected)
  throw new Error('Security headers differ between vercel.json, public/.htaccess and public/_headers — update all three.');

export default defineConfig({
  plugins: [react()],
  preview: { headers },
});
