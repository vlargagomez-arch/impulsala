import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * POST /api/tts
 * Body: { text: string, voice?: string }
 *
 * Convierte texto a voz (MP3) usando Edge TTS de Microsoft.
 * Voces Neural - mucho más humanas que Google Translate.
 * 100% gratis, sin API key, sin límite.
 *
 * Voices soportadas (español):
 * - "es-CO-Salome" → es-CO-SalomeNeural (femenina colombiana)
 * - "es-CO-Gonzalo" → es-CO-GonzaloNeural (masculino colombiano)
 * - "es-MX-Dalia" → es-MX-DaliaNeural (femenina mexicana neutra)
 * - "es-MX-Jorge" → es-MX-JorgeNeural (masculino mexicano)
 * - "es-ES-Elvira" → es-ES-ElviraNeural (femenina española)
 * - "es-ES-Alvaro" → es-ES-AlvaroNeural (masculino español)
 * - "es-AR-Elena" → es-AR-ElenaNeural (femenina argentina)
 * - "es-AR-Tomas" → es-AR-TomasNeural (masculino argentino)
 *
 * Response: audio/mpeg directamente
 */

const VOICE_MAP: Record<string, string> = {
  "es-CO-Salome": "es-CO-SalomeNeural",
  "es-CO-Gonzalo": "es-CO-GonzaloNeural",
  "es-MX-Dalia": "es-MX-DaliaNeural",
  "es-MX-Jorge": "es-MX-JorgeNeural",
  "es-ES-Elvira": "es-ES-ElviraNeural",
  "es-ES-Alvaro": "es-ES-AlvaroNeural",
  "es-AR-Elena": "es-AR-ElenaNeural",
  "es-AR-Tomas": "es-AR-TomasNeural",
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

    const edgeVoice = VOICE_MAP[voice] || VOICE_MAP["es-CO-Salome"];

    // Usar edge-tts-universal dinámicamente (puede no estar disponible en Vercel)
    try {
      const edgeTtsModule: any = await import("edge-tts-universal");
      const EdgeTTS = edgeTtsModule.EdgeTTS || edgeTtsModule.UniversalEdgeTTS;

      // Constructor: new EdgeTTS(text, voice, options)
      const tts = new EdgeTTS(text, edgeVoice, {
        rate: 0,
        volume: 0,
        pitch: 0,
      });

      // synthesize() devuelve { audio: Blob, subtitle: [...] }
      const result = await tts.synthesize();

      if (!result?.audio) {
        throw new Error("No se recibió audio");
      }

      // Convertir Blob a ArrayBuffer
      const arrayBuffer = await result.audio.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": arrayBuffer.byteLength.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (edgeErr: any) {
      console.log("⚠️ Edge TTS no disponible, fallback a Google Translate TTS:", edgeErr.message);

      // Fallback: Google Translate TTS (calidad menor pero siempre funciona)
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text.slice(0, 200)
      )}&tl=es&client=tw-ob`;

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

      throw new Error("No se pudo generar audio ni con Edge ni con Google TTS");
    }
  } catch (error: any) {
    console.error("❌ [TTS] Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Error generando audio" },
      { status: 500 }
    );
  }
}
