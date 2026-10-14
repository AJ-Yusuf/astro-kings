# Astro Kings — Launch Checklist

Bookings, payments and availability are handled entirely by Planyo: the
booking page opens the venue's Planyo page in a new tab (nothing is framed).
This site holds no API keys, takes no payments, and stores no customer records.

Hosting: the site is built and served by **Cloudflare Workers** (Workers
Builds, project `astro-kings`), which reads `public/_headers`. Vercel was
used until late September 2026; `vercel.json` and `public/.htaccess` (Apache)
carry the same headers, and `vite.config.js` fails the build if the three ever
differ. The astro-kings.com domain still points at the old Apache site.

---

## ⚠️ BLOCKERS — cannot go live without these

- [ ] **Switch the Formspree recipient to the venue inbox.** `ENQUIRY_ENDPOINT`
      is set to `https://formspree.io/f/mvkgdpok` and the enquiry + Subs Bench
      forms DO submit to it — but it currently delivers to a developer's
      personal test inbox. In Formspree: add play@astro-kings.com under Linked
      Emails, have the venue confirm it, then make it the form's recipient
      (the endpoint URL does not change).

- [ ] **Before pointing astro-kings.com at Cloudflare: HTTPS everywhere.**
      HSTS (`max-age=31536000; includeSubDomains`) is now sent by all three
      header files. Once the domain is live, browsers will refuse plain HTTP
      for it AND every subdomain for a year — so first confirm every
      `*.astro-kings.com` subdomain (mail, old site, etc.) works over HTTPS, or
      drop `includeSubDomains` from all three files. Also turn on Cloudflare →
      SSL/TLS → Edge Certificates → "Always Use HTTPS" (`http://` currently
      returns the page instead of redirecting).

- [ ] **Confirm the cancellation policy.** The "free cancellation up to 48h"
      claim has been REMOVED from Venue and the booking page until the venue
      confirms the policy actually set in Planyo (unconfirmed promises are a
      DMCC Act risk). Re-add it only with the confirmed wording. "Instant
      confirmation" on the booking page also depends on Planyo's settings.

- [ ] **Confirm the Subs Bench minimum age.** Get a Game now refuses sign-ups
      under `SUBS_BENCH_MIN_AGE` (18) in `src/lib/config.js`, because joining
      adds people to a WhatsApp group where everyone sees each other's number.
      Change the number there if the venue wants a different rule.

- [ ] **Formspree dashboard protections.** Turnstile verification is ON
      (confirmed 14 Oct 2026). Still to check in the form's settings: restrict
      submissions to the live domain(s) and keep spam filtering on.

- [ ] **Cloudflare account check.** Confirm who owns the Cloudflare account,
      that every member has two-factor login on, and remove anyone who
      shouldn't have access. Turn on build-failure notifications.
      Workers Builds currently FAILS on every branch except `main` (main
      builds fine), so PRs get no preview — check the non-production branch
      build settings (Workers → astro-kings → Settings → Build).

- [ ] **Privacy page legal review.** `src/pages/Privacy.jsx` now names
      Formspree, Planyo, Cloudflare (hosting + Turnstile), WhatsApp/Meta (Subs
      Bench group) and Google (map, after a click). Still unconfirmed: ICO
      registration, the seven-year retention period, child-photo consent. Also
      needed: a terms & conditions page, and the company number + registered
      office in the footer (`src/components/Nav.jsx`).

---

## 🔴 Needs Dan's input before launch

- [ ] **Privacy policy review.** `src/pages/Privacy.jsx` is a DRAFT written
      against what the site actually does. It has not been checked by a
      solicitor. Three TODOs inside need confirming:
      - Does the new site keep Facebook Pixel / Google Tag Manager? (the current
        site runs both — if kept, they must be disclosed AND a cookie consent
        banner is required)
      - Actual data retention periods
      - Is Astro Kings registered with the ICO? (likely required — £40–60/yr)

- [ ] **Placeholder content across several pages.** Shop has invented products
      and prices; Notts Olympic has no real squad/fixtures; Coaching has
      placeholder crests; GetAGame has a placeholder WhatsApp invite link.
      These are marked TODO in the code. Decide: get real content, or hide
      those pages until it exists.

