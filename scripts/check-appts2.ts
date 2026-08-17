import { db } from "../src/lib/db";
async function main() {
  const appts = await db.appointment.findMany({
    where: { status: "confirmed" },
    select: { name: true, scheduledAt: true, status: true },
    orderBy: { scheduledAt: "asc" },
    take: 5,
  });
  console.log("Citas confirmadas:");
  appts.forEach(a => console.log(`  ${a.name} | ${a.scheduledAt.toISOString()} | ${a.status}`));
}
main().finally(() => db.$disconnect());
