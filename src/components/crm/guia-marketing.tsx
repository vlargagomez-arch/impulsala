"use client";

import { useState } from "react";
import {
  Rocket,
  Search,
  TrendingUp,
  Target,
  Video,
  Mail,
  Megaphone,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Users,
  Zap,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const PHASES = [
  {
    id: 1,
    title: "Fase 1: SEO Técnico (Indexar en Google)",
    icon: Search,
    color: "from-blue-500/15 to-cyan-500/5 border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    status: "completado",
    duration: "Listo",
    cost: "$0",
    tasks: [
      { text: "Sitemap.xml optimizado con URL correcta", done: true },
      { text: "Robots.txt permitiendo indexación", done: true },
      { text: "Meta tags optimizados (title, description, keywords)", done: true },
      { text: "Structured data (Schema.org) en todas las páginas", done: true },
      { text: "OpenGraph tags para compartir en redes", done: true },
      { text: "Canonical URLs configuradas", done: true },
    ],
    nextSteps: [
      "Comprar dominio impulsala.com",
      "Configurar DNS en Vercel",
      "Enviar sitemap a Google Search Console",
      "Verificar propiedad en Google Search Console",
      "Crear Google Business Profile",
    ],
  },
  {
    id: 2,
    title: "Fase 2: Contenido Viral (Guiones + Videos)",
    icon: Video,
    color: "from-fuchsia-500/15 to-pink-500/5 border-fuchsia-500/30",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    status: "en-progreso",
    duration: "Diario",
    cost: "$0",
    tasks: [
      { text: "10+ guiones de video por tipo de negocio", done: true },
      { text: "Voz IA Neural (Edge TTS, voces colombianas)", done: true },
      { text: "MoneyPrinterTurbo integrado (genera video automático)", done: true },
      { text: "Workflow: guion → voz → video → publicado", done: true },
      { text: "Calendario editorial: 1 video/día en TikTok/Reels", done: false },
      { text: "20 guiones virales adicionales", done: false },
    ],
    nextSteps: [
      "Abrir MoneyPrinterTurbo en Google Colab (gratis)",
      "Generar 1 video por día usando los guiones del CRM",
      "Publicar en TikTok, Instagram Reels, YouTube Shorts",
      "Usar hashtags de los guiones",
      "Mejor horario: 7-9pm hora Colombia",
      "Meta: 30 videos en el primer mes",
    ],
  },
  {
    id: 3,
    title: "Fase 3: Prospección de Clientes",
    icon: Target,
    color: "from-emerald-500/15 to-teal-500/5 border-emerald-500/30",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    status: "en-progreso",
    duration: "Diario",
    cost: "$0",
    tasks: [
      { text: "Prospección IA en CRM (busca negocios con falencias)", done: true },
      { text: "Base de +35 negocios reales de Bogotá por categoría", done: true },
      { text: "Generación automática de propuestas personalizadas", done: true },
      { text: "Botón enviar email/WhatsApp directo desde CRM", done: true },
      { text: "Scraping Google Maps para encontrar más negocios", done: false },
      { text: "Sistema de seguimiento (follow-up automático)", done: false },
    ],
    nextSteps: [
      "Ir a CRM → Prospección IA",
      "Buscar 'restaurantes Bogotá' con filtro 'falencias digitales'",
      "Copiar propuestas personalizadas",
      "Enviar 10 emails/WhatsApp por día",
      "Meta: 50 contactos por semana = 200/mes",
      "Tasa de conversión esperada: 5% = 10 clientes/mes",
    ],
  },
  {
    id: 4,
    title: "Fase 4: Tráfico y Ads",
    icon: Megaphone,
    color: "from-amber-500/15 to-orange-500/5 border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    status: "pendiente",
    duration: "Mensual",
    cost: "$500K-$1M COP",
    tasks: [
      { text: "Google Ads Search (captar intención de búsqueda)", done: false },
      { text: "Meta Ads (Facebook + Instagram)", done: false },
      { text: "Remarketing para visitantes de la web", done: false },
      { text: "Landing pages optimizadas por servicio", done: true },
      { text: "Pixel de Facebook instalado", done: false },
      { text: "Google Analytics 4 configurado", done: false },
    ],
    nextSteps: [
      "Esperar a tener 30+ videos publicados (autoridad)",
      "Configurar Google Analytics 4",
      "Instalar Facebook Pixel",
      "Crear campaña Google Ads Search",
      "Presupuesto inicial: $500.000 COP/mes",
      "Segmentar: Bogotá, PYMES, dueños de negocio 25-50 años",
    ],
  },
  {
    id: 5,
    title: "Fase 5: Métricas y Optimización",
    icon: BarChart3,
    color: "from-violet-500/15 to-purple-500/5 border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    status: "pendiente",
    duration: "Semanal",
    cost: "$0",
    tasks: [
      { text: "Google Search Console configurado", done: false },
      { text: "Google Analytics 4 configurado", done: false },
      { text: "Dashboard de métricas en CRM", done: true },
      { text: "Reporte semanal de KPIs", done: false },
      { text: "A/B testing de CTAs", done: false },
      { text: "Optimización basada en datos", done: false },
    ],
    nextSteps: [
      "Verificar propiedad en Google Search Console",
      "Conectar Google Analytics 4",
      "Revisar métricas semanalmente",
      "KPIs clave: tráfico orgánico, leads, citas, conversiones",
      "Ajustar estrategia según datos",
    ],
  },
];

const VIRALITY_TIPS = [
  {
    title: "Hook en los primeros 3 segundos",
    description: "El 70% de las personas deciden si ver el video en los primeros 3s. Empezá con una pregunta impactante o un dato sorprendente.",
    example: "¿Sabías que tu web pierde el 50% de clientes si tarda más de 3 segundos en cargar?",
  },
  {
    title: "Una idea por video",
    description: "No quieras decir todo. Un video = un mensaje. Si querés hablar de 3 cosas, hacé 3 videos.",
    example: "Video 1: Velocidad web. Video 2: SEO. Video 3: WhatsApp automation.",
  },
  {
    title: "Texto en pantalla grande",
    description: "El 80% ve videos sin sonido al principio. El texto debe ser legible y grande.",
    example: "Tipografía 48px+, colores contrastantes, fondo sólido detrás del texto.",
  },
  {
    title: "Llamado a la acción claro",
    description: "Decí exactamente qué querés que hagan. No dejes ambigüedad.",
    example: "Agenda tu videollamada gratis en impulsala.com o WhatsApp 319 635 4992",
  },
  {
    title: "Publicá todos los días",
    description: "El algoritmo premia la consistencia. 1 video/día por 30 días = más alcance que 30 videos en un día.",
    example: "Lunes a Viernes, 7pm hora Colombia. Fines de semana opcional.",
  },
  {
    title: "Responde comentarios rápido",
    description: "Los primeros 30 minutos después de publicar son clave. Respondé todos los comentarios.",
    example: "Si te comentan '¿cuánto cuesta?', respondé: 'Agendá videollamada gratis y te damos cotización personalizada'",
  },
];

const SCRAPING_STRATEGIES = [
  {
    name: "Google Maps",
    description: "Buscar negocios por categoría y ubicación. Extraer nombre, teléfono, dirección.",
    method: "Buscar 'restaurantes Bogotá' en Google Maps → filtrar por los que no tienen web",
    url: "https://www.google.com/maps/search/restaurantes+bogota",
    icon: "📍",
  },
  {
    name: "Instagram",
    description: "Buscar por hashtags de Bogotá. Negocios que postean pero no tienen link en bio.",
    method: "Buscar #restaurantesbogota #bogotafoodie → perfiles sin link en bio = oportunidad",
    url: "https://www.instagram.com/explore/tags/restaurantesbogota/",
    icon: "📸",
  },
  {
    name: "Facebook Pages",
    description: "Páginas de negocios locales sin web. Filtro por categoría y ubicación.",
    method: "Buscar 'restaurantes en Bogotá' en Facebook → filtrar páginas sin sitio web",
    url: "https://www.facebook.com/search/pages/?q=restaurantes%20bogota",
    icon: "📘",
  },
  {
    name: "TikTok Search",
    description: "Negocios que publican pero no tienen web profesional. Por hashtags locales.",
    method: "Buscar #negociosbogota #emprendedorescolombia → verificar si tienen web",
    url: "https://www.tiktok.com/search?q=negocios%20bogota",
    icon: "🎵",
  },
  {
    name: "Google Search Avanzado",
    description: "Buscar negocios sin web con operadores avanzados de Google.",
    method: "Buscar: 'restaurantes bogotá' -site:* → los que no aparecen = sin web",
    url: "https://www.google.com/search?q=restaurantes+bogota",
    icon: "🔍",
  },
  {
    name: "Directorios locales",
    description: "Directorios de PYMES en Colombia. Negocios listados sin web.",
    method: "Revisar directorios: amarilla.com, paginasamarillas.com.co, guiacolombia.com",
    url: "https://www.paginasamarillas.com.co",
    icon: "📖",
  },
];

export function CrmGuiaMarketing() {
  const [copiedTip, setCopiedTip] = useState<number | null>(null);

  const copyTip = (tip: { title: string; description: string; example: string }, idx: number) => {
    const text = `${tip.title}\n\n${tip.description}\n\nEjemplo: ${tip.example}`;
    navigator.clipboard.writeText(text);
    setCopiedTip(idx);
    setTimeout(() => setCopiedTip(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Guía Maestra de Marketing Digital</h2>
            <p className="text-xs text-muted-foreground">
              Plan paso a paso para generar ventas y viralidad. Yo soy tu experto en marketing.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Clock className="w-3 h-3" />
              Tiempo
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">90 días</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <DollarSign className="w-3 h-3" />
              Inversión
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">$0 - $1M COP</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Target className="w-3 h-3" />
              Meta
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">10 clientes/mes</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <TrendingUp className="w-3 h-3" />
              Crecimiento
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">Viralidad orgánica</p>
          </div>
        </div>
      </div>

      {/* Fases del plan */}
      <div className="space-y-3">
        {PHASES.map((phase) => (
          <div
            key={phase.id}
            className={`backdrop-blur-xl bg-gradient-to-br ${phase.color} border rounded-2xl p-4`}
          >
            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background/40 border border-border/40">
                  <phase.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{phase.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {phase.duration}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-2.5 h-2.5" />
                      {phase.cost}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full border uppercase font-bold ${phase.badgeColor}`}>
                {phase.status === "completado" ? "✓ Completado" :
                 phase.status === "en-progreso" ? "En progreso" : "Pendiente"}
              </span>
            </div>

            {/* Tasks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
              {phase.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px]">
                  {task.done ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={task.done ? "text-foreground/80" : "text-muted-foreground"}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Next steps */}
            <div className="rounded-lg bg-background/30 border border-border/30 p-2.5">
              <p className="text-[10px] font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                Próximos pasos:
              </p>
              <ol className="text-[11px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                {phase.nextSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      {/* Estrategias de scraping */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          Dónde encontrar clientes (scraping manual)
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Métodos para encontrar negocios con falencias digitales. Contactalos con las propuestas del CRM.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SCRAPING_STRATEGIES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg bg-card/40 border border-border/40 hover:border-emerald-500/40 transition-all"
            >
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.description}</p>
                <p className="text-[10px] text-foreground/70 mt-1 italic">{s.method}</p>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </div>

      {/* Tips de viralidad */}
      <div className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          6 reglas para videos virales
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Aplicá estas reglas en cada video que publiques. Son las que usan los creadores con millones de views.
        </p>
        <div className="space-y-2">
          {VIRALITY_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="group rounded-lg bg-card/40 border border-border/40 p-3 hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[9px] font-bold">
                    {idx + 1}
                  </span>
                  {tip.title}
                </p>
                <button
                  onClick={() => copyTip(tip, idx)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedTip === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mb-1">{tip.description}</p>
              <p className="text-[11px] text-amber-300/90 italic">💡 {tip.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meta y proyección */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-5">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Proyección de crecimiento (90 días)
        </h3>
        <div className="space-y-3">
          {[
            { month: "Mes 1", videos: "30 videos", contacts: "200 contactos", clients: "2-3 clientes", revenue: "$6-9M COP" },
            { month: "Mes 2", videos: "60 videos", contacts: "400 contactos", clients: "5-8 clientes", revenue: "$15-24M COP" },
            { month: "Mes 3", videos: "90 videos", contacts: "600 contactos", clients: "10-15 clientes", revenue: "$30-45M COP" },
          ].map((m) => (
            <div key={m.month} className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-foreground w-16 flex-shrink-0">{m.month}</span>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded bg-background/40 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Videos</p>
                  <p className="text-xs font-bold text-foreground">{m.videos}</p>
                </div>
                <div className="rounded bg-background/40 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Contactos</p>
                  <p className="text-xs font-bold text-foreground">{m.contacts}</p>
                </div>
                <div className="rounded bg-background/40 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Clientes</p>
                  <p className="text-xs font-bold text-emerald-300">{m.clients}</p>
                </div>
                <div className="rounded bg-background/40 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Ingresos</p>
                  <p className="text-xs font-bold text-emerald-300">{m.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-background/40 border border-border/40">
          <p className="text-[11px] text-muted-foreground">
            <strong className="text-foreground">Fórmula:</strong> 1 video/día + 10 contactos/día + 5% conversión = 10-15 clientes/mes en 90 días.
            <br />
            <strong className="text-foreground">Clave:</strong> Consistencia. No saltes ni un día. El algoritmo premia la constancia.
          </p>
        </div>
      </div>
    </div>
  );
}
