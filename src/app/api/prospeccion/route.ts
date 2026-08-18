import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import {
  getProspectsByType,
  generateTemplateProposal,
  type ProspectTemplate,
} from "@/lib/prospect-db";

/**
 * POST /api/prospeccion
 * Body: { query: string, location?: string, limit?: number }
 *
 * Estrategia:
 * 1. Si hay GEMINI_API_KEY, usa Google Gemini (gratis, 15 req/min)
 * 2. Si hay Z.ai SDK disponible (sandbox Z.ai), lo usa
 * 3. SINO, usa prospectos pre-generados de Bogotá (siempre funciona)
 *
 * Response: { prospects: Prospect[] }
 */

type Prospect = {
  businessName: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  recommendedService: "web" | "seo" | "ads" | "ia";
  potentialScore: number;
  subject: string;
  proposal: string;
  sourceUrl: string;
  sourceDomain: string;
};

/**
 * Genera prospectos usando Google Gemini API (gratis, 15 req/min).
 */
async function generateWithGemini(
  query: string,
  location: string,
  limit: number
): Promise<Prospect[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // Hacemos una sola llamada pidiendo N prospectos de una
  const prompt = `Sos un experto en prospección B2B en Colombia. Generá ${limit} prospectos reales de "${query}" en ${location}.

Para cada prospecto devolvé:
- businessName: nombre real del negocio (negocios conocidos que existan)
- email: email si lo conocés (sino null)
- phone: teléfono si lo conocés (sino null)
- website: URL del sitio web si lo tiene (sino null)
- recommendedService: "web" | "seo" | "ads" | "ia" (qué servicio de Impulsala le conviene más)
- potentialScore: número 1-10 (qué tan buen prospecto es)
- subject: asunto de email máx 60 caracteres
- proposal: propuesta personalizada 3 párrafos en español colombiano, profesional
- snippet: descripción breve del negocio

Impulsala es una agencia digital en Bogotá que hace: desarrollo web, SEO, campañas publicitarias (Google/Meta Ads), y automatización con IA. WhatsApp: 319 635 4992.

Respondé SOLO un JSON válido con esta estructura:
{
  "prospects": [
    {
      "businessName": "...",
      "email": "... o null",
      "phone": "... o null",
      "website": "... o null",
      "recommendedService": "web"|"seo"|"ads"|"ia",
      "potentialScore": 1-10,
      "subject": "...",
      "proposal": "...",
      "snippet": "..."
    }
  ]
}

Generá ${limit} prospectos reales de ${query} en ${location}:`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Limpiar markdown si existe
  const cleanJson = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed = JSON.parse(cleanJson);

  if (!parsed.prospects || !Array.isArray(parsed.prospects)) {
    throw new Error("Respuesta de Gemini inválida");
  }

  return parsed.prospects.slice(0, limit).map((p: any): Prospect => ({
    businessName: p.businessName || "Negocio sin nombre",
    email: p.email || null,
    phone: p.phone || null,
    website: p.website || null,
    recommendedService: (p.recommendedService as Prospect["recommendedService"]) || "web",
    potentialScore: Math.min(10, Math.max(1, p.potentialScore || 5)),
    subject: p.subject || `Propuesta para ${p.businessName}`,
    proposal: p.proposal || "",
    sourceUrl: p.website || "",
    sourceDomain: p.website ? new URL(p.website).hostname : "",
  }));
}

/**
 * Genera prospectos usando z-ai-web-dev-sdk (solo en sandbox Z.ai).
 */
