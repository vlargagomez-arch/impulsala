/**
 * Único punto de verdad del administrador del CRM.
 * Se puede sobreescribir con la variable CRM_ADMIN_EMAIL (Vercel).
 */
export const ADMIN_EMAIL = (process.env.CRM_ADMIN_EMAIL || "vlargagomez@gmail.com").trim().toLowerCase();

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email) && String(email).trim().toLowerCase() === ADMIN_EMAIL;
}

/**
 * Contraseñas de administrador aceptadas.
 * La variable CRM_ADMIN_PASSWORD manda; la de respaldo se mantiene para no dejar fuera al dueño.
 */
export const ADMIN_PASSWORDS: string[] = [process.env.CRM_ADMIN_PASSWORD, "Globe$12$3"].filter(
  (p): p is string => Boolean(p),
);

export function isAdminPassword(pass?: string | null): boolean {
  return Boolean(pass) && ADMIN_PASSWORDS.includes(String(pass));
}
