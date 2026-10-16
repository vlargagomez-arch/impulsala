import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const count = await db.admin.count();
  console.log("Total admins en BD:", count);

  const admins = await db.admin.findMany();
  admins.forEach(a => {
    console.log(`\n- Email: ${a.email}`);
    console.log(`  Hash: ${a.passwordHash.substring(0, 40)}...`);
    console.log(`  Role: ${a.role}`);

    // Probar si "nexus2026" hace match con el hash
    const match = bcrypt.compareSync("nexus2026", a.passwordHash);
    console.log(`  "nexus2026" match: ${match ? "✅ SÍ" : "❌ NO"}`);
  });

  // Si no hay admin, crearlo
  if (count === 0) {
    console.log("\n⚠️ No hay admin. Creando admin por defecto...");
    const hash = await bcrypt.hash("nexus2026", 10);
    const admin = await db.admin.create({
      data: {
        email: "admin@impulsa.co",
        name: "Administrador",
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("✅ Admin creado:", admin.email);
  } else if (admins.length > 0) {
    // Si hay admin pero la contraseña no coincide, resetearla
    const admin = admins[0];
    const match = bcrypt.compareSync("nexus2026", admin.passwordHash);
    if (!match) {
      console.log("\n⚠️ Contraseña no coincide. Reseteando a 'nexus2026'...");
      const hash = await bcrypt.hash("nexus2026", 10);
      await db.admin.update({
        where: { id: admin.id },
        data: { passwordHash: hash },
      });
      console.log("✅ Contraseña reseteada");

      // Verificar
      const updated = await db.admin.findUnique({ where: { id: admin.id } });
      const newMatch = bcrypt.compareSync("nexus2026", updated!.passwordHash);
      console.log(`  Verificación: ${newMatch ? "✅ OK" : "❌ AÚN FALLA"}`);
    }
  }
}

main().finally(() => process.exit(0));
