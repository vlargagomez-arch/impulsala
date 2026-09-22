import { db } from "../src/lib/db";

async function main() {
  // 1. Ver las citas confirmadas existentes
  const citas = await db.appointment.findMany({
    where: { status: "confirmed" },
    select: { name: true, scheduledAt: true, status: true },
    orderBy: { scheduledAt: "asc" },
  });
  console.log("📅 CITAS CONFIRMADAS EN BD:");
  citas.forEach((c) => {
    console.log(`   ${c.name} → ${c.scheduledAt.toISOString()}`);
  });

  // 2. Llamar a la API de slots y ver si esos horarios NO aparecen
  console.log("\n🔍 Verificando que los horarios ocupados NO aparezcan en los slots disponibles...");
  const response = await fetch("http://localhost:3000/api/appointments/slots?days=14");
  const data = await response.json();
  
  const allSlots: string[] = [];
  data.dates.forEach((d: { slots: { startUtc: string; label: string }[] }) => {
    d.slots.forEach((s: { startUtc: string; label: string }) => {
      allSlots.push(s.startUtc);
    });
  });

  console.log(`   Total slots disponibles mostrados: ${allSlots.length}`);
  
  // Verificar que ninguno de los horarios confirmados esté en los slots disponibles
  let conflictos = 0;
  citas.forEach((c) => {
    const citaUtc = c.scheduledAt.toISOString();
    if (allSlots.includes(citaUtc)) {
      console.log(`   ⚠️  CONFLICTO: Cita de ${c.name} (${citaUtc}) SÍ aparece como disponible`);
      conflictos++;
    }
  });
  
  if (conflictos === 0) {
    console.log("   ✅ PERFECTO: Ningún horario ocupado aparece como disponible");
  } else {
    console.log(`   ❌ Hay ${conflictos} conflictos`);
  }
}

main().finally(() => db.$disconnect());
