"use client";

import { useState } from "react";
import {
  Video,
  Megaphone,
  Code2,
  Search,
  Bot,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Clock,
  Hash,
} from "lucide-react";

type ScriptType = "hook" | "reel" | "testimonio" | "tutorial" | "promocion";
type ServiceType = "general" | "web" | "seo" | "ads" | "ia";

type Script = {
  id: string;
  type: ScriptType;
  service: ServiceType;
  title: string;
  duration: string;
  platform: string;
  hook: string;
  scenes: { time: string; visual: string; voiceover: string; textOverlay?: string }[];
  cta: string;
  hashtags: string[];
};

const SCRIPTS: Script[] = [
  // ===== WEB =====
  {
    id: "web-1",
    type: "reel",
    service: "web",
    title: "Tu web carga en 2 segundos (y Google te premia)",
    duration: "30s",
    platform: "TikTok / Reels",
    hook: "¿Sabías que si tu web tarda más de 3 segundos en cargar, pierdes el 50% de tus clientes?",
    scenes: [
      {
        time: "0-3s",
        visual: "Persona mirando el celular con cara de frustración. Pantalla de carga girando.",
        voiceover: "¿Sabías que si tu web tarda más de 3 segundos en cargar, pierdes la mitad de tus clientes?",
        textOverlay: "50% se van si tarda +3s",
      },
      {
        time: "3-10s",
        visual: "Transición rápida a una web de Impulsala cargando instantáneamente. Cronómetro en pantalla.",
        voiceover: "En Impulsala construimos webs que cargan en menos de 2 segundos. Google nos premia con mejores posiciones.",
        textOverlay: "Carga en <2 segundos",
      },
      {
        time: "10-20s",
        visual: "Muestra de 3 webs de clientes (Don XL, Café Herencia, Properati) con transiciones.",
        voiceover: "Ya llevamos 40+ proyectos entregados. Restaurantes, inmobiliarias, cultura. Todos cargan rapidísimo.",
        textOverlay: "40+ proyectos",
      },
      {
        time: "20-30s",
        visual: "Persona sonriendo con su celular mostrando su nueva web. Logo Impulsala al final.",
        voiceover: "¿Tu web es lenta? Agenda una videollamada gratis y te decimos cómo arreglarla en 30 minutos.",
        textOverlay: "Diagnóstico gratis → impulsala.com",
      },
    ],
    cta: "Agenda tu videollamada gratuita en impulsala.com o escribinos por WhatsApp al 319 635 4992",
    hashtags: ["#DesarrolloWeb", "#PaginasWebColombia", "#Bogota", "#PYMES", "#SEO", "#MarketingDigital", "#Impulsala"],
  },
  {
    id: "web-2",
    type: "tutorial",
    service: "web",
    title: "Cómo hacer que tu web venda por ti 24/7",
    duration: "60s",
    platform: "YouTube Shorts / Reels",
    hook: "Tu web debería ser tu mejor vendedor. Pero probablemente está perdiendo clientes ahora mismo.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona en pijama atendiendo una llamada a las 11pm. Cara de cansancio.",
        voiceover: "Tu web debería ser tu mejor vendedor. Pero probablemente está perdiendo clientes ahora mismo.",
        textOverlay: "¿Perdiendo clientes ahora?",
      },
      {
        time: "5-15s",
        visual: "Pantalla dividida: web antigua vs web nueva de Impulsala. La nueva tiene WhatsApp integrado.",
        voiceover: "Una web bien hecha: responde preguntas, califica leads, agenda citas y cierra ventas. Sin que tú muevas un dedo.",
        textOverlay: "Web que vende = Web que trabaja",
      },
      {
        time: "15-25s",
        visual: "Captura del CRM de Impulsala con leads entrando automáticamente.",
        voiceover: "Cada visitante que llega a tu web se convierte en un lead en tu CRM. Con seguimiento automático por email y WhatsApp.",
        textOverlay: "Lead → CRM automático",
      },
      {
        time: "25-40s",
        visual: "Móvil mostrando una web responsive perfecta. Tap en botón WhatsApp, se abre el chat.",
        voiceover: "Diseño responsive impecable en celular, tablet y desktop. Integración directa con WhatsApp. Tus clientes te contactan con un toque.",
        textOverlay: "WhatsApp en 1 toque",
      },
      {
        time: "40-50s",
        visual: "Gráfico animado: +180% conversión, +340% ROI.",
        voiceover: "Nuestros clientes aumentan un 180% sus conversiones. Es como tener 3 vendedores extra sin pagar sueldo.",
        textOverlay: "+180% conversión",
      },
      {
        time: "50-60s",
        visual: "Logo Impulsala + botón agendar + teléfono.",
        voiceover: "Agenda tu videollamada gratuita de 30 minutos. Te revisamos tu web actual y te damos un plan personalizado. Sin compromiso.",
        textOverlay: "Diagnóstico gratis → impulsala.com",
      },
    ],
    cta: "Videollamada gratuita de 30 min: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#DesarrolloWeb", "#PaginasWeb", "#PYMESColombia", "#Bogota", "#MarketingDigital", "#VenderOnline", "#Impulsala"],
  },

  // ===== SEO =====
  {
    id: "seo-1",
    type: "hook",
    service: "seo",
    title: "Por qué tu competencia aparece primero en Google",
    duration: "20s",
    platform: "TikTok / Reels",
    hook: "Tu competencia aparece primero en Google y tú no. Te explico por qué en 20 segundos.",
    scenes: [
      {
        time: "0-3s",
        visual: "Búsqueda en Google: 'abogado divorcios Bogotá'. La competencia aparece arriba, tu web no aparece ni en página 5.",
        voiceover: "Tu competencia aparece primero en Google y tú no. Te explico por qué en 20 segundos.",
        textOverlay: "¿Por qué ellos y no tú?",
      },
      {
        time: "3-12s",
        visual: "Animación: 3 pilares del SEO — Velocidad, Contenido, Autoridad.",
        voiceover: "No es suerte. Es SEO. Tres cosas: velocidad de tu web, contenido optimizado con las keywords correctas, y autoridad con backlinks reales.",
        textOverlay: "Velocidad · Contenido · Autoridad",
      },
      {
        time: "12-20s",
        visual: "Logo Impulsala + tel.",
        voiceover: "En Impulsala te posicionamos en los primeros resultados. Agenda una auditoría SEO gratis y te mostramos qué estás haciendo mal.",
        textOverlay: "Auditoría gratis → impulsala.com",
      },
    ],
    cta: "Auditoría SEO gratuita: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#SEO", "#PosicionamientoGoogle", "#MarketingDigital", "#Bogota", "#PYMES", "#Impulsala", "#GoogleAds"],
  },
  {
    id: "seo-2",
    type: "tutorial",
    service: "seo",
    title: "3 errores de SEO que están matando tu web",
    duration: "45s",
    platform: "Reels / YouTube Shorts",
    hook: "3 errores de SEO que están matando tu web ahora mismo. Si haces el #2, perdés el 70% de tu tráfico.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona grave mirando cámara. Texto grande: 3 ERRORES SEO.",
        voiceover: "3 errores de SEO que están matando tu web ahora mismo. Si haces el #2, perdés el 70% de tu tráfico.",
        textOverlay: "3 errores SEO mortales",
      },
      {
        time: "5-15s",
        visual: "Pantallazo web lenta. Cronómetro. Imagen Google penalizando.",
        voiceover: "Error 1: web lenta. Google penaliza cualquier página que tarde más de 3 segundos en cargar. Tu cliente se va antes de ver tu contenido.",
        textOverlay: "#1 Web lenta = penalización",
      },
      {
        time: "15-25s",
        visual: "Página con texto genérico, sin keywords. Tacha con X roja.",
        voiceover: "Error 2: contenido sin keywords. Si no mencionás lo que tu cliente busca, Google no sabe para quién es tu web. Ahí perdiste el 70% del tráfico.",
        textOverlay: "#2 Sin keywords = -70% tráfico",
      },
      {
        time: "25-35s",
        visual: "Web sin mobile. Persona intentando navegar en celular. Frustración.",
        voiceover: "Error 3: no estar optimizado para móvil. El 70% de las búsquedas son desde celular. Si tu web no se ve bien ahí, perdiste.",
        textOverlay: "#3 No mobile = -70% visitas",
      },
      {
        time: "35-45s",
        visual: "Logo Impulsala + auditoría.",
        voiceover: "¿Cometés alguno de estos? En Impulsala te hacemos una auditoría SEO gratis. 30 minutos por videollamada. Te decimos exactamente qué arreglar.",
        textOverlay: "Auditoría gratis → impulsala.com",
      },
    ],
    cta: "Auditoría SEO gratis: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#SEO", "#ErroresSEO", "#MarketingDigital", "#GoogleRanking", "#PYMES", "#Bogota", "#Impulsala"],
  },

  // ===== ADS =====
  {
    id: "ads-1",
    type: "testimonio",
    service: "ads",
    title: "Café Herencia: cómo duplicamos sus ventas con Google Ads",
    duration: "50s",
    platform: "Reels / YouTube Shorts",
    hook: "Café Herencia duplicó sus ventas en 3 meses con Google Ads. Te cuento cómo lo hicimos.",
    scenes: [
      {
        time: "0-5s",
        visual: "Café Herencia lleno de gente. Dueño sonriendo. Estadística: +100% ventas.",
        voiceover: "Café Herencia duplicó sus ventas en 3 meses con Google Ads. Te cuento cómo lo hicimos.",
        textOverlay: "+100% ventas en 3 meses",
      },
      {
        time: "5-15s",
        visual: "Antes: café vacío. Después: café lleno. Transición.",
        voiceover: "Antes: el café estaba vacío entre semana. Hoy: lleno de lunes a viernes. ¿La diferencia? Aparecemos cuando alguien busca 'café cultural Bogotá'.",
        textOverlay: "Antes: vacío → Ahora: lleno",
      },
      {
        time: "15-25s",
        visual: "Pantallazo de Google Ads. CPC bajo. Conversiones altas.",
        voiceover: "Reducimos el costo por cliente en un 60%. Cada peso invertido genera 3.2 pesos en ventas. Eso es ROI del 320%.",
        textOverlay: "ROI: 320%",
      },
      {
        time: "25-35s",
        visual: "Mapa de Bogotá con marcadores donde aparecen los anuncios.",
        voiceover: "Segmentamos por ubicación: solo mostramos anuncios a personas en La Candelaria y zonas cercanas. Cero gastos desperdiciados.",
        textOverlay: "Segmentación precisa",
      },
      {
        time: "35-50s",
        visual: "Dueño hablando + logo Impulsala.",
        voiceover: "Cada semana recibimos un reporte claro. Sin métricas vanidosas. Solo ventas reales. Si querés duplicar tus ventas con Google Ads, agenda una videollamada gratis con Impulsala.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Duplicá tus ventas con Ads: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#GoogleAds", "#MarketingDigital", "#PYMES", "#Bogota", "#CafeHerencia", "#CasoDeExito", "#Impulsala"],
  },
  {
    id: "ads-2",
    type: "hook",
    service: "ads",
    title: "Estás tirando tu plata en anuncios",
    duration: "25s",
    platform: "TikTok / Reels",
    hook: "Si estás haciendo anuncios en Meta o Google sin un experto, estás tirando tu plata a la basura.",
    scenes: [
      {
        time: "0-3s",
        visual: "Persona tirando billetes a la basura. Cara seria.",
        voiceover: "Si estás haciendo anuncios en Meta o Google sin un experto, estás tirando tu plata a la basura.",
        textOverlay: "¿Tirando plata?",
      },
      {
        time: "3-12s",
        visual: "Pantallazo de Facebook Ads Manager. CPC alto. Conversiones bajas.",
        voiceover: "Anuncios mal optimizados: pagás $5 por clic cuando podrías pagar $1. Anuncios sin segmentar: los ve gente que nunca va a comprar.",
        textOverlay: "$5 por clic → $1 por clic",
      },
      {
        time: "12-20s",
        visual: "Captura de campañas Impulsala optimizadas. ROI 340%.",
        voiceover: "En Impulsala reducimos tu costo por lead hasta 60%. Multiplicamos tus resultados con el mismo presupuesto.",
        textOverlay: "ROI: 340%",
      },
      {
        time: "20-25s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Agenda tu cita gratis y te mostramos cuánta plata estás perdiendo.",
        textOverlay: "Cita gratis → impulsala.com",
      },
    ],
    cta: "Stop perder plata con Ads: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#GoogleAds", "#MetaAds", "#MarketingDigital", "#PYMES", "#Bogota", "#Impulsala", "#ROI"],
  },

  // ===== IA =====
  {
    id: "ia-1",
    type: "reel",
    service: "ia",
    title: "Tu negocio nunca duerme con agentes de IA",
    duration: "35s",
    platform: "TikTok / Reels",
    hook: "Imaginá tener un vendedor que atiende a tus clientes a las 3am, a las 11pm, los domingos. Sin pagarle sueldo.",
    scenes: [
      {
        time: "0-3s",
        visual: "Reloj marcando 3am. Pantalla de WhatsApp con mensaje entrando de un cliente.",
        voiceover: "Imaginá tener un vendedor que atiende a tus clientes a las 3am, a las 11pm, los domingos. Sin pagarle sueldo.",
        textOverlay: "Vendedor 24/7 gratis",
      },
      {
        time: "3-12s",
        visual: "Chat de WhatsApp: cliente pregunta precio, agente IA responde instantáneo. Cliente agenda cita.",
        voiceover: "Eso es un agente de IA. Conversa con tus clientes como un humano, responde preguntas, califica leads, agenda citas. 24/7 sin cansarse.",
        textOverlay: "Conversa · Califica · Agenda",
      },
      {
        time: "12-22s",
        visual: "Dashboard mostrando 23 conversaciones atendidas. Avatares de clientes.",
        voiceover: "Nuestros agentes atienden un promedio de 120 conversaciones al día. Imaginate: 120 clientes atendidos sin que muevas un dedo.",
        textOverlay: "120 conversaciones/día",
      },
      {
        time: "22-30s",
        visual: "Persona libre, tomando café, leyendo. Su celular suena: 'Cita agendada'.",
        voiceover: "Mientras vos dormís o pasás tiempo con tu familia, tu agente de IA cierra citas y califica leads. Vos solo recibís los clientes listos para comprar.",
        textOverlay: "Vos descansás, él trabaja",
      },
      {
        time: "30-35s",
        visual: "Logo Impulsala + botón agendar.",
        voiceover: "Agenda una demo de 5 minutos y te mostramos tu futuro agente de IA en acción.",
        textOverlay: "Demo gratis → impulsala.com",
      },
    ],
    cta: "Demo IA gratis 5 min: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#InteligenciaArtificial", "#Chatbot", "#Automatizacion", "#PYMES", "#Bogota", "#Impulsala", "#GPT4"],
  },
  {
    id: "ia-2",
    type: "tutorial",
    service: "ia",
    title: "Cómo automatizar tu negocio con IA en 2026",
    duration: "55s",
    platform: "YouTube Shorts / Reels",
    hook: "Si tu negocio todavía no tiene IA en 2026, estás 5 años atrás de tu competencia. Te muestro 3 automatizaciones fáciles.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona mirando cámara con urgencia. Texto: 3 AUTOMATIZACIONES IA.",
        voiceover: "Si tu negocio todavía no tiene IA en 2026, estás 5 años atrás de tu competencia. Te muestro 3 automatizaciones fáciles.",
        textOverlay: "3 automatizaciones IA",
      },
      {
        time: "5-18s",
        visual: "Captura: chatbot en web atendiendo cliente. Mensaje automático.",
        voiceover: "Automatización 1: chatbot en tu web. Responde preguntas frecuentes, califica leads y agenda citas. Tus clientes obtienen respuesta inmediata, 24/7. Implementación: 2 semanas.",
        textOverlay: "#1 Chatbot 24/7",
      },
      {
        time: "18-30s",
        visual: "Captura: lead entra por web, se guarda en CRM, se envía email automático, se notifica a vendedor.",
        voiceover: "Automatización 2: flujo de leads. Cuando alguien contacta por tu web, automáticamente se guarda en tu CRM, se le envía email de bienvenida, se notifica a tu equipo de ventas y se agenda seguimiento.",
        textOverlay: "#2 Flujo de leads automático",
      },
      {
        time: "30-42s",
        visual: "Posts de Instagram publicados automáticamente en diferentes horas.",
        voiceover: "Automatización 3: publicación en redes. Programás contenido para todo el mes. Se publica solo en Instagram, Facebook y TikTok en los mejores horarios. Sin que tengas que acordarte.",
        textOverlay: "#3 Redes automáticas",
      },
      {
        time: "42-55s",
        visual: "Gráfico: 120 horas ahorradas/mes. Logo Impulsala.",
        voiceover: "Promedio: 120 horas ahorradas al mes por cliente. Es como tener 3 empleados extra sin pagarles sueldo. Agenda una demo y vemos qué podés automatizar en tu negocio.",
        textOverlay: "120h ahorradas/mes · Demo: impulsala.com",
      },
    ],
    cta: "Demo IA gratis: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#AutomatizacionIA", "#Chatbot", "#InteligenciaArtificial", "#PYMES", "#Bogota", "#Impulsala", "#Productividad"],
  },

  // ===== GENERAL / BRAND =====
  {
    id: "brand-1",
    type: "promocion",
    service: "general",
    title: "Impulsala: tu partner estratégico digital en Bogotá",
    duration: "40s",
    platform: "Reels / YouTube Shorts",
    hook: "No somos una agencia más. Somos tu partner estratégico digital. Hay una diferencia enorme.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona mirando cámara. Texto: PARTNER vs AGENCIA.",
        voiceover: "No somos una agencia más. Somos tu partner estratégico digital. Hay una diferencia enorme.",
        textOverlay: "Partner ≠ Agencia",
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
        voiceover: "Ya trabajamos con 40+ empresas en Bogotá, Medellín, Cali y toda Colombia. Desde restaurantes hasta inmobiliarias con 50.000+ propiedades.",
        textOverlay: "40+ clientes en Colombia",
      },
      {
        time: "25-35s",
        visual: "Testimonios breves de clientes felices. Estadísticas: 4.9/5 estrellas.",
        voiceover: "Nuestros clientes nos califican con 4.9 de 5 estrellas. Por algo será. No vendemos humo: entregamos resultados medibles.",
        textOverlay: "4.9/5 ⭐⭐⭐⭐⭐",
      },
      {
        time: "35-40s",
        visual: "Logo Impulsala + CTA agendar.",
        voiceover: "Agenda tu videollamada gratuita de 30 minutos. Revisamos tu caso y te damos un plan personalizado. Sin compromiso.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Videollamada gratuita 30 min: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Impulsala", "#AgenciaDigital", "#Bogota", "#Colombia", "#PYMES", "#MarketingDigital", "#DesarrolloWeb"],
  },
  {
    id: "brand-2",
    type: "hook",
    service: "general",
    title: "Resultado garantizado o seguimos sin costo",
    duration: "20s",
    platform: "TikTok / Reels",
    hook: "Si después de 30 días no generamos resultados medibles, seguimos trabajando sin cobrarte. Así de seguros estamos.",
    scenes: [
      {
        time: "0-3s",
        visual: "Persona mirando cámara con confianza. Texto: GARANTÍA.",
        voiceover: "Si después de 30 días no generamos resultados medibles, seguimos trabajando sin cobrarte. Así de seguros estamos.",
        textOverlay: "Garantía 30 días",
      },
      {
        time: "3-12s",
        visual: "Captura de reportes con métricas reales: +340% ROI, +180% conversión.",
        voiceover: "No es marketing: es un hecho. Nuestros clientes ven resultados desde el primer mes. ROI promedio del 340%. Conversiones que se multiplican.",
        textOverlay: "ROI: 340%",
      },
      {
        time: "12-20s",
        visual: "Logo Impulsala + teléfono + URL.",
        voiceover: "Agenda tu videollamada gratuita. Si no ves resultados en 30 días, no nos pagás. Cero riesgo para ti.",
        textOverlay: "Sin riesgo → impulsala.com",
      },
    ],
    cta: "Garantía de resultados: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Garantia", "#Resultados", "#MarketingDigital", "#Impulsala", "#Bogota", "#PYMES", "#Confianza"],
  },
];

