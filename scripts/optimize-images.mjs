/* optimize-images.mjs — `npm run images`
   Reads original photos from images-src/ (gitignored), resizes to max 2000px wide,
   converts to WebP (q78) and strips ALL metadata (EXIF/GPS/XMP/IPTC), writing to
   src/assets/images/. Warns on any output over 250 KB.
   Only real, licensed photos of the venue — no stock/AI images, and no identifiable
   people (especially children) without confirmed consent. */

import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'src/assets/images';
const MAX_WIDTH = 2000;
const QUALITY = 78;
const WARN_BYTES = 250 * 1024;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

let files;
try { files = await readdir(SRC); }
catch { console.error(`No ${SRC}/ folder — put original photos there first.`); process.exit(1); }

await mkdir(OUT, { recursive: true });
let failed = false;

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!EXTS.has(ext)) { if (!f.startsWith('.')) console.warn(`skip ${f} (unsupported type)`); continue; }
  const name = path.basename(f, path.extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const out = path.join(OUT, name + '.webp');

  // .rotate() bakes in the EXIF orientation; sharp writes no metadata unless asked to
  await sharp(path.join(SRC, f))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  // verify nothing identifying survived
  const meta = await sharp(out).metadata();
  if (meta.exif || meta.xmp || meta.iptc) { console.error(`✗ ${out} still has metadata`); failed = true; }

  const { size } = await stat(out);
  const kb = (size / 1024).toFixed(0);
  if (size > WARN_BYTES) console.warn(`⚠ ${out} is ${kb} KB (over 250 KB) — consider cropping or a lower quality`);
  else console.log(`✓ ${out} ${meta.width}×${meta.height} ${kb} KB`);
}

if (failed) process.exit(1);
