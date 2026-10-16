import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hash an IP address for spam protection without storing raw IP.
 * Uses Web Crypto API (SubtleCrypto) — available in Next.js runtime.
 */
async function hashIp(ip: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`nexus-salt::${ip}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "unknown";
  }
}

/**
 * POST /api/newsletter
 *
 * Subscribes an email to the newsletter. Validates input, prevents duplicates,
 * and protects against spam by limiting subscriptions per IP hash.
 *
 * Body: { email: string, source?: string }
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const emailRaw = (body.email || "").trim().toLowerCase();
  const source = (body.source || "footer").trim().toLowerCase();

  if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json(
      { error: "Email inválido. Revisa el formato." },
      { status: 422 },
    );
  }

  if (emailRaw.length > 254) {
    return NextResponse.json(
      { error: "Email demasiado largo." },
      { status: 422 },
    );
  }

  // Hash IP for spam protection (max 5 subscriptions per IP per hour)
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim() || "unknown";
  const ipHash = await hashIp(clientIp);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentFromIp = await db.newsletter.count({
    where: {
      ipHash,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentFromIp >= 5) {
    return NextResponse.json(
      { error: "Demasiadas suscripciones desde esta IP. Intenta más tarde." },
      { status: 429 },
    );
  }

  // Check if email is already subscribed
  const existing = await db.newsletter.findUnique({
    where: { email: emailRaw },
  });

  if (existing) {
    if (existing.status === "active") {
      return NextResponse.json({
        ok: true,
        message: "Ya estabas suscrito. ¡Gracias por tu interés!",
        alreadySubscribed: true,
      });
    }
    // Reactivate if previously unsubscribed
    await db.newsletter.update({
      where: { id: existing.id },
      data: { status: "active", source, ipHash },
    });
    return NextResponse.json({
      ok: true,
      message: "¡Suscripción reactivada con éxito!",
    });
  }

  // Create new subscription
  await db.newsletter.create({
    data: {
      email: emailRaw,
      source,
      status: "active",
      ipHash,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "¡Suscripción exitosa! Recibirás estrategias digitales cada semana.",
  });
}

/**
 * GET /api/newsletter
 *
 * Returns the count of active subscribers. Useful for admin/dashboard.
 * Protected in production by an admin token (basic implementation).
 */
export async function GET(req: NextRequest) {
  // Simple admin token check (in production, use proper auth)
  const authHeader = req.headers.get("authorization");
  const adminToken = process.env.NEWSLETTER_ADMIN_TOKEN;

  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const total = await db.newsletter.count({ where: { status: "active" } });
  const today = await db.newsletter.count({
    where: {
      status: "active",
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return NextResponse.json({ total, today });
}
