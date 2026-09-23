/**
 * Búsqueda REAL de negocios para prospección (sin API keys, sin costo).
 *
 * Fuentes:
 *  - Nominatim (OpenStreetMap) para convertir "ciudad, país" en coordenadas.
 *  - Overpass API (OpenStreetMap) para listar negocios reales de una categoría
 *    alrededor de esas coordenadas, con nombre, dirección, teléfono y web cuando
 *    el negocio los tenga registrados en el mapa.
 *
 * Datos © OpenStreetMap contributors (ODbL 1.0).
 * IMPORTANTE: lo que NO aparece en el mapa no se inventa. Si un negocio no tiene
 * web/teléfono registrados, se marca como "sin dato en el mapa" (no como "no tiene").
 */

const UA = "ImpulsalaProspector/1.0 (+https://impulsala.vercel.app)";

export type RealBusiness = {
  name: string;
  categoryLabel: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  lat: number;
  lon: number;
  /** Ficha del negocio en OpenStreetMap. */
  osmUrl: string;
  /** Enlace a la ubicación exacta en Google Maps. */
  mapUrl: string;
};

type TagSpec = { keys: string[]; filters: string[]; label: string };

/** Categorías que entiende el buscador, en español. */
const CATEGORIES: TagSpec[] = [
  { keys: ["restaurant", "restaurante", "comida", "cafeter", "café", "cafe", "pizzer", "panader", "postre", "helader"], filters: ['nwr["amenity"="restaurant"]', 'nwr["amenity"="fast_food"]', 'nwr["amenity"="cafe"]', 'nwr["shop"="bakery"]'], label: "restaurante / cafetería" },
  { keys: ["gimnasio", "gym", "crossfit", "fitness", "entrenamiento"], filters: ['nwr["leisure"="fitness_centre"]', 'nwr["leisure"="sports_centre"]'], label: "gimnasio" },
  { keys: ["dentista", "odontolog", "dental", "ortodon"], filters: ['nwr["amenity"="dentist"]'], label: "clínica dental" },
  { keys: ["abogado", "juridic", "jurídic", "notar", "bufete"], filters: ['nwr["office"="lawyer"]', 'nwr["office"="notary"]'], label: "abogados / notaría" },
  { keys: ["peluquer", "barber", "estétic", "estétic", "estetica", "spa", "belleza", "uñas", "unas"], filters: ['nwr["shop"="hairdresser"]', 'nwr["shop"="beauty"]', 'nwr["leisure"="spa"]'], label: "peluquería / estética" },
  { keys: ["veterinar", "mascota"], filters: ['nwr["amenity"="veterinary"]'], label: "veterinaria" },
  { keys: ["ropa", "moda", "boutique", "calzado", "zapat", "almacen", "almacén"], filters: ['nwr["shop"="clothes"]', 'nwr["shop"="shoes"]', 'nwr["shop"="boutique"]'], label: "tienda de ropa / calzado" },
  { keys: ["inmobiliar", "inmueble", "finca raiz", "finca raíz", "arriendo", "casas", "apartamento"], filters: ['nwr["office"="estate_agent"]'], label: "inmobiliaria" },
  { keys: ["clinic", "clínic", "medic", "médic", "salud", "hospital", "consultorio", "laboratorio"], filters: ['nwr["amenity"="clinic"]', 'nwr["amenity"="doctors"]', 'nwr["amenity"="hospital"]'], label: "clínica / consultorio" },
  { keys: ["hotel", "hostal", "hospedaje", "posada", "glamping"], filters: ['nwr["tourism"="hotel"]', 'nwr["tourism"="hostel"]', 'nwr["tourism"="guest_house"]'], label: "hotel / hospedaje" },
  { keys: ["taller", "mecanic", "mecánic", "automotriz", "llanta", "carro", "moto"], filters: ['nwr["shop"="car_repair"]', 'nwr["shop"="tyres"]', 'nwr["shop"="motorcycle_repair"]'], label: "taller automotriz" },
  { keys: ["ferreter", "construc", "construc", "materiales"], filters: ['nwr["shop"="hardware"]', 'nwr["shop"="doityourself"]', 'nwr["shop"="trade"]'], label: "ferretería / materiales" },
  { keys: ["optic", "óptic", "gafas", "lentes"], filters: ['nwr["shop"="optician"]'], label: "óptica" },
  { keys: ["farmacia", "droguer"], filters: ['nwr["amenity"="pharmacy"]'], label: "droguería / farmacia" },
  { keys: ["academia", "colegio", "escuela", "instituto", "universidad", "preicfes", "jardin", "jardín"], filters: ['nwr["amenity"="school"]', 'nwr["amenity"="college"]', 'nwr["office"="educational_institution"]', 'nwr["amenity"="kindergarten"]'], label: "institución educativa" },
  { keys: ["contador", "contabil", "auditor"], filters: ['nwr["office"="accountant"]'], label: "contaduría" },
  { keys: ["publicidad", "marketing", "diseño", "diseno", "agencia", "software", "tecnolog"], filters: ['nwr["office"="advertising_agency"]', 'nwr["office"="it"]'], label: "agencia / tecnología" },
  { keys: ["evento", "banquete", "salon", "salón", "fiesta", "recepcion", "recepción"], filters: ['nwr["amenity"="events_venue"]', 'nwr["amenity"="banquet_hall"]'], label: "salón de eventos" },
  { keys: ["supermercado", "mercado", "tienda de barrio", "abarrote"], filters: ['nwr["shop"="supermarket"]', 'nwr["shop"="convenience"]', 'nwr["shop"="greengrocer"]'], label: "supermercado / tienda" },
  { keys: ["joyer", "reloj"], filters: ['nwr["shop"="jewelry"]', 'nwr["shop"="watches"]'], label: "joyería" },
  { keys: ["mueble", "decoracion", "decoración", "colchon"], filters: ['nwr["shop"="furniture"]', 'nwr["shop"="interior_decoration"]'], label: "mueblería / decoración" },
  { keys: ["licor", "bar", "discoteca", "cantina"], filters: ['nwr["amenity"="bar"]', 'nwr["amenity"="pub"]', 'nwr["amenity"="nightclub"]'], label: "bar / licorería" },
  { keys: ["lavadero", "lavander", "car wash", "lavado"], filters: ['nwr["shop"="laundry"]', 'nwr["amenity"="car_wash"]'], label: "lavandería / lavadero" },
];

