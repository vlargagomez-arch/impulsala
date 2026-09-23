import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { searchBusinesses, type RealBusiness } from "@/lib/prospect-maps";

/**
 * POST /api/prospeccion
 * Body: { query: string, location?: string, limit?: number, focusFlaws?: boolean }
 *
 * Busca negocios REALES (OpenStreetMap: Nominatim + Overpass) y genera una propuesta
 * comercial personalizada con DeepSeek (modelo más económico: deepseek-flash).
 *
 * Regla dura: si el negocio no está en el mapa, no existe para esta herramienta.
 * NO se inventan negocios, teléfonos, correos ni webs. Lo que no hay, se dice.
 *
 * Response: { prospects, total, provider, source, city, categoryLabel, scanned, message? }
 */

type Prospect = {
  businessName: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  /** Ficha real del negocio en OpenStreetMap. */
  osmUrl: string;
  /** Ubicación exacta en Google Maps. */
  mapUrl: string;
  recommendedService: "web" | "seo" | "ads" | "ia";
  potentialScore: number;
  subject: string;
  proposal: string;
  sourceUrl: string;
  sourceDomain: string;
  snippet: string;
};

const WHATSAPP = "319 635 4992";
const SITE = "https://impulsala.vercel.app";

/** Servicio sugerido según lo que el mapa dice del negocio (determinista, sin inventar). */
function recommendService(b: RealBusiness): Prospect["recommendedService"] {
  if (!b.website) return "web";
  const heavyOps = /clínic|restaurant|cafeter|hotel|salón|taller|gimnasio|veterinar|inmobiliar/i.test(
    b.categoryLabel,
  );
  return heavyOps ? "ia" : "seo";
}

/** Puntaje 1-10 basado solo en datos presentes en el mapa. */
function scoreOf(b: RealBusiness): number {
  let s = 4;
  if (b.phone) s += 2; // se puede contactar
  if (b.address) s += 1; // ubicación verificable
  if (b.website) s += 1; // ya invierte en digital
  if (!b.website) s += 1; // necesita web
  return Math.min(10, s);
}

function snippetOf(b: RealBusiness, city: string): string {
  const datos = [
    b.phone ? "teléfono en el mapa" : null,
    b.address ? `dirección registrada (${b.address})` : null,
    b.website ? `web registrada: ${b.website}` : "sin web registrada en el mapa",
    b.email ? "correo en el mapa" : null,
  ].filter(Boolean);
  return `${b.categoryLabel} en ${city}. Datos en OpenStreetMap: ${datos.join(", ")}.`;
}

/** Propuesta local (sin LLM) usando SOLO los datos reales del negocio. */
function localProposal(
  b: RealBusiness,
  city: string,
  service: Prospect["recommendedService"],
): { subject: string; proposal: string } {
  const servicio = {
    web: "una página web que convierta visitas en clientes",
    seo: "posicionamiento en Google (SEO)",
    ads: "campañas de publicidad digital",
    ia: "automatización con IA",
  }[service];
  const webLine = b.website
    ? `Ya tienen presencia web (${b.website}), así que el siguiente paso natural es captar más clientes desde ahí.`
    : `No encontré una página web registrada para ustedes. Si ya tienen una, me lo dicen y lo ajusto; si no, es justo por donde están perdiendo clientes.`;
  const proposal = `Hola, equipo de ${b.name}:

Les escribo de Impulsala, agencia digital en Colombia. Estoy revisando ${b.categoryLabel.toLowerCase()}s en ${city} y su negocio me pareció un buen candidato para ${servicio}.

${webLine}

¿Les parece si agendamos una videollamada de 30 minutos, sin costo y sin compromiso, para mostrarles qué haríamos en su caso concreto? Me responden a este correo o por WhatsApp al ${WHATSAPP}. También pueden ver cómo trabajamos en ${SITE}.

Quedo atento,
Equipo Impulsala`;
  return {
    subject: `Propuesta para ${b.name} (${b.categoryLabel.toLowerCase()})`.slice(0, 60),
    proposal,
  };
}

/**
 * Genera subject + propuesta personalizada para cada negocio real con DeepSeek (1 sola llamada).
 * Si falla, se devuelve la propuesta local: nunca se inventan datos.
 */
