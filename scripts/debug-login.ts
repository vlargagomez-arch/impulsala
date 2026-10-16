import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("=== DEBUG LOGIN ===");

  // 1. Verificar que el admin existe
  const admin = await db.admin.findUnique({
    where: { email: "admin@impulsa.co" },
  });

  if (!admin) {
    console.log("❌ Admin NO existe en la BD");
    console.log("Creando admin...");
    const hash = await bcrypt.hash("nexus2026", 10);
    await db.admin.create({
      data: {
        email: "admin@impulsa.co",
        name: "Administrador",
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("✅ Admin creado");
    return;
  }

  console.log("✅ Admin encontrado:");
  console.log("  ID:", admin.id);
  console.log("  Email:", admin.email);
  console.log("  Hash (primeros 40):", admin.passwordHash.substring(0, 40));
  console.log("  Role:", admin.role);

  // 2. Probar bcrypt.compareSync directamente
  console.log("\n=== PROBAR BCRYPT ===");
  const password = "nexus2026";
  console.log("Password a probar:", password);

  const match = bcrypt.compareSync(password, admin.passwordHash);
  console.log("¿Password coincide?", match ? "✅ SÍ" : "❌ NO");

  if (!match) {
    console.log("\n⚠️ Hash no coincide. Generando hash nuevo...");
    const newHash = await bcrypt.hash(password, 10);
    console.log("Nuevo hash:", newHash);

    // Verificar nuevo hash
    const newMatch = bcrypt.compareSync(password, newHash);
    console.log("¿Nuevo hash funciona?", newMatch ? "✅ SÍ" : "❌ NO");

    // Actualizar en BD
    await db.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });
    console.log("✅ Hash actualizado en BD");

    // Verificar desde BD
    const updated = await db.admin.findUnique({ where: { id: admin.id } });
    const finalMatch = bcrypt.compareSync(password, updated!.passwordHash);
    console.log("¿Hash desde BD funciona?", finalMatch ? "✅ SÍ" : "❌ NO");
  }
}

main().finally(() => process.exit(0));
