import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { estadoAgentes, setAgenteEncendido } from "@/lib/agents/switches";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Interruptores de los agentes (on/off). El dueño decide cuándo trabaja cada uno.
 *   GET  /api/agents/switch                 → estado de todos
 *   POST /api/agents/switch {agent, enabled} → enciende o apaga uno
 * Protegido con la cookie de administrador.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  return NextResponse.json({ ok: true, agentes: await estadoAgentes() });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = (await req.json().catch(() => ({}))) as { agent?: string; enabled?: boolean };
  const agent = String(body?.agent || "");
  if (typeof body?.enabled !== "boolean") {
    return NextResponse.json({ error: "Falta 'enabled' (true/false)" }, { status: 400 });
  }

  try {
    const fila = await setAgenteEncendido(agent, body.enabled);
    return NextResponse.json({
      ok: true,
      agent: fila.agent,
      enabled: fila.enabled,
      mensaje: fila.enabled ? `${fila.agent}: ENCENDIDO` : `${fila.agent}: APAGADO`,
      agentes: await estadoAgentes(),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
