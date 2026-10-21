#!/usr/bin/env node
/**
 * prospector.cjs — busca negocios con "falencia digital" y prepara propuesta.
 *
 * Fuente de negocios: OpenStreetMap / Overpass (gratis, sin key).
 * Detección de falencia: sin web, web solo en red social, sin teléfono se descarta.
 * Propuesta: DeepSeek (usa DEEPSEEK_API_KEY del .env).
 *
 * Uso:
 *   node scripts/prospect.cjs --nicho restaurante --ciudad bogota --limite 20
 *   node scripts/prospect.cjs --nicho odontologo --ciudad medellin --propuestas 3
 *
 * Salida: prospectos/<ciudad>-<nicho>-<fecha>.csv + .json y propuestas en .md
 */
const fs = require('fs');
const path = require('path');

// ---------- env ----------
function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
}
loadEnv();

// ---------- args ----------
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i].replace(/^--/, '');
  args[k] = process.argv[i + 1];
}
const NICHO = (args.nicho || 'restaurante').toLowerCase();
const LIMITE = parseInt(args.limite || '15', 10);
const NPROP = parseInt(args.propuestas || '0', 10);
const CIUDAD = (args.ciudad || 'bogota').toLowerCase();

// bbox aproximado (sur, oeste, norte, este) + centro
const CIUDADES = {
  bogota:   { nombre: 'Bogotá',   center: [4.6482, -74.0628], bbox: [4.55, -74.17, 4.78, -74.02] },
  medellin: { nombre: 'Medellín', center: [6.2442, -75.5812], bbox: [6.17, -75.65, 6.33, -75.52] },
  cali:     { nombre: 'Cali',     center: [3.4516, -76.5320], bbox: [3.36, -76.60, 3.53, -76.47] },
  barranquilla: { nombre: 'Barranquilla', center: [10.9685, -74.7813], bbox: [10.90, -74.85, 11.04, -74.73] },
  bucaramanga:  { nombre: 'Bucaramanga',  center: [7.1193, -73.1227], bbox: [7.06, -73.18, 7.17, -73.08] },
};
const C = CIUDADES[CIUDAD] || CIUDADES.bogota;

// tag OSM según nicho
const NICHO_TAGS = {
  restaurante: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe'],
  odontologo: ['amenity=dentist', 'healthcare=dentist'],
  abogado: ['office=lawyer'],
  veterinaria: ['amenity=veterinary'],
  gimnasio: ['leisure=fitness_centre'],
  hotel: ['tourism=hotel', 'tourism=guest_house'],
  salon: ['shop=beauty', 'shop=hairdresser'],
  ferreteria: ['shop=hardware', 'shop=doityourself'],
  inmobiliaria: ['office=estate_agent'],
  taller: ['shop=car_repair'],
};
const filtros = (NICHO_TAGS[NICHO] || [`amenity=${NICHO}`, `shop=${NICHO}`]);

function overpassQuery(tag, bbox) {
  const [s, w, n, e] = bbox;
  const [k, v] = tag.split('=');
  return `[out:json][timeout:60];
node["${k}"="${v}"]["name"](${s},${w},${n},${e});
out tags ${LIMITE * 25};`;
}

const MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.osm.ch/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// ---------- Google Places API (New) — la fuente buena ----------
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
async function buscarPlaces() {
  if (!PLACES_KEY) return [];
  const out = [];
  // 4 cuadrantes alrededor del centro para superar el límite de 20 por consulta
  const d = 0.045;
  const [lat, lon] = C.center;
  const puntos = [[0, 0], [d, 0], [-d, 0], [0, d], [0, -d]];
  for (const [dlat, dlon] of puntos) {
    const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryTypeDisplayName',
      },
      body: JSON.stringify({ textQuery: `${NICHO} en ${C.nombre}, Colombia`, languageCode: 'es', maxResultCount: 20, locationBias: { circle: { center: { latitude: lat + dlat, longitude: lon + dlon }, radius: 2500 } } }),
    });
    if (!r.ok) { console.warn('  ! Places HTTP', r.status, (await r.text()).slice(0, 160)); break; }
    const j = await r.json();
    for (const p of j.places || []) {
      const tel = p.nationalPhoneNumber || p.internationalPhoneNumber || '';
      if (!tel) continue;
      out.push({
        nombre: p.displayName?.text || '', nicho: NICHO, ciudad: C.nombre,
        telefono: tel, web: p.websiteUri || '',
        direccion: p.formattedAddress || '',
        lat: p.location?.latitude, lon: p.location?.longitude, fuente: 'google',
        rating: p.rating || null, resenas: p.userRatingCount || 0,
        maps: p.googleMapsUri || '', categoria: p.primaryTypeDisplayName?.text || '',
      });
    }
    await new Promise(r => setTimeout(r, 300));
  }
  const seen = new Set();
  return out.filter(p => { const k = p.nombre.toLowerCase() + p.telefono.slice(-7); if (seen.has(k)) return false; seen.add(k); return true; });
}

