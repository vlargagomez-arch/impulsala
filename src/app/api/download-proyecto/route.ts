import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/download-proyecto
 * Descarga el proyecto completo en ZIP.
 * Acceso público (sin auth) para que el admin pueda descargarlo fácilmente.
 *
 * Query params:
 *   ?type=completo   → ZIP con todo (incluye node_modules parciales)
 *   ?type=source     → ZIP solo código fuente (recomendado, más liviano)
 *   (default)        → source
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "source";

    const downloadDir = path.join(process.cwd(), "download");
    let filePath: string;
    let fileName: string;

    if (type === "completo") {
      filePath = path.join(downloadDir, "impulsala-proyecto.zip");
      fileName = "impulsala-proyecto-completo.zip";
    } else {
      filePath = path.join(downloadDir, "impulsala-codigo-fuente.zip");
      fileName = "impulsala-codigo-fuente.zip";
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Archivo no encontrado", path: fileName },
        { status: 404 }
      );
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(filePath);
    const stat = fs.statSync(filePath);

    // Devolver como descarga
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/zip"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );
    headers.set("Content-Length", stat.size.toString());
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Error en download-proyecto:", error);
    return NextResponse.json(
      { error: error?.message || "Error al descargar" },
      { status: 500 }
    );
  }
}
