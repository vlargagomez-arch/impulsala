"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

const LOGOS = [
  { id: 1, name: "Glassmorphism Sutil", desc: "{i} con glassmorphism sutil, fondo blanco, colores de la web." },
  { id: 2, name: "Geometric Modern", desc: "{i} geométrico moderno, líneas limpias." },
  { id: 3, name: "Bold Thick", desc: "{i} con trazos gruesos bold, transparente." },
  { id: 4, name: "Thin Elegant", desc: "{i} con líneas finas elegantes minimal." },
  { id: 5, name: "3D Depth", desc: "{i} con profundidad 3D sutil." },
  { id: 6, name: "Rounded Soft", desc: "{i} con esquinas redondeadas suaves." },
  { id: 7, name: "Sharp Angular", desc: "{i} angular agresivo moderno." },
  { id: 8, name: "Shadow Depth", desc: "{i} con sombra para profundidad." },
  { id: 9, name: "Monoline", desc: "{i} trazo único monoline elegante." },
  { id: 10, name: "Corporate Geometric", desc: "{i} geométrico preciso corporate." },
  { id: 11, name: "Code Dots", desc: "{i} con puntos de código acento." },
  { id: 12, name: "Layered Glass", desc: "{i} con capas de cristal sutiles." },
  { id: 13, name: "Terminal Cursor", desc: "{i} con cursor de terminal parpadeante." },
  { id: 14, name: "Spark Top", desc: "{i} con chispa en la parte superior." },
  { id: 15, name: "Isometric 3D", desc: "{i} con perspectiva isométrica 3D." },
];

export default function LogosPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Logos para Impulsala
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            15 logos con <code className="px-2 py-0.5 bg-slate-800 rounded text-fuchsia-400">{`{i}`}</code> + colores de tu web (índigo → fucsia → rosa).
            <br />
            <span className="text-fuchsia-400">Profesional, limpio, combina con tu marca</span>
          </p>
          {/* Muestra de colores de la web */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-500">Colores de tu web:</span>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded bg-indigo-500" title="Índigo"></div>
              <div className="w-6 h-6 rounded bg-fuchsia-500" title="Fucsia"></div>
              <div className="w-6 h-6 rounded bg-pink-500" title="Rosa"></div>
            </div>
          </div>
        </div>

        {/* Grid de logos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {LOGOS.map((logo) => (
            <div
              key={logo.id}
              className={`relative bg-slate-900/60 backdrop-blur border-2 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 ${
                selected === logo.id
                  ? "border-fuchsia-500 shadow-lg shadow-fuchsia-500/30"
                  : "border-slate-700 hover:border-slate-600"
              }`}
              onClick={() => setSelected(logo.id)}
            >
              {selected === logo.id && (
                <div className="absolute -top-2 -right-2 bg-fuchsia-500 rounded-full p-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="aspect-square bg-white rounded-xl p-2 mb-2 flex items-center justify-center border border-slate-200">
                <img src={`/logos/logo${logo.id}.png`} alt={logo.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <p className="text-xs font-semibold text-white text-center">#{logo.id}</p>
              <p className="text-[10px] text-slate-400 text-center mt-1">{logo.name}</p>
            </div>
          ))}
        </div>

        {/* Preview del seleccionado */}
        {selected && (
          <div className="bg-slate-900/60 backdrop-blur border border-fuchsia-500/30 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white rounded-2xl p-4 flex-shrink-0 border border-slate-200">
                <img src={`/logos/logo${selected}.png`} alt="Logo seleccionado" className="w-32 h-32 object-contain" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">
                  Logo #{selected}: {LOGOS[selected - 1].name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{LOGOS[selected - 1].desc}</p>
                <p className="text-fuchsia-400 text-sm font-mono mb-2">{`{i}`} · índigo → fucsia → rosa</p>
                <p className="text-fuchsia-400 text-sm font-semibold">
                  ✓ Dime "uso el #{selected}" y lo pongo como logo oficial de Impulsala
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vista previa en modo claro y oscuro */}
        {selected && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center border border-slate-200">
              <div className="text-center">
                <img src={`/logos/logo${selected}.png`} alt="Logo claro" className="w-24 h-24 object-contain mx-auto mb-2" />
                <p className="text-xs text-slate-500">Modo claro</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 flex items-center justify-center border border-slate-700">
              <div className="text-center">
                <img src={`/logos/logo${selected}.png`} alt="Logo oscuro" className="w-24 h-24 object-contain mx-auto mb-2" />
                <p className="text-xs text-slate-400">Modo oscuro</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center">
          <p className="text-slate-400 text-sm">
            💡 <strong className="text-white">Dime el número</strong> del logo que más te guste (del #1 al #15).
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Todos tienen: <code className="text-fuchsia-400">{`{i}`}</code> + colores de tu web (índigo/fucsia/rosa) + diseño profesional.
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition">
            ← Volver a la web
          </a>
        </div>
      </div>
    </div>
  );
}
