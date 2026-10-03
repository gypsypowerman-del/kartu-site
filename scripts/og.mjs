// Share previews (og:image, 1200×630) and the favicon, built from existing brand assets only.
// Run: node scripts/og.mjs  → public/og/*.jpg, src/app/icon.png, src/app/apple-icon.png
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

const PHOTOS = "public/images/photos";
const OUT = "public/og";
mkdirSync(OUT, { recursive: true });

// key → photo stem (same images the pages lead with)
const pages = {
  home: "home-hero",
  projects: "shepherds-bush-09",
  studio: "studio-01",
  services: "services-01",
  contact: "services-03",
  "shepherds-bush": "home-hero", // approved crop of the same view (01 has a dark door-jamb band)
  beregovoy: "beregovoy-01",
  "jewellery-studio": "jewellery-studio-01",
  "city-bay": "city-bay-01",
  "family-house": "family-house-01",
  "sea-side": "sea-side-01",
};

const W = 1200, H = 630;
const logo = await sharp(readFileSync("public/images/logo/Logo_white.svg"), { density: 300 }).resize({ width: 260 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
// Same scrim as the site hero (--hero-scrim), so the white wordmark stays legible
const scrim = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".38" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

for (const [key, stem] of Object.entries(pages)) {
  await sharp(`${PHOTOS}/${stem}-1600.webp`)
    .resize(W, H, { fit: "cover", position: "attention" })
    .composite([
      { input: scrim, top: 0, left: 0 },
      { input: logo, left: 64, top: H - 64 - logoMeta.height },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${OUT}/${key}.jpg`);
  console.log("og", key);
}

// Favicon: the K symbol on white
for (const [file, size] of [["src/app/icon.png", 512], ["src/app/apple-icon.png", 180]]) {
  const pad = Math.round(size * 0.18);
  const mark = await sharp("public/images/logo/Symbol_black.png").trim().resize(size - 2 * pad, size - 2 * pad, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#ffffff" } }).composite([{ input: mark, gravity: "center" }]).png().toFile(file);
  console.log("icon", file);
}
