# ============================================================
# GUÍA PARA HERMES — Subir mejoras CRM + Bot a Vercel
# ============================================================
# 
# FECHA: 2026-08-13
# TIPO: Actualización de código (ya hay deploy existente en Vercel)
# TIEMPO: 5-10 minutos
#
# CONTEXTO: Ya hay un deploy funcionando en Vercel conectado
# al repo de GitHub. Esta guía es solo para SUBIR los nuevos
# cambios del CRM arreglado y el bot mejorado.
# ============================================================

## RESUMEN DE CAMBIOS A SUBIR

Hay 3 commits nuevos en la rama `main` que contienen:

### Commit 1: Fix CRM (Kanban/Leads cargando)
- Arreglado bug `req is not defined` en `/api/crm/leads/[id]/route.ts`
- Arreglado mismo bug en `/api/crm/campaigns/[id]/route.ts`
- Eliminada dependencia de next-auth/react del CRM (causaba "module factory not available")
- Creado endpoint `/api/logout` (borra cookie simple)
- Mejorado `useFetch` con manejo de errores visible + botón Reintentar
- Fixeados errores de TypeScript en auth-guard, appointments, blog

### Commit 2: Eliminado session-provider.tsx
- Borrado el archivo `src/components/crm/session-provider.tsx`
- Ya no se usa NextAuth SessionProvider en el CRM
- Auth es 100% por cookie simple `nexus-admin-session`

### Commit 3: Bot mejorado (ImpulsalaBot v3)
- Eliminados botones extra en confirmación de cita (solo queda mensaje amigable)
- Eliminados todos los emojis (📹, ✅, ✏️, 🏠, 😊)
- Renombrado "ImpulsaBot" → "ImpulsalaBot" en todos lados
- Métricas con gradiente sutil, más llamativas
- Botones de sugerencias con borde primary y hover con sombra
- Mensaje de bienvenida más cálido y específico
- Descripciones de servicios más profesionales y persuasivas

---

## PASOS PARA HERMES

### PASO 1: Pull del repositorio (1 min)

```bash
cd /ruta/al/proyecto/impulsala
git pull origin main
```

**Si hay conflictos**, resolver manteniendo los cambios nuevos (los de main).

### PASO 2: Verificar que se bajaron los cambios (30 seg)

```bash
# Ver los últimos 3 commits
git log --oneline -5

# Deberías ver estos commits arriba:
# 25ad06c - bot mejoras v3 (ai-chat-fab.tsx)
# 5461fee - eliminar session-provider.tsx
# 60256b3 - fix CRM (kanban/leads, logout, NextAuth cleanup)
```

### PASO 3: Verificar archivos clave (1 min)

```bash
# Confirmar que session-provider.tsx NO existe
ls src/components/crm/session-provider.tsx
# Output esperado: "No such file or directory"

# Confirmar que logout route SÍ existe
ls src/app/api/logout/route.ts
# Output esperado: el path del archivo

# Ver que ai-chat-fab.tsx tenga el nuevo mensaje
grep "ImpulsalaBot" src/components/site/ai-chat-fab.tsx | head -3
# Output esperado: 4-5 líneas con "ImpulsalaBot"
```

### PASO 4: Instalar dependencias (solo si cambió package.json) (1 min)

```bash
# Verificar si package.json cambió
git log --oneline -5 -- package.json
# Si no aparece, saltar este paso

# Si cambió:
bun install
# o
npm install
```

### PASO 5: Generar Prisma Client (1 min)

```bash
bunx prisma generate
# o
npx prisma generate
```

Esto regenera el cliente de Prisma con el schema actual.

### PASO 6: Build local de prueba (2 min)

```bash
bun run build
# o
npm run build
```

**Si el build falla**, NO subir a Vercel. Reportar el error.

**Salida esperada**: "✓ Compiled successfully" + lista de rutas generadas.

### PASO 7: Push a GitHub (1 min)

```bash
# El pull del PASO 1 ya trae los commits
# Solo necesitamos confirmar que el remote está actualizado
git status
# Output esperado: "Your branch is up to date with 'origin/main'"

# Si por alguna razón hay commits sin push:
git push origin main
```

