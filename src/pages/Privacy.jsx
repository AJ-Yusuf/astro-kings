/* Privacy.jsx — privacy policy.

   ⚠️ DRAFT — this is a starting template based on what the site actually does.
   It has NOT been reviewed by a solicitor. Dan should check it (or have it
   checked) before launch, and confirm every factual claim below is true:
   retention periods, who data is shared with, and the ICO registration.

   Anything marked TODO must be confirmed with Dan before this goes live. */

import { CONTACT } from '../lib/data.js';
import { PageHead } from '../components/ui.jsx';
import { Footer } from '../components/Nav.jsx';

function Section({ title, children }){
  return (
    <section className="mt-10">
      <h2 className="text-[19px] font-medium lowercase">{title}</h2>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-white/65">{children}</div>
    </section>
  );
}

export function Privacy(){
  return (
    <div>
      <PageHead eyebrow="legal" title="privacy policy"
        sub="How Astro Kings collects, uses and protects your personal information." />

      <div className="mx-auto max-w-2xl px-6 pb-16">
        <p className="mt-8 text-[13px] text-white/40">Last updated: September 2026</p>

        <Section title="who we are">
          <p>
            Astro Kings, {CONTACT.addr}. We are the data controller for the
            personal information described in this policy. You can reach us at{' '}
            <a href={'mailto:'+CONTACT.email} className="accent-text hover:underline">{CONTACT.email}</a>{' '}
            or {CONTACT.phone}.
          </p>
        </Section>

        <Section title="what we collect">
          <p>Depending on how you use the site, we may collect:</p>
          <ul className="space-y-1.5 pl-4">
            <li>· <span className="text-white/85">Enquiry forms:</span> your name, email address, phone number and the message you send us.</li>
            <li>· <span className="text-white/85">Subs Bench / Get a Game sign-up:</span> your name, email, phone number, age and preferred playing days.</li>
            <li>· <span className="text-white/85">Bookings:</span> pitch bookings and payments are handled by our booking provider, Planyo. When you book, your details are collected by Planyo under their own privacy policy, not by this website.</li>
          </ul>
        </Section>

        <Section title="children's information">
          <p>
            Some of our activities are for under-18s. Where a sign-up relates to
            a child, we ask that a parent or guardian completes the form. We only
            collect what we need to run the session safely and to contact you
            about it.
          </p>
          <p>
            If you would like us to delete a child's details, contact us at{' '}
            <a href={'mailto:'+CONTACT.email} className="accent-text hover:underline">{CONTACT.email}</a> and we will do so.
          </p>
        </Section>

        <Section title="why we use it">
          <p>
            We use your information to reply to your enquiry, to organise the
            sessions and games you have asked to join, and to contact you about
            a booking. We rely on your consent when you submit a form, and on
            legitimate interests to run the venue and respond to you.
          </p>
          <p>We do not sell your information, and we do not use it for advertising.</p>
        </Section>

        <Section title="who we share it with">
          <p>
            <span className="text-white/85">Planyo</span> — our booking and payment
            provider, who process bookings and card payments on our behalf.
          </p>
          <p>
            <span className="text-white/85">Cloudflare</span> — we use Cloudflare
            Turnstile to check that form submissions come from a real person and
            not an automated bot.
          </p>
          <p>
            {/* TODO: confirm with Dan whether the site still runs Facebook Pixel
                and Google Tag Manager, as the current site does. If it does, they
                MUST be listed here and need a cookie consent banner. */}
            We do not share your information with anyone else unless we are
            legally required to.
          </p>
        </Section>

        <Section title="how long we keep it">
          <p>
            {/* TODO: confirm actual retention periods with Dan */}
            We keep enquiry and sign-up details only as long as we need them to
            deal with your request and for our own records, and then delete them.
            Booking records are held by Planyo under their retention policy.
          </p>
        </Section>

        <Section title="your rights">
          <p>
            You have the right to ask us for a copy of the information we hold
            about you, to have it corrected or deleted, and to object to how we
            use it. To do any of these, email{' '}
            <a href={'mailto:'+CONTACT.email} className="accent-text hover:underline">{CONTACT.email}</a>.
          </p>
          <p>
            If you are unhappy with how we have handled your information, you can
            complain to the Information Commissioner's Office at{' '}
            <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="accent-text hover:underline">ico.org.uk</a>.
          </p>
        </Section>

        <Section title="cookies">
          <p>
            {/* TODO: if analytics or Facebook Pixel are added, this section must
                be expanded and a cookie consent banner added before launch. */}
            This website does not set tracking cookies. The embedded booking
            widget and map may set cookies necessary for them to work.
          </p>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
