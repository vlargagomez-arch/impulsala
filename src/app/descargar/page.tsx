"use client";

import { useState } from "react";
import {
  Download,
  FileArchive,
  Code2,
  CheckCircle,
  Loader2,
  Folder,
  Package,
  ExternalLink,
} from "lucide-react";

export default function DescargarPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (type: "source" | "completo") => {
    setDownloading(type);
    // Trigger download
    const link = document.createElement("a");
    link.href = `/api/download-proyecto?type=${type}`;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 mb-6 shadow-lg shadow-violet-500/30">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Descargar Proyecto Impulsala
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Descarga el código fuente completo de tu proyecto web. Incluye CRM,
            chatbot con IA, integraciones con Gmail, Google Calendar y Meet, blog,
            y todo el sistema listo para ejecutar.
          </p>
        </div>

        {/* Opciones de descarga */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Opción 1: Código Fuente (Recomendado) */}
          <div className="relative bg-slate-900/60 backdrop-blur border border-violet-500/30 rounded-2xl p-6 hover:border-violet-500/60 transition group">
            <div className="absolute -top-3 left-6">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 text-white text-xs font-bold uppercase tracking-wider">
                ⭐ Recomendado
              </span>
            </div>

            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 mb-3">
                <Code2 className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Código Fuente
              </h3>
              <p className="text-slate-400 text-xs">
                Solo lo esencial · 1.4 MB · 299 archivos
              </p>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Código React/Next.js completo</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Schema de base de datos (Prisma)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Assets públicos y del blog</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Configuración (.env.example)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Instrucciones de instalación (README)</span>
              </li>
            </ul>

            <button
              onClick={() => handleDownload("source")}
              disabled={downloading === "source"}
              className="w-full bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-violet-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading === "source" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Código Fuente
                </>
              )}
            </button>
          </div>

          {/* Opción 2: Completo */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/50 border border-slate-600 mb-3">
                <FileArchive className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Proyecto Completo
              </h3>
              <p className="text-slate-400 text-xs">
                Todo incluido · 42 MB · 1,780 archivos
              </p>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Todo lo del código fuente</span>
              </li>
              <li className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Scripts de build y deploy</span>
              </li>
              <li className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Mini-services adicionales</span>
              </li>
              <li className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Configuración de Caddy server</span>
              </li>
              <li className="flex items-start gap-2">
                <Folder className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>Más pesado, incluye archivos redundantes</span>
              </li>
            </ul>

            <button
              onClick={() => handleDownload("completo")}
              disabled={downloading === "completo"}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition border border-slate-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {downloading === "completo" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Completo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Enlaces directos */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Enlaces de descarga directa
          </h3>
          <div className="space-y-2 text-xs">
            <a
              href="/api/download-proyecto?type=source"
              className="block text-violet-400 hover:text-violet-300 font-mono break-all"
            >
              /api/download-proyecto?type=source
            </a>
            <a
              href="/api/download-proyecto?type=completo"
              className="block text-slate-400 hover:text-slate-300 font-mono break-all"
            >
              /api/download-proyecto?type=completo
            </a>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Cómo ejecutar el proyecto después de descargarlo
          </h3>
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs space-y-2">
            <div className="text-slate-500"># 1. Descomprimir el ZIP</div>
            <div className="text-emerald-400">unzip impulsala-codigo-fuente.zip</div>
            <div className="text-emerald-400">cd impulsala</div>
            <div className="text-slate-500 mt-2"># 2. Instalar dependencias</div>
            <div className="text-emerald-400">bun install</div>
            <div className="text-slate-500 mt-2"># 3. Configurar .env</div>
            <div className="text-emerald-400">cp .env.example .env</div>
            <div className="text-slate-500"># Editar .env con tus credenciales</div>
            <div className="text-slate-500 mt-2"># 4. Generar base de datos</div>
            <div className="text-emerald-400">bunx prisma generate</div>
            <div className="text-emerald-400">bunx prisma db push</div>
            <div className="text-slate-500 mt-2"># 5. Ejecutar</div>
            <div className="text-emerald-400">bun run dev</div>
          </div>
        </div>

        {/* Volver a la web */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition"
          >
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  );
}
