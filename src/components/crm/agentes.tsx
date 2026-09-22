"use client";

import { useState } from "react";
import {
  Search,
  Target,
  Video,
  TrendingUp,
  Mail,
  Bot,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Users,
  Activity,
  DollarSign,
  Eye,
} from "lucide-react";

type AgentStatus = "activo" | "en-progreso" | "pendiente";

type Agent = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  avatar: string;
  color: string;
  badgeColor: string;
  status: AgentStatus;
  specialty: string;
  responsibilities: string[];
  kpis: { label: string; value: string; target: string }[];
  weeklyTasks: string[];
  tools: string[];
  reports: { date: string; summary: string; status: "success" | "warning" | "info" }[];
};

const AGENTS: Agent[] = [
  {
    id: "prospectador",
    name: "Alejo",
    role: "Agente Prospectador",
    emoji: "🎯",
    avatar: "🎯",
    color: "from-emerald-500/15 to-teal-500/5 border-emerald-500/30",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    status: "activo",
    specialty: "Búsqueda y calificación de clientes potenciales",
    responsibilities: [
      "Buscar negocios en Google Maps, Instagram, Facebook con falencias digitales",
      "Usar la Prospección IA del CRM para generar listas de prospectos",
      "Filtrar negocios sin web, sin email, sin presencia en Google",
      "Calificar prospectos con score 1-10 según potencial",
      "Generar propuestas personalizadas con IA",
      "Mandar 10 emails/WhatsApp por día",
    ],
    kpis: [
      { label: "Prospectos/mes", value: "200", target: "200" },
      { label: "Contactos/día", value: "10", target: "10" },
      { label: "Tasa respuesta", value: "15%", target: "20%" },
      { label: "Reuniones agendadas", value: "8", target: "15" },
    ],
    weeklyTasks: [
      "Buscar 50 nuevos prospectos por semana",
      "Enviar 50 emails de prospección",
      "Enviar 20 WhatsApp personalizados",
      "Actualizar CRM con respuestas",
      "Reportar métricas todos los viernes",
    ],
    tools: ["Prospección IA (CRM)", "Google Maps", "Instagram", "Facebook", "Directorios locales"],
    reports: [
      { date: "Semana actual", summary: "35 prospectos encontrados. 12 con falencias críticas (sin web). 8 emails enviados, 2 respuestas.", status: "info" },
      { date: "Última semana", summary: "42 prospectos. 15 contactados. 1 reunión agendada con café de Bogotá.", status: "success" },
    ],
  },
  {
    id: "contenido",
    name: "Sofía",
    role: "Agente de Contenido",
    emoji: "🎬",
    avatar: "🎬",
    color: "from-fuchsia-500/15 to-pink-500/5 border-fuchsia-500/30",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    status: "activo",
    specialty: "Creación de contenido viral para redes sociales",
    responsibilities: [
      "Generar 1 guion de video por día usando el CRM",
      "Generar voz con Edge TTS (voces colombianas)",
      "Generar video con MoneyPrinterTurbo en Google Colab",
      "Crear copy para Instagram, Facebook, TikTok",
      "Mantener calendario editorial",
      "Investigar tendencias y hashtags virales",
    ],
    kpis: [
      { label: "Videos/mes", value: "30", target: "30" },
      { label: "Videos/día", value: "1", target: "1" },
      { label: "Views promedio", value: "500", target: "5.000" },
      { label: "Engagement", value: "8%", target: "15%" },
    ],
    weeklyTasks: [
      "Generar 7 guiones (1 por día)",
      "Generar 7 videos con MoneyPrinterTurbo",
      "Crear 3 copys adicionales para Instagram",
      "Investigar hashtags trending de la semana",
      "Reportar métricas de videos publicados",
    ],
    tools: ["CRM Marketing Digital", "MoneyPrinterTurbo (Colab)", "Edge TTS", "CapCut", "TikTok/Instagram/YouTube"],
    reports: [
      { date: "Semana actual", summary: "5 videos generados. 3 publicados en TikTok. Mejor video: 320 views. Hashtags optimizados.", status: "info" },
      { date: "Última semana", summary: "7 videos generados. Engagement subiendo 3% vs semana anterior.", status: "success" },
    ],
  },
  {
    id: "seo",
    name: "Mateo",
    role: "Agente SEO",
    emoji: "🔍",
    avatar: "🔍",
    color: "from-blue-500/15 to-cyan-500/5 border-blue-500/30",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    status: "activo",
    specialty: "Posicionamiento orgánico en Google",
    responsibilities: [
      "Monitorear posiciones de keywords en Google",
      "Optimizar contenido on-page",
      "Investigar nuevas keywords de oportunidad",
      "Crear contenido SEO para el blog",
      "Monitorizar Google Search Console",
      "Reportar tráfico orgánico semanal",
    ],
    kpis: [
      { label: "Keywords top 3", value: "0", target: "10" },
      { label: "Tráfico orgánico", value: "50", target: "5.000" },
      { label: "Páginas indexadas", value: "15", target: "50" },
      { label: "Backlinks", value: "0", target: "100" },
    ],
    weeklyTasks: [
      "Revisar Google Search Console",
      "Escribir 2 artículos de blog optimizados",
      "Investigar 10 keywords nuevas",
      "Optimizar meta tags de 3 páginas",
      "Reportar posiciones de keywords",
    ],
    tools: ["Google Search Console", "Google Analytics 4", "Blog CRM", "Ahrefs (gratis)", "Ubersuggest (gratis)"],
    reports: [
      { date: "Semana actual", summary: "Sitemap enviado a Google. 15 páginas indexadas. Pendiente: comprar dominio para indexación completa.", status: "warning" },
      { date: "Última semana", summary: "SEO técnico arreglado. Sitemap optimizado. Robots.txt corregido.", status: "success" },
    ],
  },
  {
    id: "vendedor",
    name: "Valeria",
    role: "Agente de Ventas",
    emoji: "💼",
    avatar: "💼",
    color: "from-amber-500/15 to-orange-500/5 border-amber-500/30",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    status: "pendiente",
    specialty: "Cierre de ventas y relación con clientes",
    responsibilities: [
      "Atender videollamadas de diagnóstico gratis",
      "Preparar propuestas comerciales personalizadas",
      "Dar seguimiento a leads del CRM",
      "Cerrar ventas y coordinar onboarding",
      "Mantener relación con clientes existentes",
      "Upsell de servicios adicionales",
    ],
    kpis: [
      { label: "Citas/mes", value: "0", target: "15" },
      { label: "Cierres/mes", value: "0", target: "10" },
      { label: "Tasa conversión", value: "0%", target: "30%" },
      { label: "Ticket promedio", value: "$0", target: "$3M COP" },
    ],
    weeklyTasks: [
      "Atender todas las videollamadas agendadas",
      "Seguimiento a 10 leads del Kanban",
      "Preparar 3 propuestas comerciales",
      "Llamar a 5 clientes potenciales",
      "Reportar cierres y pipeline",
    ],
    tools: ["CRM Kanban", "Zoom/Google Meet", "WhatsApp Business", "Gmail", "Propuestas del CRM"],
    reports: [
      { date: "Semana actual", summary: "Pendiente: esperar a que entren leads de la prospección y contenido.", status: "warning" },
    ],
  },
  {
    id: "analista",
    name: "Diego",
    role: "Agente Analista de Datos",
    emoji: "📊",
    avatar: "📊",
    color: "from-violet-500/15 to-purple-500/5 border-violet-500/30",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    status: "en-progreso",
    specialty: "Análisis de métricas y optimización",
    responsibilities: [
      "Monitorear Google Analytics 4",
      "Analizar métricas de redes sociales",
      "Calcular ROI de campañas",
      "Identificar oportunidades de optimización",
      "Generar reportes ejecutivos semanales",
      "A/B testing de CTAs y copy",
    ],
    kpis: [
      { label: "Tráfico web", value: "100", target: "10.000" },
      { label: "Conversiones", value: "2", target: "50" },
      { label: "Costo/lead", value: "$0", target: "$20.000" },
      { label: "ROI", value: "—", target: "340%" },
    ],
    weeklyTasks: [
      "Revisar Google Analytics 4",
      "Analizar métricas de TikTok/Instagram",
      "Calcular KPIs del dashboard del CRM",
      "Generar reporte ejecutivo",
      "Identificar 3 oportunidades de mejora",
    ],
    tools: ["Google Analytics 4", "TikTok Analytics", "Instagram Insights", "CRM Dashboard"],
    reports: [
      { date: "Semana actual", summary: "Pendiente: configurar Google Analytics 4 y TikTok Analytics cuando haya dominio.", status: "warning" },
    ],
  },
  {
    id: "automatizador",
    name: "Lucía",
    role: "Agente de Automatización",
    emoji: "🤖",
    avatar: "🤖",
    color: "from-rose-500/15 to-red-500/5 border-rose-500/30",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    status: "activo",
    specialty: "Automatización de procesos y bots",
    responsibilities: [
      "Mantener ImpulsalaBot funcionando 24/7",
      "Automatizar respuestas de WhatsApp",
      "Configurar flujos de email automáticos",
      "Optimizar el CRM con nuevas funciones",
      "Integrar APIs de terceros",
      "Monitorear que todo funcione",
    ],
    kpis: [
      { label: "Conversaciones bot", value: "15", target: "100" },
      { label: "Citas automáticas", value: "3", target: "20" },
      { label: "Uptime bot", value: "99%", target: "99.9%" },
      { label: "Leads capturados", value: "20", target: "150" },
    ],
    weeklyTasks: [
      "Verificar que ImpulsalaBot funcione",
      "Revisar logs de errores",
      "Optimizar respuestas del bot",
      "Agregar nuevos flujos si es necesario",
      "Reportar uptime y conversaciones",
    ],
    tools: ["ImpulsalaBot", "CRM", "Edge TTS", "n8n (futuro)", "Zapier (futuro)"],
    reports: [
      { date: "Semana actual", summary: "Bot funcionando. 15 conversaciones atendidas. 3 citas agendadas automáticamente.", status: "success" },
      { date: "Última semana", summary: "Bot actualizado a v3. Voces Neural integradas. Flujo de agendamiento simplificado.", status: "success" },
    ],
  },
];

