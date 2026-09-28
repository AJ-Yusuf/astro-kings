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

/* Planyo resource IDs for the pitches, from Dan's own Planyo shortcode:
   ppp_resfilter=58246,58245,58244,185941
   ⚠️ NOT yet matched to individual pitch names - we know these are the four
   bookable resources but not which ID is which pitch. Only needed if the
   custom API booking flow (Path 2) is built later. */
export const PLANYO_RESOURCE_IDS = [58246, 58245, 58244, 185941];

/* Map each of our pitch cards (PITCHES id) to its Planyo resource_id, so the
   native pitch picker on #booking can filter the embedded widget / deep-link
   straight to that pitch.
   ⚠️ Leave a pitch null until its ID is CONFIRMED — a wrong guess sends people
   to the wrong pitch. While null, that card just opens the full calendar.
   The four known resource IDs are in PLANYO_RESOURCE_IDS above; we don't yet
   know which is which pitch, so all are null for now. */
export const PLANYO_PITCH_RESOURCE = {
  classic: null,
  samba:   null,
  big:     null,
  mini:    null,
};

/* Build the Planyo booking URL, optionally pre-set to one resource and start
   date. `startDate` is best-effort (YYYY-MM-DD): if Planyo's date format differs
   it's simply ignored and the customer picks the day on Planyo — never a
   dead-end. */
export const planyoUrl = (resourceId, startDate) =>
  PLANYO_EMBED_URL
  + (resourceId ? `&resource_id=${resourceId}` : '')
  + (startDate ? `&start_date=${startDate}` : '');

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
export const CANCEL_WINDOW_HRS = 24; // shown in the cancellation policy text
export const PAYPLAY_PRICE  = 4.5;   // U18 daily pay & play, per person

/* ---------------------------------------------------------------- security */

/* Cloudflare Turnstile site key.
   ⚠️ This is Cloudflare's ALWAYS-PASSES test key — it blocks nothing.
   Before launch: replace with the venue's real site key from
   dash.cloudflare.com → Turnstile, AND verify tokens server-side at
   /siteverify. Until then, treat forms as unprotected against bots. */
export const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

export const pounds = (n) => '£' + Math.round(n);
