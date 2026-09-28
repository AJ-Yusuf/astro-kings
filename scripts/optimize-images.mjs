/* optimize-images.mjs — `npm run images`
   Converts an EXPLICIT list of original photos (images-src/, gitignored and
   read-only) into web-ready WebP files in public/images/ (a folder used only for
   these outputs). Nothing else in public/ is ever read, written or removed.

   ⚠️ The photos mapped below are TEMPORARY stock-style images, pending licence and
   consent confirmation — they are NOT photos of Astro Kings. Each one is tracked
   in IMAGE_SOURCES.md and must be replaced or confirmed before launch.

   - Only the files in MAP are processed; anything else in images-src/ is ignored.
   - An existing output file is never overwritten: the script stops with an error.
   - Max 1600px wide (or a per-photo `width` in MAP). WebP at q78; if the result is over 250 KB, quality drops in
     steps of 4 down to q60. Still over 250 KB → exit 1 and nothing is written.
   - ALL metadata (EXIF/GPS/XMP/IPTC) is stripped, then verified on the result. */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'public/images';
const MAX_WIDTH = 1600;
const Q_START = 78, Q_STEP = 4, Q_MIN = 60;
const MAX_BYTES = 250 * 1024;

/* source file in images-src/ → output file name in public/images/ (+ optional max width) */
const MAP = {
  'photo3-player-striking-ball.jpg': { out:'pz-session.webp' },
  'photo4-team-celebrating.jpg':     { out:'events-celebrate.webp', width:1280 },  // can't reach 250 KB at 1600px even at q60 (owner-approved 1280px)
  'photo2-goalkeeper-dive.jpg':      { out:'events-action.webp' },
  'photo1-coach-kids-huddle.jpg':    { out:'party-huddle.webp' },
  'photo5-kids-santa-hug.jpg':       { out:'party-christmas.webp' },   // processed only — not placed on any page
};

const exists = (p) => access(p).then(() => true, () => false);

// refuse to start if any output already exists — never overwrite
for (const { out } of Object.values(MAP)) {
  if (await exists(path.join(OUT, out))) {
    console.error(`✗ ${OUT}/${out} already exists — refusing to overwrite. Nothing was written.`);
    process.exit(1);
  }
}
await mkdir(OUT, { recursive: true });

let failed = false;
for (const [src, { out, width = MAX_WIDTH }] of Object.entries(MAP)) {
  const input = await readFile(path.join(SRC, src));   // read-only: the original is never modified

  let q = Q_START, buf;
  for (;;) {
    // .rotate() bakes in the EXIF orientation; sharp writes no metadata unless asked to
    buf = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
    if (buf.length <= MAX_BYTES || q - Q_STEP < Q_MIN) break;
    q -= Q_STEP;
  }
  if (buf.length > MAX_BYTES) {
    console.error(`✗ ${src} is still ${(buf.length / 1024).toFixed(0)} KB at q${q} (limit 250 KB) — not written`);
    failed = true;
    continue;
  }

  const meta = await sharp(buf).metadata();
  if (meta.exif || meta.xmp || meta.iptc) {
    console.error(`✗ ${out} still has metadata — not written`);
    failed = true;
    continue;
  }

  await writeFile(path.join(OUT, out), buf, { flag: 'wx' });   // 'wx' fails if the file appeared meanwhile
  console.log(`✓ ${OUT}/${out}  ${meta.width}×${meta.height}  q${q}  ${(buf.length / 1024).toFixed(0)} KB`);
}

if (failed) process.exit(1);
