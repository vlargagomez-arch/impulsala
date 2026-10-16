/**
 * ============================================================================
 * Impulsala — Google Apps Script para sincronizar citas
 * ============================================================================
 *
 * QUÉ HACE:
 * Este script recibe los datos de cada cita creada en tu web y los agrega
 * como una nueva fila en tu Google Sheet. Te da un panel visual de todas
 * las citas con links listos para click (WhatsApp, Videollamada, etc).
 *
 * INSTALACIÓN (5 minutos):
 *
 * 1. Entra a https://sheets.google.com y crea un Sheet vacío
 *    (o usa uno existente)
 *
 * 2. En el menú: Extensions → Apps Script
 *
 * 3. Borra todo el código que aparece y pega TODO este archivo
 *
 * 4. Click en "Save" (Ctrl+S) — dale un nombre al proyecto
 *
 * 5. Click en "Deploy" → "New deployment"
 *
 * 6. Click en el ícono de engranaje → selecciona "Web app"
 *
 * 7. Configura:
 *    - Description: Impulsala Webhook
 *    - Execute as: Me (tu cuenta)
 *    - Who has access: Anyone
 *
 * 8. Click "Deploy"
 *
 * 9. Te pedirá permisos — click "Authorize" → selecciona tu cuenta
 *    → click "Advanced" → click "Go to Impulsala (unsafe)"
 *    → click "Allow"
 *    (El warning es normal: Google no reconoce el script porque es tuyo,
 *     no verificado. Es seguro, solo tú y tu web acceden a él)
 *
 * 10. Copia la "Web app URL" (termina en /exec)
 *
 * 11. Pégala en el archivo .env de tu web:
 *     GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxx/exec
 *
 * 12. Reinicia tu servidor: bun run dev
 *
 * ¡Listo! Cada cita nueva se agregará como fila a tu Sheet.
 * ============================================================================
 */

/**
 * Función principal — recibe el POST de tu web.
 */
function doPost(e) {
  try {
    // CORS headers para permitir el POST desde tu web
    var allowedOrigins = [
      "https://d1m686vag521-d.space-z.ai",
      "http://localhost:3000",
    ];

    // Responder a preflight OPTIONS
    if (e.parameter && e.parameter.method === "OPTIONS") {
      return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    var sheet = SpreadsheetApp.getActiveSheet();
    if (!sheet) {
      // Si no hay hoja activa, crear una llamada "Citas"
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Citas");
    }

    // Si la hoja está vacía, crear los headers
    var lastColumn = sheet.getLastColumn();
    if (lastColumn === 0) {
      var headers = [
        "Fecha Cita",
        "Nombre",
        "Negocio",
        "Email",
        "Teléfono",
        "Tiene Web",
        "Duración (min)",
        "Estado",
        "Link Videollamada",
        "Link WhatsApp",
        "Proveedor Meet",
        "Origen",
        "Creada el",
        "ID Cita"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.getRange(1, 1, 1, headers.length).setBackground("#7c3aed");
      sheet.getRange(1, 1, 1, headers.length).setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Parsear el body JSON
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: "JSON inválido: " + parseErr.message });
    }

    // Formatear fecha para mostrar en Sheet
    var fechaCita = "";
    if (data.scheduledAt) {
      var fecha = new Date(data.scheduledAt);
      fechaCita = Utilities.formatDate(fecha, "America/Bogota", "yyyy-MM-dd HH:mm");
    }

    var fechaCreada = "";
    if (data.createdAt) {
      var creado = new Date(data.createdAt);
      fechaCreada = Utilities.formatDate(creado, "America/Bogota", "yyyy-MM-dd HH:mm:ss");
    }

    // Agregar la fila con los datos
    var rowData = [
      fechaCita,
      data.name || "",
      data.business || "",
      data.email || "",
      data.phone || "",
      data.hasWebsite || "",
      data.durationMin || 30,
      data.status || "confirmed",
      data.meetLink || "",
      data.whatsappLink || "",
      data.meetProvider || "",
      data.source || "",
      fechaCreada,
      data.appointmentId || ""
    ];

    sheet.appendRow(rowData);

    // Auto-ajustar ancho de columnas
    sheet.autoResizeColumns(1, rowData.length);

    // Si hay link de WhatsApp, hacerlo clickeable (hipervínculo)
    var lastRow = sheet.getLastRow();
    if (data.whatsappLink) {
      sheet.getRange(lastRow, 10).setFormula('=HYPERLINK("' + data.whatsappLink + '", "Abrir WhatsApp")');
    }
    if (data.meetLink) {
      sheet.getRange(lastRow, 9).setFormula('=HYPERLINK("' + data.meetLink + '", "Unirse a Meet")');
    }

    // Formato condicional: estado con color
    var estadoCell = sheet.getRange(lastRow, 8);
    var estado = (data.status || "").toLowerCase();
    if (estado === "confirmed") {
      estadoCell.setBackground("#dbeafe").setFontColor("#1e40af");
    } else if (estado === "completed") {
      estadoCell.setBackground("#d1fae5").setFontColor("#065f46");
    } else if (estado === "cancelled") {
      estadoCell.setBackground("#fee2e2").setFontColor("#991b1b");
    }

    return jsonResponse({
      success: true,
      message: "Cita agregada al Sheet",
      row: lastRow
    });

  } catch (err) {
    return jsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

/**
 * Responder con JSON.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET — para verificar que el webhook está vivo.
 * Visita la URL en el navegador y deberías ver {"ok": true}.
 */
function doGet() {
  return jsonResponse({
    ok: true,
    message: "Impulsala webhook activo",
    timestamp: new Date().toISOString()
  });
}

/**
 * Función de utilidad — crea un Sheet nuevo con headers limpios.
 * Úsala si quieres resetear: Run → setupSheet desde el editor de Apps Script.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet("Citas_Nuevo");

  var headers = [
    "Fecha Cita",
    "Nombre",
    "Negocio",
    "Email",
    "Teléfono",
    "Tiene Web",
    "Duración (min)",
    "Estado",
    "Link Videollamada",
    "Link WhatsApp",
    "Proveedor Meet",
    "Origen",
    "Creada el",
    "ID Cita"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.getRange(1, 1, 1, headers.length).setBackground("#7c3aed");
  sheet.getRange(1, 1, 1, headers.length).setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  Logger.log("Sheet creado con headers. ID: " + sheet.getSheetId());
}