---

## ✅ Done

- **Planyo booking URL wired in** —
  `https://www.planyo.com/booking.php?calendar=22300`. "check availability &
  book" opens it in a new tab. This is Planyo's own hosted page, so it does
  not depend on the old WordPress site.
  ⚠️ **Must be tested before launch** — complete a test booking end to end.

- Security headers + CSP in `public/_headers` (live), `vercel.json` and
  `public/.htaccess` (X-Frame-Options, nosniff, Referrer-Policy,
  Permissions-Policy, Cross-Origin-Opener-Policy, HSTS; `.htaccess` also
  turns off directory listing and blocks dotfiles). `style-src` allows
  `'unsafe-inline'` (inline styles only, never scripts) — see the note in
  `public/_headers`.
- Real Turnstile site key live; Formspree verifies tokens server-side
  (confirmed 14 Oct 2026).
- Display prices checked against Planyo by the owner (14 Oct 2026).
- Readex Pro font self-hosted; no Google Fonts requests.
- Google Map loads only after the visitor clicks "show map" (sandboxed iframe).
- GitHub Actions workflow: `npm ci`, production dependency audit, build.
- Privacy policy page created at `#privacy`, linked from the footer and from
  the enquiry form.
- Fake payment engine deleted (`booking.js`, `store.js`, `booking.test.js`,
  `StripeCard.jsx`) along with the Stripe packages.
- localStorage "database" removed — no customer data stored in browsers.
- Fake availability removed from Browse and Venue (they were showing invented
  free/taken slots unrelated to the real calendar).
- Forms no longer show a fake "sent" confirmation. (The footer newsletter
  still did — it said "you're subscribed" but sent nothing; removed on the
  `security-fixes` branch.)
- Student discount (`.ac.uk` email = discount, trivially spoofed) gone with the
  deleted booking engine.
- `.agents/`, `.claude/`, `.env` gitignored.

---

## 🚨 If something goes wrong

- **Spam flood through the forms:** Formspree → the form → turn on
  "Disable submissions" (or rotate the Turnstile secret there). The site
  keeps working; forms show the phone/email fallback on error.
- **A key or password leaks:** the only secrets are the Turnstile SECRET key
  (Cloudflare → Turnstile → rotate, then paste the new one into Formspree)
  and account logins (change password, check 2FA). Nothing secret is in this
  repo.
- **Bad deploy on the live site:** Cloudflare → Workers → astro-kings →
  Deployments → roll back to the previous version, then revert the PR.
- **Take the site offline:** Cloudflare → Workers → astro-kings → Settings →
  Domains & Routes → disable the route/custom domain.
- **Who to contact:** site owner (Dan), repo + Cloudflare (Suleiman /
  Daxsintech), developer (AJ). Personal-data breaches may need reporting to
  the ICO within 72 hours.

---

## 🟡 Recommended after launch

- [ ] Test the full booking journey on mobile and desktop
- [ ] Confirm booking confirmation emails arrive (customer + venue)
- [ ] Set up a backup of the Planyo data
- [x] Move to Tailwind 4 — done (4.3.3); `npm audit` is at 0. Every page was
      checked against the Tailwind 3 build at desktop and phone width.

---

## 📝 Notes — existing images (no files changed; owner to decide)

- **Licences unconfirmed for existing photos** (found in their metadata):
  - `public/corporate.jpg` — IPTC "FBMD" marker: saved from Facebook.
  - `public/kingsclub-tile.jpg`, `public/subs.jpg` — EXIF "Google Inc. 2016":
    likely saved from Google.
  - `public/nottsolympic-hero.png` — Canva XMP (contains Canva account IDs).
  - `public/league-academy.png`, `league-development.png`,
    `league-foundation.png` — screenshots.
  None contain GPS data. See `IMAGE_SOURCES.md`.
- **Photos of children** need recorded parental consent before launch.
- **Temporary Pexels placeholders** on Events and Performance Zone need real
  Astro Kings photos.
- **Large files:** `public/kfl-crest.png` and `public/nottsolympic-crest.png`
  are about 1.5 MB each. The owner will decide whether to optimise them.
