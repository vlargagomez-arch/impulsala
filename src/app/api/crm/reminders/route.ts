import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { formatPhoneForWhatsApp } from "@/lib/whatsapp";
import { sendEmail, generateAppointmentEmailHtml, getEmailStatus } from "@/lib/email-sender";
import { generateMeetingLink } from "@/lib/meeting-link";

// GET — listar citas próximas + estado del sistema de recordatorios
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "48h";

  const now = new Date();
  let until = new Date();
  if (range === "24h") until.setHours(until.getHours() + 24);
  else if (range === "48h") until.setHours(until.getHours() + 48);
  else if (range === "7d") until.setDate(until.getDate() + 7);
  else until = new Date("2099-01-01");

  const appointments = await db.appointment.findMany({
    where: { status: "confirmed", scheduledAt: { gte: now, lte: until } },
    orderBy: { scheduledAt: "asc" },
  });

  const emailStatus = getEmailStatus();

  return NextResponse.json({
    appointments,
    count: appointments.length,
    emailStatus,
  });
}

// POST — preparar o enviar recordatorio
// method=whatsapp → devuelve link wa.me (NO envía automáticamente, anti-spam)
// method=email    → envía email real vía Brevo/Gmail/SMTP
// method=email-preview → devuelve HTML para preview sin enviar
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = (await req.json()) as {
    appointmentId: string;
    method: "whatsapp" | "email" | "email-preview";
  };

  const { appointmentId, method } = body;

  if (!appointmentId || !method) {
    return NextResponse.json(
      { error: "appointmentId y method requeridos" },
      { status: 400 }
    );
  }

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  const fechaCita = new Date(appointment.scheduledAt).toLocaleString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

  // ===== WHATSAPP (manual, anti-spam) =====
  // NO se envía automáticamente. Solo se devuelve el link wa.me para que
  // el admin lo abra manualmente y personalice si lo desea.
  if (method === "whatsapp") {
    // Generar meet link para esta cita (si ya está en notes, se reutiliza)
    const meetLink = generateMeetingLink(appointment.id);

    // Mensaje humanizado con link de Meet
    const message = `Hola ${appointment.name}, soy Santiago de Impulsala.

Te escribo por tu cita agendada:
• Fecha: ${fechaCita}
• Duración: 30 minutos
• Videollamada: ${meetLink.url}

¿Confirmas que te viene bien este horario? Si necesitas reprogramar, avísame y coordinamos otra fecha.

Quedo atento,
Santiago
Impulsala · 319 635 4992`;

    const phone = formatPhoneForWhatsApp(appointment.phone);
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Guardar tracking en notes (append, no overwrite)
    const trackingNote = `[${new Date().toISOString()}] WhatsApp preparado (manual)\n`;
    await db.appointment
      .update({
        where: { id: appointmentId },
        data: {
          notes: appointment.notes
            ? `${appointment.notes}\n${trackingNote}`
            : trackingNote,
        },
      })
      .catch(() => null); // no fallar si no se puede guardar tracking

    return NextResponse.json({
      success: true,
      method: "whatsapp",
      link,
      message: `WhatsApp preparado para ${appointment.name}`,
      warning:
        "Se abrirá WhatsApp con el mensaje pre-cargado. Revísalo antes de enviar. No envíes más de 5-10 mensajes parecidos por hora para evitar bloqueos.",
    });
  }

  // ===== EMAIL PREVIEW (sin enviar) =====
  if (method === "email-preview") {
    const meetLink = generateMeetingLink(appointment.id);
    const html = generateAppointmentEmailHtml({
      name: appointment.name,
      fechaCita,
      email: appointment.email,
      phone: appointment.phone,
      meetLink: meetLink.url,
      meetProvider: meetLink.provider,
    });

    return NextResponse.json({
      success: true,
      method: "email-preview",
      html,
      subject: `Confirmación de tu cita con Impulsala — ${fechaCita}`,
      meetLink: meetLink.url,
    });
  }

  // ===== EMAIL REAL =====
  if (method === "email") {
    const emailStatus = getEmailStatus();

    if (!emailStatus.configured) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Gmail no configurado. Para enviar correos reales necesitas configurar EMAIL_USER y EMAIL_PASS en el archivo .env con tu Gmail y App Password.",
          needsConfig: emailStatus.needsConfig,
          currentProvider: emailStatus.providerLabel,
          docs: {
            gmail:
              "1. Activa verificación en 2 pasos: https://myaccount.google.com/security\n2. Genera App Password: https://myaccount.google.com/apppasswords\n3. En .env agrega:\n   EMAIL_USER=tu-correo@gmail.com\n   EMAIL_PASS=abcd-efgh-ijkl-mnop",
          },
        },
        { status: 400 }
      );
    }

    const meetLink = generateMeetingLink(appointment.id);
    const subject = `Confirmación de tu cita con Impulsala — ${fechaCita}`;

    const html = generateAppointmentEmailHtml({
      name: appointment.name,
      fechaCita,
      email: appointment.email,
      phone: appointment.phone,
      meetLink: meetLink.url,
      meetProvider: meetLink.provider,
    });

    const text = `Impulsala — Confirmación de Cita

Hola ${appointment.name}:

Tu cita gratuita con Impulsala ha sido agendada.

Fecha: ${fechaCita}
Duración: 30 minutos
Modalidad: Videollamada
Link: ${meetLink.url}
Contacto: 319 635 4992

Para confirmar o reprogramar, responde a este correo o escríbenos por WhatsApp al 319 635 4992.

Saludos,
Equipo Impulsala
contacto@impulsala.co`;

    const result = await sendEmail({
      to: appointment.email,
      subject,
      html,
      text,
      replyTo: "contacto@impulsala.co",
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Error al enviar email vía ${result.provider}: ${result.error}`,
          provider: result.provider,
        },
        { status: 500 }
      );
    }

    // Guardar tracking
    const trackingNote = `[${new Date().toISOString()}] Email enviado vía ${result.provider} (messageId: ${result.messageId})\n`;
    await db.appointment
      .update({
        where: { id: appointmentId },
        data: {
          notes: appointment.notes
            ? `${appointment.notes}\n${trackingNote}`
            : trackingNote,
        },
      })
      .catch(() => null);

    return NextResponse.json({
      success: true,
      method: "email",
      sent: true,
      messageId: result.messageId,
      provider: result.provider,
      previewUrl: result.previewUrl || null,
      message:
        result.provider === "ethereal"
          ? `Email de prueba generado (Ethereal). Vista previa: ${result.previewUrl}`
          : `Email enviado a ${appointment.email} vía ${result.provider}`,
    });
  }

  return NextResponse.json({ error: "Método no válido" }, { status: 400 });
}