async function buscarOSM() {
  const all = new Map();
  for (const tag of filtros) {
    for (const host of MIRRORS) {
      try {
        const r = await fetch(host, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(overpassQuery(tag, C.bbox)),
        });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        for (const el of j.elements || []) {
          if (!el.tags || !el.tags.name) continue;
          const t = el.tags;
          const web = t.website || t['contact:website'] || '';
          const tel = t.phone || t['contact:phone'] || t['contact:mobile'] || '';
          if (!tel) continue; // sin teléfono no es contactable
          const key = el.tags.name.trim().toLowerCase() + '|' + tel.replace(/\D/g, '').slice(-7);
          if (all.has(key)) continue;
          all.set(key, {
            nombre: t.name, nicho: NICHO, ciudad: C.nombre,
            telefono: tel, web, direccion: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' '),
            lat: el.lat, lon: el.lon, fuente: 'osm',
            instagram: t['contact:instagram'] || '', facebook: t['contact:facebook'] || '',
          });
        }
        break; // host OK, siguiente tag
      } catch (e) {
        if (host.includes('kumi')) console.warn('  ! OSM falló para', tag, e.message);
      }
    }
  }
  return [...all.values()];
}

// ---------- falencia ----------
const SOCIAL = /(facebook\.com|instagram\.com|wa\.me|whatsapp|linktr\.ee|tiktok\.com)/i;
async function revisarWeb(url) {
  if (!url) return { estado: 'sin_web', peso: 45, detalle: 'No tiene página web, solo teléfono.' };
  if (SOCIAL.test(url)) return { estado: 'solo_red_social', peso: 32, detalle: 'Su "web" es un perfil social, no un sitio propio.' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const t0 = Date.now();
    const r = await fetch(url.startsWith('http') ? url : 'https://' + url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'Mozilla/5.0 ImpulsalaAudit' } });
    clearTimeout(t);
    const ms = Date.now() - t0;
    const html = (await r.text()).slice(0, 200000);
    const https = url.startsWith('https') || r.url.startsWith('https');
    const title = (html.match(/<title[^>]*>([^<]{0,120})/i) || [])[1] || '';
    const m = html.match(/<meta[^>]+name=["']viewport["']/i);
    let peso = 0; const fallas = [];
    if (!r.ok) { peso += 35; fallas.push(`la web responde ${r.status}`); }
    if (!https) { peso += 15; fallas.push('sin HTTPS'); }
    if (!m) { peso += 20; fallas.push('no es móvil-first (sin viewport)'); }
    if (ms > 3000) { peso += 15; fallas.push(`tarda ${(ms / 1000).toFixed(1)}s en cargar`); }
    if (html.length < 3000) { peso += 15; fallas.push('página casi vacía'); }
    if (!/whatsapp|wa\.me/i.test(html)) { peso += 8; fallas.push('sin botón de WhatsApp'); }
    return { estado: peso >= 25 ? 'web_mala' : 'ok', peso: Math.min(peso, 60), detalle: fallas.length ? fallas.join('; ') : 'Web aceptable.', title, ms, https };
  } catch (e) {
    return { estado: 'web_caida', peso: 50, detalle: 'La web no carga: ' + e.message };
  }
}

async function scoreProspecto(p) {
  const web = await revisarWeb(p.web);
  p.estado_web = web.estado;
  p.fallas = web.detalle;
  p.peso_web = web.peso;
  p.score = web.peso;
  if (!p.web) p.score += 10; // sin web = más fácil de convencer
  if (p.instagram) p.score += 5;
  if (!p.direccion) p.score += 3;
  p.prioridad = p.score >= 55 ? 'ALTA' : p.score >= 35 ? 'MEDIA' : 'BAJA';
  p.gancho = p.estado_web === 'sin_web'
    ? 'no aparece en Google con página propia: quien lo busca encuentra a la competencia'
    : p.estado_web === 'solo_red_social'
      ? 'solo existe en redes: no tiene web ni aparece en búsquedas de Google'
      : p.estado_web === 'web_caida'
        ? 'su página web no abre'
        : 'su web está por debajo de lo que un cliente espera en 2026';
  return p;
}