/** Ciudades ya geocodificadas en esta instancia (evita repetir Nominatim). */
const cityCache = new Map<string, { lat: number; lon: number; label: string } | null>();

/** Coordenadas de las ciudades donde trabaja Impulsala: sin llamada externa y sin fallas. */
const CITY_TABLE: { keys: string[]; label: string; lat: number; lon: number }[] = [
  { keys: ["bogota", "bogota dc", "santa fe de bogota"], label: "Bogotá, Colombia", lat: 4.6533, lon: -74.0836 },
  { keys: ["medellin"], label: "Medellín, Antioquia", lat: 6.2442, lon: -75.5812 },
  { keys: ["cali", "santiago de cali"], label: "Cali, Valle del Cauca", lat: 3.4516, lon: -76.532 },
  { keys: ["palmira"], label: "Palmira, Valle del Cauca", lat: 3.5308, lon: -76.2988 },
  { keys: ["barranquilla"], label: "Barranquilla, Atlántico", lat: 10.9685, lon: -74.7813 },
  { keys: ["cartagena", "cartagena de indias"], label: "Cartagena, Bolívar", lat: 10.391, lon: -75.4794 },
  { keys: ["bucaramanga"], label: "Bucaramanga, Santander", lat: 7.1193, lon: -73.1227 },
  { keys: ["cucuta"], label: "Cúcuta, Norte de Santander", lat: 7.8939, lon: -72.5078 },
  { keys: ["pereira"], label: "Pereira, Risaralda", lat: 4.8133, lon: -75.6961 },
  { keys: ["manizales"], label: "Manizales, Caldas", lat: 5.0689, lon: -75.5174 },
  { keys: ["armenia"], label: "Armenia, Quindío", lat: 4.5339, lon: -75.6811 },
  { keys: ["ibague"], label: "Ibagué, Tolima", lat: 4.4389, lon: -75.2322 },
  { keys: ["villavicencio"], label: "Villavicencio, Meta", lat: 4.142, lon: -73.6266 },
  { keys: ["santa marta"], label: "Santa Marta, Magdalena", lat: 11.2408, lon: -74.199 },
  { keys: ["pasto"], label: "Pasto, Nariño", lat: 1.2136, lon: -77.2811 },
  { keys: ["neiva"], label: "Neiva, Huila", lat: 2.9345, lon: -75.2809 },
  { keys: ["valledupar"], label: "Valledupar, Cesar", lat: 10.4631, lon: -73.2532 },
  { keys: ["monteria"], label: "Montería, Córdoba", lat: 8.7479, lon: -75.8814 },
  { keys: ["sincelejo"], label: "Sincelejo, Sucre", lat: 9.3047, lon: -75.3978 },
  { keys: ["tunja"], label: "Tunja, Boyacá", lat: 5.5353, lon: -73.3678 },
  { keys: ["popayan"], label: "Popayán, Cauca", lat: 2.4448, lon: -76.6147 },
  { keys: ["yopal"], label: "Yopal, Casanare", lat: 5.3378, lon: -72.3959 },
  { keys: ["bello"], label: "Bello, Antioquia", lat: 6.3373, lon: -75.5578 },
  { keys: ["envigado"], label: "Envigado, Antioquia", lat: 6.1759, lon: -75.5878 },
  { keys: ["soacha"], label: "Soacha, Cundinamarca", lat: 4.5794, lon: -74.2168 },
  { keys: ["chía", "chia"], label: "Chía, Cundinamarca", lat: 4.8619, lon: -74.0327 },
  { keys: ["fusagasuga"], label: "Fusagasugá, Cundinamarca", lat: 4.3375, lon: -74.3639 },
  { keys: ["palmira valle"], label: "Palmira, Valle del Cauca", lat: 3.5308, lon: -76.2988 },
];

