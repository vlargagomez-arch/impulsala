import { db } from "../src/lib/db";
async function main() {
  const count = await db.appointment.count();
  console.log(`Total citas: ${count}`);
  const leads = await db.bookingLead.count();
  console.log(`Total leads: ${leads}`);
  const subs = await db.newsletter.count();
  console.log(`Total suscriptores: ${subs}`);
}
main().finally(() => db.$disconnect());
