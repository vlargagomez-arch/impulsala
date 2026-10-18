import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { sendEmail } from "@/lib/email-sender";

/**
 * POST /api/prospeccion/enviar
 * Body: { to: string, subject: string, body: string, negocio?: string }
 *
 * Envía la propuesta redactada por el agente al correo del negocio (Gmail del proyecto).
 * Solo admin. Nada de envíos masivos automáticos: uno por uno, desde el CRM.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  try {
    const { to, subject, body, negocio } = await req.json();

    if (!to || !EMAIL_RE.test(String(to).trim())) {
      return NextResponse.json(
        { ok: false, error: "Ese negocio no tiene un correo válido. Usá el botón de WhatsApp." },
        { status: 400 },
      );
    }
    if (!subject || !body || String(body).trim().length < 60) {
      return NextResponse.json({ ok: false, error: "Falta el asunto o el texto de la propuesta" }, { status: 400 });
    }

    const text = String(body).trim();
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111">${text
      .split("\n")
      .map((l) => (l.trim() ? `<p style="margin:0 0 12px">${escapeHtml(l.trim())}</p>` : ""))
      .join("")}</div>`;

    const res = await sendEmail({
      to: String(to).trim(),
      subject: String(subject).slice(0, 120),
      text,
      html,
    });

    if (!res.success) {
      console.error("❌ [PROSPECCION] envío falló:", res.error);
      return NextResponse.json({ ok: false, error: res.error || "No se pudo enviar" }, { status: 502 });
    }

    console.log(`📧 [PROSPECCION] propuesta enviada a ${to} (${negocio || "sin nombre"}) vía ${res.provider}`);
    return NextResponse.json({ ok: true, provider: res.provider, messageId: res.messageId || null });
  } catch (error: any) {
    console.error("❌ [PROSPECCION/enviar] Error:", error?.message);
    return NextResponse.json({ ok: false, error: error?.message || "Error enviando" }, { status: 500 });
  }
}
