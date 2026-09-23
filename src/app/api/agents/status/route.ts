import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { hasDeepSeekKey } from "@/lib/agents/deepseek";
import { BUSINESS } from "@/lib/agents/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/agents/status
 * Panel del CRM: estado de la automatización + actividad de los agentes.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const hace7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [runs, logsRaw, leadsAgente, citasAgente, pendientes, articulos, totalLeads7] = await Promise.all([
    db.agentRun.findMany({ orderBy: { createdAt: "desc" }, take: 25 }).catch(() => []),
    db.agentLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 }).catch(() => []),
    db.bookingLead
      .findMany({ where: { source: { contains: "agent" } }, orderBy: { createdAt: "desc" }, take: 20 })
      .catch(() => []),
    db.appointment.findMany({ where: { notes: { contains: "ai-agent" } }, orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []),
    db.bookingLead.count({ where: { status: "new" } }).catch(() => 0),
    db.blogArticle.findMany({ select: { title: true, slug: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 6 }).catch(() => []),
    db.bookingLead.count({ where: { createdAt: { gte: hace7 } } }).catch(() => 0),
  ]);

  // Agrupa las conversaciones del agente de chat
  const conversaciones = new Map<string, { conversationId: string; updatedAt: Date; mensajes: number; muestra: string }>();
  for (const log of logsRaw) {
    const id = log.conversationId || "sin-id";
    const prev = conversaciones.get(id);
    if (!prev) {
      conversaciones.set(id, {
        conversationId: id,
        updatedAt: log.createdAt,
        mensajes: 1,
        muestra: log.content.slice(0, 180),
      });
    } else {
      prev.mensajes += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    estado: {
      motor: hasDeepSeekKey() ? "DeepSeek conectado" : "Falta DEEPSEEK_API_KEY",
      whatsapp: `+${BUSINESS.whatsapp}`,
      agentes: [
        { id: "chat", nombre: "Agente de ventas 24/7", detalle: "Atiende el chat de la web, califica y agenda citas", activo: hasDeepSeekKey() },
        { id: "blog", nombre: "Agente SEO", detalle: "Publica un artículo optimizado cada día", activo: hasDeepSeekKey() },
        { id: "followup", nombre: "Agente de seguimiento", detalle: "Escribe y envía correos a leads nuevos", activo: hasDeepSeekKey() },
        { id: "report", nombre: "Agente analista", detalle: "Reporte semanal con cifras y acciones (lunes)", activo: hasDeepSeekKey() },
      ],
    },
    metricas: {
      leads7d: totalLeads7,
      leadsSinContactar: pendientes,
      conversaciones: conversaciones.size,
      citasAgente: citasAgente.length,
      articulos: articulos.length,
    },
    runs,
    conversaciones: Array.from(conversaciones.values()).slice(0, 15),
    leadsAgente,
    citasAgente,
    articulos,
  });
}
