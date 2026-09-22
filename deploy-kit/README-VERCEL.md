# ============================================================
# DEPLOY GUIDE - Impulsala a Vercel
# ============================================================
#
# Esta guía la puede seguir cualquier asistente IA (Hermes,
# Claude, Cursor, etc.) o un humano. Son pasos exactos.
#
# TIEMPO ESTIMADO: 30-45 minutos
# COSTO: $0 (gratis en Vercel + Supabase)
# ============================================================

## PASO 0: Pre-requisitos (5 min)

Necesitas:
- [ ] Cuenta de GitHub (gratis en https://github.com)
- [ ] Cuenta de Vercel (gratis en https://vercel.com - login con GitHub)
- [ ] Cuenta de Supabase (gratis en https://supabase.com)
- [ ] El archivo ZIP del proyecto descargado

## PASO 1: Crear proyecto en Supabase (10 min)

1. Entra a https://supabase.com y crea cuenta
2. Click "New Project"
3. Name: `impulsala`
4. Database Password: genera una segura y guárdala
5. Region: US East (o la más cercana a Colombia)
6. Click "Create new project" (espera 2 min)

7. Ve a **Settings → Database → Connection string → URI**
8. Copia la URL completa, se ve así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
9. Reemplaza `[YOUR-PASSWORD]` con tu password real
10. Guarda esta URL, la vas a usar después

## PASO 2: Migrar base de datos (5 min)

En tu computadora, en la carpeta del proyecto:

```bash
# Instalar dependencias
bun install

# Ejecutar migración
bash deploy-kit/migrate-to-postgres.sh
# Cuando pida la URL, pega la de Supabase
```

Esto migra automáticamente:
- 16 citas existentes
- 17 leads
- 9 suscriptores newsletter
- 1 admin

## PASO 3: Subir a GitHub (5 min)

### Opción A: Con línea de comandos
```bash
# Inicializar git (si no existe)
git init
git add .
git commit -m "Initial commit: Impulsala"

# Crear repo en GitHub (necesitas GitHub CLI)
gh repo create impulsala --public --source=. --push
```

### Opción B: Con interfaz web
1. Entra a https://github.com/new
2. Repository name: `impulsala`
3. Public (gratis)
4. Click "Create repository"
5. En tu computadora:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/impulsala.git
   git push -u origin main
   ```

## PASO 4: Conectar Vercel (5 min)

1. Entra a https://vercel.com/new
2. Importa tu repo `impulsala` de GitHub
3. Framework Preset: **Next.js** (detecta automático)
4. NO cambies nada más
5. Click "Environment Variables" y agrega TODAS estas:

```
DATABASE_URL = [pega tu URL de Supabase]
NEXTAUTH_SECRET = [NEXTAUTH-SECRET-EN-ENV]
NEXTAUTH_URL = https://impulsala.vercel.app
CRM_ADMIN_EMAIL = admin@impulsala.co
CRM_ADMIN_PASSWORD = nexus2026
NEXT_PUBLIC_SITE_URL = https://impulsala.vercel.app
EMAIL_USER = tu-email@gmail.com
EMAIL_PASS = tu-app-password-de-gmail
GOOGLE_CLIENT_ID = tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = tu-google-client-secret
GOOGLE_REDIRECT_URI = https://impulsala.vercel.app/api/google-calendar/callback
```

6. Click "Deploy"
7. Espera 3-5 min a que termine

## PASO 5: Actualizar Google OAuth (5 min)

1. Entra a https://console.cloud.google.com/apis/credentials
2. Click en tu OAuth client (Impulsala Web)
3. En "Authorized redirect URIs" agrega:
   ```
   https://impulsala.vercel.app/api/google-calendar/callback
   ```
   (reemplaza `impulsala` con el nombre real de tu app en Vercel)
4. Click "Save"
5. Espera 5 min a que propaguen

## PASO 6: Conectar dominio propio (opcional, 5 min)

Si compraste un dominio:

1. En Vercel, ve a tu proyecto → **Settings → Domains**
2. Agrega tu dominio: `impulsala.co`
3. Vercel te da instrucciones DNS
4. Ve a tu proveedor de dominio (Namecheap, Cloudflare, etc.)
5. Configura los DNS que Vercel te indica
6. Espera 5-30 min a que propaguen
7. SSL se configura automático

## PASO 7: Verificar todo (5 min)

Entra a tu URL de Vercel:
- [ ] Home carga
- [ ] /crm funciona (login: admin@impulsala.co / nexus2026)
- [ ] Gmail funciona (envía email de prueba)
- [ ] Google Calendar se puede conectar
- [ ] Crear cita genera Google Meet link

## SI ALGO FALLA

### Error: "Prisma Client not found"
```bash
bunx prisma generate
```

### Error: "Database connection failed"
- Verifica que DATABASE_URL esté bien en Vercel
- Verifica que el password de Supabase sea correcto

### Error: "Google OAuth redirect_uri_mismatch"
- Actualiza la URL en Google Cloud Console
- Espera 5 min

### CRM no carga (500 error)
- Verifica NEXTAUTH_SECRET esté configurado
- Verifica NEXTAUTH_URL apunte a tu dominio de Vercel

## PARA ASISTENTES IA (Hermes, Claude, etc.)

Si un asistente IA está ejecutando esto:

1. Lee todos los pasos completos antes de empezar
2. NO saltes pasos
3. Si algo falla, lee el error completo antes de continuar
4. Las variables de entorno en Vercel deben ser EXACTAS (copia y pega)
5. Después de cada paso, verifica que funcionó antes de seguir
6. El paso más crítico es el PASO 2 (migración) - si falla, todo falla

## ARCHIVOS IMPORTANTES EN ESTE KIT

- `migrate-to-postgres.sh` — Migra SQLite a PostgreSQL
- `vercel.json` — Configuración de Vercel
- `.github/workflows/deploy.yml` — Deploy automático
- `README-VERCEL.md` — Este archivo

## TIEMPO TOTAL ESTIMADO

- Pasos 1-2 (Supabase + migración): 15 min
- Pasos 3-4 (GitHub + Vercel): 10 min
- Pasos 5-7 (OAuth + verificar): 15 min
- **Total: 40 minutos**

vs 6-8 horas haciéndolo manualmente.
