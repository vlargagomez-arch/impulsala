// Test de envío de email real con Gmail
import { sendEmail, getEmailStatus, generateAppointmentEmailHtml } from "../src/lib/email-sender";

async function main() {
  console.log("=== ESTADO DEL SISTEMA DE EMAIL ===");
  const status = getEmailStatus();
  console.log("Configurado:", status.configured);
  console.log("Proveedor:", status.providerLabel);

  if (!status.configured) {
    console.error("\n❌ Email no configurado. Verifica .env");
    process.exit(1);
  }

  console.log("\n=== PROBANDO ENVÍO REAL A TU GMAIL ===");

  const html = generateAppointmentEmailHtml({
    name: "Santiago",
    fechaCita: "lunes, 4 de agosto de 2026, 15:00",
    email: "vlargagomez@gmail.com",
    phone: "322 707 2022",
    meetLink: "https://meet.jit.si/impulsala-test123",
    meetProvider: "jitsi",
  });

  const result = await sendEmail({
    to: "vlargagomez@gmail.com",
    subject: "TEST Impulsala — Gmail funcionando ✅",
    html,
    text: `Impulsala — Test de email

Hola Santiago:

Este es un email de prueba enviado desde el CRM de Impulsala usando tu Gmail.

Si lo estás leyendo, el sistema funciona correctamente.

Equipo Impulsala`,
  });

  console.log("\n=== RESULTADO ===");
  console.log("Success:", result.success);
  console.log("Provider:", result.provider);
  console.log("MessageId:", result.messageId);
  if (result.error) console.log("Error:", result.error);

  if (result.success) {
    console.log("\n✅ Email enviado a vlargagomez@gmail.com");
    console.log("   Revisa tu bandeja de entrada (y spam si no lo ves)");
  } else {
    console.log("\n❌ Error enviando email");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("ERROR FATAL:", e);
  process.exit(1);
});
