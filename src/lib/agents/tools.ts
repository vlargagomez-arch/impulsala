/**
 * Herramientas (function calling) que los agentes de Impulsala pueden ejecutar
 * sobre la base de datos, el correo y el calendario.
 *
 * Todas devuelven un objeto serializable: el agente lo lee y responde al usuario.
 */

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email-sender";
import { chatCompletion, type ToolSchema } from "./deepseek";
import { BUSINESS } from "./knowledge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,20}$/;
const COT_OFFSET_MS = -5 * 60 * 60 * 1000;
export const TEAM_EMAIL = process.env.CRM_ADMIN_EMAIL || process.env.EMAIL_USER || BUSINESS.email;

export const AGENT_TOOLS: ToolSchema[] = [
  {
    type: "function",
    function: {
      name: "ver_horarios_disponibles",
      description:
        "Consulta los horarios libres reales para la videollamada de diagnóstico. Úsala antes de proponer fechas al prospecto.",
      parameters: {
        type: "object",
        properties: {
          dias: { type: "number", description: "Cuántos días hacia adelante revisar (1-21). Default 7." },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "guardar_lead",
      description:
        "Guarda o actualiza el prospecto en el CRM. Llámala en cuanto tengas al menos nombre y una forma de contacto. Es tu objetivo principal si la persona no agenda todavía.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string", description: "Nombre completo o como se presentó" },
          telefono: { type: "string", description: "WhatsApp del prospecto, con indicativo si lo sabes" },
          email: { type: "string", description: "Correo electrónico" },
          tiene_negocio: {
            type: "string",
            description: "Sí, tengo un negocio | Soy emprendedor | Trabajo en una empresa | Aún no tengo negocio",
          },
          interes: { type: "string", description: "Qué servicio o problema describió, en una frase" },
          presupuesto_estimado: { type: "number", description: "Valor potencial en COP si lo mencionó" },
        },
        required: ["nombre"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "agendar_cita",
      description:
        "Agenda la videollamada de 30 minutos (crea la cita real, evento en Google Calendar con Meet y envía los correos). Solo cuando el prospecto confirmó fecha y hora y diste sus datos completos.",
      parameters: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          email: { type: "string" },
          telefono: { type: "string" },
          negocio: { type: "string", description: "Nombre del negocio o a qué se dedica" },
          tiene_web: { type: "string", enum: ["si", "no"], description: "¿Ya tiene sitio web?" },
          fecha_iso: { type: "string", description: "Fecha y hora ISO 8601 en UTC, ej: 2026-05-14T15:00:00.000Z" },
          notas: { type: "string", description: "Contexto útil para el equipo" },
        },
        required: ["nombre", "email", "telefono", "negocio", "tiene_web", "fecha_iso"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "escalar_a_humano",
      description:
        "Devuelve el enlace de WhatsApp del equipo humano. Úsala cuando el prospecto lo pida o cuando la conversación se salga de tu alcance.",
      parameters: {
        type: "object",
        properties: {
          motivo: { type: "string", description: "Por qué escalas la conversación" },
        },
        required: ["motivo"],
      },
    },
  },
];

type ToolArgs = Record<string, unknown>;

function str(args: ToolArgs, key: string): string {
  const v = args[key];
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

/** Horarios libres reales (lun-vie 8:00-18:00 COT, 30 min, sin solapamiento). */
export async function availableSlots(days = 7): Promise<{ iso: string; humano: string }[]> {
  const total = Math.min(21, Math.max(1, days));
  const nowCot = Date.now() + COT_OFFSET_MS;
  const minStart = nowCot + 2 * 60 * 60 * 1000; // al menos 2h en el futuro

  const candidates: number[] = [];
  for (let d = 0; d < total; d++) {
    const day = new Date(nowCot);
    day.setUTCDate(day.getUTCDate() + d);
    day.setUTCHours(0, 0, 0, 0);
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    for (let h = 8; h < 18; h++) {
      for (const m of [0, 30]) {
        const start = new Date(day);
        start.setUTCHours(h, m, 0, 0);
        if (start.getTime() < minStart) continue;
        candidates.push(start.getTime() - COT_OFFSET_MS);
      }
    }
  }
  if (!candidates.length) return [];

  const existing = await db.appointment.findMany({
    where: {
      status: "confirmed",
      scheduledAt: {
        gte: new Date(Math.min(...candidates) - 60 * 60 * 1000),
        lte: new Date(Math.max(...candidates) + 60 * 60 * 1000),
      },
    },
    select: { scheduledAt: true },
  });
  const busy = new Set(existing.map((a) => a.scheduledAt.getTime()));

  const fmt = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return candidates
    .filter((t) => !busy.has(t))
    .slice(0, 24)
    .map((t) => ({ iso: new Date(t).toISOString(), humano: fmt.format(new Date(t)) }));
}

async function notifyTeam(subject: string, html: string, text: string) {
  try {
    await sendEmail({ to: TEAM_EMAIL, subject, html, text, replyTo: TEAM_EMAIL });
    return true;
  } catch (err) {
    console.error("[agentes] No se pudo notificar al equipo:", err);
    return false;
  }
}

export type ToolContext = { source?: string; conversationId?: string };

export async function runTool(name: string, rawArgs: string, ctx: ToolContext = {}): Promise<unknown> {
  try {
    return await runToolInner(name, rawArgs, ctx);
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : String(err);
    console.error(`[agentes] herramienta ${name} falló:`, mensaje);

    // Plan B: si la base de datos no responde, el contacto no se pierde: llega por correo al equipo.
    if (name === "guardar_lead" || name === "agendar_cita") {
      try {
        const args = rawArgs ? (JSON.parse(rawArgs) as Record<string, unknown>) : {};
        const cuerpo = Object.entries(args)
          .map(([k, v]) => `<p><strong>${k}:</strong> ${String(v)}</p>`)
          .join("");
        await sendEmail({
          to: TEAM_EMAIL,
          subject: `🚨 Lead del chat (base de datos caída): ${String(args.nombre || args.name || "contacto sin nombre")}`,
          html: `<h2>Contacto capturado por el agente IA</h2>${cuerpo}
            <p><em>La base de datos no respondió, así que este contacto se envía por correo para que lo contactes por WhatsApp.</em></p>`,
          text: `Lead del chat: ${JSON.stringify(args)}`,
          replyTo: TEAM_EMAIL,
        });
      } catch (mailErr) {
        console.error("[agentes] tampoco se pudo enviar el correo de respaldo:", mailErr);
      }
    }

    return {
      ok: false,
      error: "El sistema interno no respondió en este momento.",
      instruccion:
        "Discúlpate breve y comparte el WhatsApp del equipo humano (+57 319 635 4992) para que un asesor lo atienda ya. No intentes la misma herramienta otra vez en esta conversación.",
    };
  }
}

async function runToolInner(name: string, rawArgs: string, ctx: ToolContext = {}): Promise<unknown> {
  let args: ToolArgs = {};
  try {
    args = rawArgs ? (JSON.parse(rawArgs) as ToolArgs) : {};
  } catch {
    return { ok: false, error: "Argumentos inválidos (JSON malformado). Reintenta con JSON válido." };
  }

  switch (name) {
    case "ver_horarios_disponibles": {
      const dias = Number(args.dias) || 7;
      const slots = await availableSlots(dias);
      if (!slots.length) {
        return { ok: true, slots: [], nota: "No hay horarios libres en ese rango. Ofrece el WhatsApp del equipo." };
      }
      return { ok: true, timezone: "America/Bogota", slots: slots.slice(0, 8) };
    }

    case "guardar_lead": {
      const nombre = str(args, "nombre");
      if (nombre.length < 2) return { ok: false, error: "Falta el nombre del prospecto." };

      const email = str(args, "email").toLowerCase();
      const telefono = str(args, "telefono");
      const tieneNegocio = str(args, "tiene_negocio") || "Por definir en la llamada";
      const interes = str(args, "interes");
      const presupuesto = Number(args.presupuesto_estimado) || 0;

      if (email && !EMAIL_RE.test(email)) return { ok: false, error: "El email no parece válido, confírmalo con el prospecto." };
      if (telefono && !PHONE_RE.test(telefono)) return { ok: false, error: "El teléfono no parece válido, confírmalo con el prospecto." };
      if (!email && !telefono) {
        return { ok: false, error: "Necesito al menos un teléfono/WhatsApp o un correo para guardar el contacto." };
      }

      const existing = email || telefono
        ? await db.bookingLead.findFirst({
            where: { OR: [...(email ? [{ email }] : []), ...(telefono ? [{ phone: telefono }] : [])] },
            orderBy: { createdAt: "desc" },
          })
        : null;

      const notas = [interes && `Interés: ${interes}`, ctx.conversationId && `Conversación: ${ctx.conversationId}`]
        .filter(Boolean)
        .join(" | ");

      const lead = existing
        ? await db.bookingLead.update({
            where: { id: existing.id },
            data: {
              name: nombre,
              email: email || existing.email,
              phone: telefono || existing.phone,
              hasBusiness: tieneNegocio,
              estimatedValue: presupuesto || existing.estimatedValue,
              notes: [existing.notes, notas].filter(Boolean).join(" | ") || null,
            },
          })
        : await db.bookingLead.create({
            data: {
              name: nombre,
              email: email || `sin-correo+${Date.now()}@impulsala.com`,
              phone: telefono || "Sin teléfono",
              hasBusiness: tieneNegocio,
              source: ctx.source || "ai-agent",
              status: "new",
              estimatedValue: presupuesto,
              notes: notas || null,
            },
          });

      await db.leadNote.create({
        data: {
          leadId: lead.id,
          content: `🤖 Agente IA (${ctx.source || "ai-agent"}): ${interes || "contacto capturado en el chat"}${telefono ? ` · WhatsApp ${telefono}` : ""}`,
        },
      });

      await notifyTeam(
        `🔥 Nuevo lead del agente IA: ${nombre}`,
        `<h2>Nuevo lead capturado por el agente IA</h2>
         <p><strong>Nombre:</strong> ${nombre}</p>
         <p><strong>WhatsApp:</strong> ${telefono || "no indicado"}</p>
         <p><strong>Email:</strong> ${email || "no indicado"}</p>
         <p><strong>Perfil:</strong> ${tieneNegocio}</p>
         <p><strong>Interés:</strong> ${interes || "no especificado"}</p>
         <p>Revísalo en el CRM: https://impulsala.vercel.app/crm/leads</p>`,
        `Nuevo lead: ${nombre} · ${telefono || email} · ${interes || ""}`,
      );

      return {
        ok: true,
        leadId: lead.id,
        actualizado: Boolean(existing),
        mensaje: "Contacto guardado en el CRM y notificado al equipo.",
      };
    }

    case "agendar_cita": {
      const { POST } = await import("@/app/api/appointments/route");
      const payload = {
        name: str(args, "nombre"),
        business: str(args, "negocio") || str(args, "nombre"),
        hasWebsite: (str(args, "tiene_web") || "no").toLowerCase().startsWith("s") ? "si" : "no",
        email: str(args, "email").toLowerCase(),
        phone: str(args, "telefono"),
        scheduledAt: str(args, "fecha_iso"),
        notes: str(args, "notas") || "Cita agendada por el agente IA de la web",
        source: ctx.source || "ai-agent",
      };

      const req = new NextRequest("https://impulsala.vercel.app/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const data = (await res.json()) as { ok?: boolean; error?: string; meetLink?: string; scheduledAt?: string };

      if (!res.ok || !data.ok) {
        return {
          ok: false,
          error: data.error || "No se pudo agendar la cita",
          sugerencia: "Ofrece otro horario de los disponibles o pídele confirmar el correo/teléfono.",
        };
      }

      await runTool(
        "guardar_lead",
        JSON.stringify({
          nombre: payload.name,
          email: payload.email,
          telefono: payload.phone,
          tiene_negocio: "Agendó videollamada",
          interes: payload.notes,
        }),
        ctx,
      );

      return {
        ok: true,
        cita: data.scheduledAt,
        meetLink: data.meetLink,
        mensaje: "Cita creada, correos enviados y evento en Google Calendar con Meet.",
      };
    }

    case "escalar_a_humano": {
      const motivo = str(args, "motivo") || "El prospecto pidió hablar con una persona";
      await notifyTeam(
        `📞 Escalado a humano: ${motivo}`,
        `<p>El agente IA pidió refuerzo humano: <strong>${motivo}</strong></p>`,
        `Escalado a humano: ${motivo}`,
      );
      return {
        ok: true,
        whatsapp: BUSINESS.whatsappHumano,
        telefono: `+${BUSINESS.whatsapp}`,
        mensaje: "Comparte el WhatsApp del equipo en tu respuesta.",
      };
    }

    default:
      return { ok: false, error: `Herramienta desconocida: ${name}` };
  }
}

/** Extrae los parámetros de negocio de un texto libre (usado por agentes internos). */
export async function extractLeadFromText(text: string): Promise<{ nombre?: string; email?: string; telefono?: string }> {
  const raw = await chatCompletion({
    messages: [
      { role: "system", content: "Extrae datos de contacto. Responde SOLO JSON: {\"nombre\":\"\",\"email\":\"\",\"telefono\":\"\"}" },
      { role: "user", content: text },
    ],
    temperature: 0,
    jsonMode: true,
    maxTokens: 200,
  });
  try {
    return JSON.parse(raw.message.content || "{}");
  } catch {
    return {};
  }
}
