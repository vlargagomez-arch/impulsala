import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const body = await req.json();
  const { scheduledAt, type, notes } = body as {
    scheduledAt: string;
    type?: string;
    notes?: string;
  };

  if (!scheduledAt)
    return NextResponse.json({ error: "scheduledAt requerido" }, { status: 400 });

  const followUp = await db.followUp.create({
    data: {
      leadId: id,
      scheduledAt: new Date(scheduledAt),
      type: type || "call",
      notes: notes || "",
    },
  });

  return NextResponse.json({ followUp });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const { followUpId, completed } = await req.json();
  if (!followUpId)
    return NextResponse.json({ error: "followUpId requerido" }, { status: 400 });

  const followUp = await db.followUp.update({
    where: { id: followUpId },
    data: {
      completed: !!completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return NextResponse.json({ followUp });
}