function cityFromTable(location: string): { lat: number; lon: number; label: string } | null {
  const raw = strip(location);
  if (!raw) return null;
  for (const c of CITY_TABLE) {
    if (c.keys.some((k) => raw === k || raw.startsWith(`${k},`) || raw.includes(k))) {
      return { lat: c.lat, lon: c.lon, label: c.label };
    }
  }
  return null;
}

/** Nominatim exige máximo ~1 consulta por segundo: se serializan. */
let nominatimChain: Promise<unknown> = Promise.resolve();
const NOMINATIM_MIN_GAP_MS = 1200;
let lastNominatimAt = 0;

async function nominatimLookup(location: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`;
  const run = async () => {
    const wait = Math.max(0, lastNominatimAt + NOMINATIM_MIN_GAP_MS - Date.now());
    if (wait) await new Promise((r) => setTimeout(r, wait));
    lastNominatimAt = Date.now();
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "es" },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const arr = (await res.json()) as { lat: string; lon: string; display_name?: string }[];
    if (!Array.isArray(arr) || !arr.length) throw new Error("Nominatim: sin resultados");
    return { lat: Number(arr[0].lat), lon: Number(arr[0].lon) };
  };
  const queued = nominatimChain.then(run, run);
  nominatimChain = queued.catch(() => undefined);
  try {
    return await queued;
  } catch {
    // un solo reintento, ya respetando el intervalo
    try {
      const retry = async () => {
        await new Promise((r) => setTimeout(r, NOMINATIM_MIN_GAP_MS));
        lastNominatimAt = Date.now();
        const res = await fetch(url, {
          headers: { "User-Agent": UA, "Accept-Language": "es" },
          cache: "no-store",
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error(`Nominatim ${res.status}`);
        const arr = (await res.json()) as { lat: string; lon: string }[];
        if (!Array.isArray(arr) || !arr.length) throw new Error("sin resultados");
        return { lat: Number(arr[0].lat), lon: Number(arr[0].lon) };
      };
      return await retry();
    } catch {
      return null;
    }
  }
}

const OVERPASS_MIRRORS: { url: string; method: "GET" | "POST" }[] = [
  { url: "https://overpass-api.de/api/interpreter", method: "POST" },
  { url: "https://z.overpass-api.de/api/interpreter", method: "POST" },
  { url: "https://lz4.overpass-api.de/api/interpreter", method: "GET" },
];

function strip(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** "restaurantes" -> los filtros OSM de restaurante; si no hay match, búsqueda por nombre. */
export function filtersForCategory(query: string): { filters: string[]; label: string } {
  const q = strip(query);
  if (!q) return { filters: [], label: query };
  const scored = CATEGORIES.map((c) => {
    const hit = c.keys.reduce((acc, k) => {
      const kk = strip(k);
      if (q === kk) return Math.max(acc, 3);
      if (q.includes(kk)) return Math.max(acc, 2);
      return acc;
    }, 0);
    return { c, hit };
  })
    .filter((x) => x.hit > 0)
    .sort((a, b) => b.hit - a.hit);
  if (!scored.length) return { filters: [], label: query };
  return { filters: scored[0].c.filters, label: scored[0].c.label };
}

export async function geocodeCity(location: string): Promise<{ lat: number; lon: number; label: string } | null> {
  const input = (location || "Bogotá, Colombia").trim() || "Bogotá, Colombia";
  const key = strip(input);
  if (cityCache.has(key)) return cityCache.get(key) ?? null;

  // 1. Ciudades conocidas: instantáneo y sin depender de nadie.
  const fromTable = cityFromTable(input);
  if (fromTable) {
    cityCache.set(key, fromTable);
    return fromTable;
  }

  // 2. Cualquier otra ubicación: Nominatim.
  const coords = await nominatimLookup(input);
  const found = coords ? { ...coords, label: input } : null;
  cityCache.set(key, found);
  return found;
}

/** Una consulta a Overpass: se lanzan los mirrors en paralelo y gana el primero que responda.
 *  Nota: los servidores públicos devuelven 504 con consultas grandes, por eso cada llamada
 *  lleva UN solo filtro (ver searchBusinesses). */
async function overpass(query: string): Promise<any[] | null> {
  const attempt = async (m: { url: string; method: "GET" | "POST" }): Promise<any[]> => {
    const res =
      m.method === "GET"
        ? await fetch(`${m.url}?data=${encodeURIComponent(query)}`, {
            headers: { "User-Agent": UA },
            cache: "no-store",
            signal: AbortSignal.timeout(12_000),
          })
        : await fetch(m.url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
            body: `data=${encodeURIComponent(query)}`,
            cache: "no-store",
            signal: AbortSignal.timeout(12_000),
          });
    if (!res.ok) throw new Error(`Overpass ${res.status}`);
    const json = (await res.json()) as { elements?: any[] };
    if (!Array.isArray(json.elements)) throw new Error("Overpass: sin elements");
    return json.elements;
  };

  try {
    // Los tres mirrors en paralelo: gana el que responda primero (suele ser ~2-6 s).
    return await Promise.any(OVERPASS_MIRRORS.map(attempt));
  } catch {
    // Reintento en serie por cada mirror (los 504 son por pico de carga, no por la consulta).
    for (const m of OVERPASS_MIRRORS) {
      try {
        return await attempt(m);
      } catch {
        // siguiente
      }
    }
    return null; // null = los mapas fallaron (no es lo mismo que "sin resultados")
  }
}

function pick(tags: Record<string, string>, keys: string[]): string | null {
  for (const k of keys) {
    const v = tags[k];
    if (v && String(v).trim()) return String(v).trim();
  }
  return null;
}

function buildAddress(tags: Record<string, string>): string | null {
  const street = pick(tags, ["addr:street"]);
  const num = pick(tags, ["addr:housenumber"]);
  const suburb = pick(tags, ["addr:suburb", "addr:neighbourhood"]);
  const city = pick(tags, ["addr:city"]);
  const parts = [street && num ? `${street} ${num}` : street || num, suburb, city].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function normalizeName(name: string): string {
  return strip(name).replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

export type SearchResult = {
  businesses: RealBusiness[];
  city: string;
  categoryLabel: string;
  scanned: number;
  /** true = los servidores públicos de mapas fallaron; el vacío no significa "no hay negocios". */
  degraded: boolean;
};

/** Resultados en memoria por 10 minutos (misma búsqueda repetida = instantánea). */
const searchCache = new Map<string, { at: number; result: SearchResult }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Busca negocios reales de una categoría en una ciudad.
 * Devuelve SOLO lo que existe en el mapa, con la fuente incluida.
 */
export async function searchBusinesses(opts: {
  category: string;
  location: string;
  limit?: number;
  radiusMeters?: number;
}): Promise<SearchResult> {
  const limit = Math.min(Math.max(opts.limit ?? 10, 1), 25);
  const location = opts.location?.trim() || "Bogotá, Colombia";

  const cacheKey = `${strip(opts.category)}|${strip(location)}|${limit}`;
  const hit = searchCache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.result;

  const geo = await geocodeCity(location);
  if (!geo) {
    return { businesses: [], city: location, categoryLabel: opts.category, scanned: 0, degraded: false };
  }

  const radius = opts.radiusMeters ?? 15_000;
  const deadline = Date.now() + 45_000; // presupuesto de los mapas (la función de Vercel corta a 60 s)
  const { filters, label } = filtersForCategory(opts.category);
  const safe = opts.category.replace(/["\\]/g, "").slice(0, 40);
  const selectors = filters.length
    ? filters.slice(0, 3).map((f) => `${f}["name"]`)
    : [`nwr["name"~"${safe}",i]`];

  // Secuencial con corte temprano: cada consulta lleva UN filtro (así no dan 504) y
  // se para en cuanto hay suficientes negocios.
  let elements: any[] = [];
  let algunaOk = false;
  const nombres = () =>
    new Set(elements.filter((e) => e?.tags?.name).map((e) => normalizeName(String(e.tags.name)))).size;

  for (const sel of selectors) {
    if (Date.now() > deadline) break; // presupuesto de tiempo agotado: mejor devolver lo que haya
    const batch = await overpass(
      `[out:json][timeout:25];${sel}(around:${radius},${geo.lat},${geo.lon});out tags center 150;`,
    );
    if (batch) {
      algunaOk = true;
      elements = elements.concat(batch);
    }
    if (nombres() >= limit) break;
  }
  const degraded = !algunaOk;

  const seen = new Set<string>();
  const businesses: RealBusiness[] = [];
  for (const el of elements) {
    const tags: Record<string, string> | undefined = el?.tags;
    const name: string | undefined = tags?.name || tags?.brand;
    if (!name) continue;
    const lat = typeof el.lat === "number" ? el.lat : el?.center?.lat;
    const lon = typeof el.lon === "number" ? el.lon : el?.center?.lon;
    if (typeof lat !== "number" || typeof lon !== "number") continue;

    const key = normalizeName(name);
    if (seen.has(key)) continue;
    seen.add(key);

    businesses.push({
      name: String(name).slice(0, 120),
      categoryLabel: label,
      address: buildAddress(tags || {}),
      phone: pick(tags || {}, ["phone", "contact:phone", "contact:mobile", "mobile"]),
      website: pick(tags || {}, ["website", "contact:website", "url"]),
      email: pick(tags || {}, ["email", "contact:email"]),
      lat,
      lon,
      osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
    });
  }

  // Prioridad: los que se pueden contactar (teléfono) y tienen dirección verificable.
  businesses.sort((a, b) => {
    const sa = (a.phone ? 2 : 0) + (a.address ? 1 : 0);
    const sb = (b.phone ? 2 : 0) + (b.address ? 1 : 0);
    if (sb !== sa) return sb - sa;
    return a.name.localeCompare(b.name);
  });

  const scanned = nombres();
  const result: SearchResult = {
    businesses: businesses.slice(0, limit),
    city: geo.label.split(",").slice(0, 2).join(","),
    categoryLabel: label,
    scanned,
    degraded,
  };
  if (!degraded && result.businesses.length) searchCache.set(cacheKey, { at: Date.now(), result });
  return result;
}
