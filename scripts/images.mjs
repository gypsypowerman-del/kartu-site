// Generates responsive AVIF + WebP variants for every photo in assets-src/photos
// and writes src/content/photo-meta.json (intrinsic sizes, for layout without shift).
// Usage: npm run images
import sharp from "sharp";
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-src/photos";
const OUT = "public/images/photos";
const WIDTHS = [640, 1080, 1600, 2400];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const meta = {};

let done = 0;
sharp.concurrency(2);
const queue = [...files];
async function worker() {
  while (queue.length) {
    const f = queue.shift();
    const stem = f.replace(/\.\w+$/, "");
    const input = path.join(SRC, f);
    const { width, height } = await sharp(input).metadata();
    meta[stem] = { w: width, h: height };
    for (const w of WIDTHS) {
      const target = Math.min(w, width);
      const base = path.join(OUT, `${stem}-${w}`);
      const exists = await stat(`${base}.webp`).then(() => true, () => false);
      if (exists) continue;
      const img = sharp(input).resize({ width: target, withoutEnlargement: true });
      await img.clone().avif({ quality: 52, effort: 2 }).toFile(`${base}.avif`);
      await img.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
    }
    if (++done % 20 === 0) console.log(`${done}/${files.length}`);
  }
}
await Promise.all([worker(), worker()]);

await writeFile("src/content/photo-meta.json", JSON.stringify(meta, null, 1));
console.log(`done: ${files.length} photos → ${OUT}`);
