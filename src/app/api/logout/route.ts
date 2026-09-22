import { NextResponse } from "next/server";

/**
 * POST /api/logout
 * Borra la cookie simple nexus-admin-session (sin NextAuth).
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("nexus-admin-session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
