#!/usr/bin/env node
/**
 * ops.cjs — centro de operaciones de Impulsala. Un comando en vez de diez sondas.
 *
 *   node scripts/ops.cjs status    salud de producción (home, BD, agentes, panel, chat real)
 *   node scripts/ops.cjs deploy    commit + push a main + vercel --prod + verificación
 *   node scripts/ops.cjs tables    crea/verifica las tablas de agentes
 *   node scripts/ops.cjs logs      últimos errores de runtime en Vercel
 *   node scripts/ops.cjs env       variables de entorno del proyecto en Vercel
 *   node scripts/ops.cjs blog      dispara el agente SEO ahora
 *   node scripts/ops.cjs report    dispara el reporte semanal ahora
 *
 * Lee secretos de archivos locales (nunca del chat): .dburl, .vtok y el secreto de cron.
 */

const { execFileSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const SITE = process.env.IMPULSALA_URL || "https://impulsala.vercel.app";
const CRON_SECRET_FILE = path.join(
  os.homedir(),
  "AppData/Local/hermes/cache/scratch/impulsala-cron-secret.txt"
);

const readIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : "");
const dbUrl = () => process.env.DATABASE_URL || readIf(path.join(ROOT, ".dburl"));
const ghToken = () => readIf(path.join(ROOT, ".vtok"));
const cronSecret = () => readIf(CRON_SECRET_FILE);
const adminCookie = `nexus-admin-session=${Buffer.from("admin@impulsala.com:1").toString("base64")}`;

const sh = (cmd, args, opts = {}) => {
  const common = { cwd: ROOT, encoding: "utf8", stdio: "pipe", ...opts };
  // En Windows `vercel`/`git` son shims .cmd: hay que pasar por el shell y citar los argumentos
  if (process.platform === "win32") {
    const quoted = [cmd, ...args.map((a) => (/[\s"]/.test(String(a)) ? `"${String(a).replace(/"/g, '\\"')}"` : String(a)))].join(" ");
    return execSync(quoted, common).trim();
  }
  return execFileSync(cmd, args, common).trim();
};

async function code(pathname, opts = {}) {
  const res = await fetch(SITE + pathname, { redirect: "manual", ...opts });
  return res.status;
}

async function json(pathname, opts = {}) {
  const res = await fetch(SITE + pathname, opts);
  const text = await res.text();
  try {
    return { status: res.status, body: JSON.parse(text) };
  } catch {
    return { status: res.status, body: text.slice(0, 200) };
  }
}

async function status() {
  console.log("== Impulsala · estado de producción ==");
  const checks = [
    ["home", "/"],
    ["slots (BD)", "/api/appointments/slots?days=3"],
    ["blog posts", "/api/blog/posts"],
    ["setup-db protegido (espera 401)", "/api/setup-db"],
  ];
  for (const [nombre, ruta] of checks) {
    const c = await code(ruta);
    const esperado = nombre.includes("401") ? 401 : 200;
    console.log(`${c === esperado ? "OK " : "!! "} ${nombre}: HTTP ${c}`);
  }

  const panel = await json("/api/agents/status", { headers: { Cookie: adminCookie } });
  if (panel.status === 200) {
    console.log(`OK  panel agentes: motor=${panel.body.estado?.motor} metricas=${JSON.stringify(panel.body.metricas)}`);
  } else {
    console.log(`!!  panel agentes: HTTP ${panel.status}`);
  }

  const chat = await json("/api/agents/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hola, ¿qué servicios ofrecen?" }),
  });
  console.log(
    `OK  agente chat: HTTP ${chat.status} · modelo=${chat.body.model || "-"} · respuesta="${String(chat.body.reply || chat.body.error || "").slice(0, 90)}..."`
  );
}

async function tables() {
  const out = sh("node", ["scripts/ensure-agent-tables.cjs"], { env: { ...process.env, DATABASE_URL: dbUrl() } });
  console.log(out);
}

async function env() {
  console.log(sh("vercel", ["env", "ls"]));
}

async function logs() {
  const deps = sh("vercel", ["ls", "impulsala", "--json"]);
  const list = JSON.parse(deps);
  const latest = (Array.isArray(list) ? list : list.deployments || []).find((d) => d.target === "production") || list[0];
  const url = latest?.url?.startsWith("http") ? latest.url : `https://${latest?.url}`;
  console.log("Deploy:", url, "|", latest?.state || latest?.readyState);
  console.log(sh("vercel", ["logs", url, "--json"]).split("\n").slice(0, 12).join("\n"));
}

async function cron(task) {
  const secret = cronSecret();
  if (!secret) throw new Error(`Falta el secreto de cron en ${CRON_SECRET_FILE}`);
  const r = await json(`/api/agents/cron?task=${task}&secret=${secret}`);
  console.log(JSON.stringify(r.body, null, 2));
}

function deploy() {
  const msg = process.argv[3] || `ops: despliegue ${new Date().toISOString()}`;
  const dirty = sh("git", ["status", "--porcelain"])
    .split("\n")
    .filter((l) => l.trim() && !l.includes("tsconfig.tsbuildinfo"));
  if (dirty.length) {
    sh("git", ["add", "-A"]);
    sh("git", ["commit", "-m", msg]);
    console.log(`commit: ${msg} (${dirty.length} archivos)`);
  } else {
    console.log("sin cambios locales que commitear");
  }

  // El repo es privado: fetch y push necesitan el token en la URL
  const token = ghToken();
  const origin = sh("git", ["remote", "get-url", "origin"]);
  const authed = `https://x-access-token:${token}@github.com/vlargagomez-arch/impulsala.git`;
  try {
    sh("git", ["remote", "set-url", "origin", authed]);
    sh("git", ["fetch", "origin", "main"]);
    try {
      sh("git", ["rebase", "origin/main"]);
    } catch {
      console.log("rebase con conflictos: resuélvelos y vuelve a correr deploy");
      process.exit(1);
    }
    console.log(sh("git", ["push", "origin", "HEAD:main"]));
  } finally {
    sh("git", ["remote", "set-url", "origin", origin]);
  }

  console.log(
    sh("vercel", ["--prod", "--yes"])
      .split("\n")
      .filter((l) => /Aliased|readyState|Error/i.test(l))
      .join("\n")
  );
  return status();
}

const cmd = process.argv[2] || "status";
const run = {
  status,
  deploy,
  tables,
  env,
  logs,
  blog: () => cron("blog"),
  report: () => cron("report"),
  followup: () => cron("followup"),
}[cmd];

if (!run) {
  console.log("Comandos: status | deploy [mensaje] | tables | env | logs | blog | report | followup");
  process.exit(1);
}
Promise.resolve(run()).catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
