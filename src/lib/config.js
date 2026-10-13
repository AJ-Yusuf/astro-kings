/* config.js — site configuration.

   PRODUCTION SETUP (Path 1 — Planyo embed):
   Bookings, payments and availability are all handled by Planyo inside an
   embedded widget. This site does NOT take payments, store customer records,
   or hold any API keys. */

/* ---------------------------------------------------------------- booking */

/* Which booking experience the #booking page shows:
   'embed'  — the venue's Planyo booking widget lives inside our page  ← PRODUCTION
   'link'   — deep-link out to BOOKING_PLATFORM_URL (their hosted booking page) */
export const BOOKING_MODE = 'embed';

/* The venue's Planyo booking system, embedded in an iframe on our #booking page.
   calendar=22300 is the Astro Kings Planyo calendar ID.
   This is Planyo's own hosted booking page, so it does NOT depend on the old
   WordPress site existing. */
export const PLANYO_EMBED_URL = 'https://www.planyo.com/booking.php?calendar=22300';

/* Same Planyo booking page, opened in a new tab. Used by 'link' mode and as the
   "having trouble?" fallback beneath the embedded widget. */
export const BOOKING_PLATFORM_URL = 'https://www.planyo.com/booking.php?calendar=22300';

/* Planyo resource IDs, from Dan's Planyo shortcode
   (ppp_resfilter=58246,58245,58244,185941). Matched to names on
   astro-kings.com/book-pitch-astro-kings and confirmed in Planyo's own
   booking form (Oct 2026):
     58246 Big One · 58245 Classic · 58244 Samba · 185941 Performance Zone */
export const PLANYO_RESOURCE_IDS = [58246, 58245, 58244, 185941];

/* Map each of our pitch cards (PITCHES id) to its Planyo resource_id, so the
   pitch picker on #booking opens Planyo's booking form with that pitch
   already selected.
   Mini Soccer has no Planyo resource of its own (Planyo lists only Big One,
   Classic, Samba and Performance Zone), so it stays null and opens the full
   calendar. Never guess an ID — a wrong one books the wrong pitch. */
export const PLANYO_PITCH_RESOURCE = {
  classic: 58245,
  samba:   58244,
  big:     58246,
  mini:    null,
};

/* Build the Planyo booking URL.
   With a pitch: opens Planyo's booking form (mode=reserve) with that pitch
   selected and, if given, the day (`one_date`, YYYY-MM-DD) filled in.
   Without one: the full calendar, where the customer picks the pitch — we
   don't pre-fill a day there, as the form would silently pick a pitch. */
export const planyoUrl = (resourceId, startDate) =>
  resourceId
    ? `${PLANYO_EMBED_URL}&mode=reserve&resource_id=${resourceId}`
      + (startDate ? `&one_date=${startDate}` : '')
    : PLANYO_EMBED_URL;

/* Where enquiry + Subs Bench form submissions go.

   ⚠️ REQUIRED BEFORE LAUNCH — currently empty, so the forms tell people to
   phone or email instead of submitting. They never show a fake "sent" message.

   Set this to the venue's Formspree form URL:
     https://formspree.io/f/XXXXXXXX

   To create it: formspree.io → sign up → New Form → set the recipient to the
   venue's inbox → copy the form's endpoint URL and paste it below.
   Formspree emails each submission and handles spam filtering, so no backend
   of our own is needed. The first submission needs confirming by email.

   Each form passes a `source` (which page it came from) into the subject line,
   and sets reply-to as the customer's address, so hitting reply in the inbox
   replies straight to them.

   ⚠️ CURRENTLY POINTS AT A PERSONAL INBOX. The Formspree form behind this URL
   delivers to the developer's own address for testing. Before launch, add the
   venue's address (play@astro-kings.com) under Linked Emails in the Formspree
   account, have the venue confirm it by email, then switch the form's
   recipient. The URL below does NOT change when you do that. */
export const ENQUIRY_ENDPOINT = 'https://formspree.io/f/mvkgdpok';

/* ---------------------------------------------------------------- reviews */
/* The venue's Google Business reviews link. Leave '' until the client supplies
   it — the "read our reviews on Google" link stays hidden while blank.
   Never add ratings or quotes by hand: invented reviews are illegal (DMCC Act). */
export const GOOGLE_REVIEWS_URL = '';

/* ---------------------------------------------------------------- display only */
/* Indicative prices shown on marketing pages. The ACTUAL price charged is
   always whatever Planyo calculates at booking time — these are for display
   and must be kept in step with Planyo's pricing manager. */
export const MAX_HOURS      = 2;     // longest bookable run shown in marketing copy
export const PAYPLAY_PRICE  = 4.5;   // U18 daily pay & play, per person
/* No cancellation window is shown anywhere until the venue confirms the policy
   set in Planyo — an unconfirmed "free cancellation" promise is a misleading
   claim under the DMCC Act 2024. */

/* ---------------------------------------------------------------- subs bench */
/* Get a Game adds people to a WhatsApp group of adult players, where every
   member sees every other member's name and phone number. Under-18s are turned
   away (safeguarding). ⚠️ Owner to confirm the age — change it here only. */
export const SUBS_BENCH_MIN_AGE = 18;

/* ---------------------------------------------------------------- security */

/* Cloudflare Turnstile site key.
   ⚠️ This is Cloudflare's ALWAYS-PASSES test key — it blocks nothing.
   Before launch: replace with the venue's real site key from
   dash.cloudflare.com → Turnstile, AND verify tokens server-side at
   /siteverify. Until then, treat forms as unprotected against bots. */
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

export const pounds = (n) => '£' + Math.round(n);
