# Llevar Impulsala a un VPS / hosting propio

Objetivo: que la web, el CRM, los agentes y la base de datos corran en un servidor propio, con HTTPS y automatización igual que hoy. **Vercel sigue funcionando como respaldo** hasta que el VPS esté estable.

## 0. Requisitos
- VPS con Ubuntu 22.04+ (2 vCPU / 4 GB RAM es suficiente para empezar), Docker y Docker Compose instalados.
- Dominio apuntando al IP del VPS (por ejemplo `impulsala.com` → A record).
- El repo local: `C:\Users\themo\impulsala-github`.

## 1. Base de datos
Opción A (recomendada para arrancar): seguir con **Supabase** — solo se copian las variables de entorno.
Opción B (todo propio): Postgres en el VPS y migrar los datos.

```bash
# Copia desde Supabase (desde tu máquina, con la URL real en .dburl)
pg_dump "$(cat .dburl)" --no-owner --no-privileges -f impulsala.sql

# En el VPS, con el contenedor de Postgres levantado
docker compose exec -T db psql -U impulsala -d impulsala < impulsala.sql
```
Verificar: `docker compose exec db psql -U impulsala -d impulsala -c "\dt"` debe listar las **13 tablas** (incluidas `AgentRun` y `AgentLog`).

## 2. Variables de entorno
Copiar `.env.production.example` → `.env` en el VPS y llenar:
`DATABASE_URL`, `DEEPSEEK_API_KEY`, `CRON_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `CRM_ADMIN_EMAIL`,
`CRM_ADMIN_PASSWORD`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`,
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`.

Los valores reales se leen con `vercel env ls` (nombres) y de los archivos locales del proyecto (`.dburl`); **nunca se pegan en el chat**.

## 3. Levantar la app
```bash
cd /opt/impulsala
docker compose up -d --build
docker compose logs -f app        # debe terminar en "Ready" y responder en el puerto 3000 interno
curl -s localhost:3000 | head -5  # 200 esperado
```
Caddy emite el certificado HTTPS automáticamente cuando el dominio ya apunta al VPS.

## 4. Crons del sistema (reemplazan los de Vercel)
En el VPS (`crontab -e`), usando el mismo `CRON_SECRET`:
```cron
0 13 * * * curl -s "https://impulsala.com/api/agents/cron?task=followup&secret=$CRON_SECRET" >> /var/log/impulsala-cron.log 2>&1
0 14 * * * curl -s "https://impulsala.com/api/agents/cron?task=blog&secret=$CRON_SECRET" >> /var/log/impulsala-cron.log 2>&1
```
(Los lunes, `followup` dispara también el reporte semanal.) Si el hosting no permite crons, usar cron-job.org apuntando a esas dos URLs.

## 5. Verificación post-migración
Con `scripts/ops.cjs` apuntando al nuevo dominio: `IMPULSALA_URL=https://impulsala.com node scripts/ops.cjs status`.
Debe dar OK en home, slots (BD), blog, `/api/setup-db` (401) y chat del agente.

## 6. Respaldos
```cron
0 3 * * * docker compose exec -T db pg_dump -U impulsala impulsala | gzip > /backups/impulsala-$(date +\%F).sql.gz
```
Guardar 30 días y probar una restauración antes de confiar en el respaldo.

## 7. Checklist de corte
- [ ] `.env` completo y sin secretos en el repo
- [ ] 13 tablas presentes
- [ ] `ops.cjs status` OK contra el dominio nuevo
- [ ] 2 crons activos y con log
- [ ] Google Calendar reconectado (OAuth) si se cambió el dominio
- [ ] respaldo diario funcionando
- [ ] Vercel sigue en pie como respaldo 1 semana
