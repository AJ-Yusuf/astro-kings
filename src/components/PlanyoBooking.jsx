/* PlanyoBooking.jsx — native Astro Kings booking front over the Planyo engine.

   The pitch picker, hero and framing are OUR UI (dark, branded), so choosing a
   pitch feels like booking on our own site. The actual availability, pricing,
   card payment and confirmation all happen inside the embedded Planyo widget —
   which reloads filtered to the chosen pitch (once its resource_id is mapped in
   config.PLANYO_PITCH_RESOURCE).

   DESIGN NOTE — the light panel:
   The iframe's INTERIOR is Planyo's own page on planyo.com. Browsers block a
   parent page from restyling cross-origin content, so its light theme cannot be
   darkened from this codebase — only in the Planyo dashboard. Ready-to-paste
   dark/coral CSS for that lives in docs/planyo-theme.md. */

import { useState } from 'react';
import { PLANYO_EMBED_URL, BOOKING_PLATFORM_URL, PLANYO_PITCH_RESOURCE, planyoUrl } from '../lib/config.js';
import { PITCHES } from '../lib/data.js';
import { scrollToId } from '../lib/router.js';
import { I } from '../lib/icons.jsx';
import { Glass, Eyebrow, Btn } from './ui.jsx';
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

/* one branded pitch card — selecting it filters the widget below */
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
        <span className={`inline-flex items-center gap-1 text-[12px] font-medium transition-colors ${active?'accent-text':'text-white/45 group-hover:text-white/80'}`}>
          {active ? 'selected' : 'check availability'}
          <span style={{ width: 13, height: 13 }} className="transition-transform group-hover:translate-x-0.5">{I.arrow({})}</span>
        </span>
      </div>
    </button>
  );
}

export function PlanyoBooking(){
  const [pitch, setPitch] = useState(null);   // selected pitch id, or null = all
  const active = PITCHES.find(p => p.id === pitch) || null;
  const resId = pitch ? PLANYO_PITCH_RESOURCE[pitch] : null;
  const src = planyoUrl(resId);

  function pick(p){
    setPitch(p.id);
    // let the iframe swap, then bring the widget into view under the nav
    setTimeout(() => scrollToId('availability'), 60);
  }

  return (
    <div>
      {/* ---------- hero ---------- */}
      <div className="mx-auto max-w-5xl px-6 pt-28 pb-8 md:pt-32">
        <Eyebrow>secure booking</Eyebrow>
        <h1 className="hero-title mt-3 text-4xl font-semibold lowercase md:text-5xl">book your pitch</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/60">
          Pick your pitch, check live availability and pay by card — all in a few taps.
        </p>
        <TrustRow />
      </div>

      {/* ---------- native pitch picker ---------- */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[12px] uppercase tracking-[.18em] text-white/40">1 · choose your pitch</div>
          {active ? (
            <button onClick={()=>setPitch(null)} className="text-[12px] text-white/45 underline-offset-2 hover:text-white/80 hover:underline">show all pitches</button>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PITCHES.map(p => (
            <PitchTile key={p.id} p={p} active={pitch === p.id} onPick={() => pick(p)} />
          ))}
        </div>
      </div>

      {/* ---------- booking panel ---------- */}
      <div id="availability" className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <div className="mb-3 text-[12px] uppercase tracking-[.18em] text-white/40">2 · check availability &amp; book</div>
        <Glass strong className="rounded-[28px] p-2.5 md:p-3">
          {/* header strip */}
          <div className="flex items-center justify-between gap-4 px-3 pb-3 pt-1.5 md:px-4">
            <div className="flex items-center gap-2.5">
              <span className="accent-text grid place-items-center" style={{ width: 16, height: 16 }}>{I.cal({})}</span>
              <span className="text-[14px] font-medium text-white/90">
                {active ? active.name : 'All pitches'}
              </span>
              {resId ? null : active ? (
                <span className="hidden rounded-full bg-white/8 px-2 py-0.5 text-[10.5px] text-white/45 sm:inline">showing full calendar</span>
              ) : null}
            </div>
            <span className="hidden items-center gap-1.5 text-[12px] text-white/40 sm:flex">
              <span className="accent-text" style={{ width: 12, height: 12 }}>{I.pin({})}</span>
              Bilborough, Nottingham
            </span>
          </div>

          {/* the widget — key forces a clean reload when the pitch changes */}
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white">
            <iframe
              key={src}
              title="Astro Kings booking"
              src={src}
              className="block h-[820px] w-full bg-white"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          {/* caption */}
          <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-3 md:px-4">
            <span className="flex items-center gap-1.5 text-[11px] text-white/35">
              <span className="accent-text" style={{ width: 12, height: 12 }}>{I.shield({})}</span>
              Secured by Planyo
            </span>
            <a href={planyoUrl(resId) || BOOKING_PLATFORM_URL} target="_blank" rel="noreferrer"
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
