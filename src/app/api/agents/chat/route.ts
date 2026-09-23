import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hasDeepSeekKey, DeepSeekError } from "@/lib/agents/deepseek";
import { runAgent, toHistory } from "@/lib/agents/runner";
import { knowledgeDigest, GUARDRAILS, BUSINESS } from "@/lib/agents/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Turn = { role: "user" | "assistant"; content: string };

// Rate limit simple en memoria (por instancia). Suficiente contra abuso básico.
const HITS = new Map<string, number[]>();
const LIMIT_PER_HOUR = 40;

function limited(key: string): boolean {
  const now = Date.now();
  const prev = (HITS.get(key) || []).filter((t) => now - t < 60 * 60 * 1000);
  prev.push(now);
  HITS.set(key, prev);
  if (HITS.size > 5000) HITS.clear();
  return prev.length > LIMIT_PER_HOUR;
}

async function clientKey(req: NextRequest): Promise<string> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`impulsala-agent::${ip}`));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

function buildSystem(page?: string, context?: string): string {
  return `Eres "Impulsa", el asistente virtual de ${BUSINESS.nombre} (agencia de desarrollo web, SEO, publicidad y automatización con IA en ${BUSINESS.ciudad}).

CONOCIMIENTO OFICIAL (única fuente de verdad):
${knowledgeDigest()}

REGLAS:
- ${GUARDRAILS}

OBJETIVO COMERCIAL: entender qué necesita el prospecto, demostrar autoridad con datos reales, y cerrar una de dos acciones: (1) agendar la videollamada gratuita de 30 min con la herramienta agendar_cita, o (2) guardar su contacto con guardar_lead para que un asesor lo contacte.

CONTEXTO DEL VISITANTE: ${page ? `está viendo la página ${page}.` : "no sabemos desde qué página entró."}${context ? ` ${context}` : ""}
Si el visitante viene de una página de servicio, prioriza ese servicio en tus ejemplos.`;
}

export async function POST(req: NextRequest) {
  if (!hasDeepSeekKey()) {
    return NextResponse.json(
      { ok: false, reply: `Estoy en mantenimiento técnico. Escríbenos al WhatsApp +${BUSINESS.whatsapp} y te atendemos ya.`, error: "missing_key" },
      { status: 200 },
    );
  }

  let body: { message?: string; history?: Turn[]; page?: string; context?: string; conversationId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const message = (body.message || "").trim().slice(0, 1500);
  if (!message) return NextResponse.json({ ok: false, error: "Mensaje vacío" }, { status: 422 });

  const key = await clientKey(req);
  if (limited(key)) {
    return NextResponse.json({
      ok: true,
      reply: `Estamos atendiendo muchos mensajes ahora mismo. Para no hacerte esperar, escríbenos al WhatsApp +${BUSINESS.whatsapp} y un asesor te responde enseguida.`,
      limited: true,
    });
  }

  const conversationId = (body.conversationId || crypto.randomUUID()).slice(0, 60);
  const history = toHistory([...(body.history || []), { role: "user", content: message }]);

  try {
    const started = Date.now();
    const result = await runAgent({
      system: buildSystem(body.page, body.context),
      history,
      ctx: { source: "ai-agent", conversationId },
    });

    const reply = result.text || `Con gusto te ayudo. ¿Me cuentas un poco más de tu negocio?`;

    // Registro de la conversación + herramientas usadas (para el panel del CRM)
    try {
      await db.agentLog.createMany({
        data: [
          { conversationId, role: "user", content: message.slice(0, 2000) },
          { conversationId, role: "agent", content: reply.slice(0, 4000) },
        ],
      });
      if (result.steps.length) {
        await db.agentRun.create({
          data: {
            agent: "chat",
            status: "ok",
            summary: `Herramientas: ${result.steps.map((s) => s.tool).join(", ")}`,
            tokens: result.tokens,
            durationMs: Date.now() - started,
            meta: JSON.stringify(result.steps).slice(0, 8000),
          },
        });
      }
    } catch (logErr) {
      console.error("[agentes] log falló:", logErr);
    }

    return NextResponse.json({
      ok: true,
      reply,
      conversationId,
      tools: result.steps.map((s) => ({
        name: s.tool,
        ok: Boolean((s.result as { ok?: boolean } | undefined)?.ok),
      })),
      model: result.model,
    });
  } catch (err) {
    const status = err instanceof DeepSeekError ? err.status : 500;
    console.error("[agentes/chat]", err);
    return NextResponse.json(
      {
        ok: false,
        reply: `Se me cruzaron los cables un segundo. ¿Me repites la última idea? Si prefieres, escríbenos al WhatsApp +${BUSINESS.whatsapp}.`,
        error: err instanceof Error ? err.message : "error",
      },
      { status: status === 429 ? 200 : 200 },
    );
  }
}