const SERVICE_LABELS: Record<ServiceType, string> = {
  general: "General / Marca",
  web: "Desarrollo Web",
  seo: "SEO",
  ads: "Campañas Ads",
  ia: "Automatización IA",
};

const TYPE_LABELS: Record<ScriptType, string> = {
  hook: "Hook (15-25s)",
  reel: "Reel completo (30s)",
  testimonio: "Testimonio cliente",
  tutorial: "Tutorial educativo",
  promocion: "Promoción marca",
};

const SERVICE_ICONS: Record<ServiceType, React.ComponentType<{ className?: string }>> = {
  general: Sparkles,
  web: Code2,
  seo: Search,
  ads: Megaphone,
  ia: Bot,
};

export function CrmMarketing() {
  const [filterService, setFilterService] = useState<ServiceType | "all">("all");
  const [filterType, setFilterType] = useState<ScriptType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = SCRIPTS.filter((s) => {
    if (filterService !== "all" && s.service !== filterService) return false;
    if (filterType !== "all" && s.type !== filterType) return false;
    return true;
  });

  const copyScript = (script: Script) => {
    const text = formatScript(script);
    navigator.clipboard.writeText(text);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatScript = (script: Script): string => {
    let text = `🎬 ${script.title}\n`;
    text += `Duración: ${script.duration} | Plataforma: ${script.platform}\n`;
    text += `Servicio: ${SERVICE_LABELS[script.service]}\n\n`;
    text += `HOOK:\n${script.hook}\n\n`;
    text += `ESCENAS:\n`;
    script.scenes.forEach((sc, i) => {
      text += `\n[Escena ${i + 1} - ${sc.time}]\n`;
      text += `Visual: ${sc.visual}\n`;
      text += `Voz en off: ${sc.voiceover}\n`;
      if (sc.textOverlay) text += `Texto en pantalla: ${sc.textOverlay}\n`;
    });
    text += `\nLLAMADO A LA ACCIÓN:\n${script.cta}\n\n`;
    text += `HASHTAGS:\n${script.hashtags.join(" ")}`;
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/10 border border-fuchsia-500/30">
            <Video className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Guiones para Videos de Marketing</h2>
            <p className="text-xs text-muted-foreground">
              Guiones listos para TikTok, Reels y YouTube Shorts. Cópialos, dáselos a Hermes y graba.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            {SCRIPTS.length} guiones disponibles
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            4 servicios cubiertos
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            20s a 60s de duración
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Filtrar por servicio
          </label>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value as ServiceType | "all")}
            className="w-full px-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
          >
            <option value="all">Todos los servicios</option>
            {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
              <option key={s} value={s}>
                {SERVICE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Filtrar por tipo
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ScriptType | "all")}
            className="w-full px-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
          >
            <option value="all">Todos los tipos</option>
            {(Object.keys(TYPE_LABELS) as ScriptType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de guiones */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No hay guiones con esos filtros
          </div>
        ) : (
          filtered.map((script) => {
            const Icon = SERVICE_ICONS[script.service];
            const isExpanded = expandedId === script.id;
            const isCopied = copiedId === script.id;
            return (
              <div
                key={script.id}
                className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl overflow-hidden transition-all hover:border-fuchsia-500/40"
              >
                {/* Header del guion */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : script.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-fuchsia-400">
                          {SERVICE_LABELS[script.service]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{TYPE_LABELS[script.type]}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground leading-tight">{script.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {script.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {script.platform}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyScript(script);
                      }}
                      className="flex-shrink-0 p-2 rounded-lg bg-fuchsia-500/15 hover:bg-fuchsia-500/25 text-fuchsia-400 transition-colors"
                      title="Copiar guion completo"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Hook preview (siempre visible) */}
                <div className="px-4 pb-3">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Hook (primeros 3 segundos)
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 italic">"{script.hook}"</p>
                  </div>
                </div>

                {/* Detalle expandible */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-border/40 pt-3">
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-fuchsia-400" />
                        Escenas ({script.scenes.length})
                      </h4>
                      <div className="space-y-2">
                        {script.scenes.map((sc, i) => (
                          <div key={i} className="rounded-lg bg-background/40 border border-border/40 p-2.5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-500/10 px-1.5 py-0.5 rounded">
                                {sc.time}
                              </span>
                              <span className="text-[10px] text-muted-foreground">Escena {i + 1}</span>
                            </div>
                            <p className="text-xs text-foreground/90 mb-1">
                              <span className="text-muted-foreground text-[10px] uppercase font-semibold">Visual:</span>{" "}
                              {sc.visual}
                            </p>
                            <p className="text-xs text-foreground/90 mb-1">
                              <span className="text-muted-foreground text-[10px] uppercase font-semibold">Voz en off:</span>{" "}
                              {sc.voiceover}
                            </p>
                            {sc.textOverlay && (
                              <p className="text-xs text-amber-300">
                                <span className="text-muted-foreground text-[10px] uppercase font-semibold">Texto en pantalla:</span>{" "}
                                {sc.textOverlay}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                        Llamado a la acción
                      </h4>
                      <p className="text-xs text-foreground/90 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                        {script.cta}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-sky-400" />
                        Hashtags
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {script.hashtags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => copyScript(script)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-sm font-semibold transition-all"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          ¡Copiado! Pegalo en tu editor
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar guion completo
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-pink-500/5 border border-fuchsia-500/20 p-4">
        <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          Cómo usar estos guiones
        </h3>
        <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
          <li>Elegí el guion según el servicio que querés promocionar</li>
          <li>Hacé clic en "Copiar guion completo"</li>
          <li>Pasale el texto a Hermes (o al editor de video)</li>
          <li>Grabá las escenas según las indicaciones visuales</li>
          <li>Agregá los hashtags en la descripción del video</li>
          <li>Publicá en TikTok, Reels y YouTube Shorts</li>
        </ol>
      </div>
    </div>
  );
}
