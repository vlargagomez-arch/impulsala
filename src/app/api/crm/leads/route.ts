import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { hasBusiness: { contains: search } },
    ];
  }

  const leads = await db.bookingLead.findMany({
    where,
    include: {
      _count: { select: { leadNotes: true, followUps: true } },
      followUps: {
        where: { completed: false },
        orderBy: { scheduledAt: "asc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = await req.json();
  const { id, status, estimatedValue, notes } = body as {
    id: string;
    status?: string;
    estimatedValue?: number;
    notes?: string;
  };

  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (status) data.status = status;
  if (typeof estimatedValue === "number") data.estimatedValue = estimatedValue;
  if (typeof notes === "string") data.notes = notes;

  const updated = await db.bookingLead.update({
    where: { id },
    data,
  });

  return NextResponse.json({ lead: updated });
}
