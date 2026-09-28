/* PlanyoBooking.jsx — native Astro Kings booking front, handing off to Planyo.

   FLOW (agreed):
   1. Pick a pitch  (our UI)
   2. Pick a day    (our UI)
   3. "check availability & book" opens the venue's own Planyo page in a new tab,
      pre-set to that pitch (resource_id, once mapped in config) and day
      (start_date, best-effort). Real availability + card payment happen there.

   We embed nothing and hold no data — the whole selection just rides along in
   the Planyo URL. Pitch-filtering activates once PLANYO_PITCH_RESOURCE is filled
   in config.js. */

import { useState } from 'react';
import { planyoUrl, PLANYO_PITCH_RESOURCE } from '../lib/config.js';
import { PITCHES, CONTACT } from '../lib/data.js';
import { I } from '../lib/icons.jsx';
import { Glass, Eyebrow, Btn } from './ui.jsx';
import { Footer } from './Nav.jsx';

/* local YYYY-MM-DD (avoids UTC off-by-one) */
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const DAYS = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+i); return d; });

/* open with a sensible selection already made so most people can book in one tap
   — both are changeable */
const DEFAULT_PITCH = (PITCHES.find(p => p.tag === 'Most booked') || PITCHES[0]).id;

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

function PitchTile({ p, active, onPick }){
  return (
    <button type="button" onClick={onPick}
      className={`group relative flex flex-col rounded-[22px] border p-5 text-left transition-all duration-200
        ${active ? 'accent-ring border-transparent bg-white/[.06]' : 'border-white/10 bg-white/[.02] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.04]'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[16px] font-medium lowercase">{p.name}</div>
          <div className="mt-0.5 text-[12px] text-white/45">{p.desc}</div>
        </div>
        <span className="shrink-0 rounded-full bg-white/8 px-2.5 py-1 text-[11px] font-medium text-white/70">{p.size}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="tnum text-2xl font-semibold accent-text">£{p.price}</span>
          <span className="text-[12px] text-white/40">{p.unit}</span>
        </div>
        <span className={`grid h-6 w-6 place-items-center rounded-full border transition-colors ${active?'accent-bg border-transparent text-[#0b0b0b]':'border-white/20 text-transparent'}`}>
          <span style={{ width: 13, height: 13 }}>{I.check({})}</span>
        </span>
      </div>
    </button>
  );
}

export function PlanyoBooking(){
  const [pitch, setPitch] = useState(DEFAULT_PITCH);   // pre-selected, changeable
  const [day, setDay]     = useState(DAYS[0]);         // today, changeable
  const active = PITCHES.find(p => p.id === pitch) || null;
  const resId  = pitch ? PLANYO_PITCH_RESOURCE[pitch] : null;
  const href   = planyoUrl(resId, day ? iso(day) : null);

  const dayLabel = day
    ? day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    : null;

  return (
    <div>
      {/* ---------- hero ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-8 md:pt-32">
        <Eyebrow>secure booking</Eyebrow>
        <h1 className="hero-title mt-3 text-4xl font-semibold lowercase md:text-5xl">book your pitch</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
          Pick your pitch and day here, then check live availability and pay by card — all on our secure system.
        </p>
        <TrustRow />
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        {/* step 1 — pitch */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[12px] uppercase tracking-[.18em] text-white/40">1 · choose your pitch</div>
          {active ? <button onClick={()=>setPitch(null)} className="text-[12px] text-white/45 underline-offset-2 hover:text-white/80 hover:underline">clear</button> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PITCHES.map(p => <PitchTile key={p.id} p={p} active={pitch === p.id} onPick={() => setPitch(p.id)} />)}
        </div>

        {/* step 2 — day */}
        <div className="mb-3 mt-10 flex items-center justify-between">
          <div className="text-[12px] uppercase tracking-[.18em] text-white/40">2 · choose a day</div>
          {day ? <button onClick={()=>setDay(null)} className="text-[12px] text-white/45 underline-offset-2 hover:text-white/80 hover:underline">clear</button> : null}
        </div>
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DAYS.map((d,i) => {
            const on = day && iso(day) === iso(d);
            return (
              <button key={i} onClick={()=>setDay(d)}
                className={`flex shrink-0 flex-col items-center rounded-2xl border px-3.5 py-2.5 transition-all
                  ${on ? 'accent-ring border-transparent bg-white/[.06]' : 'border-white/10 bg-white/[.02] hover:border-white/20 hover:bg-white/[.04]'}`}>
                <span className="text-[11px] uppercase tracking-wide text-white/45">{i===0?'today':i===1?'tmrw':d.toLocaleDateString('en-GB',{weekday:'short'})}</span>
                <span className="tnum mt-0.5 text-[16px] font-semibold">{d.getDate()}</span>
                <span className="text-[11px] text-white/40">{d.toLocaleDateString('en-GB',{month:'short'})}</span>
              </button>
            );
          })}
        </div>

        {/* step 3 — hand off to Planyo */}
        <Glass strong className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[26px] p-6 md:flex-row md:p-7">
          <div className="text-center md:text-left">
            <div className="text-[12px] uppercase tracking-[.18em] text-white/40">3 · check availability &amp; book</div>
            <div className="mt-1.5 text-[16px] font-medium">
              {active ? active.name : <span className="text-white/50">any pitch</span>}
              <span className="text-white/30"> · </span>
              {dayLabel || <span className="text-white/50">any day</span>}
            </div>
            <p className="mt-1 text-[12.5px] text-white/45">Opens our secure Planyo booking page with real-time availability &amp; card payment.</p>
          </div>
          <a href={href} target="_blank" rel="noreferrer" className="w-full md:w-auto">
            <Btn kind="primary" size="lg" className="w-full md:w-auto" iconEnd={I.arrow({})}>check availability &amp; book</Btn>
          </a>
        </Glass>

        {/* fallbacks */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-1">
          <span className="flex items-center gap-1.5 text-[11px] text-white/35">
            <span className="accent-text" style={{ width: 12, height: 12 }}>{I.shield({})}</span>
            Booking &amp; payment secured by Planyo
          </span>
          <span className="text-[12px] text-white/45">
            Prefer to talk?{' '}
            <a href={'tel:'+CONTACT.phone.replace(/\s/g,'')} className="accent-text hover:underline">{CONTACT.phone}</a>
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
