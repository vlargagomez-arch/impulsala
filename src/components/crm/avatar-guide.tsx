"use client";

import { useState } from "react";
import {
  Video,
  Mic,
  Bot,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Volume2,
  Play,
  Palette,
  Film,
  Zap,
  Clock,
  DollarSign,
} from "lucide-react";

const TOOLS = [
  {
    name: "HeyGen",
    description: "Avatar con IA que habla. Subí tu guion y genera video automáticamente.",
    url: "https://heygen.com",
    price: "$24/mes (gratis 1 video)",
    features: ["Avatar realista", "Voz en español", "Gestos naturales", "Fondos personalizables"],
    recommended: true,
    icon: Bot,
  },
  {
    name: "Synthesia",
    description: "Videos con avatares IA. +140 idiomas. Ideal para presentaciones profesionales.",
    url: "https://synthesia.io",
    price: "$30/mes (gratis 1 video)",
    features: ["+140 idiomas", "+60 avatares", "Plantillas profesionales", "API disponible"],
    recommended: false,
    icon: Video,
  },
  {
    name: "D-ID",
    description: "Anima fotos con IA. Subí una foto y la haces hablar.",
    url: "https://d-id.com",
    price: "$5/mes (gratis 5 min)",
    features: ["Anima cualquier foto", "Voz realista", "API barata", "Integración con ChatGPT"],
    recommended: false,
    icon: Sparkles,
  },
  {
    name: "ElevenLabs",
    description: "Mejor TTS del mercado. Voces hiper-realistas en español.",
    url: "https://elevenlabs.io",
    price: "$5/mes (gratis 10k chars)",
    features: ["Voces realistas", "Español neutro/colombiano", "Clonación de voz", "API barata"],
    recommended: true,
    icon: Mic,
  },
];

const WORKFLOW = [
  {
    step: 1,
    title: "Generar guion",
    description: "Usá el Asistente IA Marketing o los Guiones de Video del CRM",
    icon: Sparkles,
    time: "5 min",
    cost: "Gratis",
  },
  {
    step: 2,
    title: "Generar voz con ElevenLabs",
    description: "Pegá el guion en ElevenLabs. Elegí voz en español colombiano. Descargá MP3.",
    icon: Volume2,
    time: "3 min",
    cost: "$0.10 USD",
    url: "https://elevenlabs.io",
  },
  {
    step: 3,
    title: "Generar avatar con HeyGen",
    description: "Subí el audio a HeyGen. Elegí avatar. Generá video automáticamente.",
    icon: Bot,
    time: "5 min",
    cost: "$1 USD",
    url: "https://heygen.com",
  },
  {
    step: 4,
    title: "Agregar visuales con Canva/CapCut",
    description: "Editá en CapCut (gratis). Agregá texto en pantalla, transiciones, música.",
    icon: Film,
    time: "15 min",
    cost: "Gratis",
  },
  {
    step: 5,
    title: "Publicar en redes",
    description: "Subí a TikTok, Reels y YouTube Shorts con los hashtags del guion.",
    icon: Video,
    time: "5 min",
    cost: "Gratis",
  },
];

const VOICE_OPTIONS = [
  { name: "Spanish - Colombia", voice: "Juan", description: "Voz masculina, profesional, neutro" },
  { name: "Spanish - Colombia", voice: "Sofia", description: "Voz femenina, cálida, cercana" },
  { name: "Spanish - Latam", voice: "Carlos", description: "Voz masculina, energía media, ideal Ads" },
  { name: "Spanish - Latam", voice: "Maria", description: "Voz femenina, profesional, ideal educativo" },
];

