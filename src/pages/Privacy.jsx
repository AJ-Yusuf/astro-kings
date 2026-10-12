/* Privacy.jsx — privacy policy.

   Facts below (legal entities, ICO registration, retention periods, children's
   data handling) are taken from Astro Kings' existing published privacy policy
   at astro-kings.com/contact-us/disclaimer-and-privacy-policy/ and describe what
   THIS site actually does.

   ⚠️ Still not reviewed by a solicitor — worth Dan having it checked.

   ⚠️ IF Facebook Pixel or Google Tag Manager are added to this site (the old
   WordPress site runs both), the cookies section below becomes untrue and a
   cookie consent banner is legally required. Do not add trackers without
   updating this page. */

import { CONTACT } from '../lib/data.js';
import { PageHead } from '../components/ui.jsx';
import { Footer } from '../components/Nav.jsx';

function Section({ title, children }){
  return (
    <section className="mt-10">
      <h2 className="text-[19px] font-medium">{title}</h2>
      <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-white/65">{children}</div>
    </section>
  );
}

export function Privacy(){
  return (
    <div>
      <PageHead eyebrow="legal" title="Privacy policy"
        sub="How Astro Kings collects, uses and protects your personal information." />

      <div className="mx-auto max-w-2xl px-6 pb-16">
        <p className="mt-8 text-[13px] text-white/40">Last updated: September 2026</p>

        <Section title="Who we are">
          <p>
            Astro Kings Ltd, {CONTACT.addr}. Astro Kings Ltd is owned by
            Nineteen Twelve Holdings Ltd — where this policy says “we” or “us”,
            it means both together.
          </p>
          <p>
            We are the data controller for the personal information described in
            this policy, and we are registered with the Information
            Commissioner’s Office (ICO) in the UK. You can reach us at{' '}
            <a href={'mailto:'+CONTACT.email} className="accent-text hover:underline">{CONTACT.email}</a>{' '}
            or {CONTACT.phone}.
          </p>
        </Section>

        <Section title="What we collect">
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
            Photographs of children used on this website are published with the
            consent of their parent or guardian. If you would like a photograph
            removed, or a child’s details deleted, contact us at{' '}
            <a href={'mailto:'+CONTACT.email} className="accent-text hover:underline">{CONTACT.email}</a> and we will do so.
          </p>
        </Section>

        <Section title="Why we use it">
          <p>
            We use your information to reply to your enquiry, to organise the
            sessions and games you have asked to join, and to contact you about
            a booking. We rely on your consent when you submit a form, and on
            legitimate interests to run the venue and respond to you.
          </p>
          <p>We do not sell your information, and we do not use it for advertising.</p>
        </Section>

        <Section title="Who we share it with">
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
            <span className="text-white/85">Formspree</span> — the service that
            delivers enquiry and sign-up forms from this site to our inbox.
          </p>
          <p>
            We may also share information with regulators, the police or other
            competent authorities where we are legally required to. Beyond that,
            we do not share your information with anyone else, and we never sell
            it.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep personal data, including transaction history and complaints,
            for up to seven years after our last contact with you — so that we
            can answer questions, claims or complaints, and meet the regulations
            that apply to us.
          </p>
          <p>
            CCTV recordings at the venue are kept for 21 days.
          </p>
          <p>
            Booking records are held by Planyo under their own retention policy.
            After these periods your data is permanently deleted from our
            systems, unless we have to keep it for a legal reason — for example
            if you were involved in a safety incident.
          </p>
        </Section>

        <Section title="Your rights">
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

        <Section title="Cookies">
          <p>
            This website does not set advertising or analytics cookies, and does
            not track you across other websites. The embedded booking widget and
            map may set cookies that are necessary for them to work.
          </p>
        </Section>
      </div>
      <Footer />
    </div>
  );
}
