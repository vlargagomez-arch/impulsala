import { db } from "@/lib/db";

async function main() {
  console.log("📊 VERIFICACIÓN DE SINCRONIZACIÓN CRM\n");

  // 1. Verificar leads (BookingLead)
  const leads = await db.bookingLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true, email: true, phone: true, hasBusiness: true, source: true, status: true, createdAt: true },
  });
  console.log("📋 LEADS RECIENTES (BookingLead):");
  leads.forEach((l, i) => {
    console.log(`   ${i + 1}. ${l.name} | ${l.email} | ${l.phone} | ${l.hasBusiness} | fuente: ${l.source} | estado: ${l.status}`);
  });
  console.log(`   Total leads en BD: ${await db.bookingLead.count()}\n`);

  // 2. Verificar citas (Appointment)
  const appointments = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { name: true, email: true, phone: true, business: true, scheduledAt: true, status: true, createdAt: true },
  });
  console.log("📅 CITAS RECIENTES (Appointment):");
  appointments.forEach((a, i) => {
    console.log(`   ${i + 1}. ${a.name} | ${a.email} | ${a.phone} | ${a.business} | cita: ${a.scheduledAt.toLocaleString("es-CO")} | estado: ${a.status}`);
  });
  console.log(`   Total citas en BD: ${await db.appointment.count()}\n`);

  // 3. Verificar suscriptores (Newsletter)
  const subs = await db.newsletter.count();
  console.log(`📧 SUSCRIPTORES NEWSLETTER: ${subs} en BD\n`);

  // 4. Verificar si el último lead "Test Confirm" está sincronizado
  const testLead = await db.bookingLead.findFirst({
    where: { name: "Test Confirm" },
    orderBy: { createdAt: "desc" },
  });
  const testAppt = await db.appointment.findFirst({
    where: { name: "Test Confirm" },
    orderBy: { createdAt: "desc" },
  });
  console.log("🔍 VERIFICACIÓN DE LA ÚLTIMA CITA AGENDADA:");
  console.log(`   Lead guardado: ${testLead ? "✅ SÍ" : "❌ NO"}`);
  if (testLead) {
    console.log(`     → fuente: ${testLead.source}, estado: ${testLead.status}`);
  }
  console.log(`   Cita guardada: ${testAppt ? "✅ SÍ" : "❌ NO"}`);
  if (testAppt) {
    console.log(`     → fecha: ${testAppt.scheduledAt.toLocaleString("es-CO")}, estado: ${testAppt.status}`);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
