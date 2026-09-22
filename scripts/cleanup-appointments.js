const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const r = await prisma.appointment.deleteMany({});
  console.log(`Deleted ${r.count} appointments`);
}
main().finally(() => prisma.$disconnect());
