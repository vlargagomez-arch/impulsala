import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Interruptores de los agentes: el dueño decide cuándo trabaja cada uno.
 * Viven en la tabla AgentSetting (por defecto: todos encendidos).
 */

export const AGENTES_CONMUTABLES = ["chat", "blog", "followup", "report", "daily", "prospect"] as const;
export type AgenteConmutable = (typeof AGENTES_CONMUTABLES)[number];

export const NOMBRE_AGENTE: Record<string, string> = {
  chat: "Agente de ventas (chat de la web)",
  blog: "Agente SEO (artículo diario)",
  followup: "Agente de seguimiento (correos a leads)",
  report: "Agente analista (reporte semanal)",
  daily: "Resumen diario por correo",
  prospect: "Buscador de clientes (prospectador)",
};

/** ¿Está encendido? Si la tabla no existe todavía, no bloqueamos nada. */
export async function agenteEncendido(agent: string): Promise<boolean> {
  try {
    const fila = await db.agentSetting.findUnique({ where: { agent } });
    return fila ? fila.enabled : true;
  } catch (err) {
    console.error("[switches] no pude leer AgentSetting:", (err as Error)?.message);
    return true;
  }
}

/** Lista con el estado de cada agente (los que no tienen fila van encendidos). */
export async function estadoAgentes(): Promise<{ agent: string; nombre: string; enabled: boolean; updatedAt: Date | null }[]> {
  let filas: { agent: string; enabled: boolean; updatedAt: Date }[] = [];
  try {
    filas = await db.agentSetting.findMany();
  } catch (err) {
    console.error("[switches] no pude listar AgentSetting:", (err as Error)?.message);
  }
  return AGENTES_CONMUTABLES.map((agent) => {
    const fila = filas.find((f) => f.agent === agent);
    return { agent, nombre: NOMBRE_AGENTE[agent] || agent, enabled: fila ? fila.enabled : true, updatedAt: fila?.updatedAt || null };
  });
}

/** Enciende/apaga un agente. */
export async function setAgenteEncendido(agent: string, enabled: boolean) {
  if (!AGENTES_CONMUTABLES.includes(agent as AgenteConmutable)) {
    throw new Error(`Agente desconocido: ${agent}`);
  }
  return db.agentSetting.upsert({
    where: { agent },
    create: { agent, enabled },
    update: { enabled },
  });
}

/** Respuesta lista para una ruta HTTP. */
export async function guardOffDe(agent: string): Promise<NextResponse | null> {
  const encendido = await agenteEncendido(agent);
  if (encendido) return null;
  return NextResponse.json(
    {
      ok: false,
      apagado: true,
      error: `${NOMBRE_AGENTE[agent] || agent} está APAGADO. Enciéndelo para que trabaje.`,
    },
    { status: 409 },
  );
}
