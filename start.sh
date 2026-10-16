#!/bin/bash
# Auto-iniciar servidor cuando el sandbox arranque

# Restaurar .env
cat > /home/z/my-project/.env << 'EOF'
DATABASE_URL=file:/home/z/my-project/db/custom.db
NEXTAUTH_SECRET=[NEXTAUTH_SECRET]
NEXTAUTH_URL=https://d1m686vag521-d.space-z.ai
CRM_ADMIN_EMAIL=admin@impulsala.com
CRM_ADMIN_PASSWORD=nexus2026
NEXT_PUBLIC_SITE_URL=https://d1m686vag521-d.space-z.ai
EMAIL_USER=vlargagomez@gmail.com
EMAIL_PASS=[EMAIL_PASS]
GOOGLE_CLIENT_ID=[GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[GOOGLE_CLIENT_SECRET]
GOOGLE_REDIRECT_URI=https://d1m686vag521-d.space-z.ai/api/google-calendar/callback
GOOGLE_SHEETS_WEBHOOK_URL=
EOF

# Matar todo
pkill -9 -f "next" 2>/dev/null
pkill -9 -f "server.js" 2>/dev/null
pkill -9 -f "python3 /tmp" 2>/dev/null
sleep 2

# Iniciar servidor Next.js de producción
cd /home/z/my-project/.next/standalone
NODE_ENV=production bun server.js > /home/z/my-project/server.log 2>&1 &
