import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import ZAI from "z-ai-web-dev-sdk";

/**
 * POST /api/prospeccion
 * Body: { query: string, location?: string, limit?: number }
 *
 * Usa z-ai-web-dev-sdk para:
 * 1. Buscar negocios en Google/web
 * 2. Extraer info de cada negocio (nombre, web, email si está visible)
 * 3. Generar propuesta personalizada con IA para cada uno
 *
 * Response: { prospects: Prospect[] }
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const { query, location = "Bogotá, Colombia", limit = 10 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query requerido" }, { status: 400 });
    }

    const zai = await ZAI.create();

    // 1. Buscar negocios en la web
    const searchQuery = `${query} ${location} contacto email`;
    console.log(`🔍 [PROSPECCION] Buscando: ${searchQuery}`);

    const searchResults = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: Math.min(limit * 2, 20), // Pedimos más de los que necesitamos por si algunos no tienen email
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return NextResponse.json({
        prospects: [],
        message: "No se encontraron negocios para esta búsqueda",
      });
    }

    // 2. Procesar cada resultado con IA para extraer info y generar propuesta
    const prospects: any[] = [];

    for (let i = 0; i < Math.min(searchResults.length, limit); i++) {
      const result = searchResults[i];
      console.log(`📧 [PROSPECCION] Procesando ${i + 1}/${limit}: ${result.name || result.host_name}`);

      try {
        // Generar análisis + propuesta con IA
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: "assistant",
              content: `Sos un experto en marketing digital de Impulsala (agencia de desarrollo web, SEO, Ads y automatización con IA en Bogotá, Colombia). Tu tarea es analizar un negocio encontrado en internet y generar una propuesta comercial personalizada.

INSTRUCCIONES:
1. Extraé el nombre del negocio
2. Extraé el email si está visible en el snippet (si no está, dejá null)
3. Extraé el teléfono si está visible (si no, null)
4. Analizá qué servicio de Impulsala le conviene más (web, SEO, Ads, IA)
5. Generá una propuesta personalizada de 3-4 párrafos, en español colombiano, profesional pero cercana. Mencioná:
   - Por qué les escribís
   - Qué notaste de su negocio (basado en el snippet)
   - Qué servicio de Impulsala les puede ayudar y por qué
   - CTA suave para agenda videollamada gratis de 30 min
6. Generá un subject para el email (máximo 60 caracteres)
7. Estimá un potencial score (1-10) basado en qué tan buen prospecto es

Respondé SOLO en formato JSON válido:
{
  "businessName": "string",
  "email": "string o null",
  "phone": "string o null",
  "website": "string o null",
  "recommendedService": "web" | "seo" | "ads" | "ia",
  "potentialScore": number (1-10),
  "subject": "string (max 60 chars)",
  "proposal": "string (3-4 párrafos)"
}`,
            },
            {
              role: "user",
              content: `BUSINESS INFO:
Título: ${result.name || "Sin título"}
URL: ${result.url}
Dominio: ${result.host_name}
Snippet: ${result.snippet || "Sin snippet"}
Ubicación de búsqueda: ${location}
Tipo de negocio buscado: ${query}

Generá la propuesta en JSON:`,
            },
          ],
          thinking: { type: "disabled" },
        });

        const responseText = completion.choices[0]?.message?.content || "";

        // Intentar parsear el JSON (la IA a veces lo envuelve en markdown)
        let prospect;
        try {
          // Quitar markdown si existe
          const cleanJson = responseText
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          prospect = JSON.parse(cleanJson);
        } catch (parseErr) {
          console.log(`⚠️ [PROSPECCION] No se pudo parsear JSON para ${result.name}`);
          // Fallback: crear prospect básico con la info que tenemos
          prospect = {
            businessName: result.name || result.host_name,
            email: null,
            phone: null,
            website: result.url,
            recommendedService: "web",
            potentialScore: 5,
            subject: `Propuesta Impulsala para ${result.name || "tu negocio"}`,
            proposal: `Hola,\n\nTe contacto de Impulsala, agencia digital en Bogotá. Vi tu negocio en internet y me pareció interesante.\n\nNos especializamos en desarrollo web, SEO, campañas publicitarias y automatización con IA para PYMES en Colombia.\n\n¿Te gustaría agendar una videollamada gratuita de 30 minutos para revisar tu caso? Sin compromiso.\n\nSaludos,\nEquipo Impulsala`,
          };
        }

        prospects.push({
          ...prospect,
          sourceUrl: result.url,
          sourceDomain: result.host_name,
        });
      } catch (err) {
        console.log(`❌ [PROSPECCION] Error procesando ${result.name}:`, err);
      }
    }

    console.log(`✅ [PROSPECCION] ${prospects.length} prospectos generados`);

    return NextResponse.json({
      prospects,
      total: prospects.length,
      query,
      location,
    });
  } catch (error: any) {
    console.error("❌ [PROSPECCION] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error en prospección" },
      { status: 500 }
    );
  }
}