export function CrmAvatarGuide() {
  const [copied, setCopied] = useState(false);

  const copyWorkflow = () => {
    const text = `WORKFLOW AUTOMATIZADO PARA VIDEOS DE IMPULSALA

1. GENERAR GUION (5 min, gratis)
   - Entrá al CRM → Asistente IA Marketing
   - Pedí: "Generá un guion para video de TikTok sobre [servicio]"
   - Copiá el guion generado

2. GENERAR VOZ CON ELEVENLABS (3 min, $0.10)
   - Entrá a https://elevenlabs.io
   - Pegá el guion en la caja de texto
   - Voz: Spanish - Colombia (Juan o Sofia)
   - Click "Generate" → descargar MP3

3. GENERAR AVATAR CON HEYGEN (5 min, $1)
   - Entrá a https://heygen.com
   - Click "Create Video"
   - Elegí avatar (recomendado: "Andrew" o "Sarah")
   - Subí el MP3 de ElevenLabs
   - Click "Submit" → esperar 5 min → descargar video

4. EDITAR CON CAPCUT (15 min, gratis)
   - Descargá CapCut gratis: https://capcut.com
   - Importá el video del avatar
   - Agregá texto en pantalla (lo del guion "textOverlay")
   - Agregá transiciones entre escenas
   - Agregá música de fondo (búsqueda "corporate uplifting")
   - Exportá en 1080x1920 (vertical para TikTok/Reels)

5. PUBLICAR (5 min, gratis)
   - Subí a TikTok, Instagram Reels, YouTube Shorts
   - Pegá los hashtags del guion
   - Caption: el subject o hook del guion
   - Mejor horario: 7-9pm hora Colombia

TOTAL: 33 minutos por video
COSTO: $1.10 USD por video
HERRAMIENTAS NECESARIAS: ElevenLabs + HeyGen + CapCut (gratis)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Avatar y Voz Automática</h2>
            <p className="text-xs text-muted-foreground">
              Generá videos con avatares IA y voz realista sin grabar nada. Workflow automático para Hermes.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            33 min por video
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            $1.10 USD por video
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            100% automático
          </span>
        </div>
      </div>

      {/* Workflow visual */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Film className="w-4 h-4 text-violet-400" />
          Workflow Automatizado (5 pasos)
        </h3>
        <div className="space-y-3">
          {WORKFLOW.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                {step.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <step.icon className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {step.time}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {step.cost}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                {step.url && (
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-violet-400 hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Abrir herramienta
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={copyWorkflow}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              ¡Copiado! Pegalo en WhatsApp para Hermes
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar workflow completo
            </>
          )}
        </button>
      </div>

      {/* Herramientas recomendadas */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Herramientas Recomendadas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className={`rounded-xl border p-4 transition-all ${
                tool.recommended
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-border/60 bg-card/40"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-violet-500/15">
                    <tool.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      {tool.name}
                      {tool.recommended && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                          Recomendado
                        </span>
                      )}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{tool.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] text-muted-foreground">{tool.price}</span>
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-0.5 mb-2">
                {tool.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-violet-400 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Abrir
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Voces recomendadas */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-violet-400" />
          Voces Recomendadas (ElevenLabs)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOICE_OPTIONS.map((v) => (
            <div
              key={v.voice}
              className="flex items-center gap-3 p-3 rounded-lg bg-card/40 border border-border/40"
            >
              <div className="p-2 rounded-full bg-violet-500/15">
                <Mic className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{v.voice}</p>
                <p className="text-[11px] text-muted-foreground">{v.name}</p>
                <p className="text-[10px] text-muted-foreground/80">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick setup */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 p-4">
        <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Setup inicial (una sola vez)
        </h3>
        <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
          <li>Crear cuenta en ElevenLabs (gratis, $5 de crédito inicial)</li>
          <li>Crear cuenta en HeyGen (gratis, 1 video gratis)</li>
          <li>Descargar CapCut gratis en https://capcut.com</li>
          <li>Crear cuenta en TikTok, Instagram y YouTube (si no tenés)</li>
          <li>Probar el workflow con 1 video piloto</li>
        </ol>
        <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/30">
          💡 <strong>Tip:</strong> Con $10 USD de crédito en HeyGen podés generar 10 videos. Con $5 en ElevenLabs, suficientes voces para 50+ videos.
        </p>
      </div>
    </div>
  );
}
