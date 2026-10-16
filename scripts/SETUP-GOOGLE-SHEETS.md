# Guía de configuración — Google Sheets + Meet

## Resumen

Cuando un cliente agenda una cita a través del chatbot de tu web:

1. ✅ La cita se guarda en la base de datos
2. ✅ Se genera automáticamente un link de videollamada (Meet o Jitsi)
3. ✅ Se sincroniza a tu Google Sheet (panel visual)
4. ✅ El cliente ve el link en el chat
5. ✅ Cuando envías el recordatorio por WhatsApp/Email, el link va incluido

---

## Parte 1: Google Sheets (5 minutos)

### Paso 1: Crear el Sheet
1. Entra a https://sheets.google.com
2. Click en **"+ Blank"** para crear un Sheet vacío
3. Dale un nombre: `Impulsala Citas`

### Paso 2: Agregar el Apps Script
1. En el Sheet, ve al menú: **Extensions → Apps Script**
2. Se abre un editor. **Borra todo el código que aparece**
3. Abre el archivo `/scripts/google-apps-script.js` de tu proyecto
4. Copia TODO el contenido y pégalo en el editor de Apps Script
5. Click en **Save** (ícono de disquete) o `Ctrl+S`
6. Dale un nombre al proyecto: `Impulsala Webhook`

### Paso 3: Deployar como Web App
1. Click en **Deploy → New deployment**
2. Click en el ícono de engranaje ⚙️ → selecciona **Web app**
3. Completa:
   - **Description**: `Impulsala Webhook`
   - **Execute as**: `Me (tu-cuenta@gmail.com)`
   - **Who has access**: `Anyone`
4. Click **Deploy**

### Paso 4: Autorizar permisos
1. Te aparece "Authorization required"
2. Click **Authorize**
3. Selecciona tu cuenta de Google
4. Ve el warning "Google hasn't verified this app"
5. Click **Advanced** (abajo a la izquierda)
6. Click **Go to Impulsala Webhook (unsafe)**
7. Click **Allow**

> ⚠️ **El warning es NORMAL**: Google no reconoce el script porque es tuyo,
> no verificado por Google. Es 100% seguro — solo tu web puede enviarle datos.

### Paso 5: Copiar la URL
1. Te aparece "Web app URL"
2. Copia la URL (formato: `https://script.google.com/macros/s/AKfyc.../exec`)
3. Pégala en tu archivo `.env`:
   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfyc.../exec
   ```
4. Reinicia el servidor: `bun run dev`

### Paso 6: Verificar
1. Entra a tu web y agenda una cita de prueba desde el chatbot
2. Vuelve al Google Sheet — deberías ver la cita como nueva fila
3. Las columnas tendrán: fecha, cliente, email, links listos para click

---

## Parte 2: Google Meet (opcional, recomendado)

### Opción A: Google Meet estático (1 minuto)
Si quieres que todas las citas usen **el mismo link de Google Meet**:

1. Entra a https://calendar.google.com
2. Crea un evento:
   - Título: `Citas Impulsala`
   - Fecha: hoy
   - Recurrence: **Repeats daily** (todos los días)
3. Click **Add Google Meet video conference**
4. Se genera un link `https://meet.google.com/xxx-xxxx-xxx`
5. Copia ese link
6. Pégalo en `.env`:
   ```
   GOOGLE_MEET_LINK=https://meet.google.com/xxx-xxxx-xxx
   ```
7. Reinicia el servidor

> ✅ **Ventaja**: Tu cliente ve "Google Meet" en el correo (más confianza)
> ⚠️ **Nota**: Todas las citas usarán la misma sala (no hay problema porque
> son a diferentes horarios)

### Opción B: Jitsi Meet automático (sin configuración)
Si dejas `GOOGLE_MEET_LINK` vacío, el sistema genera automáticamente
un link único en `meet.jit.si` para cada cita. **No requiere ninguna
configuración**.

- Ejemplo: `https://meet.jit.si/impulsala-abc12345`
- Funciona igual que Meet: cámara, micrófono, pantalla compartida
- No requiere cuenta ni login
- Funciona en cualquier navegador

---

## Verificación final

Después de configurar todo:

1. **Agenda una cita de prueba** en tu web (vía chatbot)
2. **Verifica en el Google Sheet** que aparece la nueva fila
3. **Verifica que el link de Meet** aparece en la columna "Link Videollamada"
4. **Verifica que el link de WhatsApp** es clickeable y abre WhatsApp
5. **Entra al CRM** (`/crm`) y envía un recordatorio por email/WhatsApp
   — verás que el link de Meet va incluido

## Troubleshooting

### El webhook no sincroniza
- Verifica que `GOOGLE_SHEETS_WEBHOOK_URL` en `.env` termine en `/exec`
- Reinicia el servidor después de cambiar `.env`
- Mira los logs: `bun run dev` → busca "Sheets Sync" en la consola
- Prueba abrir la URL del webhook en el navegador — debe devolver `{"ok":true}`

### El link de Meet no aparece
- Verifica que `GOOGLE_MEET_LINK` empiece con `https://meet.google.com/`
- Si está vacío, el sistema usa Jitsi automáticamente (verifica la columna "Proveedor Meet")

### Google Apps Script warning
- Es normal ver "Google hasn't verified this app"
- Click **Advanced → Go to Impulsala (unsafe) → Allow**
- Aparece porque el script es tuyo, no verificado por Google
