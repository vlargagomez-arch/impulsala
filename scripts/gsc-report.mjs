#!/usr/bin/env node
/**
 * Reporte de indexación/seo de impulsala.com en Google Search Console (API, sin navegador).
 * Uso: node scripts/gsc-report.mjs
 */
import { execFileSync } from "node:child_process";

const SITE = "sc-domain:impulsala.com";
const URLS = [
  "https://impulsala.com/",
  "https://impulsala.com/servicios",
  "https://impulsala.com/blog",
  "https://impulsala.com/diagnostico-gratis",
  "https://impulsala.com/contacto",
];

const run = (args) => {
  try {
    return execFileSync(process.execPath, ["scripts/gsc.mjs", ...args], {
      encoding: "utf8",
      timeout: 60000,
    }).trim();
  } catch (e) {
    return "ERROR: " + (e.stdout || e.message).toString().trim().slice(0, 300);
  }
};

const lines = [];
lines.push("## Search Console · impulsala.com");
lines.push("");

const sites = run(["sites"]);
lines.push(`Propiedades: ${sites.replace(/\n/g, " · ")}`);
lines.push("");

lines.push("Sitemap:");
lines.push(run(["sitemap", SITE]).replace(/^/, "  "));
lines.push("");

lines.push("Indexación por URL:");
for (const u of URLS) {
  const raw = run(["inspect", u, SITE]);
  let estado = raw;
  try {
    const j = JSON.parse(raw);
    estado = `verdict=${j.verdict} · ${j.coverageState}${
      j.lastCrawl ? ` · último rastreo=${String(j.lastCrawl).slice(0, 10)}` : ""
    }`;
  } catch {}
  lines.push(`  ${u} → ${estado}`);
}
lines.push("");

lines.push("Búsquedas (28 días):");
const q = run(["query", SITE, "28"]);
lines.push(q.split("\n").map((l) => "  " + l).join("\n"));

const out = lines.join("\n");
console.log(out);
if (process.env.GSC_REPORT_FILE) {
  const fs = await import("node:fs");
  fs.writeFileSync(process.env.GSC_REPORT_FILE, out);
}
