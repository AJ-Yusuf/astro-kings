/* Enquiry.jsx — reusable contact/enquiry form with validation + success state.

   Submissions POST as JSON to ENQUIRY_ENDPOINT (see src/lib/config.js).
   That endpoint is a Formspree form URL — Formspree emails each submission to
   the venue's inbox, so no backend of our own is needed.

   Pass `source` wherever this form is used (e.g. source="parties") — it goes
   into the email subject so the venue can tell at a glance which page an
   enquiry came from, since this same form appears on eight pages. */

import { useState } from 'react';
import { I } from '../lib/icons.jsx';
import { ENQUIRY_ENDPOINT } from '../lib/config.js';
import { CONTACT } from '../lib/data.js';
import { Btn, Field } from './ui.jsx';

const INPUT = 'w-full bg-transparent text-[14px] outline-none placeholder:text-white/35';

export function EnquiryForm({ cta = 'get in touch', placeholder = 'How can we help?', labels = true, source = 'website' }){
  const [v,setV]   = useState({ name:'', phone:'', email:'', message:'' });
  const [err,setErr]   = useState('');
  const [done,setDone] = useState(false);
  const set = (k)=>(e)=>{ setV(s=>({...s,[k]:e.target.value})); setErr(''); };

  const [sending,setSending] = useState(false);

  async function submit(e){
    if (e) e.preventDefault();
    if (!v.name.trim() || !v.email.trim()) { setErr('Please add your name and email.'); return; }

    // No endpoint configured yet - never pretend the message was sent.
    if (!ENQUIRY_ENDPOINT) {
      setErr(`Our online form isn't live yet — please email ${CONTACT.email} or call ${CONTACT.phone} and we'll get straight back to you.`);
      return;
    }

    setSending(true);
    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Formspree returns JSON instead of a redirect when we ask for it
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...v,
          // Formspree uses these to set the email subject and reply-to address,
          // so hitting reply in the inbox replies straight to the customer.
          _subject: `Website enquiry — ${source}`,
          _replyto: v.email,
          page: source,
        }),
      });
      if (!res.ok) throw new Error('send failed');
      setDone(true);
    } catch (_) {
      setErr(`Sorry — we couldn't send that. Please email ${CONTACT.email} or call ${CONTACT.phone}.`);
    } finally {
      setSending(false);
    }
  }

  if (done) return (
    <div className="py-6 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full accent-bg text-[#0b0b0b]"><span style={{width:26,height:26}}>{I.check({})}</span></span>
      <div className="hero-title mt-4 text-xl font-semibold lowercase">enquiry sent</div>
      <p className="mx-auto mt-2 max-w-xs text-[13px] text-white/60">Thanks {v.name.split(' ')[0]} — we’ll be in touch shortly.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label={labels?'your name':undefined} icon={I.user({})}><input value={v.name} onChange={set('name')} className={INPUT} placeholder="First & last" /></Field>
        <Field label={labels?'phone':undefined} icon={I.user({})}><input value={v.phone} onChange={set('phone')} className={INPUT} placeholder="07…" /></Field>
      </div>
      <Field label={labels?'email':undefined} icon={I.user({})}><input type="email" value={v.email} onChange={set('email')} className={INPUT} placeholder="you@email.com" /></Field>
      <label className="block">
        {labels ? <span className="mb-2 block text-[12px] uppercase tracking-wide text-white/45">message</span> : null}
        <textarea rows="3" value={v.message} onChange={set('message')} className="glass glass-soft w-full rounded-2xl px-4 py-3 text-[14px] outline-none placeholder:text-white/35" placeholder={placeholder}></textarea>
      </label>
      {err ? <div className="text-[13px] text-red-200">{err}</div> : null}
      <Btn kind="primary" size="lg" type="submit" className="w-full" disabled={sending} iconEnd={I.arrow({})}>{sending ? 'sending…' : cta}</Btn>
      <p className="text-center text-[11px] leading-relaxed text-white/35">
        We use your details only to reply to your enquiry. See our{' '}
        <a href="#privacy" className="underline hover:text-white/60">privacy policy</a>.
      </p>
    </form>
  );
}
