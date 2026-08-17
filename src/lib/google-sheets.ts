/**
 * Sincronización con Google Sheets vía Apps Script Webhook.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ CÓMO FUNCINA                                                    │
 * ├──────────────────────────────────────────────────────────────────┤
 * │                                                                  │
 * │ 1. El admin crea un Google Sheet vacío                          │
 * │ 2. En Extensions → Apps Script, pega el script de               │
 * │    /scripts/google-apps-script.js                               │
 * │ 3. Deploya el script como Web App (Anyone with link)           │
 * │ 4. Copia la URL del webhook (termina en /exec)                  │
 * │ 5. Pega la URL en .env como GOOGLE_SHEETS_WEBHOOK_URL           │
 * │                                                                  │
 * │ Cuando se crea una cita, este módulo envía un POST al webhook   │
 * │ con todos los datos, y el script los agrega como nueva fila.    │
 * │                                                                  │
 * │ El admin puede ver todas las citas en su Google Sheet, con      │
 * │ columnas para: fecha, cliente, email, teléfono, link Meet,      │
 * │ link WhatsApp listo para click, estado del email, etc.          │
 * │                                                                  │
 * └──────────────────────────────────────────────────────────────────┘
 */

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";

export interface SheetsAppointmentData {
  appointmentId: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  scheduledAt: string; // ISO
  durationMin: number;
  hasWebsite: string;
  meetLink: string;
  meetProvider: string;
  whatsappLink: string; // wa.me link con mensaje de confirmación
  status: string;
  source: string; // ai-chat | form | manual
  createdAt: string;
}

export interface SyncResult {
  success: boolean;
  synced: boolean;
  error?: string;
}

/**
 * Sincroniza una cita a Google Sheets vía webhook.
 *
 * Si GOOGLE_SHEETS_WEBHOOK_URL no está configurado, no hace nada (no falla).
 * Si el webhook falla, NO bloquea la creación de la cita (best-effort sync).
 */
export async function syncAppointmentToSheets(
  data: SheetsAppointmentData
): Promise<SyncResult> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return { success: true, synced: false };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(
        `❌ [Sheets Sync] Webhook respondió ${response.status}: ${await response.text().catch(() => "no body")}`
      );
      return {
        success: false,
        synced: false,
        error: `Webhook ${response.status}`,
      };
    }

    console.log(`📊 [Sheets Sync] Cita ${data.appointmentId} sincronizada a Google Sheets`);
    return { success: true, synced: true };
  } catch (error: any) {
    console.error(`❌ [Sheets Sync] Error:`, error?.message || error);
    return {
      success: false,
      synced: false,
      error: error?.message || "Error desconocido",
    };
  }
}

/**
 * Genera el link de WhatsApp con mensaje pre-cargado para confirmar la cita.
 */
export function generateWhatsAppLink(
  phone: string,
  name: string,
  scheduledAt: string,
  meetLink?: string
): string {
  // Limpiar teléfono (quitar todo lo que no sea dígito, añadir 57 si es Colombia)
  let cleanPhone = phone.replace(/[^\d]/g, "");
  if (cleanPhone.length === 10 && !cleanPhone.startsWith("57")) {
    cleanPhone = "57" + cleanPhone;
  }

  const fecha = new Date(scheduledAt).toLocaleString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

  const message = meetLink
    ? `Hola ${name}, soy Santiago de Impulsala.

Tu cita fue agendada:
• Fecha: ${fecha}
• Videollamada: ${meetLink}

¿Confirmas que te viene bien? Si necesitas reprogramar, avísame.

Saludos,
Santiago
Impulsala · 319 635 4992`
    : `Hola ${name}, soy Santiago de Impulsala.

Tu cita fue agendada para ${fecha}.

¿Confirmas que te viene bien? Si necesitas reprogramar, avísame.

Saludos,
Santiago
Impulsala · 319 635 4992`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Devuelve el estado de configuración de Google Sheets sync.
 */
export function getSheetsStatus(): {
  configured: boolean;
  webhookUrl: string | null;
  instructions: string | null;
} {
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    return {
      configured: true,
      webhookUrl: GOOGLE_SHEETS_WEBHOOK_URL,
      instructions: null,
    };
  }

  return {
    configured: false,
    webhookUrl: null,
    instructions:
      "Para sincronizar con Google Sheets: crea un Sheet, agrega el Apps Script de /scripts/google-apps-script.js, deploya como Web App, y pega la URL en .env como GOOGLE_SHEETS_WEBHOOK_URL",
  };
}

export { GOOGLE_SHEETS_WEBHOOK_URL };
