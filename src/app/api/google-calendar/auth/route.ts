import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, isOAuthConfigured } from "@/lib/google-auth";

/**
 * GET /api/google-calendar/auth
 * Redirige al usuario a Google para autorizar el acceso al calendario.
 * Detecta automáticamente la URL de redirect según el dominio del request.
 */
export async function GET(req: NextRequest) {
  if (!isOAuthConfigured()) {
    return NextResponse.json(
      {
        error: "OAuth no configurado",
        instructions:
          "Necesitas crear OAuth credentials en Google Cloud Console y configurar GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env",
      },
      { status: 500 }
    );
  }

  // Pasar el request para que detectRedirectUri use la URL correcta
  const authUrl = getAuthUrl(req);
  return NextResponse.redirect(authUrl);
}
