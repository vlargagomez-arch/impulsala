import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const lead = await db.bookingLead.findUnique({
    where: { id },
    include: {
      leadNotes: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { scheduledAt: "asc" } },
    },
  });

  if (!lead) return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  await db.bookingLead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
