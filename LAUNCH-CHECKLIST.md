# Astro Kings — Launch Checklist

Site is configured for **Path 1: Planyo embed**. Bookings, payments and
availability are handled entirely by Planyo. This site holds no API keys,
takes no payments, and stores no customer records.

---

## ⚠️ BLOCKERS — cannot go live without these

- [ ] **Hosting access** (FTP / cPanel) to actually deploy.

- [ ] **Real Turnstile site key + server-side verification** —
      `TURNSTILE_SITE_KEY` is currently Cloudflare's always-passes TEST key and
      blocks nothing. dash.cloudflare.com → Turnstile. The token must ALSO be
      verified server-side at /siteverify — until that exists, the captcha is
      cosmetic even with a real key.

- [ ] **Switch the Formspree recipient to the venue inbox.** `ENQUIRY_ENDPOINT`
      is set to `https://formspree.io/f/mvkgdpok` and the enquiry + Subs Bench
      forms DO submit to it — but it currently delivers to a developer's
      personal test inbox. In Formspree: add play@astro-kings.com under Linked
      Emails, have the venue confirm it, then make it the form's recipient
      (the endpoint URL does not change).

- [ ] **Enable HSTS once HTTPS is confirmed.** The `Strict-Transport-Security`
      line in `public/.htaccess` is commented out. Turn it on only after the
      certificate is live and working, and only keep `includeSubDomains` if
      every subdomain of the domain is also on HTTPS.

- [ ] **Confirm the cancellation wording.** "free cancellation up to 24h" is
      shown on Venue and in `PlanyoBooking.jsx` (from `CANCEL_WINDOW_HRS`).
      Check it against the cancellation policy actually configured in Planyo;
      change or remove it if they differ.

- [ ] **Privacy page legal review.** `src/pages/Privacy.jsx` must name every
      processor that handles visitors' data: Formspree (form submissions),
      Planyo (bookings and payments) and Cloudflare (Turnstile). See the
      review item below for the other open questions.

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
  `https://www.planyo.com/booking.php?calendar=22300` set as both the embedded
  widget and the direct-link fallback. This is Planyo's own hosted page, so it
  does not depend on the old WordPress site.
  ⚠️ **Must be tested in a browser before launch** — confirm the widget loads
  inside the iframe (some booking systems refuse to be framed) and that a test
  booking completes end to end.

- Security headers + CSP via `public/.htaccess` (X-Frame-Options,
  nosniff, Referrer-Policy, Permissions-Policy, directory listing off,
  dotfile access blocked). HSTS is written but commented out — enable only
  once HTTPS is confirmed working.
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
- [ ] HSTS — now a launch blocker (see above)
- [ ] Set up a backup of the Planyo data

---

## 📝 Notes — existing images (no files changed; owner to decide)

- **Licences unconfirmed for existing photos** (found in their metadata):
  - `public/corporate.jpg` — IPTC "FBMD" marker: saved from Facebook.
  - `public/kingsclub-tile.jpg`, `public/subs.jpg` — EXIF "Google Inc. 2016":
    likely saved from Google.
  - `public/nottsolympic-hero.png` — Canva XMP (contains Canva account IDs).
  - `public/league-academy.png`, `league-development.png`,
    `league-foundation.png` — screenshots.
  None contain GPS data. See `IMAGE_SOURCES.md` once it exists.
- **Large files:** `public/kfl-crest.png` and `public/nottsolympic-crest.png`
  are about 1.5 MB each. The owner will decide whether to optimise them.