const STATUS_CONFIG = {
  "activo": { label: "Activo", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
  "en-progreso": { label: "En progreso", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Clock },
  "pendiente": { label: "Pendiente", color: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: AlertCircle },
};

export function CrmAgentes() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>("prospectador");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Equipo de Agentes Virtuales</h2>
            <p className="text-xs text-muted-foreground">
              Tu equipo digital trabajando 24/7. Cada uno con su especialidad.
            </p>
          </div>
        </div>

        {/* Resumen del equipo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Users className="w-3 h-3" />
              Agentes
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{AGENTS.length}</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Activity className="w-3 h-3" />
              Activos
            </div>
            <p className="text-sm font-bold text-emerald-300 mt-0.5">
              {AGENTS.filter((a) => a.status === "activo").length}
            </p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Target className="w-3 h-3" />
              Tareas/día
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">35</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <DollarSign className="w-3 h-3" />
              Meta/mes
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">$30M COP</p>
          </div>
        </div>
      </div>

      {/* Agentes */}
      <div className="space-y-3">
        {AGENTS.map((agent) => {
          const isExpanded = expandedAgent === agent.id;
          const statusConfig = STATUS_CONFIG[agent.status];
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={agent.id}
              className={`backdrop-blur-xl bg-gradient-to-br ${agent.color} border rounded-2xl overflow-hidden transition-all`}
            >
              {/* Header del agente */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-background/40 border border-border/40 flex items-center justify-center text-2xl">
                      {agent.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">{agent.role}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{agent.specialty}</p>
                    </div>
                  </div>

                  {/* Status + expand */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[9px] px-2 py-1 rounded-full border uppercase font-bold flex items-center gap-1 ${statusConfig.color}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusConfig.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* KPIs (siempre visibles) */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {agent.kpis.map((kpi) => (
                    <div key={kpi.label} className="rounded bg-background/30 border border-border/30 p-1.5 text-center">
                      <p className="text-[9px] text-muted-foreground uppercase truncate">{kpi.label}</p>
                      <p className="text-xs font-bold text-foreground mt-0.5">{kpi.value}</p>
                      <p className="text-[8px] text-muted-foreground">/ {kpi.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle expandible */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                  {/* Responsabilidades */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      Responsabilidades
                    </p>
                    <ul className="space-y-0.5">
                      {agent.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tareas semanales */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Tareas semanales
                    </p>
                    <ul className="space-y-0.5">
                      {agent.weeklyTasks.map((t, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                          <CheckCircle2 className="w-2.5 h-2.5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Herramientas */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5">Herramientas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-background/40 border border-border/40 text-muted-foreground"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Reportes */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-violet-400" />
                      Reportes recientes
                    </p>
                    <div className="space-y-1.5">
                      {agent.reports.map((report, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2.5 border ${
                            report.status === "success"
                              ? "bg-emerald-500/10 border-emerald-500/20"
                              : report.status === "warning"
                              ? "bg-amber-500/10 border-amber-500/20"
                              : "bg-sky-500/10 border-sky-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {report.status === "success" ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : report.status === "warning" ? (
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                            ) : (
                              <Activity className="w-3 h-3 text-sky-400" />
                            )}
                            <span className="text-[10px] font-semibold text-foreground">{report.date}</span>
                          </div>
                          <p className="text-[11px] text-foreground/80">{report.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen ejecutivo */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 p-4">
        <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
          <Eye className="w-4 h-4 text-violet-400" />
          Reporte ejecutivo semanal
        </h3>
        <div className="space-y-1.5 text-[11px] text-foreground/80">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" />
            <strong className="text-foreground">Alejo</strong> encontró 35 prospectos, 12 con falencias críticas. 8 emails enviados.
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-fuchsia-400" />
            <strong className="text-foreground">Sofía</strong> generó 5 videos. 3 publicados. Mejor: 320 views en TikTok.
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400" />
            <strong className="text-foreground">Mateo</strong> arregló SEO técnico. Pendiente: comprar dominio.
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-400" />
            <strong className="text-foreground">Lucía</strong> mantiene el bot. 15 conversaciones, 3 citas automáticas.
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-400" />
            <strong className="text-foreground">Valeria</strong> lista para cerrar ventas. Esperando leads.
          </div>
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-400" />
            <strong className="text-foreground">Diego</strong> configurando Analytics. Reportará cuando haya dominio.
          </div>
        </div>
      </div>
    </div>
  );
}
