#!/bin/bash
# ============================================================
# MIGRACIÓN AUTOMÁTICA SQLite → PostgreSQL
# ============================================================
# Este script migra tu base de datos SQLite a PostgreSQL
# para que funcione en Vercel.
#
# USO:
#   1. Crea cuenta en https://supabase.com (gratis)
#   2. Crea un proyecto nuevo
#   3. Copia la DATABASE_URL de Supabase
#   4. Ejecuta: bash deploy-kit/migrate-to-postgres.sh
#   5. Pega la URL cuando te la pida
# ============================================================

set -e

echo "🚀 Migración SQLite → PostgreSQL"
echo "================================"
echo ""

# Verificar que existe la BD SQLite
if [ ! -f "db/custom.db" ]; then
  echo "❌ No se encontró db/custom.db"
  exit 1
fi

# Pedir URL de PostgreSQL
read -p "Pega tu DATABASE_URL de Supabase (postgres://...): " POSTGRES_URL

if [ -z "$POSTGRES_URL" ]; then
  echo "❌ URL vacía"
  exit 1
fi

echo ""
echo "📋 Resumen:"
echo "  Origen: SQLite (db/custom.db)"
echo "  Destino: PostgreSQL (Supabase)"
echo ""

# 1. Backup de la BD actual
echo "1. Haciendo backup de SQLite..."
cp db/custom.db db/custom.db.backup
echo "   ✅ Backup en db/custom.db.backup"

# 2. Cambiar schema a PostgreSQL
echo ""
echo "2. Actualizando prisma/schema.prisma a PostgreSQL..."
cp prisma/schema.prisma prisma/schema.prisma.backup
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
echo "   ✅ Schema actualizado"

# 3. Actualizar .env
echo ""
echo "3. Actualizando .env con PostgreSQL..."
cp .env .env.backup
sed -i "s|DATABASE_URL=file:.*|DATABASE_URL=\"$POSTGRES_URL\"|" .env
echo "   ✅ .env actualizado"

# 4. Generar Prisma client
echo ""
echo "4. Generando Prisma client..."
bunx prisma generate
echo "   ✅ Prisma client generado"

# 5. Push schema a PostgreSQL
echo ""
echo "5. Subiendo schema a PostgreSQL..."
bunx prisma db push
echo "   ✅ Schema subido"

# 6. Migrar datos existentes
echo ""
echo "6. Migrando datos existentes..."
cat > /tmp/migrate-data.ts << 'EOF'
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";

const postgres = new PrismaClient();
const sqlite = new Database("db/custom.db.backup");

async function migrate() {
  console.log("Migrando datos...");

  // Admins
  const admins = sqlite.prepare("SELECT * FROM Admin").all();
  for (const a of admins) {
    await postgres.admin.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        email: a.email,
        name: a.name,
        passwordHash: a.passwordHash,
        role: a.role,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      },
      update: {},
    });
  }
  console.log(`  ✅ ${admins.length} admins`);

  // Appointments
  const appts = sqlite.prepare("SELECT * FROM Appointment").all();
  for (const a of appts) {
    await postgres.appointment.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        name: a.name,
        business: a.business,
        hasWebsite: a.hasWebsite,
        email: a.email,
        phone: a.phone,
        scheduledAt: new Date(a.scheduledAt),
        durationMin: a.durationMin,
        status: a.status,
        notes: a.notes,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
      },
      update: {},
    });
  }
  console.log(`  ✅ ${appts.length} appointments`);

  // Newsletter
  const newsletter = sqlite.prepare("SELECT * FROM Newsletter").all();
  for (const n of newsletter) {
    await postgres.newsletter.upsert({
      where: { id: n.id },
      create: {
        id: n.id,
        email: n.email,
        source: n.source,
        status: n.status,
        ipHash: n.ipHash,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt),
      },
      update: {},
    });
  }
  console.log(`  ✅ ${newsletter.length} newsletter`);

  // BookingLead
  const leads = sqlite.prepare("SELECT * FROM BookingLead").all();
  for (const l of leads) {
    await postgres.bookingLead.upsert({
      where: { id: l.id },
      create: {
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        hasBusiness: l.hasBusiness,
        source: l.source,
        status: l.status,
        estimatedValue: l.estimatedValue,
        notes: l.notes,
        ipHash: l.ipHash,
        createdAt: new Date(l.createdAt),
        updatedAt: new Date(l.updatedAt),
      },
      update: {},
    });
  }
  console.log(`  ✅ ${leads.length} leads`);

  console.log("✅ Migración completa!");
}

migrate().finally(() => postgres.$disconnect());
EOF
bun run /tmp/migrate-data.ts
echo "   ✅ Datos migrados"

# 7. Verificar
echo ""
echo "7. Verificando migración..."
cat > /tmp/verify.ts << 'EOF'
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  console.log("Admins:", await db.admin.count());
  console.log("Citas:", await db.appointment.count());
  console.log("Leads:", await db.bookingLead.count());
  console.log("Newsletter:", await db.newsletter.count());
}
main().finally(() => db.$disconnect());
EOF
bun run /tmp/verify.ts

echo ""
echo "🎉 ¡Migración completa!"
echo ""
echo "Tu PostgreSQL en Supabase tiene todos los datos."
echo "Ahora puedes deployar en Vercel."