// ---------- propuesta con DeepSeek ----------
async function propuesta(p) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return null;
  const prompt = `Eres el redactor comercial de Impulsala (agencia digital en Colombia: webs, SEO, Google Ads y automatización con IA). Escribe una propuesta corta y concreta para este negocio, en español de Colombia, tuteo, sin exagerar.

Negocio: ${p.nombre}
Nicho: ${p.nicho} en ${p.ciudad}
Hallazgo real: ${p.estado_web} — ${p.fallas}
Gancho: ${p.gancho}

Formato exacto (máximo 130 palabras):
1) Línea 1: asunto para correo o primer mensaje de WhatsApp (máx 60 caracteres), sin "estimado".
2) "Qué vi:" una frase con el hallazgo concreto.
3) "Qué te propongo:" 3 viñetas: página/landing con WhatsApp, aparecer en Google (Google Business + SEO local), automatización con IA (agente que responde y agenda). Cada viñeta una línea.
4) "Siguiente paso:" una frase invitando a una llamada de 15 min.
No inventes precios, no inventes cifras de clientes ni resultados.`;
  try {
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.6, max_tokens: 420 }),
    });
    if (!r.ok) return `[DeepSeek HTTP ${r.status}]`;
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) { return '[DeepSeek error: ' + e.message + ']'; }
}

// ---------- run ----------
(async () => {
  const t0 = Date.now();

  // modo prueba: audita URLs sueltas y muestra la falencia detectada
  if (args.auditar) {
    const urls = String(args.auditar).split(',');
    for (const u of urls) {
      const a = await revisarWeb(u === 'sin_web' ? '' : u);
      console.log(`${a.peso.toString().padStart(2)}  ${a.estado.padEnd(16)} ${u.slice(0, 45).padEnd(46)} ${a.detalle}`);
    }
    return;
  }

  // modo demo: valida el redactor de propuestas con un caso de ejemplo
  if (args.demo) {
    const ej = { nombre: 'Sabor Andino (EJEMPLO)', nicho: NICHO, ciudad: C.nombre, estado_web: 'web_mala', fallas: 'tarda 6.2s en cargar; no es móvil-first (sin viewport); sin botón de WhatsApp', gancho: 'su web está por debajo de lo que un cliente espera en 2026' };
    console.log('--- propuesta de ejemplo (negocio ficticio, solo para ver formato) ---');
    console.log(await propuesta(ej));
    return;
  }

  console.log(`\n🔎 Impulsala Prospect · ${NICHO} en ${C.nombre}`);
  let crudos = await buscarPlaces();
  if (crudos.length) console.log(`   Google Places: ${crudos.length} negocios`);
  else {
    console.log('   (sin GOOGLE_PLACES_API_KEY: usando OpenStreetMap, fuente lenta/inestable)');
    crudos = await buscarOSM();
    console.log(`   OSM: ${crudos.length} negocios con teléfono`);
  }

  const revisados = [];
  for (let i = 0; i < crudos.length; i += 8) {
    const lote = crudos.slice(i, i + 8);
    revisados.push(...await Promise.all(lote.map(scoreProspecto)));
  }
  revisados.sort((a, b) => b.score - a.score);
  const top = revisados.slice(0, LIMITE);

  const dir = path.join(process.cwd(), 'prospectos');
  fs.mkdirSync(dir, { recursive: true });
  const base = path.join(dir, `${CIUDAD}-${NICHO}-${new Date().toISOString().slice(0, 10)}`);
  const cab = ['prioridad', 'score', 'nombre', 'nicho', 'ciudad', 'telefono', 'web', 'estado_web', 'fallas', 'direccion'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  fs.writeFileSync(base + '.csv', [cab.join(','), ...top.map(p => cab.map(k => esc(p[k])).join(','))].join('\n'), 'utf8');

  if (NPROP > 0) {
    const partes = [];
    for (const p of top.slice(0, NPROP)) {
      const txt = await propuesta(p);
      p.propuesta = txt;
      partes.push(`## ${p.nombre} — ${p.telefono}\n_${p.estado_web} · score ${p.score}_\n\n${txt || '(sin DEEPSEEK_API_KEY)'}\n`);
      console.log(`   ✍️  propuesta: ${p.nombre}`);
    }
    fs.writeFileSync(base + '-propuestas.md', `# Propuestas Impulsala · ${NICHO} · ${C.nombre}\n\n${partes.join('\n---\n\n')}`, 'utf8');
  }
  fs.writeFileSync(base + '.json', JSON.stringify(top, null, 2), 'utf8');

  console.log(`\n${'#'.padEnd(3)} ${'SCORE'.padEnd(6)} ${'ESTADO'.padEnd(15)} NEGOCIO / TELÉFONO`);
  top.forEach((p, i) => {
    console.log(`${String(i + 1).padEnd(3)} ${String(p.score).padEnd(6)} ${p.estado_web.padEnd(15)} ${p.nombre.slice(0, 40)} · ${p.telefono}`);
  });
  console.log(`\n📁 ${base}.csv${NPROP ? ' + -propuestas.md' : ''}`);
  console.log(`⏱  ${((Date.now() - t0) / 1000).toFixed(1)}s · ${top.filter(p => p.prioridad === 'ALTA').length} de prioridad ALTA`);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
