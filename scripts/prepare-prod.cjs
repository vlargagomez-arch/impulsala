/* eslint-disable @typescript-eslint/no-require-imports */
// Prebuild de produccion (Vercel): fuerza PostgreSQL en produccion.
// Copia db.ts correcto y cambia schema.prisma a postgresql, inmune a Z.ai.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dbUrl = (process.env.DATABASE_URL || '').trim();
const isPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://');
if (!isPostgres) {
  console.log('[prepare-prod] DATABASE_URL no es postgresql (dev local), no se aplica.');
  process.exit(0);
}
// 1) schema.prisma: sqlite -> postgresql
const schemaPath = path.join(root, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');
if (schema.includes('provider = "sqlite"')) {
  schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('[prepare-prod] schema.prisma: sqlite -> postgresql OK');
} else {
  console.log('[prepare-prod] schema.prisma: ya postgresql');
}
// 2) db.ts: copiar plantilla correcta (sin logica sqlite)
const srcDb = path.join(root, 'scripts', 'db.prod.template.ts');
const dstDb = path.join(root, 'src', 'lib', 'db.ts');
if (fs.existsSync(srcDb)) {
  fs.copyFileSync(srcDb, dstDb);
  console.log('[prepare-prod] db.ts: plantilla produccion copiada OK');
} else {
  console.log('[prepare-prod] WARN: no existe db.prod.template.ts');
}
console.log('[prepare-prod] Listo.');
