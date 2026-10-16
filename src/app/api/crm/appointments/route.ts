import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (from || to) {
    const scheduledAt: Record<string, Date> = {};
    if (from) scheduledAt.gte = new Date(from);
    if (to) scheduledAt.lte = new Date(to);
    where.scheduledAt = scheduledAt;
  }

  const appointments = await db.appointment.findMany({
    where,
    orderBy: { scheduledAt: "desc" },
  });

  return NextResponse.json({ appointments });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { id, status } = await req.json();
  if (!id || !status)
    return NextResponse.json({ error: "id y status requeridos" }, { status: 400 });

  const updated = await db.appointment.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ appointment: updated });
}
