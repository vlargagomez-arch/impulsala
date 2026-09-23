import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { askOnce, hasDeepSeekKey } from "@/lib/agents/deepseek";
import { knowledgeDigest, BUSINESS } from "@/lib/agents/knowledge";
import { sendEmail } from "@/lib/email-sender";
import { TEAM_EMAIL } from "@/lib/agents/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Autopiloto de Impulsala. Un solo endpoint para los cron jobs de Vercel.
 *   /api/agents/cron?task=blog      → publica un artículo SEO nuevo
 *   /api/agents/cron?task=followup  → escribe y envía seguimiento a leads nuevos (y los lunes manda el reporte semanal)
 *   /api/agents/cron?task=report    → reporte ejecutivo al instante
 * Protegido con CRON_SECRET (Vercel lo envía como Bearer automáticamente).
 */

type TaskResult = { task: string; ok: boolean; detail: string; extra?: unknown };

async function logRun(agent: string, status: string, summary: string, durationMs: number, meta?: unknown) {
  try {
    await db.agentRun.create({
      data: {
        agent,
        status,
        summary: summary.slice(0, 900),
        durationMs,
        meta: meta ? JSON.stringify(meta).slice(0, 8000) : null,
      },
    });
  } catch (err) {
    console.error("[cron] no se pudo registrar la corrida:", err);
  }
}

/* ------------------------------- BLOG ---------------------------------- */

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

// Categorías válidas del blog (el render usa estas para los estilos y filtros).
const CATEGORIAS_BLOG = ["Desarrollo Web", "SEO", "Marketing Digital", "Automatización con IA", "Casos de Éxito"];

function normalizarCategoria(valor: string | undefined): string {
  if (!valor) return "Marketing Digital";
  const exacta = CATEGORIAS_BLOG.find((c) => c.toLowerCase() === valor.toLowerCase());
  if (exacta) return exacta;
  const parcial = CATEGORIAS_BLOG.find((c) => valor.toLowerCase().includes(c.toLowerCase().split(" ")[0]));
  return parcial || "Marketing Digital";
}

