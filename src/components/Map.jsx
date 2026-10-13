/* Map.jsx — Google Map, loaded only after the visitor asks for it.

   Loading the embed straight away would send the visitor's IP address (and let
   Google set cookies) before they've chosen anything, so we show a plain
   placeholder first and only create the iframe on click. The privacy policy
   describes this behaviour — keep the two in step.
   For a styled/branded map later, swap to the Maps Embed API with the owner's key. */

import { useState } from 'react';

const VENUE = 'Astro Kings 5-a-side, Wigman Rd, Nottingham NG8 4PB';

export function Map({ query = VENUE, zoom = 14, className = '' }){
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <div className={`${className} flex flex-col items-center justify-center gap-3 bg-black/40 p-4 text-center`}>
        <p className="max-w-xs text-[13px] leading-relaxed text-white/75">
          The map is provided by Google. It only loads if you choose to show it, and
          Google will then receive your IP address.
        </p>
        <button type="button" onClick={() => setShow(true)}
          className="rounded-full border border-white/30 px-5 py-2 text-[13px] font-medium text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
          show map
        </button>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
          target="_blank" rel="noreferrer" className="text-[12px] text-white/75 underline hover:text-white">
          or open in Google Maps
        </a>
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
  return (
    <iframe
      title="Astro Kings location"
      src={src}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      allowFullScreen
      className={className}
      style={{ border: 0, filter: 'grayscale(0.2) contrast(1.05)' }}
    />
  );
}
