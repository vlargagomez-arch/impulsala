import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

// GET — obtener una campaña específica
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const campaign = await db.emailCampaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
  return NextResponse.json({ campaign });
}

// DELETE — eliminar campaña
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  await db.emailCampaign.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

// PATCH — enviar una campaña en borrador
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;
  const { id } = await ctx.params;

  const campaign = await db.emailCampaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Campaña no encontrada" }, { status: 404 });
  if (campaign.status === "sent") {
    return NextResponse.json({ error: "Esta campaña ya fue enviada" }, { status: 400 });
  }

  const subscribers = await db.newsletter.findMany({
    where: { status: "active" },
    select: { email: true },
  });

  console.log(`📧 Enviando campaña "${campaign.subject}" a ${subscribers.length} suscriptores`);

  const updated = await db.emailCampaign.update({
    where: { id },
    data: {
      status: "sent",
      sentAt: new Date(),
      sentTo: subscribers.length,
    },
  });

  return NextResponse.json({
    campaign: updated,
    recipients: subscribers.length,
    message: `Campaña enviada a ${subscribers.length} suscriptores`,
  });
}
