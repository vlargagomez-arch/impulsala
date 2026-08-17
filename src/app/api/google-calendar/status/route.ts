import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { isOAuthConfigured, hasStoredToken, getAuthUrl, getUserInfo } from "@/lib/google-auth";

/**
 * GET /api/google-calendar/status
 * Devuelve el estado de la conexión con Google Calendar.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const configured = isOAuthConfigured();
  const connected = await hasStoredToken();

  let userInfo = null;
  if (connected) {
    userInfo = await getUserInfo();
  }

  return NextResponse.json({
    configured,
    connected,
    authUrl: configured && !connected ? getAuthUrl(req) : null,
    userInfo,
  });
}