async function generateWithZai(
  query: string,
  location: string,
  limit: number
): Promise<Prospect[]> {
  const ZAIModule = await import("z-ai-web-dev-sdk");
  const ZAI = ZAIModule.default;
  const zai = await ZAI.create();

  const searchResults = await zai.functions.invoke("web_search", {
    query: `${query} ${location} contacto email`,
    num: Math.min(limit * 2, 20),
  });

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    return [];
  }

  const prospects: Prospect[] = [];

  for (let i = 0; i < Math.min(searchResults.length, limit); i++) {
    const result = searchResults[i];

    try {
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content: `Sos un experto en marketing digital de Impulsala (agencia de web, SEO, Ads y automatización con IA en Bogotá). Analizá este negocio y generá una propuesta comercial personalizada en español colombiano.

Respondé SOLO JSON:
{
  "businessName": "string",
  "email": "string o null",
  "phone": "string o null",
  "website": "string o null",
  "recommendedService": "web"|"seo"|"ads"|"ia",
  "potentialScore": number 1-10,
  "subject": "string max 60 chars",
  "proposal": "string 3-4 párrafos"
}`,
          },
          {
            role: "user",
            content: `Título: ${result.name || "Sin título"}
URL: ${result.url}
Dominio: ${result.host_name}
Snippet: ${result.snippet || "Sin snippet"}
Ubicación: ${location}
Tipo de negocio: ${query}`,
          },
        ],
        thinking: { type: "disabled" },
      });

      const responseText = completion.choices[0]?.message?.content || "";

      let prospect;
      try {
        const cleanJson = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        prospect = JSON.parse(cleanJson);
      } catch {
        prospect = {
          businessName: result.name || result.host_name,
          email: null,
          phone: null,
          website: result.url,
          recommendedService: "web",
          potentialScore: 5,
          subject: `Propuesta para ${result.name || "tu negocio"}`,
          proposal: `Hola,\n\nTe contacto de Impulsala, agencia digital en Bogotá. Vi tu negocio en internet y me pareció interesante.\n\nNos especializamos en desarrollo web, SEO, campañas publicitarias y automatización con IA.\n\n¿Te gustaría agendar una videollamada gratuita de 30 minutos? Sin compromiso.\n\nSaludos,\nEquipo Impulsala`,
        };
      }

      prospects.push({
        businessName: prospect.businessName,
        email: prospect.email || null,
        phone: prospect.phone || null,
        website: prospect.website || result.url,
        recommendedService: prospect.recommendedService || "web",
        potentialScore: prospect.potentialScore || 5,
        subject: prospect.subject,
        proposal: prospect.proposal,
        sourceUrl: result.url,
        sourceDomain: result.host_name,
      });
    } catch (err) {
      console.log(`❌ Error en prospecto ${i}:`, err);
    }
  }

  return prospects;
}

/**
 * Genera prospectos usando la base de datos local (siempre funciona, sin API key).
 */
function generateWithTemplates(query: string, limit: number): Prospect[] {
  const templates = getProspectsByType(query, limit);

  return templates.map((t: ProspectTemplate): Prospect => {
    const { subject, proposal } = generateTemplateProposal(t, t.recommendedService);
    return {
      businessName: t.businessName,
      email: t.email,
      phone: t.phone,
      website: t.website,
      recommendedService: t.recommendedService,
      potentialScore: t.potentialScore,
      subject,
      proposal,
      sourceUrl: t.website || `https://${t.sourceDomain}`,
      sourceDomain: t.sourceDomain,
    };
  });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const { query, location = "Bogotá, Colombia", limit = 10 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query requerido" }, { status: 400 });
    }

    const maxLimit = Math.min(limit, 15);

    let prospects: Prospect[] = [];
    let provider = "template";

    // 1. Intentar con Google Gemini si hay API key
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log(`🤖 [PROSPECCION] Usando Google Gemini...`);
        prospects = await generateWithGemini(query, location, maxLimit);
        provider = "gemini";
      } catch (err: any) {
        console.log(`⚠️ [PROSPECCION] Gemini falló: ${err.message}. Usando templates.`);
        prospects = generateWithTemplates(query, maxLimit);
        provider = "template-fallback";
      }
    } else {
      // 2. Intentar con Z.ai SDK (sandbox)
      try {
        console.log(`🔍 [PROSPECCION] Probando Z.ai SDK...`);
        prospects = await generateWithZai(query, location, maxLimit);
        if (prospects.length > 0) provider = "zai";
        else {
          prospects = generateWithTemplates(query, maxLimit);
          provider = "template-fallback";
        }
      } catch (err: any) {
        console.log(`⚠️ [PROSPECCION] Z.ai no disponible: ${err.message}. Usando templates.`);
        prospects = generateWithTemplates(query, maxLimit);
        provider = "template";
      }
    }

    console.log(`✅ [PROSPECCION] ${prospects.length} prospectos vía ${provider}`);

    return NextResponse.json({
      prospects,
      total: prospects.length,
      query,
      location,
      provider,
    });
  } catch (error: any) {
    console.error("❌ [PROSPECCION] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error en prospección" },
      { status: 500 }
    );
  }
}
