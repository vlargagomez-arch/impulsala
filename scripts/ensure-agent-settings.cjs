// Crea la tabla AgentSetting (interruptores on/off de los agentes) por SQL crudo — prisma db push falla contra el pooler.
const fs = require('fs');
const path = require('path');
const REPO = 'C:/Users/themo/impulsala-github';
process.env.DATABASE_URL = process.env.DATABASE_URL || fs.readFileSync(path.join(REPO, '.dburl'), 'utf8').trim();
const { PrismaClient } = require(path.join(REPO, 'node_modules/@prisma/client'));
const db = new PrismaClient();

const SQL = `CREATE TABLE IF NOT EXISTS "AgentSetting" (
  agent text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  note text,
  "updatedAt" timestamptz NOT NULL DEFAULT now()
)`;

(async () => {
  try {
    await db.$executeRawUnsafe(SQL);
    const cols = await db.$queryRawUnsafe(
      `select column_name, data_type from information_schema.columns where table_name = 'AgentSetting' order by ordinal_position`,
    );
    console.log('AgentSetting columnas:', JSON.stringify(cols));
    const filas = await db.$queryRawUnsafe(`select agent, enabled, "updatedAt" from "AgentSetting"`);
    console.log('filas actuales:', JSON.stringify(filas));
  } catch (e) {
    console.error('ERROR DDL:', e.message.split('\n').slice(0, 3).join(' | '));
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
})();
