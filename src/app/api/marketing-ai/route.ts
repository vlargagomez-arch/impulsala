import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * POST /api/marketing-ai
 * Body: { message: string, context?: string }
 *
 * Chat con asistente IA de marketing de Impulsala.
 * Responde consultas de Hermes sobre:
 * - Estrategias de marketing digital
 * - Guiones para videos
 * - Copy para redes sociales
 * - Anuncios de Google/Meta Ads
 * - Email marketing
 * - SEO
 *
 * Usa DeepSeek (preferido) > Gemini > Z.ai > respuestas pre-cargadas
 */

const SYSTEM_PROMPT = `Sos "ImpulsalaBot Marketing", un experto en marketing digital senior con 15 años de experiencia.

Trabajás en Impulsala, agencia digital en Bogotá, Colombia. Especialista en:
- Desarrollo web profesional
- SEO y posicionamiento en Google
- Campañas publicitarias (Google Ads, Meta Ads, TikTok Ads)
- Automatización con IA (chatbots, agentes de venta, flujos automáticos)

Tu trabajo: asesorar a Hermes (el productor audiovisual) sobre:
1. Estrategias de marketing para Impulsala y sus clientes
2. Guiones para videos de TikTok, Reels, YouTube Shorts (estructura: hook, desarrollo, CTA)
3. Copy para redes sociales (Instagram, Facebook, LinkedIn, TikTok)
4. Anuncios de Google Ads (Search, Display, YouTube)
5. Anuncios de Meta Ads (Facebook, Instagram)
6. Email marketing (newsletters, secuencias, cold emails)
7. Estrategias SEO (keywords, contenido, linkbuilding)
8. Estrategias de automatización con IA

REGLAS:
- Respondé en español colombiano, profesional pero cercano
- Sé específico, no genérico. Mencioná números, métricas, ejemplos reales
- Cuando des un guion, estructurarlo así:
  HOOK (3s): [frase impactante]
  DESARROLLO (15-30s): [escenas con visual y voz en off]
  CTA (5s): [llamado a la acción]
- Cuando des copy de anuncios, incluir: título, descripción, CTA, hashtags
- Cuando des email, incluir: subject, preview text, body, CTA
- Mencioná servicios de Impulsala cuando sea relevante (web, SEO, Ads, IA)
- WhatsApp de contacto: 319 635 4992
- Web: https://impulsala.vercel.app
- No hables de precios específicos, decí "agenda videollamada gratis para cotización"

IMPORTANTE: Respondé con formato markdown cuando sea útil (headers, listas, **negritas**). Sé conciso pero completo.`;

