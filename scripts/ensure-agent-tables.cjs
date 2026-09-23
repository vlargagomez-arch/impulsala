// Crea las tablas de los agentes (AgentRun / AgentLog) si no existen.
// Usa SQL crudo vía Prisma porque `prisma db push` falla contra el pooler de Supabase.
// Uso: DATABASE_URL="$(cat .dburl)" node scripts/ensure-agent-tables.cjs
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const url = process.env.DATABASE_URL || fs.readFileSync(".dburl", "utf8").trim();
const prisma = new PrismaClient({ datasources: { db: { url } } });

const statements = [
  `CREATE TABLE IF NOT EXISTS "AgentRun" (
    "id" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "summary" TEXT NOT NULL DEFAULT '',
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "AgentRun_agent_idx" ON "AgentRun"("agent")`,
  `CREATE INDEX IF NOT EXISTS "AgentRun_createdAt_idx" ON "AgentRun"("createdAt")`,
  `CREATE TABLE IF NOT EXISTS "AgentLog" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentLog_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "AgentLog_conversationId_idx" ON "AgentLog"("conversationId")`,
  `CREATE INDEX IF NOT EXISTS "AgentLog_createdAt_idx" ON "AgentLog"("createdAt")`,
];

(async () => {
  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
    console.log("OK:", sql.split("\n")[0].slice(0, 70));
  }
  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`;
  console.log("TABLAS:", tables.map((t) => t.tablename).join(", "));
  const runs = await prisma.$queryRaw`SELECT count(*)::int AS n FROM "AgentRun"`;
  const logs = await prisma.$queryRaw`SELECT count(*)::int AS n FROM "AgentLog"`;
  console.log("AgentRun filas:", runs[0].n, "| AgentLog filas:", logs[0].n);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("ERROR:", String(e.message || e).slice(0, 300));
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
