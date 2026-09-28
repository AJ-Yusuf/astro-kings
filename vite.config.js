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

export default defineConfig({
  plugins: [react()],
  preview: { headers: htaccessHeaders() },
});
