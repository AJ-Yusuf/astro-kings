/* worker/index.js — Cloudflare Worker entry (see wrangler.jsonc).

   Static files in dist/ are served by Workers static assets before this runs,
   with public/_headers applied, exactly as before. Only requests that match
   no file reach this Worker: /api/submit goes to the form handler, anything
   else gets the normal static-assets response (404). */

import { handleSubmit } from './submit.js';

export default {
  async fetch(request, env){
    const { pathname } = new URL(request.url);
    if (pathname === '/api/submit') return handleSubmit(request, env);
    return env.ASSETS.fetch(request);
  },
};
