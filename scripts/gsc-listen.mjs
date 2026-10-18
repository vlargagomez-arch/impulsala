#!/usr/bin/env node
/**
 * Escucha el callback de OAuth en http://localhost:8765 y canjea el code solo.
 * Uso: node scripts/gsc-listen.mjs   (dejar corriendo mientras el dueño aprueba)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OAUTH = path.join(ROOT, ".google-oauth.json");
const TOKEN = path.join(ROOT, process.env.GOOGLE_TOKEN_FILE || ".google-token.json");
const LOG = path.join(ROOT, ".gsc-listen.log");
const creds = JSON.parse(fs.readFileSync(OAUTH, "utf8"));
const log = (m) => fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${m}\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8765");
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  log(`hit ${req.url.slice(0, 80)}`);
  if (err || !code) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<h1>Faltó el permiso</h1><p>${err || "sin code"}</p>`);
    return;
  }
  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: creds.client_id,
        client_secret: creds.client_secret,
        redirect_uri: creds.redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    const json = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(json));
    fs.writeFileSync(TOKEN, JSON.stringify({ ...json, saved_at: new Date().toISOString() }, null, 2));
    log("TOKEN OK");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Listo ✅</h1><p>Acceso concedido a Impulsala. Podés cerrar esta pestaña.</p>");
    setTimeout(() => process.exit(0), 1200);
  } catch (e) {
    log("EXCHANGE ERROR " + e.message);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Error al canjear el code: " + e.message);
  }
});

server.listen(8765, "127.0.0.1", () => log("escuchando en http://localhost:8765"));
setTimeout(() => {
  log("timeout 15min, me apago");
  process.exit(2);
}, 15 * 60 * 1000);
