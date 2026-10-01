import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { hasDeepSeekKey } from "@/lib/agents/deepseek";
import { runTaskSafe, TAREAS, type Tarea } from "@/lib/agents/tasks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Ejecuta una tarea de agente a mano desde el panel del CRM.
 *   POST /api/agents/run  { "task": "blog" | "followup" | "report" }
 * Protegido con la cookie de administrador (nexus-admin-session).
 * Registra la corrida en AgentRun igual que el cron.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  if (!hasDeepSeekKey()) {
    return NextResponse.json({ error: "Falta DEEPSEEK_API_KEY en el entorno" }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { task?: string; conReporte?: boolean };
  const task = String(body?.task || "");
  if (!TAREAS.includes(task as Tarea)) {
    return NextResponse.json({ error: `Tarea desconocida: ${task || "(vacía)"}` }, { status: 400 });
  }

  const outcome = await runTaskSafe(task as Tarea, { conReporte: body?.conReporte === true });
  if (!outcome.ok) {
    return NextResponse.json({ ok: false, task, error: outcome.error, ms: outcome.ms }, { status: 500 });
  }
  return NextResponse.json({ ...outcome.result, ms: outcome.ms });
}
