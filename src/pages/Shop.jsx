/* Shop.jsx — The Football Shop: items sold at the centre (footballs, grip socks,
   Notts Olympic kits & training wear). No online checkout — bought at reception.

   Look: clean teal retail identity, scoped to this page.

   NOTE: there are no product photos and the centre has not given us prices, so
   this page deliberately does NOT show image placeholders or guessed prices —
   an empty grey tile reads as broken, and a wrong price is worse than none.
   It presents the range as a list of what's stocked, and sends people to
   reception for prices, sizes and stock. */

import { useState } from 'react';
import { I } from '../lib/icons.jsx';
import { CONTACT } from '../lib/data.js';
import { Glass, Btn } from '../components/ui.jsx';
import { Footer } from '../components/Nav.jsx';

const TEAL = '#22C3B8';

const PRODUCTS = [
  { name:'Match footballs',            cat:'footballs',     desc:'Size 4 & 5 — training and match quality.' },
  { name:'Grip socks',                 cat:'grip socks',    desc:'Anti-slip grip socks, all sizes.' },
  { name:'Notts Olympic home kit',     cat:'club kits',     desc:'Official club shirt, shorts & socks.' },
  { name:'Notts Olympic training top', cat:'training wear', desc:'Club training wear — adults & juniors.' },
  { name:'Shin pads',                  cat:'accessories',   desc:'Junior and adult sizes.' },
  { name:'Water bottles',              cat:'accessories',   desc:'Squeeze bottles for training and matches.' },
];

const CATS = ['all','footballs','grip socks','club kits','training wear','accessories'];

export function Shop(){
  const [cat,setCat] = useState('all');
  const list = cat==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===cat);
  return (
    /* scope the brand accent to TEAL for this page */
    <div style={{ '--accent': TEAL, '--accent-2': '#7FE6DC' }}>
      {/* page-scoped retail backdrop */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex:-1, background:
        'radial-gradient(70% 55% at 14% 0%, rgba(34,195,184,.14), transparent 55%),'+
        'radial-gradient(70% 55% at 88% 6%, rgba(56,189,248,.12), transparent 55%),'+
        'radial-gradient(95% 70% at 50% 120%, rgba(34,195,184,.08), transparent 60%),'+
        'linear-gradient(180deg, #06100f 0%, #070b0c 55%, #060809 100%)' }}></div>

      {/* ---------- hero ---------- */}
      <section className="relative w-full overflow-hidden px-6 pt-28 pb-2 text-center md:pt-32">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[.22em] text-white backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full" style={{background:TEAL, boxShadow:`0 0 10px ${TEAL}`}}></span>
            the football shop
          </span>
          <h1 className="hero-title mt-5 text-5xl font-semibold leading-[.98] md:text-6xl">Kit up at <span style={{color:TEAL}}>the centre</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
            Footballs, grip socks, Notts Olympic kits and training wear — available to buy at reception every day we’re
            open.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="filter products by category">
            {CATS.map(t=>{
              const on = cat===t;
              return (
                <button key={t} type="button" aria-pressed={on} onClick={()=>setCat(t)}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium transition focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={on ? {background:TEAL,color:'#06100f',outlineColor:TEAL} : {background:TEAL+'1a',color:TEAL,outlineColor:TEAL}}>{t}</button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- products ---------- */}
      <section className="mx-auto mt-12 max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p,i)=>(
            <Glass key={p.name} className="flex flex-col rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1 fade-up" style={{animationDelay:(i*.05)+'s'}}>
              <div className="text-[16px] font-medium">{p.name}</div>
              <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-white/60">{p.desc}</p>
              <div className="mt-4 flex items-center gap-2 border-t pt-3">
                <span style={{width:13,height:13,color:TEAL}}>{I.pin({})}</span>
                <span className="text-[12.5px] text-white/50">in stock at reception</span>
              </div>
            </Glass>
          ))}
        </div>
        {list.length===0 ? <p className="mt-6 text-center text-[14px] text-white/55" role="status">Nothing in “{cat}” yet — ask at reception.</p> : null}

        <p className="mt-6 text-center text-[13px] leading-relaxed text-white/45">
          Everything here is available to buy at reception whenever we’re open —
          pop in and ask, and we’ll sort you out with sizes and prices.
        </p>

        {/* order / contact callout */}
        <Glass strong className="relative mt-10 flex flex-col items-center gap-4 overflow-hidden rounded-[30px] p-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl" style={{background:TEAL}}></div>
          <div className="relative">
            <div className="text-[18px] font-medium">Need club kit in a specific size?</div>
            <p className="mt-1 text-[14px] text-white/60">Ask at reception or get in touch — we can order Notts Olympic kits and training wear in for you.</p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <Btn href={'tel:'+CONTACT.phone.replace(/\s/g,'')} kind="outline" icon={I.clock({})} aria-label={'call '+CONTACT.phone}>{CONTACT.phone}</Btn>
            <Btn href="#contact" kind="primary" iconEnd={I.arrow({})}>Contact us</Btn>
          </div>
        </Glass>
      </section>
      <Footer />
    </div>
  );
}
