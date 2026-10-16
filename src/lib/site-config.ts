/**
 * URL base del sitio.
 *
 * Usa NEXT_PUBLIC_SITE_URL de variables de entorno.
 * En Vercel, configura esta variable en:
 *   Settings → Environment Variables → NEXT_PUBLIC_SITE_URL = https://tudominio.com
 *
 * Fallback a un default para desarrollo local.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://impulsala.com"
    : "http://localhost:3000");

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
// deploy fix Tue Aug 11 04:30:08 UTC 2026
