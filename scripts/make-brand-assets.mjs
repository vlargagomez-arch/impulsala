#!/usr/bin/env node
/**
 * Genera los assets de marca que faltaban:
 *   public/og-image.jpg                    (1200x630, para og:image y redes)
 *   business-profile/logo-720.png           (720x720, logo con fondo blanco para Google Business)
 *   business-profile/portada-1200x628.jpg   (portada para Google Business)
 * Uso: node scripts/make-brand-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const LOGO_SVG = fs.readFileSync(path.join(ROOT, "public/impulsala-logo.svg"), "utf8");

// El logo original es 120x120; se inserta escalado dentro de un viewBox mayor.
const logoGroup = (x, y, size) =>
  `<g transform="translate(${x} ${y}) scale(${size / 120})">${LOGO_SVG.replace(/<\?xml[^>]*\?>/, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}</g>`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FONT = "Segoe UI, Arial, Helvetica, sans-serif";

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#eef2ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="10" fill="#6366f1"/>
  ${logoGroup(505, 70, 190)}
  <text x="600" y="360" text-anchor="middle" font-family="${FONT}" font-size="86" font-weight="700" fill="#0f172a">Impulsala</text>
  <text x="600" y="425" text-anchor="middle" font-family="${FONT}" font-size="36" fill="#334155">Desarrollo web · SEO · Google Ads · Automatización con IA</text>
  <text x="600" y="500" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="600" fill="#6366f1">impulsala.com</text>
  <text x="600" y="560" text-anchor="middle" font-family="${FONT}" font-size="26" fill="#64748b">Bogotá · Colombia · Diagnóstico gratuito</text>
</svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
  <rect width="720" height="720" fill="#ffffff"/>
  ${logoGroup(160, 160, 400)}
</svg>`;
}

const out = async () => {
  fs.mkdirSync(path.join(ROOT, "business-profile"), { recursive: true });

  const og = path.join(ROOT, "public/og-image.jpg");
  await sharp(Buffer.from(ogSvg())).jpeg({ quality: 90 }).toFile(og);

  const logo = path.join(ROOT, "business-profile/logo-720.png");
  await sharp(Buffer.from(logoSvg())).png().toFile(logo);

  const portada = path.join(ROOT, "business-profile/portada-1200x628.jpg");
  await sharp(Buffer.from(ogSvg())).resize(1200, 628, { fit: "cover" }).jpeg({ quality: 90 }).toFile(portada);

  for (const [f, file] of [["og-image.jpg", og], ["logo-720.png", logo], ["portada-1200x628.jpg", portada]]) {
    const m = await sharp(file).metadata();
    console.log(`${f}: ${m.width}x${m.height} · ${(fs.statSync(file).size / 1024).toFixed(0)} KB · ${path.relative(ROOT, file)}`);
  }
};

out().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
