/**
 * Formatea un número de teléfono colombiano para WhatsApp.
 * 
 * Los números en Colombia tienen 10 dígitos (ej: 3196354992).
 * WhatsApp necesita el prefijo internacional 57 (ej: 573196354992).
 * 
 * Si el número ya tiene el 57, no lo duplica.
 * Si el número tiene +57, lo limpia y añade 57.
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Limpiar todo excepto números
  let cleaned = phone.replace(/[^0-9]/g, "");

  // Si ya empieza con 57 y tiene más de 10 dígitos, dejarlo así
  if (cleaned.startsWith("57") && cleaned.length > 10) {
    return cleaned;
  }

  // Si tiene 10 dígitos (número colombiano sin prefijo), añadir 57
  if (cleaned.length === 10) {
    return "57" + cleaned;
  }

  // Si tiene menos de 10, igual añadir 57
  if (cleaned.length < 10) {
    return "57" + cleaned;
  }

  // Si tiene más de 10 y no empieza con 57, asumir que ya tiene prefijo
  return cleaned;
}
