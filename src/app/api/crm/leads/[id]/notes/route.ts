import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const { content } = await req.json();
  if (!content || typeof content !== "string")
    return NextResponse.json({ error: "contenido requerido" }, { status: 400 });

  const note = await db.leadNote.create({
    data: { leadId: id, content, author: "admin" },
  });

  return NextResponse.json({ note });
}
