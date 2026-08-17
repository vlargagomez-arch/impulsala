import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (search) where.email = { contains: search };

  const subscribers = await db.newsletter.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ subscribers });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { id } = await req.json();
  await db.newsletter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
