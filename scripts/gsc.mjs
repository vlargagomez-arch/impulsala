#!/usr/bin/env node
/**
 * Google Search Console por API — sin navegador.
 *
 *   node scripts/gsc.mjs auth-url                  # URL de consentimiento
 *   node scripts/gsc.mjs exchange "<url o code>"   # canjea el code por refresh token
 *   node scripts/gsc.mjs sites                     # propiedades visibles
 *   node scripts/gsc.mjs sitemap [siteUrl]         # envía el sitemap
 *   node scripts/gsc.mjs inspect <url> [siteUrl]   # inspección de URL (estado de indexación)
 *   node scripts/gsc.mjs query [siteUrl] [días]    # clics/impresiones/posición
 *
 * Credenciales: .google-oauth.json (client_id/secret, gitignored)
 * Token:        .google-token.json (refresh_token, gitignored)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OAUTH = path.join(ROOT, ".google-oauth.json");
const TOKEN = path.join(ROOT, process.env.GOOGLE_TOKEN_FILE || ".google-token.json");
const SCOPE =
  "https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/business.manage";
const DEFAULT_SITE = "https://impulsala.com/";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const creds = () => readJson(OAUTH);

function authUrl() {
  const c = creds();
  const p = new URLSearchParams({
    client_id: c.client_id,
    redirect_uri: c.redirect_uri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

function codeFrom(input) {
  const s = String(input).trim();
  if (!s.includes("code=")) return s;
  const url = new URL(s.startsWith("http") ? s : `http://x/?${s}`);
  return url.searchParams.get("code");
}

async function postForm(url, form) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json;
}

async function exchange(input) {
  const c = creds();
  const json = await postForm("https://oauth2.googleapis.com/token", {
    code: codeFrom(input),
    client_id: c.client_id,
    client_secret: c.client_secret,
    redirect_uri: c.redirect_uri,
    grant_type: "authorization_code",
  });
  fs.writeFileSync(
    TOKEN,
    JSON.stringify({ ...json, saved_at: new Date().toISOString() }, null, 2)
  );
  return json;
}

async function accessToken() {
  const t = readJson(TOKEN);
  if (t.access_token && t.expiry_date && Date.now() < t.expiry_date - 60000) {
    return t.access_token;
  }
  const c = creds();
  const json = await postForm("https://oauth2.googleapis.com/token", {
    client_id: c.client_id,
    client_secret: c.client_secret,
    refresh_token: t.refresh_token,
    grant_type: "refresh_token",
  });
  fs.writeFileSync(TOKEN, JSON.stringify({ ...t, ...json }, null, 2));
  return json.access_token;
}

async function api(url, init = {}) {
  const token = await accessToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 500) };
  }
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json).slice(0, 600)}`);
  return json;
}

const [cmd, a1, a2] = process.argv.slice(2);

try {
  if (cmd === "auth-url") {
    console.log(authUrl());
  } else if (cmd === "exchange") {
    if (!a1) throw new Error("falta el code o la URL de retorno");
    const t = await exchange(a1);
    console.log("refresh_token guardado en .google-token.json");
    console.log("scope:", t.scope);
  } else if (cmd === "sites") {
    const r = await api("https://www.googleapis.com/webmasters/v3/sites");
    const list = r.siteEntry || [];
    console.log(list.length ? list.map((s) => `${s.permissionLevel}\t${s.siteUrl}`).join("\n") : "(sin propiedades visibles)");
  } else if (cmd === "sitemap") {
    const site = a1 || DEFAULT_SITE;
    // El feedpath debe ser la URL ABSOLUTA del sitemap (con sc-domain: no vale derivarla del site)
    const feed = a2 || "https://impulsala.com/sitemap.xml";
    await api(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(feed)}`,
      { method: "PUT" }
    );
    console.log("sitemap enviado:", feed);
  } else if (cmd === "inspect") {
    if (!a1) throw new Error("falta la URL a inspeccionar");
    const site = a2 || DEFAULT_SITE;
    const r = await api("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
      method: "POST",
      body: JSON.stringify({ inspectionUrl: a1, siteUrl: site }),
    });
    const idx = r.inspectionResult?.indexStatusResult || {};
    console.log(
      JSON.stringify(
        { verdict: idx.verdict, coverageState: idx.coverageState, lastCrawl: idx.lastCrawlTime, googleCanonical: idx.googleCanonical, userCanonical: idx.userCanonical },
        null,
        2
      )
    );
  } else if (cmd === "query") {
    const site = a1 || DEFAULT_SITE;
    const days = Number(a2 || 28);
    const end = new Date();
    const start = new Date(Date.now() - days * 864e5);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const r = await api(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
      {
        method: "POST",
        body: JSON.stringify({
          startDate: fmt(start),
          endDate: fmt(end),
          dimensions: ["query"],
          rowLimit: 25,
        }),
      }
    );
    const rows = r.rows || [];
    console.log(rows.length ? rows.map((x) => `${x.keys[0]}\tclics=${x.clicks}\timpresiones=${x.impressions}\tpos=${x.position.toFixed(1)}`).join("\n") : "(sin datos todavía)");
  } else if (cmd === "gbp-accounts") {
    // Prueba de acceso a la Business Profile API (requiere aprobación de Google)
    const r = await api("https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
    const list = r.accounts || [];
    console.log(list.length ? list.map((a) => `${a.name}\t${a.accountName}\t${a.type}`).join("\n") : "(sin cuentas de Business visibles)");
  } else {
    console.log("comandos: auth-url | exchange <code> | sites | sitemap [site] [feed] | inspect <url> [site] | query [site] [días] | gbp-accounts");
  }
} catch (e) {
  console.error("ERROR:", e.message);
  process.exit(1);
}