async function taskBlog(): Promise<TaskResult> {
  const existentes = await db.blogArticle.findMany({
    select: { title: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  const titulos = existentes.map((a) => `- ${a.title}`).join("\n") || "(todavía no hay artículos)";
  const categorias = Array.from(new Set(existentes.map((a) => a.category))).join(", ") || "Marketing Digital";

  const raw = await askOnce({
    system: `Eres el redactor SEO senior de ${BUSINESS.nombre}, agencia de ${BUSINESS.ciudad} que vende desarrollo web, SEO, publicidad digital y automatización con IA a pymes colombianas.

CONOCIMIENTO REAL DEL NEGOCIO (no inventes datos fuera de esto):
${knowledgeDigest()}

Escribes para dueños de pymes en Colombia y LATAM: lenguaje claro, ejemplos concretos, cero relleno corporativo, cero promesas falsas. Nada de cifras inventadas de estudios: si citas un dato, que sea verificable y común en el sector; si no lo puedes sostener, escribe el consejo sin cifra.`,
    user: `Escribe UN artículo de blog nuevo, útil y accionable, que un dueño de pyme pueda aplicar esta semana y que atraiga tráfico orgánico para Impulsala.

Temas YA publicados (evita repetirlos):
${titulos}

Categorías existentes (elige una o propone otra si encaja mejor): ${categorias}

Devuelve SOLO JSON con esta forma exacta:
{
  "title": "titular claro, máximo 65 caracteres, sin clickbait vacío",
  "excerpt": "resumen de 1-2 frases, máximo 160 caracteres",
  "category": "una categoría",
  "tags": "3 a 5 etiquetas separadas por coma",
  "imagePrompt": "prompt en inglés para generar la ilustración del artículo (estilo limpio, corporativo, sin texto)",
  "blocks": [
    {"type":"p","content":"párrafo de introducción que plantee el problema real"},
    {"type":"h2","content":"subtítulo"},
    {"type":"p","content":"desarrollo con ejemplo concreto de negocio colombiano"},
    {"type":"ul","items":["punto accionable 1","punto accionable 2","punto accionable 3"]},
    {"type":"h2","content":"subtítulo"},
    {"type":"stat","value":"3 semanas","label":"texto de apoyo de la cifra o plazo"},
    {"type":"quote","content":"frase de autoridad sobre el tema"},
    {"type":"h2","content":"Cómo te ayudamos en Impulsala"},
    {"type":"p","content":"cierre invitando a agendar el diagnóstico gratuito de 30 minutos (WhatsApp +57 319 635 4992)"}
  ]
}
Reglas: entre 6 y 12 bloques, cada párrafo de 40 a 90 palabras, español de Colombia, sin markdown dentro del texto, sin encabezados con "#".`,
    temperature: 0.8,
    jsonMode: true,
    maxTokens: 2600,
  });

  let parsed: {
    title?: string;
    excerpt?: string;
    category?: string;
    tags?: string;
    imagePrompt?: string;
    blocks?: unknown[];
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("El agente no devolvió JSON válido para el artículo");
  }

  if (!parsed.title || !parsed.blocks?.length) throw new Error("Artículo incompleto (sin título o sin bloques)");

  const slugBase = slugify(parsed.title);
  let slug = slugBase;
  for (let i = 2; await db.blogArticle.findUnique({ where: { slug } }); i++) slug = `${slugBase}-${i}`;

  const article = await db.blogArticle.create({
    data: {
      slug,
      title: parsed.title.slice(0, 120),
      excerpt: (parsed.excerpt || parsed.title).slice(0, 200),
      content: JSON.stringify(parsed.blocks),
      category: normalizarCategoria(parsed.category),
      tags: parsed.tags || "marketing digital, pymes",
      author: "Equipo Impulsala",
      imagePrompt: parsed.imagePrompt || null,
      published: true,
    },
  });

  const url = `https://impulsala.vercel.app/blog/${article.slug}`;
  await sendEmail({
    to: TEAM_EMAIL,
    subject: `📝 Nuevo artículo publicado por el agente IA: ${article.title}`,
    html: `<h2>El agente SEO acaba de publicar un artículo</h2>
      <p><strong>${article.title}</strong></p>
      <p>${article.excerpt}</p>
      <p>Categoría: ${article.category} · Tags: ${article.tags}</p>
      <p><a href="${url}">Ver el artículo en la web</a></p>`,
    text: `Nuevo artículo: ${article.title} → ${url}`,
    replyTo: TEAM_EMAIL,
  }).catch(() => null);

  return { task: "blog", ok: true, detail: `Artículo publicado: ${article.title}`, extra: { slug: article.slug, url } };
}

/* ----------------------------- SEGUIMIENTO ------------------------------ */

async function taskFollowup(): Promise<TaskResult> {
  const desde = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const leads = await db.bookingLead.findMany({
    where: { status: "new", createdAt: { lt: desde } },
    orderBy: { createdAt: "asc" },
    take: 8,
    include: { leadNotes: { orderBy: { createdAt: "desc" }, take: 2 } },
  });

  if (!leads.length) return { task: "followup", ok: true, detail: "No hay leads nuevos pendientes de seguimiento" };

  let enviados = 0;
  const detalle: string[] = [];

  for (const lead of leads) {
    if (!lead.email || lead.email.startsWith("sin-correo+")) {
      detalle.push(`${lead.name}: sin correo, requiere WhatsApp manual`);
      continue;
    }

    const contexto = [lead.notes, ...lead.leadNotes.map((n) => n.content)].filter(Boolean).join(" | ");

    const raw = await askOnce({
      system: `Eres el asesor comercial senior de ${BUSINESS.nombre} (${BUSINESS.ciudad}). Escribes correos de seguimiento cortos, humanos y sin sonar a plantilla. Español de Colombia, trato cercano, cero exageración.

CONOCIMIENTO DEL NEGOCIO:
${knowledgeDigest()}`,
      user: `Escribe el correo de seguimiento para este prospecto que dejó sus datos y todavía no agendó.

Datos:
- Nombre: ${lead.name}
- Perfil: ${lead.hasBusiness}
- Qué le interesa / notas: ${contexto || "no dejó detalles"}
- De dónde vino: ${lead.source}

Devuelve SOLO JSON:
{"subject":"asunto corto y personal, máximo 60 caracteres","body":"cuerpo del correo, máximo 130 palabras, 3 párrafos cortos, termina invitando a responder este correo o escribir al WhatsApp +57 319 635 4992 para la videollamada gratis de 30 minutos"}`,
      temperature: 0.7,
      jsonMode: true,
      maxTokens: 900,
    });

    let mail: { subject?: string; body?: string };
    try {
      mail = JSON.parse(raw);
    } catch {
      detalle.push(`${lead.name}: el texto generado no fue válido`);
      continue;
    }

    const html = `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;color:#1a1a1a">
      ${(mail.body || "")
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
        .join("")}
      <p style="margin-top:24px;font-size:14px;color:#666">
        ${BUSINESS.nombre} · ${BUSINESS.ciudad} · WhatsApp +${BUSINESS.whatsapp}<br/>
        <a href="${BUSINESS.whatsappHumano}">Agendar mi videollamada gratis</a>
      </p>
    </div>`;

    const res = await sendEmail({
      to: lead.email,
      subject: mail.subject || `Sobre tu proyecto, ${lead.name}`,
      html,
      text: mail.body || "",
      replyTo: TEAM_EMAIL,
    });

    if (res.success) {
      enviados++;
      detalle.push(`${lead.name}: correo enviado`);
      await db.bookingLead.update({ where: { id: lead.id }, data: { status: "contacted" } });
      await db.leadNote.create({
        data: { leadId: lead.id, author: "agente-ia", content: `📧 Seguimiento enviado por el agente IA: "${mail.subject}"` },
      });
      await db.followUp.create({
        data: {
          leadId: lead.id,
          scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          type: "call",
          notes: "Verificar si respondió al correo del agente IA",
        },
      });
    } else {
      detalle.push(`${lead.name}: fallo al enviar (${res.error || "error de correo"})`);
    }
  }

  return { task: "followup", ok: true, detail: `${enviados} correos de seguimiento enviados`, extra: detalle };
}

/* ------------------------------- REPORTE -------------------------------- */

async function taskReport(): Promise<TaskResult> {
  const ahora = Date.now();
  const hace7 = new Date(ahora - 7 * 24 * 60 * 60 * 1000);
  const hace14 = new Date(ahora - 14 * 24 * 60 * 60 * 1000);

  const [leads7, leads14, citas7, conversations, runs, articulos7] = await Promise.all([
    db.bookingLead.findMany({ where: { createdAt: { gte: hace7 } } }),
    db.bookingLead.count({ where: { createdAt: { gte: hace14, lt: hace7 } } }),
    db.appointment.findMany({ where: { createdAt: { gte: hace7 } } }),
    db.agentLog.count({ where: { role: "user", createdAt: { gte: hace7 } } }).catch(() => 0),
    db.agentRun.findMany({ where: { createdAt: { gte: hace7 } } }).catch(() => []),
    db.blogArticle.count({ where: { createdAt: { gte: hace7 } } }).catch(() => 0),
  ]);

  const porFuente: Record<string, number> = {};
  for (const l of leads7) porFuente[l.source] = (porFuente[l.source] || 0) + 1;
  const valorPipeline = leads7.reduce((s, l) => s + (l.estimatedValue || 0), 0);
  const convertidos = leads7.filter((l) => l.status === "converted").length;
  const variacion = leads14 ? Math.round(((leads7.length - leads14) / leads14) * 100) : null;

  const datos = `Últimos 7 días en Impulsala:
- Leads nuevos: ${leads7.length} (semana anterior: ${leads14}${variacion !== null ? `, variación ${variacion}%` : ""})
- Origen de los leads: ${JSON.stringify(porFuente)}
- Valor potencial del pipeline: $${valorPipeline.toLocaleString("es-CO")} COP
- Leads convertidos: ${convertidos}
- Citas agendadas: ${citas7.length}
- Conversaciones atendidas por el agente IA en la web: ${conversations}
- Acciones ejecutadas por los agentes: ${runs.length}
- Artículos publicados por el agente SEO: ${articulos7}`;

  const analisis = await askOnce({
    system: `Eres el analista de crecimiento de ${BUSINESS.nombre}. Escribes reportes ejecutivos directos para el dueño de la agencia: qué pasó, qué significa, qué hacer esta semana. Sin adornos, sin relleno, sin inventar datos que no estén en las cifras.`,
    user: `${datos}

Escribe el reporte en HTML simple (usa <h2>, <p>, <ul><li>, <strong>) con esta estructura:
1) Titular con lo más importante de la semana.
2) Cifras clave en una lista.
3) Lectura del negocio: 2 a 4 frases (por ejemplo qué canal trae mejores leads o si el volumen sube o baja).
4) 3 acciones concretas para esta semana, priorizadas.
5) Una alerta si algo está flojo (leads sin contactar, citas sin seguimiento, etc.).
Máximo 260 palabras. No uses markdown, solo HTML.`,
    temperature: 0.5,
    maxTokens: 1200,
  });

  await sendEmail({
    to: TEAM_EMAIL,
    subject: `📊 Reporte semanal de Impulsala — ${leads7.length} leads nuevos`,
    html: `<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.6;color:#1a1a1a;max-width:640px">${analisis}</div>`,
    text: analisis.replace(/<[^>]+>/g, " "),
    replyTo: TEAM_EMAIL,
  });

  return { task: "report", ok: true, detail: `Reporte enviado (${leads7.length} leads, ${citas7.length} citas)`, extra: { leads7: leads7.length } };
}

/* -------------------------------- ROUTER -------------------------------- */

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const provided = req.nextUrl.searchParams.get("secret") || "";
  const autorizado = Boolean(secret) && (auth === `Bearer ${secret}` || provided === secret);
  if (!autorizado) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!hasDeepSeekKey()) return NextResponse.json({ error: "Falta DEEPSEEK_API_KEY" }, { status: 500 });

  const task = req.nextUrl.searchParams.get("task") || "followup";
  const started = Date.now();

  try {
    let result: TaskResult;
    if (task === "blog") result = await taskBlog();
    else if (task === "followup") {
      result = await taskFollowup();
      if (new Date().getUTCDay() === 1) {
        const reporte = await taskReport();
        result = {
          task: "followup+report",
          ok: true,
          detail: `${result.detail}. ${reporte.detail}`,
          extra: { followup: result.extra, report: reporte },
        };
      }
    } else if (task === "report") result = await taskReport();
    else return NextResponse.json({ error: `Tarea desconocida: ${task}` }, { status: 400 });

    await logRun(task, "ok", result.detail, Date.now() - started, result.extra);
    return NextResponse.json({ ok: true, ...result, ms: Date.now() - started });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron]", task, err);
    await logRun(task, "error", message, Date.now() - started);
    return NextResponse.json({ ok: false, task, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
