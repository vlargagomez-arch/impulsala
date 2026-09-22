import nodemailer from "nodemailer";

/**
 * Sistema de envío de emails — Gmail con App Password.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ CONFIGURACIÓN                                                    │
 * ├──────────────────────────────────────────────────────────────────┤
 * │                                                                  │
 * │ 1. Crea una cuenta de Gmail (ej: contacto.impulsala@gmail.com)│
 * │ 2. Activa verificación en 2 pasos:                              │
 * │    https://myaccount.google.com/security                         │
 * │ 3. Genera una "App Password":                                   │
 * │    https://myaccount.google.com/apppasswords                     │
 * │    - Selecciona "Mail"                                           │
 * │    - Click "Generar"                                             │
 * │    - Te dará 16 caracteres (ej: abcd-efgh-ijkl-mnop)            │
 * │ 4. Pega tus credenciales en .env:                               │
 * │    EMAIL_USER=tu-correo@gmail.com                                │
 * │    EMAIL_PASS=abcd-efgh-ijkl-mnop                                │
 * │                                                                  │
 * │ Si no están configuradas, el sistema usa Ethereal (sandbox)     │
 * │ que NO envía correos reales, solo genera preview.               │
 * │                                                                  │
 * └──────────────────────────────────────────────────────────────────┘
 */

// Credenciales con fallback hardcoded (producción no carga .env)
const EMAIL_USER = process.env.EMAIL_USER || "vlargagomez@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "[EMAIL-PASS-EN-ENV]";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://d1m686vag521-d.space-z.ai";

type Provider = "gmail" | "ethereal";

function detectProvider(): Provider {
  if (EMAIL_USER && EMAIL_PASS) return "gmail";
  return "ethereal";
}

let transporter: nodemailer.Transporter | null = null;
let cachedProvider: Provider | null = null;

function getTransporter(): { transport: nodemailer.Transporter; provider: Provider } {
  if (transporter && cachedProvider) {
    return { transport: transporter, provider: cachedProvider };
  }

  const provider = detectProvider();

  if (provider === "gmail") {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  } else {
    // Ethereal — sandbox para desarrollo (NO envía correos reales)
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "kole.dach@ethereal.email",
        pass: "f1Qq7X4TYsW7TkJr1H",
      },
    });
  }

  cachedProvider = provider;
  return { transport: transporter, provider };
}

