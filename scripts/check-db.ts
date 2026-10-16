// Verificar estado de la BD y citas
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const total = await db.appointment.count();
  console.log(`Total citas en BD: ${total}`);

  const all = await db.appointment.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      business: true,
      scheduledAt: true,
      status: true,
      createdAt: true,
    },
  });

  console.log("\nÚltimas 10 citas:");
  all.forEach((a, i) => {
    console.log(
      `${i + 1}. ${a.name} | ${a.phone} | ${a.email} | ${a.business} | ${a.scheduledAt.toISOString()} | ${a.status}`
    );
  });

  // Verificar otras tablas
  const leads = await db.bookingLead.count();
  const newsletter = await db.newsletter.count();
  const admin = await db.admin.count();

  console.log(`\nLeads: ${leads}`);
  console.log(`Newsletter: ${newsletter}`);
  console.log(`Admins: ${admin}`);
}

main()
  .catch((e) => {
    console.error("ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
