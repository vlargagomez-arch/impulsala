import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * POST /api/login-direct
 * Login directo SIN base de datos, SIN NextAuth.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const ADMIN_EMAIL = "admin@impulsala.com";
    const ADMIN_PASSWORD = "nexus2026";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const sessionId = Buffer.from(`${email}:${Date.now()}`).toString("base64");

      const response = NextResponse.json({
        success: true,
        user: {
          email: ADMIN_EMAIL,
          name: "Administrador",
          role: "admin",
        },
      });

      response.cookies.set("nexus-admin-session", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Credenciales incorrectas" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/login-direct
 * Debug: muestra qué cookies está recibiendo.
 */
export async function GET(req: NextRequest) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((c) => {
    const [k, ...v] = c.trim().split("=");
    if (k) cookies[k] = v.join("=");
  });

  const nexusCookie = cookies["nexus-admin-session"];
  let decoded = null;
  let email = null;
  if (nexusCookie) {
    try {
      decoded = Buffer.from(nexusCookie, "base64").toString();
      email = decoded.split(":")[0];
    } catch (e) {
      decoded = `Error: ${(e as Error).message}`;
    }
  }

  return NextResponse.json({
    cookieHeader: cookieHeader.substring(0, 100),
    cookies: Object.keys(cookies),
    nexusCookie: nexusCookie ? "present" : "missing",
    decoded,
    email,
    isAuthorized: email === "admin@impulsala.com",
  });
}
