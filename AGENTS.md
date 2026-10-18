# AGENTS.md — Impulsala

Contexto completo para cualquier asistente/agente que trabaje en este repo. **No re-descubras: lee esto y actúa.**

## Qué es
Sitio + CRM + capa de agentes IA de **Impulsala**, agencia digital en Bogotá (desarrollo web, SEO, publicidad, automatización con IA). Live: **https://impulsala.vercel.app**

## Stack y rutas
- Next.js 15 (App Router) + Prisma + PostgreSQL (Supabase) + Tailwind. Deploy en **Vercel** (scope `vlargagomez-3106s-projects`, proyecto `impulsala`).
- Repo: `github.com/vlargagomez-arch/impulsala` (rama `main`). Token GitHub local: `.vtok` (gitignored).
- DB: Supabase ref `dqzwspkdfzqjvlveclgq` (us-east-1). Pooler: `aws-0-us-east-1.pooler.supabase.com:6543` (`sslmode=require&pgbouncer=true&connection_limit=1`). URL real en `.dburl` (gitignored). `db.<ref>.supabase.co` NO resuelve.
- Secreto de crons en Vercel: `CRON_SECRET`.

## Operaciones (usa esto, no sondas manuales)
```bash
node scripts/ops.cjs status   # salud de producción (home, BD, agentes, panel, chat)
node scripts/ops.cjs deploy   # push a main + vercel --prod
node scripts/ops.cjs tables   # crea/verifica AgentRun + AgentLog
node scripts/ops.cjs logs     # últimos errores de runtime
node scripts/ops.cjs env      # variables de entorno en Vercel
node scripts/ops.cjs blog     # ejecuta el agente SEO ahora
```
Build de Vercel (`vercel.json`): `node scripts/prepare-prod.cjs && npx prisma generate && next build`, install `bun install`.
Verificación local válida: `npx prisma generate && npx next build` (exit 0) + `npx next start -p 3100` + `curl localhost:3100`.
`bun run build` local está roto a propósito en Windows (su `cp -r` falla) y `bun run lint` tiene errores preexistentes ajenos; no los uses como señal.

## Rutas de la app
- Páginas: `/`, `/servicios/*`, `/demos`, `/blog`, `/blog/[slug]`, `/contacto`, `/diagnostico-gratis`, `/crm` (admin).
- API pública: `/api/appointments`, `/api/appointments/slots`, `/api/booking-leads`, `/api/newsletter`, `/api/blog/posts`, `/api/agents/chat`.
- API admin (cookie `nexus-admin-session` = base64 de `admin@impulsala.com:...`): `/api/crm/*`, `/api/agents/status`.
- Cron/secret: `/api/agents/cron?task=blog|followup|report`, `/api/agents/setup`, `/api/setup-db` (protegido; **inserta datos demo, jamás dejarlo público**).

## Agentes IA
- Librería: `src/lib/agents/` (deepseek.ts, knowledge.ts, tools.ts, runner.ts).
- Herramientas del agente de ventas: `guardar_lead` (CRM + correo al equipo), `agendar_cita` (crea cita real + Google Calendar/Meet + correos), `ver_horarios_disponibles`, `escalar_a_humano` (WhatsApp +57 319 635 4992).
- Widget web: `src/components/site/ai-chat-fab.tsx`. Panel: CRM pestaña **Automatización IA** (`src/components/crm/agents.tsx`).
- Crons (`vercel.json`): blog 14:00 UTC, followup 13:00 UTC (lunes también reporte semanal).

## Base de datos
- 13 tablas: User, Post, Appointment, Newsletter, BookingLead, LeadNote, FollowUp, Admin, EmailCampaign, OAuthToken, BlogArticle, AgentRun, AgentLog.
- **`prisma db push` falla contra el pooler.** Para DDL usar `node scripts/ensure-agent-tables.cjs` o `db.$executeRawUnsafe(...)`.
- Tablas nuevas ⇒ DDL por script + `npx prisma generate` (ya incluido en el build de Vercel).

## Reglas
1. Nunca commitear `.env*`, `.vtok`, `.dburl` (ya en `.gitignore`).
2. Un agente externo (Z.ai) hace `push --force` en `main`: antes de pushear, `git fetch origin main` y rebasar; nunca force-push encima del suyo.
3. Después de cualquier cambio: `node scripts/ops.cjs deploy` y luego `node scripts/ops.cjs status` (verificar, no asumir).
4. Respuestas cortas, datos reales, sin relleno.
5. Para escalar a VPS/hosting propio: `deploy/VPS.md` (runbook) + `deploy/docker-compose.yml`.
