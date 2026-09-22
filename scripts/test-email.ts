// Test de envío de email real con Brevo
import { sendEmail, getEmailStatus, generateAppointmentEmailHtml } from "../src/lib/email-sender";

async function main() {
  console.log("=== ESTADO DEL SISTEMA DE EMAIL ===");
  const status = getEmailStatus();
  console.log("Configurado:", status.configured);
  console.log("Proveedor:", status.providerLabel);
  console.log("Falta configurar:", status.needsConfig);

  if (!status.configured) {
    console.error("\n❌ Email no configurado. Verifica .env");
    process.exit(1);
  }

  console.log("\n=== PROBANDO ENVÍO REAL ===");

  // Email de prueba a una dirección real para verificar
  const testEmail = "vlargagomez@gmail.com"; // email que ya tienes en tu BD de citas

  const html = generateAppointmentEmailHtml({
    name: "Usuario de Prueba",
    fechaCita: "lunes, 4 de agosto de 2025, 15:00",
    email: testEmail,
    phone: "322 707 2022",
  });

  const result = await sendEmail({
    to: testEmail,
    subject: "🚀 TEST Impulsala — Email funcionando con Brevo",
    html,
    text: `Impulsala — Test de email

Este es un email de prueba enviado desde el CRM de Impulsala usando Brevo.

Si lo estás leyendo, el sistema funciona correctamente.

Equipo Impulsala`,
  });

  console.log("\n=== RESULTADO ===");
  console.log("Success:", result.success);
  console.log("Provider:", result.provider);
  console.log("MessageId:", result.messageId);
  if (result.error) console.log("Error:", result.error);
  if (result.previewUrl) console.log("Preview:", result.previewUrl);

  if (result.success) {
    console.log(`\n✅ Email enviado a ${testEmail} — revisa la bandeja de entrada (y spam si no llega)`);
  } else {
    console.log(`\n❌ Error enviando email`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("ERROR FATAL:", e);
  process.exit(1);
});