function getFromAddress(provider: Provider): string {
  if (provider === "gmail" && EMAIL_USER) {
    return `"Impulsala" <${EMAIL_USER}>`;
  }
  return '"Impulsala" <noreply@impulsala.co>';
}

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string | null;
  provider: Provider;
  error?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: EmailParams): Promise<SendEmailResult> {
  const { transport, provider } = getTransporter();
  const from = getFromAddress(provider);

  try {
    const info = await transport.sendMail({
      from,
      to,
      replyTo: replyTo || "contacto@impulsala.co",
      subject,
      html,
      text,
      headers: {
        "X-Mailer": "Impulsala Mailer",
        "X-Priority": "3",
        "List-Unsubscribe": `<mailto:unsubscribe@impulsala.co?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });

    console.log(`📧 [${provider.toUpperCase()}] Email enviado a ${to} → ${info.messageId}`);

    let previewUrl: string | null = null;
    if (provider === "ethereal") {
      previewUrl = nodemailer.getTestMessageUrl(info as any) || null;
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
      provider,
    };
  } catch (error: any) {
    console.error(`❌ [${provider.toUpperCase()}] Error enviando email a ${to}:`, error?.message || error);

    // Mensaje específico para errores comunes de Gmail
    let errorMsg = error?.message || "Error desconocido al enviar el email";
    if (errorMsg.includes("Invalid login") || errorMsg.includes("535")) {
      errorMsg = `Gmail rechazó las credenciales. Verifica que EMAIL_USER y EMAIL_PASS en .env sean correctos. La contraseña debe ser un App Password de 16 caracteres (no tu contraseña normal de Gmail). Genera uno en: https://myaccount.google.com/apppasswords`;
    } else if (errorMsg.includes("Username and Password not accepted")) {
      errorMsg = `Gmail no aceptó el usuario/contraseña. Verifica EMAIL_USER y EMAIL_PASS en .env. Necesitas un App Password (no tu contraseña normal).`;
    }

    return {
      success: false,
      provider,
      error: errorMsg,
    };
  }
}

export function getEmailStatus(): {
  configured: boolean;
  provider: Provider;
  providerLabel: string;
  needsConfig: string | null;
  emailUser: string | null;
} {
  const provider = detectProvider();

  const labels: Record<Provider, string> = {
    gmail: `Gmail (${EMAIL_USER})`,
    ethereal: "Ethereal (sandbox — NO envía correos reales)",
  };

  const needsConfig: Record<Provider, string | null> = {
    gmail: null,
    ethereal:
      "Configura Gmail en .env: EMAIL_USER=tu@gmail.com y EMAIL_PASS=tu-app-password-de-16-caracteres",
  };

  return {
    configured: provider !== "ethereal",
    provider,
    providerLabel: labels[provider],
    needsConfig: needsConfig[provider],
    emailUser: EMAIL_USER || null,
  };
}

// === HTML del email ===
export function generateAppointmentEmailHtml(params: {
  name: string;
  fechaCita: string;
  email: string;
  phone: string;
  siteUrl?: string;
  meetLink?: string;
  meetProvider?: string;
}): string {
  const { name, fechaCita, email, phone, meetLink, meetProvider } = params;
  const siteUrl = params.siteUrl || SITE_URL;

  const waConfirm = `https://wa.me/573196354992?text=${encodeURIComponent(
    `Hola, confirmo mi cita del ${fechaCita}`
  )}`;
  const waReschedule = `https://wa.me/573196354992?text=${encodeURIComponent(
    `Hola, necesito reprogramar mi cita del ${fechaCita}`
  )}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Confirmación de Cita — Impulsala</title>
</head>
<body style="margin:0;padding:0;background:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e2e8f0;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Preheader (texto preview en bandeja) -->
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">
          Tu cita gratuita con Impulsala fue confirmada. Aquí están los detalles.
        </div>

        <!-- Contenedor principal -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(15,23,42,0.08);">

          <!-- ====== HEADER ====== -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 50%,#0ea5e9 100%);padding:40px 40px 32px;text-align:center;position:relative;">

              <!-- Logo/Brand -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);border-radius:14px;padding:10px 20px;">
                      <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.3px;">Impulsala</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Título principal -->
              <h1 style="color:#ffffff;margin:0 0 8px;font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">
                Tu cita está confirmada
              </h1>
              <p style="color:rgba(255,255,255,0.9);margin:0;font-size:14px;font-weight:500;">
                Diagnóstico gratuito · 30 minutos
              </p>

              <!-- Badge decorativo -->
              <div style="margin-top:20px;display:inline-block;background:rgba(255,255,255,0.12);border-radius:100px;padding:6px 16px;border:1px solid rgba(255,255,255,0.15);">
                <span style="color:rgba(255,255,255,0.95);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                  ✓ Confirmación exitosa
                </span>
              </div>
            </td>
          </tr>

          <!-- ====== CUERPO ====== -->
          <tr>
            <td style="padding:36px 40px 24px;">

              <!-- Saludo -->
              <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
                ¡Hola, ${escapeHtml(name)}! 👋
              </h2>
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
                Nos emociona ayudarte a transformar tu negocio digital. Tu cita gratuita con el equipo de Impulsala ha sido agendada exitosamente. A continuación encontrarás todos los detalles.
              </p>

              <!-- ====== TARJETA DE DETALLES ====== -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);border-radius:14px;margin:0 0 28px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:24px 28px;">

                    <!-- Fila: Fecha -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:32px;">
                          <div style="width:32px;height:32px;background:#7c3aed;border-radius:8px;text-align:center;line-height:32px;font-size:14px;">📅</div>
                        </td>
                        <td style="padding:6px 0 6px 14px;vertical-align:middle;">
                          <p style="margin:0;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px;">Fecha y hora</p>
                          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(fechaCita)}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divisor -->
                    <div style="height:1px;background:#e2e8f0;margin:12px 0;"></div>

                    <!-- Fila: Duración -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:32px;">
                          <div style="width:32px;height:32px;background:#0ea5e9;border-radius:8px;text-align:center;line-height:32px;font-size:14px;">⏱️</div>
                        </td>
                        <td style="padding:6px 0 6px 14px;vertical-align:middle;">
                          <p style="margin:0 0 2px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Duración</p>
                          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">30 minutos</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divisor -->
                    <div style="height:1px;background:#e2e8f0;margin:12px 0;"></div>

                    <!-- Fila: Modalidad -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:32px;">
                          <div style="width:32px;height:32px;background:#10b981;border-radius:8px;text-align:center;line-height:32px;font-size:14px;">💻</div>
                        </td>
                        <td style="padding:6px 0 6px 14px;vertical-align:middle;">
                          <p style="margin:0 0 2px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Modalidad</p>
                          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">Videollamada online</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Divisor -->
                    <div style="height:1px;background:#e2e8f0;margin:12px 0;"></div>

                    <!-- Fila: Contacto -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;vertical-align:top;width:32px;">
                          <div style="width:32px;height:32px;background:#f59e0b;border-radius:8px;text-align:center;line-height:32px;font-size:14px;">📞</div>
                        </td>
                        <td style="padding:6px 0 6px 14px;vertical-align:middle;">
                          <p style="margin:0 0 2px;color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Contacto directo</p>
                          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">319 635 4992</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              ${meetLink ? `
              <!-- ====== SECCIÓN VIDEOLLAMADA ====== -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%);border-radius:14px;padding:28px 24px;text-align:center;">

                    <p style="color:rgba(255,255,255,0.85);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">
                      📹 Link de tu videollamada
                    </p>
                    <p style="color:#ffffff;font-size:13px;margin:0 0 20px;line-height:1.5;">
                      ${meetProvider === 'google-meet' ? 'Google Meet' : 'Jitsi Meet'} · Guarda este link para el día de tu cita
                    </p>

                    <!-- Botón principal -->
                    <a href="${escapeHtml(meetLink)}" target="_blank"
                       style="display:inline-block;background:#ffffff;color:#7c3aed;text-decoration:none;padding:15px 40px;border-radius:10px;font-weight:700;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,0.15);letter-spacing:-0.2px;">
                       ▶ Unirse a la videollamada
                    </a>

                    <p style="color:rgba(255,255,255,0.6);font-size:10px;margin:14px 0 0;word-break:break-all;font-family:monospace;">
                      ${escapeHtml(meetLink)}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- ====== ACCIONES RÁPIDAS ====== -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="text-align:center;">
                    <p style="color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;margin:0 0 14px;">
                      ¿Necesitas cambios?
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="padding:0 6px;">
                          <a href="${waConfirm}" target="_blank"
                             style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:13px;">
                             ✓ Confirmar
                          </a>
                        </td>
                        <td style="padding:0 6px;">
                          <a href="${waReschedule}" target="_blank"
                             style="display:inline-block;background:#f1f5f9;color:#475569;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:13px;border:1px solid #cbd5e1;">
                             🔄 Reprogramar
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ====== QUÉ ESPERAR ====== -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;margin:0 0 24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 10px;">
                      💡 Para aprovechar al máximo tu cita:
                    </p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:3px 0;color:#78350f;font-size:12px;line-height:1.6;">
                          ✓ Prepara tus preguntas sobre tu web, SEO o marketing
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;color:#78350f;font-size:12px;line-height:1.6;">
                          ✓ Si tienes un sitio web actual, ten la URL a mano
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;color:#78350f;font-size:12px;line-height:1.6;">
                          ✓ Piensa en tus objetivos de negocio a 6 meses
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:3px 0;color:#78350f;font-size:12px;line-height:1.6;">
                          ✓ Conecta 5 minutos antes para probar audio y video
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ====== FOOTER ====== -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;text-align:center;">

              <!-- Info de contacto -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center">
                    <p style="color:#cbd5e1;font-size:14px;font-weight:700;margin:0 0 6px;">
                      Impulsala
                    </p>
                    <p style="color:#64748b;font-size:12px;margin:0 0 12px;">
                      Agencia de desarrollo web, SEO y automatización con IA
                    </p>
                    <p style="color:#94a3b8;font-size:12px;margin:0;">
                      📍 Bogotá, Colombia · 📧 contacto@impulsala.co · 📱 319 635 4992
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divisor -->
              <div style="height:1px;background:#1e293b;margin:0 0 16px;"></div>

              <!-- Nota legal -->
              <p style="color:#475569;font-size:10px;margin:0;line-height:1.6;">
                Recibiste este correo porque agendaste una cita en <a href="${siteUrl}" style="color:#64748b;text-decoration:underline;">${siteUrl}</a>.<br>
                Si no reconoces esta cita, ignora este correo o contáctanos.<br><br>
                © 2026 Impulsala. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>

        <!-- Nota fuera del card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin-top:16px;">
          <tr>
            <td align="center" style="padding:0 16px;">
              <p style="color:#94a3b8;font-size:10px;margin:0;line-height:1.5;">
                Este es un correo automático enviado desde Impulsala. Por favor no respondas directamente a este email.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
