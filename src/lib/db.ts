import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

/**
 * Configuración de base de datos que funciona en:
 * - Vercel (producción): PostgreSQL via Supabase
 * - Sandbox Z.ai (desarrollo): SQLite local
 *
 * El schema.prisma dice "postgresql" para Vercel.
 * En el sandbox, forzamos SQLite sobrescribiendo el datasource URL.
 */

function getDatabaseConfig() {
  const envUrl = process.env.DATABASE_URL

  // Si es URL de PostgreSQL (Vercel/Supabase), usarla directamente
  if (envUrl && (envUrl.startsWith('postgresql://') || envUrl.startsWith('postgres://'))) {
    return {
      url: envUrl,
      provider: 'postgresql' as const,
    }
  }

  // Si es URL de SQLite (sandbox Z.ai), usarla
  if (envUrl && envUrl.startsWith('file:')) {
    return {
      url: envUrl,
      provider: 'sqlite' as const,
    }
  }

  // Fallback: buscar archivo SQLite local
  const sqlitePaths = [
    path.join(process.cwd(), 'db', 'custom.db'),
    '/home/z/my-project/db/custom.db',
    path.join(process.cwd(), '..', 'db', 'custom.db'),
  ]

  for (const p of sqlitePaths) {
    if (fs.existsSync(p)) {
      return {
        url: `file:${p}`,
        provider: 'sqlite' as const,
      }
    }
  }

  // Último recurso: usar lo que haya en .env
  return {
    url: envUrl || 'file:db/custom.db',
    provider: 'sqlite' as const,
  }
}

const dbConfig = getDatabaseConfig()
process.env.DATABASE_URL = dbConfig.url

console.log(`🗄️ [DB] Using: ${dbConfig.provider} at ${dbConfig.url.substring(0, 50)}...`)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: dbConfig.url,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
