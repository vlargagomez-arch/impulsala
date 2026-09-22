# Impulsala 🚀 — Agencia Web Completa

> Proyecto Next.js 16 + TypeScript + Prisma + SQLite con blog, demos interactivas, agente de IA que agenda citas, newsletter y SEO optimizado.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8) ![Prisma](https://img.shields.io/badge/Prisma-6-2d3748) ![License](https://img.shields.io/badge/License-Private-red)

---

## 📋 Tabla de contenidos

1. [Requisitos previos](#-requisitos-previos)
2. [Instalación rápida](#-instalación-rápida-5-minutos)
3. [Estructura del proyecto](#-estructura-del-proyecto)
4. [Base de datos](#-base-de-datos)
5. [APIs disponibles](#-apis-disponibles)
6. [Personalización](#-personalización)
7. [Despliegue a producción](#-despliegue-a-producción)
8. [Solución de problemas](#-solución-de-problemas)

---

## ✅ Requisitos previos

Antes de empezar necesitas tener instalado:

| Herramienta | Versión mínima | Cómo verificar | Descarga |
|-------------|----------------|----------------|----------|
| **Node.js** | 18+ (recom. 20+) | `node --version` | https://nodejs.org/ |
| **npm** | 9+ | `npm --version` | Viene con Node.js |
| **Bun** (opcional) | 1+ | `bun --version` | https://bun.sh/ |

> 💡 **Bun es opcional** pero instala dependencias 3x más rápido. El proyecto funciona igual con npm.

---

## 🚀 Instalación rápida (5 minutos)

```bash
# 1️⃣ Descomprimir
unzip impulsala-proyecto.zip
cd impulsala

# 2️⃣ Instalar dependencias
npm install
# (o con Bun: bun install)

# 3️⃣ Configurar base de datos
cp .env.example .env
mkdir -p db
npx prisma db push
npx prisma generate

# 4️⃣ Ejecutar en desarrollo
npm run dev
```

¡Abre **http://localhost:3000** y listo! 🎉

---

## 📁 Estructura del proyecto

```
impulsala/
├── src/
│   ├── app/                         # Rutas (App Router)
│   │   ├── page.tsx                 # Home
│   │   ├── layout.tsx               # Layout raíz + SEO + Schema.org
│   │   ├── globals.css              # Estilos globales + temas
│   │   ├── sitemap.ts               # Sitemap dinámico (22 URLs)
│   │   ├── robots.ts                # Robots.txt
│   │   │
│   │   ├── blog/                    # Blog
│   │   │   ├── page.tsx             # Listado de artículos
│   │   │   └── [slug]/page.tsx      # Artículo individual (SSG)
│   │   │
│   │   ├── demos/page.tsx           # Página de demos
│   │   ├── servicios/               # 5 páginas de servicios
│   │   │   ├── page.tsx             # Índice
│   │   │   ├── desarrollo-web/
│   │   │   ├── seo/
│   │   │   ├── publicidad-digital/
│   │   │   └── automatizacion-ia/
│   │   ├── diagnostico-gratis/      # Landing agendamiento
│   │   ├── contacto/                # Formulario de citas
│   │   │
│   │   └── api/                     # APIs REST
│   │       ├── appointments/        # Citas con fecha/hora
│   │       ├── booking-leads/       # Leads del agente IA
│   │       ├── newsletter/          # Suscripciones
│   │       └── seo-analyze/         # Analizador SEO real
│   │
│   ├── components/
│   │   ├── site/                    # Componentes del sitio
│   │   │   ├── hero.tsx             # Hero con dashboard cards
│   │   │   ├── navbar.tsx           # Navbar + theme toggle
│   │   │   ├── footer.tsx           # Footer + newsletter
│   │   │   ├── services.tsx         # 4 servicios con CTAs
│   │   │   ├── client-marquee.tsx   # Testimonios
│   │   │   ├── whatsapp-button.tsx  # WhatsApp flotante
│   │   │   ├── sticky-cta.tsx       # CTA bar fijo
│   │   │   ├── booking-wizard.tsx   # Wizard de citas
│   │   │   ├── legal-modal.tsx      # Términos/Privacidad
│   │   │   │
│   │   │   └── demos/               # 4 demos interactivas
│   │   │       ├── seo-analyzer.tsx # Analizador SEO real
│   │   │       ├── ai-chat.tsx      # Agente IA (agenda citas)
│   │   │       ├── automation-flow.tsx # Flujos automatizados
│   │   │       └── portfolio.tsx    # Portafolio de proyectos
│   │   │
│   │   └── ui/                      # shadcn/ui (40+ componentes)
│   │
│   ├── lib/
│   │   ├── db.ts                    # Cliente Prisma (singleton)
│   │   └── utils.ts                 # Utilidades (cn, etc.)
│   │
│   └── hooks/                       # Hooks personalizados
│
├── prisma/
│   └── schema.prisma                # Modelos de BD
│
├── public/                          # Assets estáticos
│   ├── logo.svg
│   ├── og-image.jpg
│   └── ...
│
├── .env.example                     # Variables de entorno (ejemplo)
├── .env                             # Variables reales (no incluido)
├── package.json                     # Dependencias
├── next.config.ts                   # Config Next.js (optimizada)
├── tailwind.config.ts               # Config Tailwind
├── tsconfig.json                    # Config TypeScript
├── components.json                  # Config shadcn/ui
└── README.md                        # Este archivo
```

---

## 🗄️ Base de datos

Usa **SQLite** — un archivo local, no requiere servidor.

### Modelos disponibles:

| Modelo | Descripción | Endpoints |
|--------|-------------|-----------|
| `Appointment` | Citas con fecha/hora específica | `/api/appointments` |
| `BookingLead` | Leads del agente IA (nombre, email, tel, negocio) | `/api/booking-leads` |
| `Newsletter` | Suscriptores al newsletter | `/api/newsletter` |
| `User` / `Post` | Modelos base (no usados) | — |

### Ver y editar datos visualmente:

```bash
npx prisma studio
```

Abre http://localhost:5555 — interfaz gráfica para ver/editar registros.

### Resetear la base de datos:

```bash
rm db/custom.db
npx prisma db push
```

---

## 🔌 APIs disponibles

| Endpoint | Método | Descripción | Body |
|----------|--------|-------------|------|
| `/api/appointments` | POST | Crea cita con fecha/hora | `{ name, business, email, phone, scheduledAt }` |
| `/api/appointments/slots` | GET | Horarios disponibles | — |
| `/api/booking-leads` | POST | Lead del agente IA | `{ name, email, phone, hasBusiness }` |
| `/api/booking-leads` | GET | Stats de leads | (requiere token) |
| `/api/newsletter` | POST | Suscripción | `{ email }` |
| `/api/newsletter` | GET | Stats suscriptores | (requiere token) |
| `/api/seo-analyze` | POST | Analiza HTML de URL | `{ url }` |

**Ejemplo de uso:**

```bash
# Crear un lead desde el agente IA
curl -X POST http://localhost:3000/api/booking-leads \
  -H "Content-Type: application/json" \
  -d '{"name":"María","email":"maria@test.com","phone":"+573111234567","hasBusiness":"Sí, tengo un negocio"}'
```

---

## 🎨 Personalización

### Cambiar colores del tema

Edita `src/app/globals.css`:

```css
:root {
  --primary: oklch(0.55 0.18 165);    /* Color principal */
  --accent: oklch(0.55 0.16 200);     /* Color de acento */
  /* ... etc */
}

.dark {
  --primary: oklch(0.78 0.18 165);    /* Color principal en dark */
  /* ... etc */
}
```

### Cambiar información de contacto

Busca y reemplaza globalmente:

| Buscar | Reemplazar por |
|--------|----------------|
| `+57-311-834-9931` | Tu teléfono |
| `contacto@impulsala.co` | Tu email |
| `https://w14nq5fjb3z1-d.space-z.ai` | Tu dominio |
| `Impulsala` | Nombre de tu agencia |

### Cambiar el logo

Reemplaza `public/logo.svg` con tu logo (recomendado: SVG, 32x32px).

### Agregar artículos al blog

Edita `src/components/site/blog-data.ts`:

```typescript
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mi-nuevo-articulo",
    title: "Mi nuevo artículo",
    excerpt: "Descripción corta",
    content: "Contenido completo en HTML...",
    date: "2026-07-15",
    category: "SEO Orgánico",
    tags: ["seo", "google"],
    image: "https://...",
    readingTime: 5,
  },
  // ...
];
```

El sitemap se actualiza automáticamente. ✅

### Cambiar testimonials

Edita `src/components/site/client-marquee.tsx` — array `TESTIMONIALS`.

### Cambiar servicios

Edita `src/components/site/services.tsx` — array `SERVICES`.

---

## 🚢 Despliegue a producción

### Opción 1: Vercel (recomendado, gratis)

1. **Sube el código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/impulsala.git
   git push -u origin main
   ```

2. **Conecta en Vercel:**
   - Ve a https://vercel.com/new
   - Importa tu repo de GitHub
   - Vercel detecta Next.js automáticamente

3. **⚠️ Importante — Cambia la base de datos:**
   
   SQLite **NO funciona en Vercel** (es serverless). Cambia a una BD en la nube:
   
   #### Opción A: PlanetScale (MySQL, gratis)
   1. Crea cuenta en https://planetscale.com
   2. Crea una base de datos
   3. Copia la `DATABASE_URL`
   4. En `prisma/schema.prisma` cambia:
      ```prisma
      datasource db {
        provider = "mysql"
        url      = env("DATABASE_URL")
      }
      ```
   5. En Vercel, agrega la variable de entorno `DATABASE_URL`
   6. Ejecuta `npx prisma db push` localmente con la nueva URL
   
   #### Opción B: Neon (PostgreSQL, gratis)
   1. Crea cuenta en https://neon.tech
   2. Crea proyecto y copia `DATABASE_URL`
   3. En `prisma/schema.prisma` cambia `provider = "postgresql"`
   4. Igual que arriba
   
   #### Opción C: Turso (SQLite distribuido, gratis)
   1. Crea cuenta en https://turso.tech
   2. Crea base de datos y copia URL + token
   3. `DATABASE_URL="libsql://..."` + `DATABASE_AUTH_TOKEN="..."`
   4. Instala `@prisma/adapter-libsql` y configura

4. **Deploy:**
   - Vercel hace el deploy automático al hacer `git push`
   - Tu sitio estará en `https://tu-proyecto.vercel.app`

### Opción 2: VPS propio (DigitalOcean, Hetzner, AWS EC2)

```bash
# En el servidor:
git clone https://github.com/tu-usuario/impulsala.git
cd impulsala
npm install
npx prisma db push
npm run build

# Instalar PM2 (mantener corriendo):
npm install -g pm2
pm2 start npm --name "impulsala" -- start
pm2 startup
pm2 save

# Configurar Nginx como reverse proxy:
# /etc/nginx/sites-available/impulsala
server {
    listen 80;
    server_name tudominio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Opción 3: Docker

Crea un `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t impulsala .
docker run -p 3000:3000 impulsala
```

---

## ❓ Solución de problemas

### ❌ "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### ❌ "Database does not exist" o "no such table"

```bash
mkdir -p db
npx prisma db push
```

### ❌ "Port 3000 already in use"

```bash
# Cambia el puerto:
npm run dev -- -p 3001
```

### ❌ Error de hidratación en consola

Asegúrate de que no hay `localStorage` o `window` en el render inicial del servidor.
El proyecto ya maneja esto con `useSyncExternalStore` y `suppressHydrationWarning`.
Si agregas componentes nuevos que usan `localStorage`, envuélvelos en `useEffect`.

### ❌ El theme toggle parpadea al recargar

El proyecto ya tiene un script anti-flash en `src/app/layout.tsx` (línea ~100).
Si lo modificas, asegúrate de mantener ese script.

### ❌ Las demos no cargan

Las demos usan `dynamic()` imports (lazy loading). Verifica que:
- No haya errores de TypeScript en `src/components/site/demos/`
- El navegador soporte IntersectionObserver (todos los modernos sí)

### ❌ El agente IA no guarda los leads

1. Verifica que la BD existe: `npx prisma db push`
2. Verifica que el modelo `BookingLead` existe en `prisma/schema.prisma`
3. Revisa la consola del navegador (F12 → Network) — busca el POST a `/api/booking-leads`
4. Si hay error 429, es protección anti-spam (espera 1 hora)

### ❌ Build de producción falla

```bash
# Limpia caché y reintenta:
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Performance

| Métrica | Valor |
|---------|-------|
| Lighthouse Performance | 90+ |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | 95+ |
| Tamaño transferido (prod) | ~350 KB |
| DOM Content Loaded | ~370 ms |
| First Contentful Paint (mobile) | ~750 ms |
| Time to Interactive | ~1.3 s |

**Optimizaciones aplicadas:**
- ✅ Lazy loading de componentes below-the-fold
- ✅ CSS animations en lugar de Framer Motion donde es posible
- ✅ `optimizePackageImports` para tree-shaking de lucide-react y framer-motion
- ✅ Imágenes en AVIF/WebP
- ✅ Compresión gzip/brotli
- ✅ Cache de 30 días para imágenes remotas
- ✅ `removeConsole` en producción

---

## 🔐 Seguridad

- ✅ Validación de inputs en todos los endpoints
- ✅ Protección anti-spam (hash de IP, rate limiting)
- ✅ Anti-duplicados en newsletter y booking-leads
- ✅ No se exponen datos sensibles en el cliente
- ✅ `.env` en `.gitignore` (no se sube al repo)

---

## 📝 Comandos útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (http://localhost:3000)

# Producción
npm run build            # Build de producción
npm run start            # Ejecuta el build de producción

# Base de datos
npx prisma db push       # Aplica cambios del schema a la BD
npx prisma generate      # Genera el cliente Prisma
npx prisma studio        # Interfaz visual para ver/editar datos
npx prisma migrate dev   # Crea migración (desarrollo)

# Calidad
npm run lint             # Ejecuta ESLint
```

---

## 📞 Soporte

- **WhatsApp**: +57 311 834 9931
- **Email**: contacto@impulsala.co
- **Web**: https://w14nq5fjb3z1-d.space-z.ai

---

## 📄 Licencia

Proyecto privado de **Impulsala**. Todos los derechos reservados.

---

¿Te fue útil este README? ¡Abre un issue si encuentras algún problema! 🚀
