/**
 * Único punto de verdad del administrador del CRM.
 * Se puede sobreescribir con la variable CRM_ADMIN_EMAIL (Vercel).
 */
export const ADMIN_EMAIL = (process.env.CRM_ADMIN_EMAIL || "vlargagomez@gmail.com").trim().toLowerCase();

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email) && String(email).trim().toLowerCase() === ADMIN_EMAIL;
}
