#!/bin/bash
# Arranca el servidor de producción con prisma pre-generado y cleanup

cd /home/z/my-project

# Matar procesos anteriores
pkill -9 -f "server.js" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 2

# Asegurar que prisma client está generado
bunx prisma generate 2>&1 | tail -3

# Arrancar producción
echo "Arrancando servidor de producción..."
NODE_ENV=production bun .next/standalone/server.js > server.log 2>&1 &
PID=$!
echo "PID: $PID"

# Esperar a que arranque
sleep 5

# Verificar
if kill -0 $PID 2>/dev/null; then
  echo "✅ Servidor corriendo (PID: $PID)"
  curl -s -o /dev/null -w "Home: HTTP %{http_code}\n" http://127.0.0.1:3000/
  echo ""
  echo "=== LOGS ==="
  tail -10 server.log
else
  echo "❌ El servidor no arrancó"
  cat server.log
fi
