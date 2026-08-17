import { db } from "../src/lib/db";
async function main() {
  const citas = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { name: true, email: true, phone: true, scheduledAt: true, status: true, createdAt: true },
  });
  console.log(`Total citas en BD: ${await db.appointment.count()}`);
  console.log("\nÚltimas 10 citas:");
  citas.forEach((c, i) => {
    console.log(`  ${i+1}. ${c.name} | ${c.email} | ${c.phone} | ${c.scheduledAt.toLocaleString("es-CO")} | ${c.status} | creada: ${c.createdAt.toLocaleString("es-CO")}`);
  });
}
main().finally(() => db.$disconnect());
