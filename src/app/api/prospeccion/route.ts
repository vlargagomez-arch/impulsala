import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import {
  getProspectsByType,
  generateTemplateProposal,
  type ProspectTemplate,
} from "@/lib/prospect-db";

/**
 * POST /api/prospeccion
 * Body: { query: string, location?: string, limit?: number, focusFlaws?: boolean }
 *
 * Estrategia:
 * 1. Si hay DEEPSEEK_API_KEY, usa DeepSeek (barato, compatible con OpenAI)
 * 2. Si hay GEMINI_API_KEY, usa Google Gemini (gratis, 15 req/min)
 * 3. Si hay Z.ai SDK disponible (sandbox Z.ai), lo usa
 * 4. SINO, usa prospectos pre-generados de Bogotá (siempre funciona)
 *
 * Si focusFlaws=true, busca negocios con falencias (sin web, sin email, etc.)
 *
 * Response: { prospects: Prospect[], provider: string }
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
  snippet?: string;
};

/**
 * Genera prospectos usando DeepSeek API (barato, compatible con OpenAI).
 */
async function generateWithDeepSeek(
  query: string,
  location: string,
  limit: number,
  focusFlaws: boolean
): Promise<Prospect[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not configured");
  }

  const flawsInstruction = focusFlaws
    ? `IMPORTANTE: Buscá negocios que TENGAN FALLENCIAS digitales, como:
- No tienen página web (o tienen una web muy mala)
- No aparecen en Google cuando los buscan
- No tienen email de contacto visible
- Su web es lenta o no se ve en móvil
- No usan WhatsApp Business
- No tienen reservas online
- No publican en redes sociales

Priorizá negocios con estos problemas, porque son los que más necesitan los servicios de Impulsala.`
    : `Buscá negocios reales que existan en ${location}.`;

  const prompt = `Sos un experto en prospección B2B en Colombia. Generá ${limit} prospectos reales de "${query}" en ${location}.

${flawsInstruction}

Para cada prospecto devolvé:
- businessName: nombre real del negocio (negocios conocidos que existan en ${location})
- email: email si lo conocés (sino null)
- phone: teléfono si lo conocés (sino null)
- website: URL del sitio web si lo tiene (sino null)
- recommendedService: "web" | "seo" | "ads" | "ia" (qué servicio de Impulsala le conviene más)
- potentialScore: número 1-10 (qué tan buen prospecto es, 10 = muy urgente)
- subject: asunto de email máx 60 caracteres
- proposal: propuesta personalizada 3 párrafos en español colombiano, profesional pero cercana. Mencioná la falencia detectada si aplica.
- snippet: descripción breve del negocio y su situación digital

Impulsala es una agencia digital en Bogotá que hace: desarrollo web, SEO, campañas publicitarias (Google/Meta Ads), y automatización con IA. WhatsApp: 319 635 4992. Web: https://impulsala.vercel.app

Respondé SOLO un JSON válido con esta estructura (sin markdown, sin texto adicional):
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

  // DeepSeek API es compatible con OpenAI
  const url = "https://api.deepseek.com/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "Sos un asistente experto en prospección B2B en Colombia. Respondés SIEMPRE en formato JSON válido, sin markdown ni texto adicional.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";

  // Limpiar markdown si existe (DeepSeek a veces lo envuelve)
  const cleanJson = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    throw new Error(`DeepSeek: respuesta inválida: ${text.slice(0, 200)}`);
  }

  if (!parsed.prospects || !Array.isArray(parsed.prospects)) {
    throw new Error("DeepSeek: formato inválido");
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
    sourceDomain: p.website ? new URL(p.website).hostname.replace(/^www\./, "") : "",
    snippet: p.snippet || "",
  }));
}

/**
 * Genera prospectos usando Google Gemini API (gratis, 15 req/min).
 */
async function generateWithGemini(
  query: string,
  location: string,
  limit: number,
  focusFlaws: boolean
): Promise<Prospect[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const flawsInstruction = focusFlaws
    ? `IMPORTANTE: Buscá negocios que TENGAN FALLENCIAS digitales: sin web, sin email, web mala, no aparecen en Google, no usan WhatsApp Business, sin reservas online.`
    : `Buscá negocios reales que existan en ${location}.`;

  const prompt = `Sos un experto en prospección B2B en Colombia. Generá ${limit} prospectos reales de "${query}" en ${location}.

${flawsInstruction}

Para cada prospecto devolvé: businessName, email (o null), phone (o null), website (o null), recommendedService ("web"|"seo"|"ads"|"ia"), potentialScore (1-10), subject (max 60 chars), proposal (3 párrafos español colombiano), snippet (descripción breve).

Impulsala es agencia digital en Bogotá: web, SEO, Ads, IA. WhatsApp: 319 635 4992. Web: https://impulsala.vercel.app

