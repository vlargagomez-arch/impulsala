import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateMeetingLink } from "@/lib/meeting-link";
import { syncAppointmentToSheets, generateWhatsAppLink } from "@/lib/google-sheets";
import { createCalendarEvent } from "@/lib/google-calendar";

type Body = {
  name: string;
  business: string;
  hasWebsite: string;
  email: string;
  phone: string;
  scheduledAt: string; // ISO string
  notes?: string;
  source?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,20}$/;

/**
 * POST /api/appointments
 *
 * Crea una cita y automáticamente:
 * 1. La guarda en la base de datos
 * 2. Crea un evento en Google Calendar con Google Meet (si está configurado)
 * 3. Genera link de videollamada (Google Meet si Calendar configurado, sino Jitsi)
 * 4. Sincroniza a Google Sheets (si está configurado)
 * 5. Genera link de WhatsApp para recordatorios manuales
 */
export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, business, hasWebsite, email, phone, scheduledAt, notes, source } = body;

  // Validación
  if (!name || name.trim().length < 2)
    return NextResponse.json({ error: "Nombre inválido" }, { status: 422 });
  if (!business || business.trim().length < 2)
    return NextResponse.json({ error: "Negocio inválido" }, { status: 422 });
  if (!email || !EMAIL_RE.test(email))
    return NextResponse.json({ error: "Email inválido" }, { status: 422 });
  if (!phone || !PHONE_RE.test(phone))
    return NextResponse.json({ error: "Teléfono inválido" }, { status: 422 });
  if (!hasWebsite || !["si", "no"].includes(hasWebsite))
    return NextResponse.json({ error: "Indica si tienes web (si/no)" }, { status: 422 });

  const start = new Date(scheduledAt);
  if (Number.isNaN(start.getTime()))
    return NextResponse.json({ error: "Fecha inválida" }, { status: 422 });
  if (start.getTime() < Date.now() + 60 * 60 * 1000)
    return NextResponse.json({ error: "La cita debe ser al menos 1 hora en el futuro" }, { status: 422 });

  // Evitar doble reserva (overlap)
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const overlap = await db.appointment.findFirst({
    where: {
      status: "confirmed",
      scheduledAt: {
        gte: new Date(start.getTime() - 30 * 60 * 1000),
        lt: end,
      },
    },
  });
  if (overlap) {
    return NextResponse.json(
      { error: "Ese horario acaba de ser reservado. Por favor elige otro." },
      { status: 409 },
    );
  }

  // Crear la cita en BD
  const appointment = await db.appointment.create({
    data: {
      name: name.trim(),
      business: business.trim(),
      hasWebsite,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      scheduledAt: start,
      durationMin: 30,
      status: "confirmed",
      notes: notes?.trim() || null,
    },
  });

  // === PASO 1: Crear evento en Google Calendar + generar Meet link ===
  // Si Google Calendar está configurado, crea evento con Meet automático.
  // Si no está configurado, usa Jitsi Meet (fallback).
  let finalMeetUrl = "";
  let finalMeetProvider = "jitsi";
  let calendarEventId: string | undefined;
  let calendarHtmlLink: string | undefined;
  let calendarError: string | undefined;

  const calendarResult = await createCalendarEvent({
    appointmentId: appointment.id,
    name: appointment.name,
    business: appointment.business,
    email: appointment.email,
    phone: appointment.phone,
    scheduledAt: start,
    durationMin: appointment.durationMin,
  });

  if (calendarResult.success && calendarResult.meetLink) {
    // Google Calendar + Meet funcionó
    finalMeetUrl = calendarResult.meetLink;
    finalMeetProvider = "google-meet";
    calendarEventId = calendarResult.eventId;
    calendarHtmlLink = calendarResult.htmlLink;
    console.log(`✅ Evento creado en Google Calendar con Meet: ${finalMeetUrl}`);
  } else {
    // Fallback: usar Jitsi Meet
    const fallback = generateMeetingLink(appointment.id);
    finalMeetUrl = fallback.url;
    finalMeetProvider = fallback.provider;
    calendarError = calendarResult.error;
    console.log(`⚠️ Google Calendar no disponible, usando Jitsi: ${finalMeetUrl}`);
    if (calendarError) console.log(`   Error: ${calendarError}`);
  }

  // Guardar el link y calendar event ID en notas (append)
  const meetNote = `[${new Date().toISOString()}] Cita creada (source: ${source || "unknown"})
- Meet link: ${finalMeetUrl}
- Provider: ${finalMeetProvider}
- Calendar Event ID: ${calendarEventId || "N/A"}
- Calendar Link: ${calendarHtmlLink || "N/A"}
${calendarError ? `- Calendar Error: ${calendarError}` : ""}
`;

  await db.appointment.update({
    where: { id: appointment.id },
    data: {
      notes: appointment.notes
        ? `${appointment.notes}\n${meetNote}`
        : meetNote,
    },
  });

  // === PASO 2: Generar link de WhatsApp para recordatorios ===
  const whatsappLink = generateWhatsAppLink(
    appointment.phone,
    appointment.name,
    appointment.scheduledAt.toISOString(),
    finalMeetUrl
  );

  // === PASO 3: Sincronizar a Google Sheets (best-effort, no bloquea) ===
  const sheetsResult = await syncAppointmentToSheets({
    appointmentId: appointment.id,
    name: appointment.name,
    business: appointment.business,
    email: appointment.email,
    phone: appointment.phone,
    scheduledAt: appointment.scheduledAt.toISOString(),
    durationMin: appointment.durationMin,
    hasWebsite: appointment.hasWebsite,
    meetLink: finalMeetUrl,
    meetProvider: finalMeetProvider,
    whatsappLink,
    status: appointment.status,
    source: source || "unknown",
    createdAt: appointment.createdAt.toISOString(),
  });

  if (sheetsResult.synced) {
    console.log(`📊 Cita ${appointment.id} sincronizada a Google Sheets`);
  }

  return NextResponse.json({
    ok: true,
    id: appointment.id,
    scheduledAt: appointment.scheduledAt,
    meetLink: finalMeetUrl,
    meetProvider: finalMeetProvider,
    whatsappLink,
    calendarEventId,
    calendarHtmlLink,
    calendarSynced: calendarResult.success,
    sheetsSynced: sheetsResult.synced,
    calendarError: calendarError || undefined,
  });
}