async function generateProposals(
  businesses: RealBusiness[],
  city: string,
  service: Prospect["recommendedService"][],
): Promise<{ subject: string; proposal: string }[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const fallback = businesses.map((b, i) => localProposal(b, city, service[i]));
  if (!apiKey) return fallback;

  const payload = businesses.map((b, i) => ({
    i,
    negocio: b.name,
    tipo: b.categoryLabel,
    ciudad: city,
    direccion: b.address,
    telefono: b.phone,
    web_registrada: b.website,
    tiene_email_publico: Boolean(b.email),
    servicio_sugerido: service[i],
  }));

  const system = `Sos redactor comercial de Impulsala, agencia digital colombiana (páginas web, SEO, Google Ads y automatización con IA). WhatsApp ${WHATSAPP}. Web ${SITE}.
REGLAS:
- Escribís en español colombiano, cercano y profesional.
- PROHIBIDO inventar datos: no inventes precios, cifras, clientes, reseñas ni datos del negocio que no estén en el JSON.
- Si web_registrada es null, decí "no encontré una página web registrada para ustedes" y aclarales que si ya tienen una, se ajusta la propuesta. Nunca afirmes que no tienen web.
- No menciones OpenStreetMap ni Google Maps en la propuesta.
- Cerrás invitando a una videollamada de 30 minutos sin costo, con el WhatsApp ${WHATSAPP} y la web ${SITE}.
- Respondés SOLO JSON válido: {"propuestas":[{"i":number,"subject":string,"proposal":string}]}`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-flash",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Negocios reales encontrados:\n${JSON.stringify(payload)}\n\nEscribí una propuesta personalizada por negocio (3 párrafos, subject máximo 60 caracteres).`,
          },
        ],
        temperature: 0.6,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) throw new Error(`DeepSeek ${res.status}`);
    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(
      text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim(),
    ) as { propuestas?: { i: number; subject?: string; proposal?: string }[] };
    if (!Array.isArray(parsed.propuestas)) throw new Error("formato inválido");

    const out = [...fallback];
    for (const p of parsed.propuestas) {
      const idx = Number(p.i);
      if (!Number.isInteger(idx) || idx < 0 || idx >= out.length) continue;
      if (p.proposal && p.proposal.trim().length > 80) {
        out[idx] = {
          subject: (p.subject || out[idx].subject).slice(0, 80),
          proposal: p.proposal.trim(),
        };
      }
    }
    return out;
  } catch (err) {
    console.error("⚠️ [PROSPECCION] DeepSeek falló, uso propuesta local:", (err as Error)?.message);
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const {
      query,
      location = "Bogotá, Colombia",
      limit = 10,
      focusFlaws = false,
    } = await req.json();

    if (!query || !String(query).trim()) {
      return NextResponse.json(
        { error: "Escribí qué tipo de negocio buscar (ej: restaurantes)" },
        { status: 400 },
      );
    }

    const maxLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);
    // focusFlaws: pedirle más negocios al mapa (y luego quedarse con los que no registran web)
    const search = await searchBusinesses({
      category: String(query).trim(),
      location: String(location).trim(),
      limit: focusFlaws ? Math.min(maxLimit * 3, 40) : maxLimit,
    });

    let businesses = search.businesses;
    if (focusFlaws) {
      const sinWeb = businesses.filter((b) => !b.website);
      businesses = (sinWeb.length ? sinWeb : businesses).slice(0, maxLimit);
    }

    if (!businesses.length) {
      return NextResponse.json({
        prospects: [],
        total: 0,
        provider: "openstreetmap",
        source: "OpenStreetMap (ODbL)",
        city: search.city,
        categoryLabel: search.categoryLabel,
        scanned: search.scanned,
        message: search.degraded
          ? "Los servidores públicos de mapas (OpenStreetMap) están saturados en este momento. Esperá un minuto y reintentá la misma búsqueda."
          : `No hay negocios de ese tipo registrados en el mapa para ${location}. Probá otra categoría o ampliá la ciudad (ej: "Palmira, Valle del Cauca").`,
      });
    }

    const services = businesses.map(recommendService);
    const texts = await generateProposals(businesses, search.city, services);

    const prospects: Prospect[] = businesses.map((b, i) => {
      const domain = b.website
        ? b.website.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]
        : "";
      return {
        businessName: b.name,
        email: b.email,
        phone: b.phone,
        website: b.website,
        address: b.address,
        osmUrl: b.osmUrl,
        mapUrl: b.mapUrl,
        recommendedService: services[i],
        potentialScore: scoreOf(b),
        subject: texts[i].subject,
        proposal: texts[i].proposal,
        sourceUrl: b.osmUrl,
        sourceDomain: domain,
        snippet: snippetOf(b, search.city),
      };
    });

    console.log(
      `✅ [PROSPECCION] ${prospects.length} negocios reales en ${search.city} (${search.scanned} escaneados en el mapa)`,
    );

    return NextResponse.json({
      prospects,
      total: prospects.length,
      query,
      location,
      city: search.city,
      categoryLabel: search.categoryLabel,
      scanned: search.scanned,
      provider: "openstreetmap",
      source: "OpenStreetMap (ODbL)",
      focusFlaws,
    });
  } catch (error: any) {
    console.error("❌ [PROSPECCION] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error en prospección" },
      { status: 500 },
    );
  }
}
