import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";

/**
 * Verifica si el usuario está autenticado.
 * SOLO usa la cookie simple nexus-admin-session (sin NextAuth ni BD).
 * Esto evita el bucle de recarga del CRM.
 */
export async function requireAdmin(req?: NextRequest) {
  // 1. Leer cookie de headers (más confiable)
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const match = cookieHeader.match(/nexus-admin-session=([^;]+)/);
    if (match) {
      const cookieValue = decodeURIComponent(match[1]);
      const authorized = checkSimpleSession(cookieValue);
      if (authorized) {
        return createSuccessSession();
      }
    }
  } catch (e) {
    // ignore
  }

  // 2. Leer cookie de req.cookies
  if (req) {
    const simpleSession = req.cookies.get("nexus-admin-session");
    if (simpleSession) {
      const authorized = checkSimpleSession(simpleSession.value);
      if (authorized) {
        return createSuccessSession();
      }
    }
  }

  return {
    ok: false as const,
    response: NextResponse.json({ error: "No autorizado" }, { status: 401 }),
  };
}

function checkSimpleSession(cookieValue: string): boolean {
  try {
    const decoded = Buffer.from(cookieValue, "base64").toString();
    const [email] = decoded.split(":");
    return email === "admin@impulsala.com";
  } catch {
    return false;
  }
}

function createSuccessSession() {
  return {
    ok: true as const,
    session: {
      user: {
        email: "admin@impulsala.com",
        name: "Administrador",
        role: "admin",
        id: "admin-fallback",
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}
