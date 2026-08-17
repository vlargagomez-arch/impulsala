import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const admin = await db.admin.findUnique({ where: { email: "admin@impulsa.co" } });
  if (admin) {
    console.log("✅ Admin ya existe:", admin.email, "| role:", admin.role);
    // Verificar password
    const valid = await bcrypt.compare("nexus2026", admin.passwordHash);
    console.log("   Password 'nexus2026' válida:", valid ? "✅ SÍ" : "❌ NO");
    if (!valid) {
      console.log("   Regenerando password...");
      const hash = await bcrypt.hash("nexus2026", 10);
      await db.admin.update({ where: { id: admin.id }, data: { passwordHash: hash } });
      console.log("   ✅ Password actualizada");
    }
  } else {
    console.log("❌ Admin NO existe. Creándolo...");
    const hash = await bcrypt.hash("nexus2026", 10);
    const newAdmin = await db.admin.create({
      data: {
        email: "admin@impulsa.co",
        name: "Administrador",
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("✅ Admin creado:", newAdmin.email);
  }
}

main().finally(() => db.$disconnect());
