# GUÍA COMPLETA PARA HERMES — Deploy de Impulsala en Vercel

## PROYECTO: Impulsala
## Agencia de desarrollo web, SEO, marketing digital e IA

---

## RESUMEN

Este proyecto es una web de agencia digital con:
- Página web pública (home, servicios, blog, demos, contacto)
- CRM interno (citas, leads, newsletter, campañas, blog)
- Chatbot con IA (ImpulsalaBot)
- Integración Gmail (emails reales)
- Integración Google Calendar + Meet
- Sistema de recordatorios por WhatsApp (manual)

**Stack:** Next.js 16 + Prisma + PostgreSQL + Tailwind CSS 4 + shadcn/ui

---

## PASO 1: CREAR CUENTAS (5 min)

### 1.1 GitHub
- URL: https://github.com
- Crear cuenta si no tiene
- Crear repositorio público llamado `impulsala`

### 1.2 Vercel
- URL: https://vercel.com
- Iniciar sesión con GitHub
- No necesita configuración adicional

### 1.3 Supabase
- URL: https://supabase.com
- Crear cuenta con Gmail
- Crear proyecto nuevo:
  - Name: `impulsala`
  - Database Password: generar una segura y guardarla
  - Region: US East (o la más cercana a Colombia)
  - Esperar 2 minutos a que cree el proyecto
