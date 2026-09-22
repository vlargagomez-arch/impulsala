# PROMPT PARA HERMES — Aplicar mejoras CRM + Bot a Impulsala

Hola Hermes. **Este ZIP contiene el proyecto de Impulsala con TODAS las mejoras ya aplicadas.** No tenés que tocar el código — solo hacer unzip, commit, push, y Vercel redeploya.

## MEJORAS INCLUIDAS EN ESTE ZIP

### CRM (Kanban/Leads arreglado)
- Bug `req is not defined` fixeado en leads/[id] y campaigns/[id]
- Eliminada dependencia de NextAuth/react del CRM
- Creado endpoint /api/logout
- useFetch mejorado con manejo de errores visible + botón Reintentar
- Manejo de error visible en Kanban, Dashboard y Lead-Detail
- Fix TypeScript en auth-guard, appointments, blog

### Bot ImpulsalaBot v3
- Sin emojis en botones (Confirmar cita, Editar datos, Volver al inicio)
- Renombrado "ImpulsaBot" → "ImpulsalaBot"
- Mensaje de bienvenida más cálido
- Descripciones de servicios más profesionales y persuasivas
- Métricas con gradiente sutil
- Botones de sugerencias con mejor diseño

### Flujo "quiero agendar cita" simplificado
- Cuando la persona dice "quiero agendar" o hace clic en "Quiero agendar una cita"
- Va DIRECTO a preguntar el nombre (sin "¿Comenzamos?" ni botón intermedio)
- Mensaje de bienvenida al flujo: "¡Qué bueno! Vamos a agendar tu videollamada gratuita de 30 minutos..."

### Confirmación de cita
- Sin botones "Confirmar asistencia" ni extras
- Mensaje amigable: "Pronto nos vemos en la videollamada"
- SÍ aparece el botón "Volver al inicio" (para que el usuario pueda reiniciar)
- Link de videollamada sin emoji 📹

---

## PASOS PARA HERMES (5 minutos)

### PASO 1: Hacer unzip del proyecto

```bash
# En la carpeta donde querés tener el proyecto
unzip impulsala-mejorado.zip -d impulsala
cd impulsala
```

### PASO 2: Instalar dependencias

```bash
bun install
# o si no tenés bun:
npm install
```

### PASO 3: Generar Prisma Client

```bash
bunx prisma generate
# o
npx prisma generate
```

### PASO 4: Build de prueba (verificar que todo compila)

```bash
bun run build
# o
npm run build
```

Si el build falla, NO continuar. Revisar el error.

### PASO 5: Commit y push a GitHub

```bash
git init
git add -A
git commit -m "feat: CRM arreglado + bot ImpulsalaBot v3 + flujo agendamiento simplificado"

# Si ya tenés repo configurado:
git push origin main --force
```

### PASO 6: Esperar deploy automático de Vercel (3-5 min)

1. https://vercel.com/dashboard
2. Click en el proyecto `impulsala`
3. Pestaña "Deployments"
4. Esperar a que esté en "Ready"

### PASO 7: Verificar en producción

Abrir la URL de Vercel y probar:

- [ ] Home carga sin errores
- [ ] Bot saluda como "ImpulsalaBot"
- [ ] Click en "Quiero agendar una cita" → va directo a pedir nombre (sin "¿Comenzamos?")
- [ ] Botones del bot SIN emojis
- [ ] Agendar cita de prueba → confirmación muestra "Volver al inicio" pero NO "Confirmar asistencia"
- [ ] /crm carga (login: admin@impulsala.com / nexus2026)
- [ ] Kanban/Leads carga las tarjetas
- [ ] Abrir un lead → modal carga sin "cargando infinito"
- [ ] Cerrar sesión funciona

### PASO 8: Avisar al usuario

Mandar mensaje a admin@impulsala.com o WhatsApp 319 635 4992:

> "Listo Vlarga, ya está subido a Vercel. Probá en [URL] que:
> 1. CRM cargue bien en /crm
> 2. El bot salude como ImpulsalaBot
> 3. Al agendar, vaya directo a pedir nombre (sin '¿comenzamos?')
> 4. Al confirmar cita, salga 'Volver al inicio' pero sin botones extra
> Cualquier cosa me avisás."

---

## SI ALGO FALLA

### Error: "Module not found: next-auth/react"
```bash
rm -rf .next node_modules/.cache
bun run build
```

### Error: "Cannot find module './session-provider'"
Buscar imports colgados:
```bash
grep -rn "session-provider" src/
# Si aparece algún import, eliminarlo
```

### CRM se queda en "cargando"
Borrar cookies del dominio Vercel en el navegador y volver a loguearse.

### Build falla en Vercel pero no local
Verificar en Vercel → Settings → Environment Variables que todas estén:
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
5. **NO cambiar el .env** que viene en el ZIP — está para producción con la URL de Vercel.

---

## ARCHIVOS MODIFICADOS (referencia)

Si por algún motivo querés ver qué archivos cambiaron respecto a la versión anterior:

```
src/app/api/crm/leads/[id]/route.ts        (fix req)
src/app/api/crm/campaigns/[id]/route.ts    (fix req)
src/app/api/logout/route.ts                (NUEVO)
src/app/crm/layout.tsx                     (sin NextAuthProvider)
src/components/crm/session-provider.tsx    (BORRADO)
src/components/crm/app.tsx                 (sin signOut, logout directo)
src/components/crm/types.ts                (useFetch mejorado)
src/components/crm/kanban.tsx              (manejo de error)
src/components/crm/dashboard.tsx           (manejo de error)
src/components/crm/lead-detail.tsx         (manejo de error)
src/lib/auth-guard.ts                      (.value fix)
src/app/crm/page.tsx                       (.value fix)
src/app/api/crm/appointments/route.ts      (where fix)
src/components/crm/blog.tsx                (contentData fix)
src/components/site/ai-chat-fab.tsx        (bot v3 + flujo simplificado + volver al inicio en confirmación)
```

**Total: 14 archivos modificados + 1 nuevo (logout) + 1 borrado (session-provider) = 16 cambios.**
