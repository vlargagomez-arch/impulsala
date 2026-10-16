"use client";

import { useState, useRef } from "react";
import {
  Video,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Volume2,
  Play,
  Pause,
  Download,
  Bot,
  ExternalLink,
  Mic,
  Film,
  Zap,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

type Script = {
  title: string;
  hook: string;
  scenes: { time: string; visual: string; voiceover: string; textOverlay?: string }[];
  cta: string;
  hashtags: string[];
};

const SCRIPT_TEMPLATES: Record<string, Script[]> = {
  "restaurante-web": [
    {
      title: "Restaurantes: tu menú digital que vende por WhatsApp",
      hook: "Si tenés un restaurante y tus clientes todavía llaman por teléfono para pedir, estás perdiendo ventas todos los días. Te muestro cómo arreglarlo.",
      scenes: [
        {
          time: "0-4s",
          visual: "Persona atendiendo teléfono en restaurante caótico. Anota pedido en papel. Se equivoca.",
          voiceover: "Si tenés un restaurante y tus clientes todavía llaman por teléfono para pedir, estás perdiendo ventas todos los días. Te muestro cómo arreglarlo.",
          textOverlay: "¿Pedidos por teléfono? Estás perdiendo ventas",
        },
        {
          time: "4-15s",
          visual: "Muestra Don XL: cliente armando perro paso a paso en web móvil. Tap, tap, enviar WhatsApp.",
          voiceover: "Esto es lo que hicimos con Don XL en Villavicencio. El cliente arma su pedido paso a paso en la web. Se envía solo por WhatsApp. Cero errores, cero llamadas perdidas.",
          textOverlay: "Pedido → WhatsApp automático",
        },
        {
          time: "15-25s",
          visual: "Estadísticas animadas: +380% pedidos WhatsApp, +28% ticket promedio.",
          voiceover: "Resultados: 380 por ciento más pedidos por WhatsApp. Ticket promedio subió 28 por ciento. Tiempo de pedido bajó 60 por ciento.",
          textOverlay: "+380% pedidos",
        },
        {
          time: "25-35s",
          visual: "Dueño restaurante sonriendo con celular. Logo Impulsala + CTA.",
          voiceover: "Si tenés restaurante, cafetería o comida rápida, esto lo podés tener funcionando en 2 semanas. Videollamada gratis y te muestro tu caso.",
          textOverlay: "Videollamada gratis → impulsala.com",
        },
      ],
      cta: "Menú digital + WhatsApp: impulsala.com · WhatsApp: 319 635 4992",
      hashtags: ["#Restaurantes", "#MenuDigital", "#PedidosWhatsApp", "#Bogota", "#Colombia", "#Impulsala"],
    },
  ],
  "gimnasio-ia": [
    {
      title: "Gimnasios: chatbot que atiende 24/7",
      hook: "Las preguntas que más te cansan en tu gimnasio: '¿cuánto cuesta?', '¿qué horarios?'. Un chatbot las responde por vos. 24/7.",
      scenes: [
        {
          time: "0-5s",
          visual: "Persona en recepción respondiendo la misma pregunta por décima vez. Cara de cansancio.",
          voiceover: "Las preguntas que más te cansan en tu gimnasio: ¿cuánto cuesta?, ¿qué horarios?, ¿tienen parqueadero? Un chatbot las responde por vos, las 24 horas.",
          textOverlay: "Cansado de las mismas preguntas?",
        },
        {
          time: "5-15s",
          visual: "Captura: chatbot en web del gimnasio. Cliente pregunta, chatbot responde con info exacta.",
          voiceover: "Chatbot inteligente en tu web y WhatsApp. Responde precios, horarios, ubicación, planes disponibles. Conoce tu gimnasio mejor que vos.",
          textOverlay: "Responde: precios, horarios, planes",
        },
        {
          time: "15-25s",
          visual: "Captura: chatbot agendando clase de prueba automáticamente.",
          voiceover: "Si el cliente está interesado, le ofrece clase de prueba gratis. Agenda automáticamente. Le manda recordatorio el día anterior.",
          textOverlay: "Clase prueba automática",
        },
        {
          time: "25-35s",
          visual: "Logo Impulsala + CTA.",
          voiceover: "Si tenés gym, box o studio, esto lo podés tener en 2 semanas. Demo gratis en impulsala.com.",
          textOverlay: "Demo gratis → impulsala.com",
        },
      ],
      cta: "Chatbot para gimnasios: impulsala.com · WhatsApp: 319 635 4992",
      hashtags: ["#Gimnasio", "#Chatbot", "#IA", "#Fitness", "#Bogota", "#Impulsala"],
    },
  ],
  "inmobiliaria-web": [
    {
      title: "Inmobiliarias: portal con +50.000 propiedades que carga en 200ms",
      hook: "Si tenés inmobiliaria y tu web no carga rápido, perdés clientes. Properati tiene 50.000 propiedades y carga en 200ms. Te muestro cómo lo hicimos.",
      scenes: [
        {
          time: "0-5s",
          visual: "Persona intentando buscar apartamento en web lenta. Se frustra, cierra. Cronómetro: 8 segundos.",
          voiceover: "Si tenés inmobiliaria y tu web no carga rápido, perdés clientes. Properati tiene 50 mil propiedades y carga en 200 milisegundos. Te muestro cómo lo hicimos.",
          textOverlay: "Web lenta = clientes perdidos",
        },
        {
          time: "5-15s",
          visual: "Captura: Properati cargando instantáneo. Mapa interactivo con miles de propiedades.",
          voiceover: "Properati: portal inmobiliario con 50 mil propiedades. Mapa interactivo con clusterización inteligente. Filtros combinables. Todo en 200 milisegundos.",
          textOverlay: "50.000 propiedades · 200ms carga",
        },
        {
          time: "15-25s",
          visual: "Captura: lead entra por web, se guarda en CRM automáticamente.",
          voiceover: "Cada contacto se guarda en tu CRM automáticamente. El sistema califica el lead según propiedades vistas. Vos solo atendés los calientes.",
          textOverlay: "Lead scoring automático",
        },
        {
          time: "25-35s",
          visual: "Logo Impulsala + CTA.",
          voiceover: "Si tenés inmobiliaria, agenda videollamada gratis y te mostramos cómo potenciar tu portal.",
          textOverlay: "Videollamada gratis → impulsala.com",
        },
      ],
      cta: "Portal inmobiliario + CRM: impulsala.com · WhatsApp: 319 635 4992",
      hashtags: ["#Inmobiliaria", "#BienesRaices", "#Bogota", "#Colombia", "#Impulsala", "#Propiedades"],
    },
  ],
  "abogados-seo": [
    {
      title: "Abogados: cómo aparecer primero en Google",
      hook: "Si sos abogado y no aparecés en Google cuando alguien busca tu servicio, estás perdiendo clientes. Te muestro cómo aparecer primero.",
      scenes: [
        {
          time: "0-5s",
          visual: "Google search: 'abogado divorcios Bogotá'. Solo 3 resultados orgánicos aparecen arriba. Tu competencia, no vos.",
          voiceover: "Si sos abogado, contador o arquitecto y no aparecés en Google cuando alguien busca tu servicio, estás perdiendo clientes. Te muestro cómo aparecer primero.",
          textOverlay: "¿No aparecés en Google? = Clientes perdidos",
        },
        {
          time: "5-15s",
          visual: "Captura: 3 pasos SEO — keywords correctas, contenido optimizado, autoridad.",
          voiceover: "Tres cosas: investigar qué buscan tus clientes. Crear contenido optimizado para esas keywords. Conseguir links de otros sitios que te mencionen.",
          textOverlay: "Keywords · Contenido · Autoridad",
        },
        {
          time: "15-25s",
          visual: "Captura: artículos de blog en web del abogado. 'Cómo tramitar divorcio en Colombia 2026'.",
          voiceover: "Ejemplo: escribimos artículo 'Cómo tramitar divorcio en Colombia 2026'. Aparece primero en Google. El cliente lo lee, te contacta. Es tu cliente.",
          textOverlay: "Artículo que convierte en cliente",
        },
        {
          time: "25-35s",
          visual: "Logo Impulsala + CTA.",
          voiceover: "Si sos profesional independiente, agenda auditoría SEO gratis. Te decimos qué están buscando tus clientes.",
          textOverlay: "Auditoría gratis → impulsala.com",
        },
      ],
      cta: "SEO para profesionales: impulsala.com · WhatsApp: 319 635 4992",
      hashtags: ["#Abogados", "#SEO", "#Bogota", "#Profesionales", "#Impulsala", "#Google"],
    },
  ],
  "brand-promo": [
    {
      title: "Impulsala: tu partner estratégico digital en Bogotá",
      hook: "No somos una agencia más. Somos tu partner estratégico digital. Hay una diferencia enorme.",
      scenes: [
        {
          time: "0-5s",
          visual: "Persona mirando cámara. Texto: PARTNER vs AGENCIA.",
          voiceover: "No somos una agencia más. Somos tu partner estratégico digital. Hay una diferencia enorme.",
          textOverlay: "Partner no es igual a Agencia",
        },
        {
          time: "5-15s",
          visual: "Mostrando los 4 servicios con íconos animados: Web, SEO, Ads, IA.",
          voiceover: "Hacemos 4 cosas muy bien: páginas web que venden, SEO que te posiciona en Google, campañas publicitarias con ROI medible, e inteligencia artificial que trabaja 24/7 por ti.",
          textOverlay: "Web · SEO · Ads · IA",
        },
        {
          time: "15-25s",
          visual: "Mapa de Colombia con marcadores en Bogotá, Medellín, Cali. Logo clientes.",
          voiceover: "Ya trabajamos con más de 40 empresas en Bogotá, Medellín, Cali y toda Colombia. Desde restaurantes hasta inmobiliarias con 50 mil propiedades.",
          textOverlay: "40+ clientes en Colombia",
        },
        {
          time: "25-35s",
          visual: "Logo Impulsala + CTA agendar.",
          voiceover: "Agenda tu videollamada gratuita de 30 minutos. Revisamos tu caso y te damos un plan personalizado. Sin compromiso.",
          textOverlay: "Videollamada gratis → impulsala.com",
        },
      ],
      cta: "Videollamada gratuita 30 min: impulsala.com · WhatsApp: 319 635 4992",
      hashtags: ["#Impulsala", "#AgenciaDigital", "#Bogota", "#Colombia", "#PYMES", "#MarketingDigital"],
    },
  ],
};

const SCRIPT_CATEGORIES = [
  { id: "restaurante-web", label: "Restaurantes - Menú Digital", emoji: "🍽️" },
  { id: "gimnasio-ia", label: "Gimnasios - Chatbot IA", emoji: "💪" },
  { id: "inmobiliaria-web", label: "Inmobiliarias - Portal Web", emoji: "🏠" },
  { id: "abogados-seo", label: "Abogados - SEO Google", emoji: "⚖️" },
  { id: "brand-promo", label: "Marca Impulsala - Promo", emoji: "✨" },
];

const VOICE_OPTIONS = [
  { id: "es-CO-Salome", label: "Salomé - Colombia Femenina", emoji: "🇨🇴" },
  { id: "es-CO-Gonzalo", label: "Gonzalo - Colombia Masculino", emoji: "🇨🇴" },
  { id: "es-MX-Dalia", label: "Dalia - México Femenina", emoji: "🇲🇽" },
  { id: "es-MX-Jorge", label: "Jorge - México Masculino", emoji: "🇲🇽" },
  { id: "es-ES-Elvira", label: "Elvira - España Femenina", emoji: "🇪🇸" },
  { id: "es-ES-Alvaro", label: "Álvaro - España Masculino", emoji: "🇪🇸" },
  { id: "es-AR-Elena", label: "Elena - Argentina Femenina", emoji: "🇦🇷" },
  { id: "es-AR-Tomas", label: "Tomás - Argentina Masculino", emoji: "🇦🇷" },
];

const OPENSOURCE_TOOLS = [
  {
    name: "Edge TTS",
    description: "Voces Neural de Microsoft en español. Calidad profesional. 100% gratis, ilimitado.",
    url: "https://github.com/andresaya/edge-tts-node",
    category: "Voz IA",
    stars: "1k+",
    icon: "🎙️",
    color: "from-emerald-500/15 to-teal-500/5 border-emerald-500/30",
    badge: "RECOMENDADO",
  },
  {
    name: "Coqui TTS (XTTS v2)",
    description: "TTS open source con clonación de voz. 17 idiomas incluyendo español. Calidad humana.",
    url: "https://github.com/coqui-ai/TTS",
    category: "Voz IA",
    stars: "35k+",
    icon: "🔊",
    color: "from-violet-500/15 to-purple-500/5 border-violet-500/30",
    badge: "TOP",
  },
  {
    name: "AllTalk TTS",
    description: "Fork de Coqui con API REST JSON. Perfecto para integrar desde Node.js.",
    url: "https://github.com/erew123/alltalk_tts",
    category: "Voz IA",
    stars: "2k+",
    icon: "📡",
    color: "from-violet-500/15 to-purple-500/5 border-violet-500/30",
    badge: "API",
  },
  {
    name: "SadTalker",
    description: "Avatar IA que habla a partir de una foto + audio. Lip-sync realista. 100% gratis.",
    url: "https://github.com/OpenTalker/SadTalker",
    category: "Avatar IA",
    stars: "14k+",
    icon: "🤖",
    color: "from-fuchsia-500/15 to-pink-500/5 border-fuchsia-500/30",
    badge: "GRATIS",
  },
  {
    name: "MuseTalk",
    description: "Lip-sync en tiempo real. Mejor calidad que Wav2Lip. Para videos profesionales.",
    url: "https://github.com/TMElyralab/MuseTalk",
    category: "Avatar IA",
    stars: "4k+",
    icon: "🎬",
    color: "from-fuchsia-500/15 to-pink-500/5 border-fuchsia-500/30",
    badge: "TIEMPO REAL",
  },
  {
    name: "Stable Diffusion WebUI",
    description: "Generá imágenes IA para tus posts. API REST en /sdapi/v1/. 164k estrellas.",
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    category: "Imágenes IA",
    stars: "164k+",
    icon: "🎨",
    color: "from-amber-500/15 to-orange-500/5 border-amber-500/30",
    badge: "API REST",
  },
  {
    name: "ComfyUI",
    description: "Editor visual de flujos IA. Generación de imágenes con nodos. 128k estrellas.",
    url: "https://github.com/comfyanonymous/ComfyUI",
    category: "Imágenes IA",
    stars: "128k+",
    icon: "🖼️",
    color: "from-amber-500/15 to-orange-500/5 border-amber-500/30",
    badge: "API",
  },
  {
    name: "Open-Sora",
    description: "Generación de video con IA. Text-to-video. Open source de HPCAI Tech.",
    url: "https://github.com/hpcaitech/Open-Sora",
    category: "Video IA",
    stars: "25k+",
    icon: "🎥",
    color: "from-sky-500/15 to-blue-500/5 border-sky-500/30",
    badge: "TEXT-TO-VIDEO",
  },
  {
    name: "VideoLingo",
    description: "Traducción + doblaje de videos con IA. Para contenido multi-idioma automático.",
    url: "https://github.com/Huanshere/VideoLingo",
    category: "Video IA",
    stars: "18k+",
    icon: "🌍",
    color: "from-sky-500/15 to-blue-500/5 border-sky-500/30",
    badge: "DOBLAJE",
  },
  {
    name: "Flowise",
    description: "Automatización IA no-code. Orquesta todo el pipeline. Nativo Node.js.",
    url: "https://github.com/FlowiseAI/Flowise",
    category: "Automatización",
    stars: "55k+",
    icon: "⚡",
    color: "from-rose-500/15 to-red-500/5 border-rose-500/30",
    badge: "NODE.JS",
  },
  {
    name: "Oobabooga TextGen",
    description: "LLM local con API compatible con OpenAI. Generá copy, guiones, estrategias.",
    url: "https://github.com/oobabooga/text-generation-webui",
    category: "LLM Local",
    stars: "40k+",
    icon: "🧠",
    color: "from-cyan-500/15 to-teal-500/5 border-cyan-500/30",
    badge: "OPENAI API",
  },
  {
    name: "Bark",
    description: "TTS de Suno con sonidos naturales. Risas, suspiros, emociones. Multilingüe.",
    url: "https://github.com/suno-ai/bark",
    category: "Voz IA",
    stars: "39k+",
    icon: "🐶",
    color: "from-emerald-500/15 to-teal-500/5 border-emerald-500/30",
    badge: "EMOCIONES",
  },
];

const TOOL_CATEGORIES = ["Voz IA", "Avatar IA", "Imágenes IA", "Video IA", "Automatización", "LLM Local"];

export function CrmMarketing() {
  const [selectedCategory, setSelectedCategory] = useState<string>("restaurante-web");
  const [selectedVoice, setSelectedVoice] = useState<string>("es-CO-Salome");
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playingScene, setPlayingScene] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentScript = SCRIPT_TEMPLATES[selectedCategory]?.[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const generateAudio = async (text: string, sceneIdx: number | "full") => {
    setAudioLoading(true);
    setAudioError(null);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error generando audio");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setPlayingScene(sceneIdx === "full" ? -1 : sceneIdx);

      // Auto-play
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setAudioLoading(false);
    }
  };

  const generateFullAudio = async () => {
    if (!currentScript) return;

    // Concatenar todas las voiceover de las escenas
    const fullText = [
      currentScript.hook,
      ...currentScript.scenes.map((s) => s.voiceover),
      currentScript.cta,
    ].join(". ");

    generateAudio(fullText, "full");
  };

  if (!currentScript) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Estudio de Marketing Digital</h2>
            <p className="text-xs text-muted-foreground">
              Generá guiones, voces y videos automáticamente. Todo integrado, todo gratis.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Video className="w-3.5 h-3.5 text-fuchsia-400" />
            Guiones por industria
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            Voz IA gratis
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Bot className="w-3.5 h-3.5 text-violet-400" />
            Avatar gratis
          </span>
        </div>
      </div>

      {/* Selector de guion */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          1. Elegí el tipo de video
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SCRIPT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setAudioUrl(null);
                setAudioError(null);
                setExpandedScene(null);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                selectedCategory === cat.id
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-border/60 bg-card/40 hover:border-violet-500/30"
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-foreground flex-1">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selector de voz */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-muted-foreground">
            2. Elegí la voz del avatar (Neural · más humanas)
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Powered by Microsoft Edge TTS
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {VOICE_OPTIONS.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVoice(v.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                selectedVoice === v.id
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-border/60 bg-card/40 hover:border-emerald-500/30"
              }`}
            >
              <span className="text-base">{v.emoji}</span>
              <Mic className={`w-3 h-3 flex-shrink-0 ${selectedVoice === v.id ? "text-emerald-400" : "text-muted-foreground"}`} />
              <span className="text-[11px] font-medium text-foreground flex-1 text-left leading-tight">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Guion completo */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl overflow-hidden">
        {/* Título del guion */}
        <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/5 px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground">{currentScript.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {currentScript.scenes.length} escenas · {currentScript.scenes[currentScript.scenes.length - 1].time}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(JSON.stringify(currentScript, null, 2), "full-script")}
              className="flex-shrink-0 p-2 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 text-violet-400 transition-colors"
              title="Copiar guion completo"
            >
              {copiedItem === "full-script" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Hook */}
        <div className="p-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Hook (primeros 3 segundos)
                </span>
              </div>
              <button
                onClick={() => generateAudio(currentScript.hook, 0)}
                disabled={audioLoading}
                className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors disabled:opacity-50"
              >
                {audioLoading && playingScene === 0 ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <Volume2 className="w-2.5 h-2.5" />
                )}
                Probar voz
              </button>
            </div>
            <p className="text-xs text-foreground/90 italic">"{currentScript.hook}"</p>
          </div>

          {/* Escenas */}
          <div className="space-y-2">
            {currentScript.scenes.map((scene, i) => (
              <div
                key={i}
                className="rounded-lg bg-background/40 border border-border/40 overflow-hidden"
              >
                <div
                  className="px-3 py-2.5 cursor-pointer hover:bg-background/60 transition-colors"
                  onClick={() => setExpandedScene(expandedScene === i ? null : i)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded">
                      {scene.time}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Escena {i + 1}</span>
                  </div>
                  <p className="text-xs text-foreground/90 line-clamp-1">{scene.voiceover}</p>
                </div>

                {expandedScene === i && (
                  <div className="px-3 pb-3 space-y-2 border-t border-border/30 pt-2">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-0.5">Visual</p>
                      <p className="text-xs text-foreground/90">{scene.visual}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-0.5">Voz en off</p>
                      <p className="text-xs text-foreground/90">{scene.voiceover}</p>
                    </div>
                    {scene.textOverlay && (
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-0.5">Texto en pantalla</p>
                        <p className="text-xs text-amber-300">{scene.textOverlay}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateAudio(scene.voiceover, i);
                        }}
                        disabled={audioLoading}
                        className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors disabled:opacity-50"
                      >
                        {audioLoading && playingScene === i ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Volume2 className="w-2.5 h-2.5" />
                        )}
                        Escuchar voz
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(scene.voiceover, `scene-${i}`);
                        }}
                        className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 transition-colors"
                      >
                        {copiedItem === `scene-${i}` ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                        Copiar texto
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Llamado a la acción
              </span>
            </div>
            <p className="text-xs text-foreground/90">{currentScript.cta}</p>
          </div>

          {/* Hashtags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentScript.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Generar audio completo */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-foreground">Generar audio completo del guion</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Generá la voz del video completo (hook + escenas + CTA) con la voz seleccionada. Gratis, ilimitado.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={generateFullAudio}
            disabled={audioLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {audioLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando audio...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Generar audio completo
              </>
            )}
          </button>

          {audioUrl && (
            <a
              href={audioUrl}
              download={`guion-${selectedCategory}.mp3`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-sm font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              Descargar MP3
            </a>
          )}
        </div>

        {audioError && (
          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300">{audioError}</p>
          </div>
        )}

        {audioUrl && (
          <div className="mt-3">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={audioUrl}
            />
          </div>
        )}
      </div>

      {/* Workflow para generar video completo */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Film className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-sm font-bold text-foreground">Generar video con avatar (3 pasos)</h3>
        </div>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">Generar audio (gratis)</p>
              <p className="text-xs text-muted-foreground mb-2">
                Usá el botón de arriba para generar el MP3 con voz colombiana. Gratis, ilimitado.
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                $0 USD
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">Generar avatar con SadTalker (gratis)</p>
                <a
                  href="https://huggingface.co/spaces/ameerazam08/SadTalker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] flex items-center gap-1 text-violet-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir
                </a>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Subí una foto tuya (o usá una de stock) + el MP3 del paso 1. SadTalker genera el video con lip-sync. 100% gratis, sin marca de agua.
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                $0 USD · Sin registro
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-foreground">Editar con CapCut (gratis)</p>
                <a
                  href="https://capcut.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Abrir
                </a>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Importá el video. Agregá los textos en pantalla (los del guion), transiciones y música. Exportá en vertical (1080x1920).
              </p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                $0 USD
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20">
          <p className="text-xs text-foreground/90">
            <strong>💡 Tip:</strong> Con este workflow, generás videos profesionales de marketing <strong>100% gratis</strong>. Solo necesitás una foto tuya para el avatar y CapCut para editar.
          </p>
        </div>
      </div>

      {/* Herramientas open source */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            Herramientas Open Source (GitHub)
          </h3>
          <span className="text-[10px] text-muted-foreground">12 repos · 100% gratis</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Las mejores herramientas open source para marketing digital con IA. Todas gratis, todas en GitHub.
        </p>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TOOL_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-muted-foreground"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {OPENSOURCE_TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col gap-2 p-3 rounded-xl border bg-gradient-to-br ${tool.color} hover:scale-[1.02] transition-all`}
            >
              {/* Badge */}
              {tool.badge && (
                <span className="absolute top-2 right-2 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-background/60 text-foreground/80 border border-border/30">
                  {tool.badge}
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xl">{tool.icon}</span>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">{tool.name}</p>
                  <p className="text-[9px] text-muted-foreground">⭐ {tool.stars}</p>
                </div>
              </div>

              <p className="text-[11px] text-foreground/80 leading-relaxed flex-1">{tool.description}</p>

              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{tool.category}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* RUTA DE VIDEO AUTOMÁTICO 100% */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent border border-violet-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Ruta de Video 100% Automático
            </h3>
            <p className="text-xs text-muted-foreground">
              Le das un guion → te entrega el video terminado. Sin editar nada. 100% automático.
            </p>
          </div>
        </div>

        {/* MoneyPrinterTurbo - destacado */}
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-3">
          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2 flex-wrap">
                  MoneyPrinterTurbo
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    Recomendado #1
                  </span>
                  <span className="text-[10px] text-muted-foreground">⭐ 66.000 estrellas</span>
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pipeline completo: guion → narración → subtítulos → música → animaciones → video final
                </p>
              </div>
            </div>
            <a
              href="https://github.com/harry0703/MoneyPrinterTurbo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              Abrir repo
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3" /> Sin GPU (CPU)
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3" /> 100% gratis
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3" /> WebUI en español
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Check className="w-3 h-3" /> Voces colombianas
            </div>
          </div>

          {/* Pasos de instalación en la nube */}
          <div className="rounded-lg bg-background/40 border border-border/40 p-3">
            <p className="text-[11px] font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Play className="w-3 h-3 text-emerald-400" />
              Opciones en la nube (sin usar tu compu)
            </p>

            {/* Opción 1: Google Colab */}
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2.5 mb-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <span className="text-base">🥇</span>
                  Google Colab (gratis, 12.7 GB RAM)
                </p>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RECOMENDADO
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">
                Notebook oficial del autor. Abrís, ejecutás 3 celdas, y tenés la WebUI pública.
              </p>
              <ol className="text-[10px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Entrá a: <code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">colab.research.google.com/github/harry0703/MoneyPrinterTurbo</code></li>
                <li>Crear cuenta ngrok gratis (para túnel): <code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">ngrok.com</code></li>
                <li>Pegar tu token de ngrok en la celda correspondiente</li>
                <li>Ejecutar las celdas → te da URL pública</li>
              </ol>
              <p className="text-[9px] text-muted-foreground mt-1">
                ✅ 100% gratis · ✅ 12.7 GB RAM · ✅ sin tocar tu compu · ⚠️ 12h por sesión
              </p>
            </div>

            {/* Opción 2: GitHub Codespaces */}
            <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2.5 mb-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <span className="text-base">🥈</span>
                  GitHub Codespaces (gratis 60h/mes, 16 GB RAM)
                </p>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  ALTERNATIVA
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">
                Usá la infraestructura de GitHub desde el navegador. 16 GB RAM gratis.
              </p>
              <ol className="text-[10px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Hacé fork del repo en GitHub</li>
                <li>Botón verde "Code" → "Create codespace on main"</li>
                <li>En la terminal: <code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">pip install -r requirements.txt</code></li>
                <li><code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">streamlit run webui/Main.py --server.port=8501 --server.address=0.0.0.0</code></li>
                <li>VSCode web abre automáticamente el puerto → URL lista</li>
              </ol>
              <p className="text-[9px] text-muted-foreground mt-1">
                ✅ 16 GB RAM · ✅ 60h/mes gratis · ✅ sin tocar tu compu · ⚠️ se cae si inactivo
              </p>
            </div>

            {/* Opción 3: Railway */}
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                  <span className="text-base">🥉</span>
                  Railway ($5/mes, 24/7 URL permanente)
                </p>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PERSISTENTE
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">
                URL pública 24/7. Mejor si vas a generar muchos videos.
              </p>
              <ol className="text-[10px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Fork del repo en GitHub</li>
                <li>Entrá a <code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">railway.app</code> → New Project → Deploy from GitHub</li>
                <li>Railway detecta el Dockerfile y deploya solo</li>
                <li>URL: <code className="px-1 py-0.5 bg-muted rounded text-foreground text-[9px]">https://tu-proyecto.up.railway.app</code></li>
              </ol>
              <p className="text-[9px] text-muted-foreground mt-1">
                ✅ 24/7 URL · ✅ 8 GB RAM · ⚠️ $5/mes · ✅ sin tocar tu compu
              </p>
            </div>
          </div>

          {/* Config gratis */}
          <div className="mt-3 rounded-lg bg-violet-500/10 border border-violet-500/30 p-3">
            <p className="text-[11px] font-bold text-foreground mb-1">💡 Configuración 100% GRATIS:</p>
            <ul className="text-[11px] text-muted-foreground space-y-0.5">
              <li>• LLM: <code className="px-1 bg-muted rounded text-foreground text-[10px]">ollama</code> (local, gratis) en vez de OpenAI</li>
              <li>• TTS: <code className="px-1 bg-muted rounded text-foreground text-[10px]">edge-tts</code> (gratis, voces colombianas)</li>
              <li>• Footage: Pexels + Pixabay (APIs gratis)</li>
              <li>• Subtítulos: Whisper local (gratis)</li>
            </ul>
          </div>

          {/* Qué hace automáticamente */}
          <div className="mt-3">
            <p className="text-[11px] font-bold text-foreground mb-2">Lo que hace SOLO:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                "Genera guion con IA (o usás el del CRM)",
                "Busca videos de stock automáticos",
                "Genera narración con voz colombiana",
                "Crea subtítulos sincronizados",
                "Agrega música de fondo automática",
                "Hace transiciones y animaciones",
                "Exporta en 9:16 (TikTok/Reels)",
                "Listo para publicar en redes",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alternativas */}
        <p className="text-xs font-bold text-foreground mb-2 mt-4">Alternativas:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            {
              name: "ShortsGenerator",
              stars: "2k⭐",
              desc: "Canal automático que publica 3 veces/día. Scheduling nativo.",
              url: "https://github.com/leamsigc/ShortsGenerator",
              icon: "📺",
            },
            {
              name: "NarratoAI",
              stars: "4k⭐",
              desc: "Videos narrados largos (1-5 min). Formato documental.",
              url: "https://github.com/linyqh/NarratoAI",
              icon: "🎙️",
            },
            {
              name: "ShortGPT",
              stars: "5.5k⭐",
              desc: "Framework modular para devs. Customizás tu pipeline.",
              url: "https://github.com/RayVentura/ShortGPT",
              icon: "🔧",
            },
            {
              name: "Viral Faceless",
              stars: "700⭐",
              desc: "Shorts faceless con Docker. Gemini free + Edge TTS.",
              url: "https://github.com/Dark2C/Viral-Faceless-Shorts-Generator",
              icon: "🎭",
            },
          ].map((alt) => (
            <a
              key={alt.name}
              href={alt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 p-2.5 rounded-lg bg-card/40 border border-border/40 hover:border-violet-500/40 transition-all"
            >
              <span className="text-base">{alt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{alt.name} <span className="text-[9px] text-muted-foreground">{alt.stars}</span></p>
                <p className="text-[10px] text-muted-foreground">{alt.desc}</p>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            </a>
          ))}
        </div>

        {/* Workflow recomendado */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
          <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Workflow recomendado para Impulsala
          </p>
          <div className="space-y-1.5 text-[11px] text-foreground/80">
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[9px] font-bold">1</span>
              <span>Elegí un guion en el CRM → Marketing Digital → copialo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[9px] font-bold">2</span>
              <span>MoneyPrinterTurbo → pegás el guion → voz "es-CO-SalomeNeural"</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-[9px] font-bold">3</span>
              <span>Click "Generate" → esperás 5 min → video listo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold">4</span>
              <span>Subís a TikTok, Reels y YouTube Shorts con los hashtags</span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border/30">
            ⏱️ Tiempo total: <strong className="text-foreground">10 minutos por video</strong> · 💰 Costo: <strong className="text-foreground">$0 USD</strong>
          </p>
        </div>
      </div>

      {/* Audio element hidden for scene playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
