/* PlanyoBooking.jsx — the venue's Planyo booking widget, embedded in our page.

   Everything inside the iframe is Planyo: live availability, the venue's real
   pricing rules, card payment, and confirmation emails. This site sends no
   customer data and holds no API key — it only renders the frame.

   The widget carries Planyo's own styling inside our branded frame; its colours
   can be adjusted in the Planyo dashboard under Site settings → Widgets. */

import { PLANYO_EMBED_URL, BOOKING_PLATFORM_URL } from '../lib/config.js';
import { Glass, Eyebrow } from './ui.jsx';
import { Footer } from './Nav.jsx';

export function PlanyoBooking(){
  return (
    <div>
      <div className="mx-auto max-w-4xl px-6 pt-28 pb-6 md:pt-32">
        <Eyebrow>secure booking</Eyebrow>
        <h1 className="hero-title mt-3 text-4xl font-semibold lowercase md:text-5xl">book your pitch</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
          Live availability and secure card payment — right here on the Astro Kings site.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-10">
        <Glass strong className="rounded-[30px] p-3 md:p-4">
          <iframe
            title="Astro Kings booking"
            src={PLANYO_EMBED_URL}
            className="h-[760px] w-full rounded-2xl bg-white"
            style={{ border: 0 }}
            loading="lazy"
          />
        </Glass>
        <p className="mx-auto mt-4 max-w-xl text-center text-[12px] leading-relaxed text-white/40">
          Bookings and payments are processed securely by Planyo, our booking provider.{' '}
          {/* fallback: some browsers/extensions block third-party iframes */}
          Trouble loading?{' '}
          <a href={BOOKING_PLATFORM_URL} target="_blank" rel="noreferrer" className="accent-text hover:underline">
            Open the booking page directly
          </a>.
        </p>
      </div>
      <Footer />
    </div>
  );
}
