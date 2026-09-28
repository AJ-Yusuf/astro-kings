/* PlanyoBooking.jsx — the venue's Planyo booking system, embedded in our page.

   Everything inside the iframe is Planyo: live availability, the venue's real
   pricing rules, card payment, and confirmation emails. This site sends no
   customer data and holds no API key — it only renders the frame.

   DESIGN NOTE — the light panel:
   The iframe's INTERIOR is Planyo's own page on planyo.com. Browsers block a
   parent page from restyling cross-origin content, so its light theme cannot be
   darkened from this codebase. It can only be changed in the Planyo dashboard
   (Site settings → Widgets → colour scheme) using our tokens:
     background #06090A · text #F4F6F7 · accent #E8645A · muted #9AA3A7 */

import { PLANYO_EMBED_URL, BOOKING_PLATFORM_URL } from '../lib/config.js';
import { I } from '../lib/icons.jsx';
import { Glass, Eyebrow } from './ui.jsx';
import { Footer } from './Nav.jsx';

function TrustRow(){
  const items = [
    { icon: I.bolt,  label: 'instant confirmation' },
    { icon: I.lock,  label: 'secure card payment' },
    { icon: I.clock, label: 'free cancellation 24h before' },
  ];
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2.5">
      {items.map(it => (
        <div key={it.label} className="flex items-center gap-2 text-[13px] text-white/50">
          <span className="accent-text" style={{ width: 14, height: 14 }}>{it.icon({})}</span>
          {it.label}
        </div>
      ))}
    </div>
  );
}

export function PlanyoBooking(){
  return (
    <div>
      {/* ---------- hero ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-8 md:pt-32">
        <Eyebrow>secure booking</Eyebrow>
        <h1 className="hero-title mt-3 text-4xl font-semibold lowercase md:text-5xl">book your pitch</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
          Live availability straight from our pitch calendar — pick your slot, pay by card, done.
        </p>
        <TrustRow />
      </div>

      {/* ---------- booking panel ---------- */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <Glass strong className="rounded-[28px] p-2.5 md:p-3">
          {/* header strip */}
          <div className="flex items-center justify-between gap-4 px-3 pb-3 pt-1.5 md:px-4">
            <div className="flex items-center gap-2.5">
              <span className="accent-text grid place-items-center" style={{ width: 16, height: 16 }}>
                {I.cal({})}
              </span>
              <span className="text-[14px] font-medium text-white/90">Check availability &amp; book</span>
            </div>
            <span className="hidden items-center gap-1.5 text-[12px] text-white/40 sm:flex">
              <span className="accent-text" style={{ width: 12, height: 12 }}>{I.pin({})}</span>
              Bilborough, Nottingham
            </span>
          </div>

          {/* the widget */}
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white">
            <iframe
              title="Astro Kings booking"
              src={PLANYO_EMBED_URL}
              className="block h-[820px] w-full bg-white"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          {/* caption, so the panel closes on our styling */}
          <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-3 md:px-4">
            <span className="flex items-center gap-1.5 text-[11px] text-white/35">
              <span className="accent-text" style={{ width: 12, height: 12 }}>{I.shield({})}</span>
              Secured by Planyo
            </span>
            <a href={BOOKING_PLATFORM_URL} target="_blank" rel="noreferrer"
               className="text-[11px] text-white/35 underline-offset-2 hover:text-white/60 hover:underline">
              open in new tab
            </a>
          </div>
        </Glass>
      </div>
      <Footer />
    </div>
  );
}
