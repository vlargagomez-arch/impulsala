// Test del flujo completo: crear cita y verificar meet link + sheets sync
async function main() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  console.log("=== CREANDO CITA DE PRUEBA ===");
  const res = await fetch("http://localhost:3000/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Meet Link",
      business: "Negocio Test",
      hasWebsite: "si",
      email: "test-meet@example.com",
      phone: "3227072022",
      scheduledAt: tomorrow.toISOString(),
      source: "test-script",
    }),
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));

  if (data.ok) {
    console.log("\n✅ Cita creada exitosamente");
    console.log("📹 Meet link:", data.meetLink);
    console.log("🚀 Provider:", data.meetProvider);
    console.log("📊 Sheets synced:", data.sheetsSynced ? "SÍ" : "NO");
    console.log("💬 WhatsApp link:", data.whatsappLink?.substring(0, 60) + "...");

    if (!data.meetLink) {
      console.log("\n⚠️  ADVERTENCIA: No se generó meet link");
    } else if (data.meetLink.includes("jitsi.si")) {
      console.log("\n💡 Se está usando Jitsi Meet (sin configuración)");
      console.log("   Para usar Google Meet, configura GOOGLE_MEET_LINK en .env");
    } else if (data.meetLink.includes("meet.google.com")) {
      console.log("\n✨ Se está usando Google Meet (configurado)");
    }
  } else {
    console.log("\n❌ Error:", data.error);
  }
}

main().catch(console.error);
