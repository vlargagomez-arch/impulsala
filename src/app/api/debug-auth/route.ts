import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * GET /api/debug-auth
 * Endpoint de debug para ver qué cookies está recibiendo el servidor.
 */
export async function GET(req: NextRequest) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  // Parsear cookies manualmente
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((c) => {
    const [k, ...v] = c.trim().split("=");
    if (k) cookies[k] = v.join("=");
  });

  // Verificar cookie nexus-admin-session
  const nexusCookie = cookies["nexus-admin-session"];
  let decoded = null;
  let email = null;
  if (nexusCookie) {
    try {
      decoded = Buffer.from(nexusCookie, "base64").toString();
      email = decoded.split(":")[0];
    } catch (e) {
      decoded = `Error decoding: ${(e as Error).message}`;
    }
  }

  return NextResponse.json({
    cookieHeader,
    cookies,
    nexusCookie: nexusCookie ? `${nexusCookie.substring(0, 30)}...` : null,
    decoded,
    email,
    isAuthorized: email === "admin@impulsala.com",
  });
}
