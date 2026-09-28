# Astro Kings — Launch Checklist

Site is configured for **Path 1: Planyo embed**. Bookings, payments and
availability are handled entirely by Planyo. This site holds no API keys,
takes no payments, and stores no customer records.

---

## ⚠️ BLOCKERS — cannot go live without these

- [ ] **Hosting access** (FTP / cPanel) to actually deploy.

- [ ] **Real Turnstile site key** — `TURNSTILE_SITE_KEY` is currently
      Cloudflare's always-passes TEST key and blocks nothing.
      dash.cloudflare.com → Turnstile. **Note:** the token also needs verifying
      server-side at /siteverify — until that exists, the captcha is
      cosmetic even with a real key.

- [ ] **`ENQUIRY_ENDPOINT`** — enquiry + Subs Bench forms currently tell users
      to phone/email rather than submitting, because there's nowhere to send to.
      Needs a real handler (PHP mail script, or Formspree/similar).

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
- Forms no longer show a fake "sent" confirmation.
- Student discount (`.ac.uk` email = discount, trivially spoofed) gone with the
  deleted booking engine.
- `.agents/`, `.claude/`, `.env` gitignored.

---

## 🟡 Recommended after launch

- [ ] Test the full booking journey on mobile and desktop
- [ ] Confirm booking confirmation emails arrive (customer + venue)
- [ ] Enable HSTS in `.htaccess` once HTTPS is stable
- [ ] Set up a backup of the Planyo data
