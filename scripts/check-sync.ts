import { db } from "@/lib/db";

async function main() {
  const [leads, appts, subs] = await Promise.all([
    db.bookingLead.count(),
    db.appointment.count(),
    db.newsletter.count(),
  ]);
  
  console.log("📊 Estado actual de la base de datos (lo que ve el CRM):");
  console.log(`   📋 Leads totales: ${leads}`);
  console.log(`   📅 Citas totales: ${appts}`);
  console.log(`   📧 Suscriptores: ${subs}`);
  
  console.log("\n🆕 Últimos 3 leads (deberían verse en el Kanban):");
  const recentLeads = await db.bookingLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { name: true, email: true, source: true, status: true, createdAt: true },
  });
  recentLeads.forEach((l, i) => {
    console.log(`   ${i+1}. ${l.name} (${l.email}) — fuente: ${l.source} — estado: ${l.status} — hace ${Math.round((Date.now() - l.createdAt.getTime())/60000)} min`);
  });
  
  console.log("\n🆕 Últimos 2 suscriptores (deberían verse en Newsletter):");
  const recentSubs = await db.newsletter.findMany({
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { email: true, source: true, status: true },
  });
  recentSubs.forEach((s, i) => {
    console.log(`   ${i+1}. ${s.email} — fuente: ${s.source} — estado: ${s.status}`);
  });
}

main().finally(() => db.$disconnect());
