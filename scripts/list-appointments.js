const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const appts = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log(JSON.stringify(appts.map(a => ({
    id: a.id.slice(-8),
    name: a.name,
    business: a.business,
    hasWebsite: a.hasWebsite,
    email: a.email,
    phone: a.phone,
    scheduledAt: a.scheduledAt.toISOString(),
    status: a.status,
  })), null, 2));
}
main().finally(() => prisma.$disconnect());
