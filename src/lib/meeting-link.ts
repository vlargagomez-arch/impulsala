/**
 * Generador de links de videollamada para citas.
 *
 * Estrategia (en orden de prioridad):
 * 1. GOOGLE_MEET_LINK fijo (env var) — el admin crea un Meet "sala permanente"
 *    y todas las citas usan ese mismo link. Simple y gratis.
 *    Cómo: Crea evento recurrente en Google Calendar → copy Meet link → pégalo en .env
 *
 * 2. Jitsi Meet dinámico (fallback, sin configuración) — genera un link único
 *    por cita en meet.jit.si. Gratis, sin cuenta, sin setup.
 *    Funciona igual que Meet, solo cambias la URL.
 *
 * 3. Whereby dinámico (alternativa) — otra opción gratuita sin cuenta.
 */

const GOOGLE_MEET_LINK = process.env.GOOGLE_MEET_LINK || "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://impulsala.co";

export interface MeetingLink {
  url: string;
  provider: "google-meet" | "jitsi" | "whereby";
  isStatic: boolean;
}

/**
 * Genera un link de videollamada para una cita.
 *
 * Si GOOGLE_MEET_LINK está configurado → usa ese (todos los clientes van a la misma sala,
 * pero a diferentes horarios, así que no se cruzan).
 *
 * Si no está configurado → genera un link único en Jitsi Meet (gratis, sin cuenta).
 */
export function generateMeetingLink(appointmentId: string): MeetingLink {
  // Opción 1: Google Meet link estático (configurado por el admin)
  if (GOOGLE_MEET_LINK && GOOGLE_MEET_LINK.startsWith("https://meet.google.com/")) {
    return {
      url: GOOGLE_MEET_LINK,
      provider: "google-meet",
      isStatic: true,
    };
  }

  // Opción 2: Jitsi Meet dinámico (link único por cita, sin configuración)
  // Formato: https://meet.jit.si/nexus-XXXXXXXX
  // Cada cita tiene su propia sala, no requiere cuenta ni login
  const slug = appointmentId
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-10)
    .toLowerCase();
  const roomName = `impulsala-${slug}`;

  return {
    url: `https://meet.jit.si/${roomName}`,
    provider: "jitsi",
    isStatic: false,
  };
}

/**
 * Devuelve instrucciones amigables para el cliente sobre cómo unirse a la llamada.
 */
export function getMeetingInstructions(link: MeetingLink): string {
  if (link.provider === "google-meet") {
    return `Link de Google Meet: ${link.url}

Para unirte:
1. Haz click en el link 5 minutos antes de la hora acordada
2. Permite el acceso a tu cámara y micrófono
3. Espera a que el equipo de Impulsala te admita`;
  }

  return `Link de videollamada: ${link.url}

Para unirte:
1. Haz click en el link 5 minutos antes de la hora acordada
2. Permite el acceso a tu cámara y micrófono
3. Espera a que el equipo de Impulsala te admita

Nota: funciona en cualquier navegador (Chrome, Safari, Firefox) sin instalar nada.`;
}

/**
 * Devuelve el link de Meet configurado por el admin (o null si no hay).
 * Útil para mostrar en el CRM cómo está configurado el sistema.
 */
export function getConfiguredMeetLink(): {
  configured: boolean;
  link: string | null;
  provider: string;
  instructions: string | null;
} {
  if (GOOGLE_MEET_LINK && GOOGLE_MEET_LINK.startsWith("https://meet.google.com/")) {
    return {
      configured: true,
      link: GOOGLE_MEET_LINK,
      provider: "Google Meet (link único — todas las citas usan la misma sala)",
      instructions:
        "Las citas usan el mismo link de Google Meet. Para cambiarlo, edita GOOGLE_MEET_LINK en .env",
    };
  }

  return {
    configured: false,
    link: null,
    provider: "Jitsi Meet (automático — link único por cita, sin configuración)",
    instructions:
      "Cada cita genera un link único en meet.jit.si automáticamente. Para usar Google Meet en su lugar, configura GOOGLE_MEET_LINK en .env",
  };
}

export { GOOGLE_MEET_LINK, SITE_URL };
