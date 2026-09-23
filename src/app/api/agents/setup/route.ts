import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mantenimiento: crea las tablas de los agentes (AgentRun, AgentLog) si no existen.
 * Idempotente y protegido con CRON_SECRET.
 *   GET /api/agents/setup?secret=XXX
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.nextUrl.searchParams.get("secret") || "";
  if (!secret || provided !== secret) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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

  const done: string[] = [];
  for (const sql of statements) {
    await db.$executeRawUnsafe(sql);
    done.push(sql.split("\n")[0].replace(/CREATE (TABLE IF NOT EXISTS|INDEX IF NOT EXISTS)/, "CREATE").slice(0, 60));
  }

  const [runs, logs] = await Promise.all([
    db.agentRun.count().catch(() => -1),
    db.agentLog.count().catch(() => -1),
  ]);

  return NextResponse.json({ ok: true, ejecutado: done, agentRunFilas: runs, agentLogFilas: logs });
}