- Ir a: Settings → Database → Connection string → URI
- Copiar la URL (formato: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`)
- Reemplazar `[PASSWORD]` con la contraseña real

---

## PASO 2: PREPARAR EL PROYECTO (10 min)

### 2.1 Descomprimir el ZIP
```bash
unzip impulsala-vercel.zip
cd impulsala
```

### 2.2 Cambiar Prisma a PostgreSQL
El archivo `prisma/schema.prisma` debe tener:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
(Si dice "sqlite", cambiarlo a "postgresql")

### 2.3 Crear archivo .env
Copiar `.env.example` a `.env` y completar con los valores reales:
```bash
cp .env.example .env
```

Editar `.env`:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
NEXTAUTH_SECRET=[NEXTAUTH_SECRET]
NEXTAUTH_URL=https://impulsala.vercel.app
CRM_ADMIN_EMAIL=admin@impulsala.com
CRM_ADMIN_PASSWORD=nexus2026
NEXT_PUBLIC_SITE_URL=https://impulsala.vercel.app
EMAIL_USER=vlargagomez@gmail.com
EMAIL_PASS=[EMAIL_PASS]
GOOGLE_CLIENT_ID=[GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[GOOGLE_CLIENT_SECRET]
GOOGLE_REDIRECT_URI=https://impulsala.vercel.app/api/google-calendar/callback
GOOGLE_SHEETS_WEBHOOK_URL=
```

### 2.4 Migrar base de datos a PostgreSQL
```bash
bun install
bunx prisma generate
bunx prisma db push
```

Esto crea todas las tablas en Supabase:
- Admin (1 registro: admin@impulsala.com)
- Appointment (citas)
- BookingLead (leads)
- Newsletter (suscriptores)
- EmailCampaign (campañas)
- OAuthToken (Google Calendar)
- BlogArticle (artículos del blog)

### 2.5 Probar localmente
```bash
bun run dev
```
Entrar a `http://localhost:3000` y verificar:
- Home carga
- CRM funciona (`/crm` con admin@impulsala.com / nexus2026)
- Blog funciona
- ImpulsalaBot funciona

---

## PASO 3: SUBIR A GITHUB (5 min)

### 3.1 Inicializar git
```bash
cd impulsala
git init
git add .
git commit -m "Initial commit: Impulsala web + CRM"
```

### 3.2 Subir a GitHub
```bash
git remote add origin https://github.com/[USUARIO]/impulsala.git
git branch -M main
git push -u origin main
```

---

## PASO 4: DEPLOYAR EN VERCEL (5 min)

### 4.1 Importar proyecto
1. Entrar a https://vercel.com/new
2. Importar el repositorio `impulsala` de GitHub
3. Framework Preset: Next.js (detecta automático)

### 4.2 Configurar variables de entorno
En "Environment Variables", agregar TODAS estas:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
NEXTAUTH_SECRET = [NEXTAUTH_SECRET]
NEXTAUTH_URL = https://impulsala.vercel.app
CRM_ADMIN_EMAIL = admin@impulsala.com
CRM_ADMIN_PASSWORD = nexus2026
NEXT_PUBLIC_SITE_URL = https://impulsala.vercel.app
EMAIL_USER = vlargagomez@gmail.com
EMAIL_PASS = [EMAIL_PASS]
GOOGLE_CLIENT_ID = [GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET = [GOOGLE_CLIENT_SECRET]
GOOGLE_REDIRECT_URI = https://impulsala.vercel.app/api/google-calendar/callback
GOOGLE_SHEETS_WEBHOOK_URL =
```

### 4.3 Deploy
- Click "Deploy"
- Esperar 3-5 minutos
- Vercel da una URL como: `https://impulsala-xxx.vercel.app`

### 4.4 Actualizar URLs
Después del primer deploy:
1. En Vercel → Settings → Environment Variables
2. Cambiar `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` a la URL real de Vercel
3. Cambiar `GOOGLE_REDIRECT_URI` a `https://[URL-VERCEL]/api/google-calendar/callback`
4. Redeploy

---

## PASO 5: CONFIGURAR GOOGLE OAUTH (5 min)

### 5.1 Actualizar redirect URI en Google Cloud
1. Ir a https://console.cloud.google.com/apis/credentials
2. Editar el OAuth client "Impulsala Web"
3. En "Authorized redirect URIs" agregar:
   `https://[URL-VERCEL]/api/google-calendar/callback`
4. Guardar

### 5.2 Conectar Google Calendar
1. Entrar al CRM en Vercel: `https://[URL-VERCEL]/crm`
2. Login: admin@impulsala.com / nexus2026
3. En Citas → click "Activar" Google Calendar
4. Google pedirá permiso (vlargagomez@gmail.com)
5. Click "Permitir"
6. Vuelve al CRM con banner verde

---

## PASO 6: CONECTAR DOMINIO (opcional, 5 min)

Si compraron un dominio (ej: impulsala.com):
1. Vercel → Settings → Domains
2. Agregar `impulsala.com`
3. Vercel da instrucciones DNS
4. Configurar en el proveedor del dominio
5. SSL automático
6. Actualizar variables de entorno con el dominio real

---

## ESTRUCTURA DEL PROYECTO

```
impulsala/
├── src/
│   ├── app/                  # Páginas y API routes
│   │   ├── api/              # APIs (citas, CRM, blog, etc.)
│   │   ├── blog/             # Blog público
│   │   ├── crm/              # CRM admin
│   │   ├── servicios/        # Páginas de servicios
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Home
│   ├── components/
│   │   ├── site/             # Componentes web pública
│   │   │   ├── ai-chat-fab.tsx    # ImpulsalaBot
│   │   │   ├── hero.tsx           # Sección hero
│   │   │   ├── navbar.tsx         # Barra de navegación
│   │   │   ├── footer.tsx         # Pie de página
│   │   │   └── ...
│   │   └── crm/              # Componentes CRM
│   │       ├── appointments.tsx   # Citas
│   │       ├── blog.tsx          # Blog CMS
│   │       ├── campaigns.tsx     # Campañas email
│   │       └── ...
│   └── lib/                  # Utilidades
│       ├── auth.ts           # NextAuth
│       ├── auth-guard.ts     # Protección de APIs
│       ├── db.ts             # Prisma (con fallback de path)
│       ├── email-sender.ts   # Gmail integration
│       ├── google-auth.ts    # Google Calendar OAuth
│       └── ...
├── prisma/
│   └── schema.prisma         # Modelo de base de datos
├── public/
│   ├── impulsala-logo.svg    # Logo {i}
│   ├── favicon.svg           # Favicon
│   ├── portfolio/            # Imágenes de clientes
│   └── blog/                 # Imágenes del blog
├── deploy-kit/               # Guías y scripts de deploy
├── package.json
├── vercel.json               # Configuración Vercel
├── .env.example              # Plantilla de variables
└── .gitignore
```

---

## CREDENCIALES

### CRM
- URL: https://[URL-VERCEL]/crm
- Email: admin@impulsala.com
- Password: nexus2026

### Gmail (para emails)
- Email: vlargagomez@gmail.com
- App Password: [EMAIL_PASS]

### Google Calendar OAuth
- Client ID: [GOOGLE_CLIENT_ID]
- Client Secret: [GOOGLE_CLIENT_SECRET]
- Cuenta autorizada: vlargagomez@gmail.com

### Teléfono de contacto
- 319 635 4992

---

## NOTAS IMPORTANTES

1. **Base de datos:** El proyecto usa PostgreSQL (Supabase). El SQLite anterior solo era para desarrollo.
2. **Emails:** Se envían vía Gmail con App Password. Funciona para hasta 100 emails por día.
3. **Google Calendar:** Requiere autorización OAuth UNA vez. Después funciona automático.
4. **WhatsApp:** Los recordatorios son manuales (link wa.me pre-cargado). No automatizado.
5. **Blog:** Se puede crear artículos desde el CRM. Los 25 artículos existentes están hardcodeados.
6. **Logo:** SVG con {i} (llaves de código + inicial de Impulsala). Gradiente índigo→fucsia.

---

## TIEMPO ESTIMADO TOTAL: 30-40 minutos

- Crear cuentas: 5 min
- Preparar proyecto: 10 min
- Subir a GitHub: 5 min
- Deploy Vercel: 5 min
- Configurar OAuth: 5 min
- Verificar todo: 5 min

---

## SI ALGO FALLA

### Error: "Prisma Client not found"
```bash
bunx prisma generate
```

### Error: "Database connection failed"
- Verificar DATABASE_URL en Vercel
- Verificar que Supabase está activo
- Verificar que el password es correcto

### Error: "Google OAuth redirect_uri_mismatch"
- Actualizar redirect URI en Google Cloud Console
- Esperar 5 min a que propaguen

### CRM no carga (500 error)
- Verificar NEXTAUTH_SECRET en Vercel
- Verificar DATABASE_URL en Vercel

### Emails no llegan
- Verificar EMAIL_USER y EMAIL_PASS en Vercel
- Revisar spam

---

## CONTACTO

Si Hermes tiene dudas, puede consultar:
- `deploy-kit/README-VERCEL.md` — Guía detallada
- `deploy-kit/PROMPT-PARA-IA.md` — Prompt para asistentes IA
- `deploy-kit/migrate-to-postgres.sh` — Script de migración

**Proyecto preparado por: Super Z (Z.ai)**
**Para: Impulsala**
**Fecha: Agosto 2026**