### PASO 8: Esperar deploy automático de Vercel (3-5 min)

1. Entra a https://vercel.com/dashboard
2. Click en el proyecto `impulsala`
3. Ve a la pestaña "Deployments"
4. El deploy más reciente debe estar en estado "Building" o "Ready"
5. Esperar a que termine (3-5 minutos)
6. Si falla, hacer click en el deploy y revisar los logs

### PASO 9: Verificar en producción (2 min)

Abrir la URL de Vercel (ej: `https://impulsala.vercel.app`):

- [ ] Home carga sin errores
- [ ] El bot ImpulsalaBot abre y saluda con "¡Hola! Soy ImpulsalaBot, tu asistente en Impulsala..."
- [ ] El bot NO tiene emojis en botones (Confirmar cita, Editar datos, Volver al inicio)
- [ ] Agendar cita de prueba → confirmación NO muestra botones extra
- [ ] /crm carga (login: admin@impulsala.com / nexus2026)
- [ ] En el CRM, el Kanban/Leads carga las tarjetas
- [ ] Abrir un lead del Kanban → el modal carga sin quedarse en "cargando"
- [ ] Cerrar sesión funciona (botón abajo a la izquierda)

---

## SI ALGO FALLA

### Error: "Module not found: next-auth/react"
**Causa**: Quedó caché vieja de Next.js.
**Solución**: 
```bash
rm -rf .next node_modules/.cache
bun run build
```

### Error: "Cannot find module './session-provider'"
**Causa**: Algo todavía importa el archivo borrado.
**Solución**: 
```bash
grep -rn "session-provider" src/
# Si aparece algún import, eliminarlo
```

### Error: "req is not defined" en /api/crm/leads/[id]
**Causa**: No se aplicó el commit 60256b3 correctamente.
**Solución**:
```bash
git log --oneline | grep "60256b3"
# Si no aparece, hacer git pull de nuevo
git pull origin main --force
```

### CRM se queda en "cargando"
**Causa**: Cookie de sesión antigua de NextAuth.
**Solución**: En el navegador, borrar cookies del dominio Vercel y volver a loguearse.

### Build falla en Vercel pero no local
**Causa**: Variables de entorno distintas.
**Solución**: Verificar en Vercel → Settings → Environment Variables que todas estén:
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
CRM_ADMIN_EMAIL
CRM_ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL
EMAIL_USER
EMAIL_PASS
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
```

---

## NOTAS IMPORTANTES

1. **NO borrar la tabla de la base de datos** en Supabase. Los cambios son solo de código.
2. **NO hacer `prisma migrate reset`** en producción. Solo `prisma generate`.
3. **Las variables de entorno ya están configuradas** en Vercel del deploy anterior.
4. **El dominio Google OAuth ya está configurado** para la URL de Vercel.
5. **NO cambiar el .env local** — eso es solo para desarrollo en Z.ai.

---

## DESPUÉS DEL DEPLOY

Mandar mensaje al usuario (admin@impulsala.com o por WhatsApp al 319 635 4992):

> "Listo, ya está subido a Vercel. Probá en [URL-DE-VERCEL] que:
> 1. El CRM cargue bien en /crm
> 2. El bot salude como ImpulsalaBot
> 3. Al confirmar una cita, no salgan botones extra
> 
> Cualquier cosa, me avisás."

---

## COMMITS ESPECÍFICOS (por si hay que hacer cherry-pick)

```
25ad06c - Bot mejoras v3 (sin emojis, descripciones profesionales, confirmación limpia)
5461fee - Eliminar session-provider.tsx (fix module factory error)  
60256b3 - Fix CRM (req is not defined, logout, NextAuth cleanup, TS fixes)
```

Si solo querés subir los cambios del bot y no los del CRM (o viceversa), podés hacer cherry-pick de commits individuales:

```bash
git cherry-pick 60256b3  # Solo CRM fix
git cherry-pick 5461fee  # Solo session-provider cleanup
git cherry-pick 25ad06c  # Solo bot mejoras
```

Pero lo recomendado es subir los 3 juntos con `git pull origin main`.
