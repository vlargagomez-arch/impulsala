#!/bin/bash
# Versión LIGERA del proyecto - solo código fuente importante
set -e

PROJECT_DIR="/home/z/my-project"
OUTPUT_ZIP="/home/z/my-project/download/impulsala-codigo-fuente.zip"

rm -f "$OUTPUT_ZIP"
cd "$PROJECT_DIR"

echo "📦 Creando ZIP del código fuente (ligero)..."

# Crear directorio temporal con solo lo esencial
TMP_DIR="/tmp/impulsala-src"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/impulsala"

# Copiar solo directorios importantes
cp -r src "$TMP_DIR/impulsala/"
cp -r public "$TMP_DIR/impulsala/"
cp -r prisma "$TMP_DIR/impulsala/"
cp -r scripts "$TMP_DIR/impulsala/"
cp -r .zscripts "$TMP_DIR/impulsala/"
cp -r mini-services "$TMP_DIR/impulsala/" 2>/dev/null || true

# Copiar archivos de configuración
cp package.json "$TMP_DIR/impulsala/"
cp bun.lock "$TMP_DIR/impulsala/" 2>/dev/null || true
cp next.config.ts "$TMP_DIR/impulsala/"
cp tsconfig.json "$TMP_DIR/impulsala/" 2>/dev/null || true
cp tailwind.config.ts "$TMP_DIR/impulsala/" 2>/dev/null || true
cp postcss.config.mjs "$TMP_DIR/impulsala/" 2>/dev/null || true
cp components.json "$TMP_DIR/impulsala/" 2>/dev/null || true
cp Caddyfile "$TMP_DIR/impulsala/" 2>/dev/null || true
cp eslint.config.mjs "$TMP_DIR/impulsala/" 2>/dev/null || true

# Crear .env.example (sin credenciales reales)
cat > "$TMP_DIR/impulsala/.env.example" << 'EOF'
DATABASE_URL=file:db/custom.db
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=http://localhost:3000
CRM_ADMIN_EMAIL=admin@impulsala.co
CRM_ADMIN_PASSWORD=nexus2026
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

# Gmail
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASS=tu-app-password-16-caracteres

# Google Calendar OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-tu-secret

# Google Sheets (opcional)
GOOGLE_SHEETS_WEBHOOK_URL=
EOF

# Crear README
cat > "$TMP_DIR/impulsala/README.md" << 'EOF'
# Impulsala - Agencia Web + CRM + IA

## Instalación

1. Instalar dependencias:
```bash
bun install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. Generar Prisma:
```bash
bunx prisma generate
bunx prisma db push
```

4. Ejecutar en desarrollo:
```bash
bun run dev
```

5. Build de producción:
```bash
bun run build
```

## Características

- Next.js 16 con App Router
- CRM completo (citas, leads, newsletter, campañas)
- Chatbot con IA para agendamiento
- Integración Gmail para emails
- Integración Google Calendar + Meet
- WhatsApp recordatorios manuales
- SEO técnico (sitemap, schemas, OG)
- Blog con 25+ artículos
- Tailwind CSS 4 + shadcn/ui

## Credenciales por defecto

- Email: admin@impulsala.co
- Password: nexus2026

## Estructura

- `src/app/` - Páginas y API routes
- `src/components/` - Componentes React
- `src/lib/` - Utilidades (auth, db, email, etc.)
- `prisma/` - Schema de base de datos
- `scripts/` - Scripts de utilidad
- `public/` - Assets estáticos
EOF

# Crear ZIP
cd /tmp
zip -r "$OUTPUT_ZIP" impulsala -q

# Limpiar
rm -rf "$TMP_DIR"

echo ""
echo "✅ ZIP del código fuente creado:"
ls -lh "$OUTPUT_ZIP"
echo ""
echo "📁 Archivos incluidos:"
unzip -l "$OUTPUT_ZIP" | tail -1