const PRE_LOADED_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["hola", "buenas", "hey", "qué tal", "que tal"],
    response: `¡Hola Hermes! 👋 Soy ImpulsalaBot Marketing, tu asistente de marketing digital.

Puedo ayudarte con:

1. **Guiones para videos** — TikTok, Reels, YouTube Shorts (con hook, desarrollo y CTA)
2. **Copy para redes sociales** — Instagram, Facebook, LinkedIn, TikTok
3. **Anuncios** — Google Ads, Meta Ads (con título, descripción, CTA)
4. **Email marketing** — newsletters, cold emails, secuencias
5. **Estrategias SEO** — keywords, contenido, linkbuilding
6. **Estrategias de IA** — chatbots, automatización de procesos

¿En qué te puedo ayudar hoy? Decime qué necesitás y te lo genero.`,
  },
  {
    keywords: ["guion", "guion video", "video", "tiktok", "reel"],
    response: `🎬 **Estructura de guion para video (30s)**

**HOOK (0-3s):**
"Si tenés [tipo de negocio] y no aparecés en Google, estás perdiendo clientes todos los días. Te muestro cómo arreglarlo en 30 segundos."

**DESARROLLO (3-25s):**
- **Visual:** Persona mirando el celular con cara de frustración. Google search donde tu competencia aparece arriba y vos no.
- **Voz en off:** "Google procesa 8.5 billones de búsquedas al día. Si no aparecés, no existís."
- **Visual:** Transición a tu web nueva cargando instantáneamente. Cronómetro en pantalla.
- **Voz en off:** "En Impulsala creamos webs que cargan en menos de 2 segundos. Google lo premia con mejores posiciones."

**CTA (25-30s):**
- **Visual:** Logo Impulsala + botón "Agenda tu videollamada gratis"
- **Voz en off:** "Agenda tu videollamada gratuita de 30 minutos en impulsala.com o WhatsApp al 319 635 4992."

**Hashtags:** #MarketingDigital #Bogota #PYMES #Impulsala

¿Querés que lo adapte para un tipo de negocio específico (restaurante, inmobiliaria, gimnasio)?`,
  },
  {
    keywords: ["copy", "instagram", "facebook", "redes sociales", "post"],
    response: `📱 **Copy para Instagram/ Facebook**

**Opción 1 (educativo):**

¿Sabías que el 70% de los colombianos busca en Google antes de comprar? 📊

Si tu negocio no aparece, perdés clientes todos los días.

En Impulsala te posicionamos en los primeros resultados de Google con:
✅ Auditoría SEO gratis
✅ Optimización técnica
✅ Contenido optimizado
✅ Resultados en 3-6 meses

Agenda tu videollamada gratuita → link en bio
WhatsApp: 319 635 4992

#SEO #MarketingDigital #Bogota #PYMES #Impulsala #Google #Posicionamiento

---

**Opción 2 (testimonio):**

"Café Herencia duplicó sus ventas en 3 meses con Google Ads" ☕

Antes: café vacío entre semana.
Hoy: lleno de lunes a viernes.

¿Cómo lo hicimos? 🤔
→ Segmentación precisa por ubicación
→ Anuncios hiper-personalizados
→ Landing pages específicas
→ ROI de 320%

Si querés duplicar tus ventas con Ads, agendá una videollamada gratis → link en bio

#CasoDeExito #GoogleAds #MarketingDigital #Bogota #Impulsala

¿Querés que lo adapte para TikTok, LinkedIn o YouTube?`,
  },
  {
    keywords: ["anuncio", "google ads", "meta ads", "facebook ads", "ad"],
    response: `🎯 **Anuncios de Google Ads (Search)**

**Campaña: Búsqueda "agencia digital Bogotá"**

**Anuncio 1:**
- **Título 1:** Agencia Digital en Bogotá | Impulsala
- **Título 2:** Web + SEO + Ads + IA
- **Título 3:** Agenda Videollamada Gratis
- **Descripción 1:** Transformamos tu negocio con desarrollo web profesional, SEO avanzado y campañas publicitarias con ROI medible. PYMES en Bogotá y Colombia.
- **Descripción 2:** Resultados garantizados en 30 días o seguimos sin costo. Diagnóstico gratuito por videollamada. Sin compromiso.
- **CTA:** Agenda tu videollamada gratis

**Extensiones:**
- Sitelinks: Servicios, Casos de Éxito, Blog, Contacto
- Llamada: 319 635 4992
- Ubicación: Bogotá, Colombia

**Keywords:**
- agencia digital bogotá
- marketing digital bogotá
- desarrollo web bogotá
- seo bogotá
- google ads bogotá

---

**Para Meta Ads (Facebook/Instagram):**

**Creative:** Video de 15s mostrando transformación de negocio
**Copy:** "¿Tu negocio no aparece en Google? Estás perdiendo clientes todos los días. En Impulsala te posicionamos en los primeros resultados. Agenda videollamada gratis →"

¿Querés que arme una campaña completa con presupuesto y segmentación?`,
  },
  {
    keywords: ["email", "newsletter", "cold email", "mail"],
    response: `📧 **Email Marketing — Cold Email B2B**

**Subject:** Tu web carga en 2 segundos (y Google te premia)

**Preview text:** ¿Sabías que si tu web tarda +3s en cargar, perdés el 50% de tus clientes?

---

Hola [Nombre],

Te contacto de Impulsala, agencia digital en Bogotá. Estaba revisando tu web [dominio] y noté que tarda [X segundos] en cargar.

 Eso es un problema: Google penaliza las webs lentas, y tus clientes se van antes de ver tu contenido.

En Impulsala construimos webs que:
- Cargan en menos de 2 segundos
- Se ven perfectas en móvil
- Se posicionan en Google
- Convierten visitantes en clientes

Nuestros clientes ven resultados como:
- +180% conversión
- +340% ROI promedio
- -60% costo por lead

¿Te interesa agendar una videollamada gratuita de 30 minutos para revisar tu caso? Sin compromiso.

Agenda directa: https://impulsala.vercel.app
WhatsApp: 319 635 4992

Saludos,
Equipo Impulsala
Partner Estratégico Digital · Bogotá, Colombia

---

**Tips:**
- Personalizá [Nombre] y [dominio] antes de enviar
- Si sabés cuánto tarda su web, mencioná el número real (usá PageSpeed Insights)
- Seguimiento: si no responde en 3 días, mandá un reply corto

¿Querés que arme una secuencia de 3 emails?`,
  },
];

