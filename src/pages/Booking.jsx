/* Booking.jsx — booking is handled entirely by Planyo.

   This site does not take payments, store customer records, or hold booking
   state. It either embeds the venue's Planyo booking widget in-page, or links
   out to the venue's hosted Planyo booking page. */

import { I } from '../lib/icons.jsx';
import { BOOKING_MODE, BOOKING_PLATFORM_URL, PLANYO_EMBED_URL } from '../lib/config.js';
import { CONTACT } from '../lib/data.js';
import { PlanyoBooking } from '../components/PlanyoBooking.jsx';
import { Btn, Eyebrow } from '../components/ui.jsx';
import { Footer } from '../components/Nav.jsx';

/* Hands straight over to the venue's hosted Planyo booking page. */
function PlatformHandoff(){
  return (
    <div>
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-16 text-center md:pt-40">
        <Eyebrow className="justify-center">book a pitch</Eyebrow>
        <h1 className="hero-title mt-4 text-4xl font-semibold lowercase md:text-5xl">book on our live system</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
          Bookings and payments are handled securely on our booking platform — pick your pitch and time there and you’re in.
        </p>
        <a href={BOOKING_PLATFORM_URL} target="_blank" rel="noreferrer" className="mt-8 inline-block">
          <Btn kind="primary" size="lg" iconEnd={I.arrow({})}>open the booking system</Btn>
        </a>
      </div>
      <Footer />
    </div>
  );
}

/* Shown only if neither the embed URL nor the platform URL has been configured.
   Never shows a fake booking flow — directs the customer to phone or email. */
function BookingUnavailable(){
  return (
    <div>
      <div className="mx-auto max-w-2xl px-6 pt-32 pb-16 text-center md:pt-40">
        <Eyebrow className="justify-center">book a pitch</Eyebrow>
        <h1 className="hero-title mt-4 text-4xl font-semibold lowercase md:text-5xl">book by phone or email</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
          Our online booking system is being set up. In the meantime, give us a call
          or drop us an email and we’ll get you booked in.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={'tel:' + CONTACT.phone.replace(/\s/g,'')}>
            <Btn kind="primary" size="lg">{CONTACT.phone}</Btn>
          </a>
          <a href={'mailto:' + CONTACT.email}>
            <Btn kind="outline" size="lg">{CONTACT.email}</Btn>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export function Booking(){
  if (BOOKING_MODE === 'embed' && PLANYO_EMBED_URL) return <PlanyoBooking />;
  if (BOOKING_PLATFORM_URL) return <PlatformHandoff />;
  return <BookingUnavailable />;
}
