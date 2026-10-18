import { NextRequest, NextResponse } from "next/server";
import { hasDeepSeekKey } from "@/lib/agents/deepseek";
import { runTaskSafe, TAREAS, type Tarea } from "@/lib/agents/tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Autopiloto de Impulsala. Un solo endpoint para los cron jobs de Vercel.
 *   /api/agents/cron?task=blog      → publica un artículo SEO nuevo
 *   /api/agents/cron?task=followup  → seguimiento a leads nuevos (los lunes también el reporte)
 *   /api/agents/cron?task=report    → reporte ejecutivo al instante
 * Protegido con CRON_SECRET (Vercel lo envía como Bearer automáticamente).
 * La lógica vive en src/lib/agents/tasks.ts.
 */

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const provided = req.nextUrl.searchParams.get("secret") || "";
  const autorizado = Boolean(secret) && (auth === `Bearer ${secret}` || provided === secret);
  if (!autorizado) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!hasDeepSeekKey()) return NextResponse.json({ error: "Falta DEEPSEEK_API_KEY" }, { status: 500 });

  const task = (req.nextUrl.searchParams.get("task") || "followup") as Tarea;
  if (!TAREAS.includes(task)) return NextResponse.json({ error: `Tarea desconocida: ${task}` }, { status: 400 });

  const outcome = await runTaskSafe(task, { conReporte: new Date().getUTCDay() === 1 });
  if (!outcome.ok) {
    return NextResponse.json({ ok: false, task, error: outcome.error, ms: outcome.ms }, { status: 500 });
  }
  return NextResponse.json({ ...outcome.result, ms: outcome.ms });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
