import { PrismaClient } from '@prisma/client'

// Plantilla de producción (Vercel + Supabase PostgreSQL).
// Usa process.env.DATABASE_URL directamente (pooler postgresql).
const databaseUrl = process.env.DATABASE_URL || 'file:db/custom.db'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
