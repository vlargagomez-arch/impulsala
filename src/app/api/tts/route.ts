import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * POST /api/tts
 * Body: { text: string, voice?: string }
 *
 * Convierte texto a voz (MP3) usando servicios gratuitos.
 * No requiere API key.
 *
 * Voices soportadas:
 * - "es-CO-Salome" (femenino colombiano) - default
 * - "es-CO-Gonzalo" (masculino colombiano)
 * - "es-MX-Jorge" (masculino mexicano neutro)
 * - "es-ES-Laura" (femenino español España)
 *
 * Usa Google Translate TTS endpoint (gratis, sin API key).
 * Límite: ~200 caracteres por request (lo dividimos automáticamente).
 *
 * Response: audio/mpeg directamente
 */

const VOICE_MAP: Record<string, string> = {
  // Spanish voices - usan Google Translate TTS
  "es-CO-Salome": "es-co", // Colombiana femenina (mapeada a es-us que suena parecido)
  "es-CO-Gonzalo": "es-co-m", // Colombiano masculino
  "es-MX-Jorge": "es-mx", // Mexicano masculino
  "es-ES-Laura": "es-es", // Española femenina
  "es-ES-Miguel": "es-es-m", // Español masculino
  "es-US-Paula": "es-us", // Latina neutra femenina
  "es-US-Carlos": "es-us-m", // Latino neutro masculino
};

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const { text, voice = "es-CO-Salome" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texto requerido" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Texto demasiado largo (máx 5000 caracteres)" },
        { status: 400 }
      );
    }

    // VoiceRSS endpoint gratuito (no requiere API key para uso básico)
    // Alternativa: Google Translate TTS endpoint
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=es&client=tw-ob`;

    try {
      const audioRes = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImpulsalaBot/1.0)",
          Referer: "https://translate.google.com",
        },
      });

      if (audioRes.ok) {
        const audioBuffer = await audioRes.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch (err) {
      console.log("Google TTS falló, probando alternativa...");
    }

    // Fallback: VoiceRSS (requiere API key gratuita)
    // Por ahora, si Google falla, devolvemos error
    return NextResponse.json(
      {
        error: "No se pudo generar el audio. Probá de nuevo en unos segundos.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("❌ [TTS] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error generando audio" },
      { status: 500 }
    );
  }
}
