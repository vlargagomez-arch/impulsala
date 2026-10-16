import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,20}$/;

/**
 * Hash an IP address for spam protection without storing raw IP.
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
 * POST /api/booking-leads
 *
 * Creates a new booking lead from the AI chat agent.
 * The lead contains: name, email, phone, hasBusiness.
 * The team contacts the lead within 2 business hours to schedule the actual appointment.
 *
 * Body: { name, email, phone, hasBusiness, source? }
 */
export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; phone?: string; hasBusiness?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const phone = (body.phone || "").trim();
  const hasBusiness = (body.hasBusiness || "").trim();
  const source = (body.source || "ai-chat").trim().toLowerCase();

  // Validaciones
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 422 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 422 });
  }
  if (!phone || !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Teléfono inválido" }, { status: 422 });
  }
  if (!hasBusiness) {
    return NextResponse.json({ error: "Indica si tienes negocio" }, { status: 422 });
  }

  // Hash IP para protección anti-spam (max 3 leads por IP por hora)
  const forwarded = req.headers.get("x-forwarded-for");
  const clientIp = forwarded?.split(",")[0]?.trim() || "unknown";
  const ipHash = await hashIp(clientIp);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentFromIp = await db.bookingLead.count({
    where: {
      ipHash,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (recentFromIp >= 3) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes desde esta IP. Intenta más tarde." },
      { status: 429 },
    );
  }

  // Verificar si ya existe un lead con el mismo email en las últimas 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existingRecent = await db.bookingLead.findFirst({
    where: {
      email,
      createdAt: { gte: oneDayAgo },
    },
  });

  if (existingRecent) {
    return NextResponse.json({
      ok: true,
      message: "Ya recibimos tu solicitud recientemente. Te contactaremos pronto.",
      alreadyExists: true,
      id: existingRecent.id,
    });
  }

  // Crear el lead
  const lead = await db.bookingLead.create({
    data: {
      name,
      email,
      phone,
      hasBusiness,
      source,
      status: "new",
      ipHash,
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Lead creado exitosamente. El equipo contactará en menos de 2 horas.",
    id: lead.id,
  });
}

/**
 * GET /api/booking-leads
 * Returns count of leads (for admin dashboard).
 * Protected by admin token.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const adminToken = process.env.BOOKING_ADMIN_TOKEN;

  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const total = await db.bookingLead.count();
  const newLeads = await db.bookingLead.count({ where: { status: "new" } });
  const today = await db.bookingLead.count({
    where: {
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    },
  });

  return NextResponse.json({ total, new: newLeads, today });
}
