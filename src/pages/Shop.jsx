/* Shop.jsx — The Football Shop: items sold at the centre (footballs, grip socks,
   Notts Olympic kits & training wear). No online checkout — bought at reception.

   Look: clean teal retail identity, scoped to this page. Product tiles use
   iconized gradients as placeholders until real photos are supplied.
   TODO: real product photos, prices, sizes & stock. */

import { useState } from 'react';
import { I } from '../lib/icons.jsx';
import { CONTACT } from '../lib/data.js';
import { Glass, Btn, Tag } from '../components/ui.jsx';
import { Footer } from '../components/Nav.jsx';

const TEAL = '#22C3B8';
const BLUE = '#38BDF8';
const MINT = '#34D399';

/* TODO: replace placeholder prices with the centre's real range + photos.
   priceConfirmed / tagConfirmed: a price or a "best seller" tag is only shown once
   the centre has confirmed it — until then the tile says "ask at reception". */
const PRODUCTS = [
  { name:'Match football',             cat:'footballs',     price:'£15', priceConfirmed:false, tag:'',            tagConfirmed:false, c:TEAL, ic:I.ball,   desc:'Size 4 & 5 · training and match quality.' },
  { name:'Grip socks',                 cat:'grip socks',    price:'£8',  priceConfirmed:false, tag:'best seller', tagConfirmed:false, c:BLUE, ic:I.bolt,   desc:'Anti-slip grip socks — all sizes.' },
  { name:'Notts Olympic home kit',     cat:'club kits',     price:'£35', priceConfirmed:false, tag:'club',        tagConfirmed:false, c:MINT, ic:I.shield, desc:'Official Notts Olympic FC shirt, shorts & socks.' },
  { name:'Notts Olympic training top', cat:'training wear', price:'£25', priceConfirmed:false, tag:'club',        tagConfirmed:false, c:TEAL, ic:I.star,   desc:'Club training wear — adults & juniors.' },
  { name:'Shin pads',                  cat:'accessories',   price:'£10', priceConfirmed:false, tag:'',            tagConfirmed:false, c:BLUE, ic:I.shield, desc:'Junior and adult sizes.' },
  { name:'Water bottle',               cat:'accessories',   price:'£5',  priceConfirmed:false, tag:'',            tagConfirmed:false, c:MINT, ic:I.cafe,   desc:'750ml squeeze bottle.' },
];

const CATS = ['all','footballs','grip socks','club kits','training wear','accessories'];

/* "best seller" is a claim, so it needs confirming; descriptive tags like "club" always show */
const showTag = (p) => p.tag && (p.tag !== 'best seller' || p.tagConfirmed);

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
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[.22em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full" style={{background:TEAL, boxShadow:`0 0 10px ${TEAL}`}}></span>
            the football shop
          </span>
          <h1 className="hero-title mt-5 text-5xl font-semibold lowercase leading-[.98] md:text-6xl">kit up at <span style={{color:TEAL}}>the centre</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75">
            Footballs, grip socks, Notts Olympic kits and training wear — available to buy at reception every day we’re
            open.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="filter products by category">
            {CATS.map(t=>{
              const on = cat===t;
              return (
                <button key={t} type="button" aria-pressed={on} onClick={()=>setCat(t)}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
            <Glass key={p.name} className="group flex flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 fade-up" style={{animationDelay:(i*.05)+'s'}}>
              {/* iconized placeholder tile */}
              <div className="relative aspect-[4/3] w-full overflow-hidden" style={{background:`linear-gradient(150deg, ${p.c}26, rgba(255,255,255,.02))`}}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"></div>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="transition-transform duration-300 group-hover:scale-110" style={{width:54,height:54,color:p.c}}>{p.ic({})}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[16px] font-medium">{p.name}</div>
                  {showTag(p) ? <Tag accent={p.tag==='best seller'}>{p.tag}</Tag> : null}
                </div>
                <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-white/60">{p.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  {p.priceConfirmed
                    ? <span className="tnum text-xl font-semibold" style={{color:p.c}}>{p.price}</span>
                    : <span className="text-[13px] font-medium" style={{color:p.c}}>ask at reception for price</span>}
                  <span className="text-[12px] text-white/45">buy at reception</span>
                </div>
              </div>
            </Glass>
          ))}
        </div>
        {list.length===0 ? <p className="mt-6 text-center text-[14px] text-white/55" role="status">Nothing in “{cat}” yet — ask at reception.</p> : null}

        <p className="mt-6 text-center text-[13px] text-white/40">Prices &amp; range are a guide — real stock, photos and sizes coming soon.</p>

        {/* order / contact callout */}
        <Glass strong className="relative mt-10 flex flex-col items-center gap-4 overflow-hidden rounded-[30px] p-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl" style={{background:TEAL}}></div>
          <div className="relative">
            <div className="text-[18px] font-medium lowercase">need club kit in a specific size?</div>
            <p className="mt-1 text-[14px] text-white/60">Ask at reception or get in touch — we can order Notts Olympic kits and training wear in for you.</p>
          </div>
          <div className="relative flex shrink-0 items-center gap-2">
            <Btn href={'tel:'+CONTACT.phone.replace(/\s/g,'')} kind="outline" icon={I.clock({})} aria-label={'call '+CONTACT.phone}>{CONTACT.phone}</Btn>
            <Btn href="#contact" kind="primary" iconEnd={I.arrow({})}>contact us</Btn>
          </div>
        </Glass>
      </section>
      <Footer />
    </div>
  );
}