Respondé SOLO JSON: {"prospects": [...]}`;

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

  const cleanJson = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed = JSON.parse(cleanJson);

  if (!parsed.prospects || !Array.isArray(parsed.prospects)) {
    throw new Error("Gemini: formato inválido");
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
    sourceDomain: p.website ? new URL(p.website).hostname.replace(/^www\./, "") : "",
    snippet: p.snippet || "",
  }));
}

/**
 * Genera prospectos usando z-ai-web-dev-sdk (solo en sandbox Z.ai).
 */
async function generateWithZai(
  query: string,
  location: string,
  limit: number,
  focusFlaws: boolean
): Promise<Prospect[]> {
  const ZAIModule = await import("z-ai-web-dev-sdk");
  const ZAI = ZAIModule.default;
  const zai = await ZAI.create();

  const searchQuery = focusFlaws
    ? `${query} ${location} sin web contacto teléfono`
    : `${query} ${location} contacto email`;

  const searchResults = await zai.functions.invoke("web_search", {
    query: searchQuery,
    num: Math.min(limit * 2, 20),
  });

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    return [];
  }

  const prospects: Prospect[] = [];

  for (let i = 0; i < Math.min(searchResults.length, limit); i++) {
    const result = searchResults[i];

    try {
      const flawsInstruction = focusFlaws
        ? `Si el negocio no tiene web visible o tiene falencias digitales, mencionalo en la propuesta y recomendá el servicio de desarrollo web.`
        : ``;

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content: `Sos un experto en marketing digital de Impulsala (agencia de web, SEO, Ads y automatización con IA en Bogotá). Analizá este negocio y generá una propuesta comercial personalizada en español colombiano.

${flawsInstruction}

Respondé SOLO JSON:
{
  "businessName": "string",
  "email": "string o null",
  "phone": "string o null",
  "website": "string o null",
  "recommendedService": "web"|"seo"|"ads"|"ia",
  "potentialScore": number 1-10,
  "subject": "string max 60 chars",
  "proposal": "string 3-4 párrafos",
  "snippet": "string"
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
          snippet: result.snippet || "",
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
        snippet: prospect.snippet || result.snippet || "",
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
function generateWithTemplates(query: string, limit: number, focusFlaws: boolean): Prospect[] {
  const templates = getProspectsByType(query, limit);

  // Si focusFlaws=true, priorizar los que NO tienen email o web
  let filtered = templates;
  if (focusFlaws) {
    const withFlaws = templates.filter((t) => !t.email || !t.website);
    const withoutFlaws = templates.filter((t) => t.email && t.website);
    filtered = [...withFlaws, ...withoutFlaws].slice(0, limit);
  }

  return filtered.map((t: ProspectTemplate): Prospect => {
    const { subject, proposal } = generateTemplateProposal(t, t.recommendedService);
    // Si focusFlaws y no tiene web/email, ajustar el score y mensaje
    let finalProposal = proposal;
    let finalScore = t.potentialScore;
    if (focusFlaws) {
      if (!t.website) finalScore = Math.min(10, finalScore + 1);
      if (!t.email) finalScore = Math.min(10, finalScore + 1);
    }
    return {
      businessName: t.businessName,
      email: t.email,
      phone: t.phone,
      website: t.website,
      recommendedService: t.recommendedService,
      potentialScore: finalScore,
      subject,
      proposal: finalProposal,
      sourceUrl: t.website || `https://${t.sourceDomain}`,
      sourceDomain: t.sourceDomain,
      snippet: t.snippet,
    };
  });
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

    if (!query) {
      return NextResponse.json({ error: "Query requerido" }, { status: 400 });
    }

    const maxLimit = Math.min(limit, 15);

    let prospects: Prospect[] = [];
    let provider = "template";

    // 1. Intentar con DeepSeek si hay API key (preferido, barato y rápido)
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        console.log(`🤖 [PROSPECCION] Usando DeepSeek... (focusFlaws: ${focusFlaws})`);
        prospects = await generateWithDeepSeek(query, location, maxLimit, focusFlaws);
        provider = "deepseek";
      } catch (err: any) {
        console.log(`⚠️ [PROSPECCION] DeepSeek falló: ${err.message}. Probando siguiente...`);
        prospects = []; // Reset para probar siguiente
      }
    }

    // 2. Si DeepSeek falló o no está, intentar con Gemini
    if (prospects.length === 0 && process.env.GEMINI_API_KEY) {
      try {
        console.log(`🔍 [PROSPECCION] Usando Google Gemini...`);
        prospects = await generateWithGemini(query, location, maxLimit, focusFlaws);
        provider = "gemini";
      } catch (err: any) {
        console.log(`⚠️ [PROSPECCION] Gemini falló: ${err.message}. Probando siguiente...`);
        prospects = [];
      }
    }

    // 3. Si nada funcionó, intentar con Z.ai SDK (sandbox)
    if (prospects.length === 0) {
      try {
        console.log(`🔍 [PROSPECCION] Probando Z.ai SDK...`);
        prospects = await generateWithZai(query, location, maxLimit, focusFlaws);
        if (prospects.length > 0) provider = "zai";
      } catch (err: any) {
        console.log(`⚠️ [PROSPECCION] Z.ai no disponible: ${err.message}.`);
      }
    }

    // 4. Si nada funcionó, usar templates (siempre funciona)
    if (prospects.length === 0) {
      console.log(`📋 [PROSPECCION] Usando base de datos local...`);
      prospects = generateWithTemplates(query, maxLimit, focusFlaws);
      provider = focusFlaws ? "template-flaws" : "template";
    }

    console.log(`✅ [PROSPECCION] ${prospects.length} prospectos vía ${provider}`);

    return NextResponse.json({
      prospects,
      total: prospects.length,
      query,
      location,
      provider,
      focusFlaws,
    });
  } catch (error: any) {
    console.error("❌ [PROSPECCION] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error en prospección" },
      { status: 500 }
    );
  }
}

