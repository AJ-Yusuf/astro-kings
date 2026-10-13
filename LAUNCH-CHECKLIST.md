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

- [ ] **Turnstile + Formspree settings in Cloudflare.** The code is done:
      forms post to `/api/submit` (`worker/submit.js`), which verifies the
      Turnstile token server-side, re-checks every field (including the Subs
      Bench minimum age) and only then forwards to Formspree. Until these are
      set, the forms refuse to send:
      - Workers → astro-kings → Settings → Build → Variables:
        `VITE_TURNSTILE_SITE_KEY` = the real site key (dash.cloudflare.com →
        Turnstile; add the live domain to the widget).
      - Workers → astro-kings → Settings → Variables and Secrets (type Secret):
        `TURNSTILE_SECRET_KEY` (that widget's secret key),
        `FORMSPREE_ENDPOINT` (see next item), `ALLOWED_ORIGINS` (e.g.
        `https://astro-kings.com,https://www.astro-kings.com` plus the
        workers.dev URL while testing).
      Redeploy, then send one test enquiry and one Subs Bench sign-up.

- [ ] **New Formspree form for the venue inbox.** Create a NEW form in
      Formspree with recipient play@astro-kings.com (add it under Linked
      Emails first and have the venue confirm it) and put its URL in
      `FORMSPREE_ENDPOINT`. Don't reuse `formspree.io/f/mvkgdpok`: that URL
      was published in this repo, so bots can post to it directly and skip the
      captcha. Disable it once the new form works.

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

- [ ] **Formspree dashboard protections.** In the form's settings: restrict
      submissions to the live domain(s), keep spam filtering on, and — if the
      plan supports it — add the Turnstile SECRET key so Formspree rejects
      submissions without a valid token. All forms (enquiry + Get a Game) now
      send the Turnstile token.

- [ ] **Cloudflare account check.** Confirm who owns the Cloudflare account,
      that every member has two-factor login on, and remove anyone who
      shouldn't have access. Turn on build-failure notifications.

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

- [ ] **Check every price on the site against reality.** Prices in the code are
      display-only; Planyo charges its own. Worth Dan eyeballing:
      - Pitch prices (£60 / £90) in `src/lib/data.js`
      - `Pricing.jsx` — "Pay & Play £350/pp" looks like it should be £3.50
      - `Parties.jsx`, `Leagues.jsx`, `PayAndPlay.jsx`, `Shop.jsx`

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
  Permissions-Policy, Cross-Origin-Opener-Policy, no `'unsafe-inline'`
  styles; `.htaccess` also turns off directory listing and blocks dotfiles).
  HSTS is still open — see the blockers above.
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