function getPreLoadedResponse(message: string): string | null {
  const lower = message.toLowerCase();
  for (const item of PRE_LOADED_RESPONSES) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.response;
    }
  }
  return null;
}

async function callDeepSeek(message: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not configured");

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek error: ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

async function callGemini(message: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${SYSTEM_PROMPT}\n\nUsuario: ${message}` }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini error: ${res.status}`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callZai(message: string): Promise<string> {
  const ZAIModule = await import("z-ai-web-dev-sdk");
  const ZAI = ZAIModule.default;
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    thinking: { type: "disabled" },
  });

  return completion.choices[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    let response = "";
    let provider = "pre-loaded";

    // 1. Intentar DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        console.log("🤖 [MARKETING-AI] Usando DeepSeek...");
        response = await callDeepSeek(message);
        provider = "deepseek";
      } catch (err: any) {
        console.log(`⚠️ DeepSeek falló: ${err.message}`);
      }
    }

    // 2. Intentar Gemini
    if (!response && process.env.GEMINI_API_KEY) {
      try {
        console.log("🔍 [MARKETING-AI] Usando Gemini...");
        response = await callGemini(message);
        provider = "gemini";
      } catch (err: any) {
        console.log(`⚠️ Gemini falló: ${err.message}`);
      }
    }

    // 3. Intentar Z.ai SDK
    if (!response) {
      try {
        console.log("🔍 [MARKETING-AI] Usando Z.ai...");
        response = await callZai(message);
        if (response) provider = "zai";
      } catch (err: any) {
        console.log(`⚠️ Z.ai no disponible: ${err.message}`);
      }
    }

    // 4. Fallback: respuestas pre-cargadas
    if (!response) {
      console.log("📋 [MARKETING-AI] Usando respuestas pre-cargadas...");
      response =
        getPreLoadedResponse(message) ||
        `Soy ImpulsalaBot Marketing. Para responder consultas en tiempo real necesito una API key de IA configurada (DeepSeek o Gemini).

Mientras tanto, te puedo ayudar con:

1. **Guiones para videos** — Decí "guion" o "video"
2. **Copy para redes** — Decí "copy" o "instagram"
3. **Anuncios** — Decí "anuncio" o "google ads"
4. **Email marketing** — Decí "email" o "newsletter"

¿Qué necesitás?`;
      provider = "pre-loaded";
    }

    return NextResponse.json({ response, provider });
  } catch (error: any) {
    console.error("❌ [MARKETING-AI] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error en asistente IA" },
      { status: 500 }
    );
  }
}
