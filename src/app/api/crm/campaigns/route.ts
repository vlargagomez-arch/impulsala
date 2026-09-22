import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { sendEmail } from "@/lib/email-sender";

// GET — listar todas las campañas
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const campaigns = await db.emailCampaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeSubs = await db.newsletter.count({ where: { status: "active" } });

  return NextResponse.json({ campaigns, activeSubs });
}

// POST — crear nueva campaña (borrador) o enviarla
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const body = await req.json();
  const { subject, content, send } = body as { subject: string; content: string; send?: boolean };

  if (!subject || !content) {
    return NextResponse.json({ error: "Asunto y contenido son requeridos" }, { status: 400 });
  }

  // Crear la campaña
  const campaign = await db.emailCampaign.create({
    data: {
      subject,
      content,
      status: send ? "sent" : "draft",
      sentAt: send ? new Date() : null,
    },
  });

  // Si se debe enviar, enviar emails reales vía Gmail
  if (send) {
    const subscribers = await db.newsletter.findMany({
      where: { status: "active" },
      select: { email: true },
    });

    console.log(`📧 Enviando campaña "${subject}" a ${subscribers.length} suscriptores`);

    let sentCount = 0;
    let failCount = 0;

    // HTML del email
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#0ea5e9 100%);padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;">Impulsala</h1>
              <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:13px;">Newsletter</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px 24px;">
              <div style="color:#1e293b;font-size:15px;line-height:1.7;white-space:pre-wrap;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </td>
          </tr>
          <tr>
            <td style="background:#0f172a;padding:22px 40px;text-align:center;border-radius:0 0 16px 16px;">
              <p style="color:#94a3b8;font-size:11px;margin:0;">
                <strong style="color:#cbd5e1;">Impulsala</strong> · Bogotá, Colombia<br>
                📧 contacto@impulsala.co · 📱 319 635 4992<br><br>
                Recibiste este correo porque te suscribiste en nuestra web.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Enviar a cada suscriptor
    for (const sub of subscribers) {
      try {
        const result = await sendEmail({
          to: sub.email,
          subject,
          html,
          text: content,
        });
        if (result.success) {
          sentCount++;
        } else {
          failCount++;
          console.error(`❌ Falló envío a ${sub.email}:`, result.error);
        }
        // Pequeña pausa para no saturar Gmail (máx 100/hora)
        await new Promise(r => setTimeout(r, 500));
      } catch (e: any) {
        failCount++;
        console.error(`❌ Error enviando a ${sub.email}:`, e?.message);
      }
    }

    await db.emailCampaign.update({
      where: { id: campaign.id },
      data: { sentTo: sentCount },
    });

    return NextResponse.json({
      campaign,
      sent: true,
      recipients: subscribers.length,
      sentCount,
      failCount,
      message: `Campaña enviada a ${sentCount} suscriptores (${failCount} fallidos)`,
    });
  }

  return NextResponse.json({ campaign, sent: false });
}
