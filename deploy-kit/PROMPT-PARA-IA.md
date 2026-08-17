# ============================================================
# PROMPT PARA HERMES (u otro asistente IA)
# ============================================================
#
# Copia y pega este texto en Hermes, Claude, Cursor, o cualquier
# otro asistente IA con acceso a tu computadora.
#
# El asistente IA puede ejecutar TODOS los pasos automáticamente.
# ============================================================

Hola. Tengo un proyecto Next.js que quiero migrar de Z.ai a Vercel + Supabase.

El proyecto ya está preparado para migración. Sigue EXACTAMENTE estos pasos:

## CONTEXTO
- Proyecto: Impulsala (agencia web + CRM + chatbot IA)
- Stack: Next.js 16, Prisma, SQLite (a migrar a PostgreSQL), Tailwind 4
- Ubicación: carpeta descargada del ZIP `impulsala-codigo-fuente.zip`

## PASOS A SEGUIR

### Paso 1: Preparar el proyecto local
1. Descomprime `impulsala-codigo-fuente.zip`
2. `cd impulsala`
3. `bun install`
4. Verifica que el proyecto corre con `bun run dev` (luego Ctrl+C)

### Paso 2: Crear Supabase (lo guío al usuario)
1. Dile al usuario: "Entra a https://supabase.com y crea un proyecto nuevo llamado impulsala"
2. Dile: "Copia la Connection String URI de Settings → Database"
3. Pídele que te pegue la URL (formato: postgresql://postgres:...)

### Paso 3: Migrar base de datos
Ejecuta el script que ya está preparado:
```bash
bash deploy-kit/migrate-to-postgres.sh
```
Cuando pida la URL, pega la de Supabase que te dio el usuario.
Verifica que migre: 16 citas, 17 leads, 9 newsletter, 1 admin.

### Paso 4: Subir a GitHub
1. Pregunta al usuario si tiene cuenta de GitHub
2. Si no, dile que cree en https://github.com
3. Ejecuta:
```bash
git init
git add .
git commit -m "Initial commit: Impulsala"
git branch -M main
gh repo create impulsala --public --source=. --push
```
(Si no tiene gh CLI, crea el repo manualmente en github.com/new y luego:
 `git remote add origin https://github.com/USUARIO/impulsala.git`
 `git push -u origin main`)

### Paso 5: Deploy en Vercel
1. Dile al usuario: "Entra a https://vercel.com/new e importa el repo impulsala"
2. Dile: "En Environment Variables, agrega estas EXACTAS:"
   - DATABASE_URL = [URL de Supabase]
   - NEXTAUTH_SECRET = [NEXTAUTH-SECRET-EN-ENV]
   - NEXTAUTH_URL = https://[nombre-app].vercel.app
   - CRM_ADMIN_EMAIL = admin@impulsala.co
   - CRM_ADMIN_PASSWORD = nexus2026
   - NEXT_PUBLIC_SITE_URL = https://[nombre-app].vercel.app
   - EMAIL_USER = admin@impulsala.com
   - EMAIL_PASS = [EMAIL-PASS-EN-ENV]
   - GOOGLE_CLIENT_ID = [CLIENT-ID-EN-ENV]
   - GOOGLE_CLIENT_SECRET = [CLIENT-SECRET-EN-ENV]
   - GOOGLE_REDIRECT_URI = https://[nombre-app].vercel.app/api/google-calendar/callback
3. Dile: "Click en Deploy y espera 5 min"

### Paso 6: Actualizar Google OAuth
1. Dile al usuario: "Entra a https://console.cloud.google.com/apis/credentials"
2. Dile: "Edita el OAuth client y en Authorized redirect URIs agrega:
   https://[nombre-app].vercel.app/api/google-calendar/callback"
3. Dile: "Click Save"

### Paso 7: Verificar
1. Dile: "Entra a https://[nombre-app].vercel.app"
2. Verifica que cargue la home
3. Dile: "Entra a /crm y haz login con admin@impulsala.co / nexus2026"
4. Si funciona, ¡listo!
5. Si falla, lee el error y busca la solución en deploy-kit/README-VERCEL.md

## IMPORTANTE
- NO inventes pasos. Sigue EXACTAMENTE esta guía.
- Si algo falla, detente y lee el error completo.
- Las variables de entorno en Vercel son CASE-SENSITIVE (copia y pega exacto).
- El paso más crítico es el Paso 3 (migración). Si falla, todo falla.
- Después de cada paso, verifica que funcionó antes de seguir.
- Si el usuario no sabe algo, explícale antes de continuar.

## TIEMPO ESTIMADO: 30-45 minutos
## COSTO: $0 (gratis en Vercel + Supabase)
