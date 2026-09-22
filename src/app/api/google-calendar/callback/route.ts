import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/google-auth";

/**
 * GET /api/google-calendar/callback
 * Google redirige aquí después de autorizar.
 * Intercambia el código por token, guarda en BD, y redirige al CRM.
 *
 * MÁXIMA VELOCIDAD: sin HTML intermedio, redirect directo.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const PUBLIC_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://d1m686vag521-d.space-z.ai";

  // Si hay error, redirigir al CRM con error
  if (error) {
    return NextResponse.redirect(
      new URL(`/crm?google_error=${encodeURIComponent(error)}`, PUBLIC_URL)
    );
  }

  // Si no hay código
  if (!code) {
    return NextResponse.redirect(
      new URL("/crm?google_error=no_code", PUBLIC_URL)
    );
  }

  // Intercambiar código por token
  const result = await exchangeCodeForToken(code, req);

  if (result.success) {
    // Éxito: redirigir al CRM con success=1
    return NextResponse.redirect(
      new URL("/crm?google_connected=1", PUBLIC_URL)
    );
  } else {
    // Error: redirigir al CRM con error
    return NextResponse.redirect(
      new URL(`/crm?google_error=${encodeURIComponent(result.error || "unknown")}`, PUBLIC_URL)
    );
  }
}
