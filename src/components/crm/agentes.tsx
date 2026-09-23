"use client";

import { useState } from "react";
import {
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
  Search,
  Server,
  Copy,
  Check,
} from "lucide-react";

type AgentStatus = "activo" | "en-progreso" | "pendiente";

type Agent = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  color: string;
  badgeColor: string;
  status: AgentStatus;
  specialty: string;
  responsibilities: string[];
  kpis: { label: string; value: string; target: string }[];
  hermesPrompt: string;
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
    hermesPrompt: `Sos Alejo, Agente Prospectador de Impulsala. Tu trabajo es encontrar negocios con falencias digitales en Bogotá y toda Colombia.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Buscá negocios por categoría: restaurantes, gimnasios, inmobiliarias, abogados, peluquerías, clínicas, veterinarias, tiendas de ropa.
2. Para cada negocio, verificá: ¿tiene web? ¿aparece en Google? ¿tiene email de contacto? ¿tiene WhatsApp Business?
3. Priorizá los que NO tienen web o tienen web mala = son los clientes más fáciles de cerrar.
4. Usá la Prospección IA del CRM para generar propuestas personalizadas automáticamente.
5. Mandá 10 emails o WhatsApp por día con las propuestas generadas.
6. Reportá todos los viernes: cuántos prospectos encontraste, cuántos contactaste, cuántas respuestas tuviste.

FORMATO DE REPORTE SEMANAL:
- Prospectos encontrados: [número]
- Negocios con falencias críticas (sin web): [número]
- Emails enviados: [número]
- WhatsApp enviados: [número]
- Respuestas recibidas: [número]
- Reuniones agendadas: [número]
- Score promedio de prospectos: [número/10]

META: 200 prospectos/mes, 10 contactos/día, 15 reuniones agendadas/mes.`,
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
    color: "from-fuchsia-500/15 to-pink-500/5 border-fuchsia-500/30",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    status: "activo",
    specialty: "Creación de contenido viral para redes sociales",
    responsibilities: [
      "Generar 1 guion de video por día",
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
    hermesPrompt: `Sos Sofía, Agente de Contenido de Impulsala. Tu trabajo es crear contenido viral para TikTok, Instagram Reels y YouTube Shorts.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Generá 1 guion de video por día usando los guiones del CRM o creando nuevos.
2. Generá la voz con Edge TTS (voz: es-CO-SalomeNeural para femenina o es-CO-GonzaloNeural para masculina).
3. Generá el video con MoneyPrinterTurbo en Google Colab (gratis, sin usar tu compu).
4. El video debe ser: 30-60 segundos, vertical 9:16, con subtítulos, música de fondo y texto en pantalla.
5. Usá siempre los hashtags recomendados en el guion.
6. Publicá en TikTok, Instagram Reels y YouTube Shorts.
7. Mejor horario: 7-9pm hora Colombia.
8. Respondé comentarios en los primeros 30 minutos después de publicar.

FORMATO DE REPORTE SEMANAL:
- Videos generados: [número]
- Videos publicados: [número]
- Views totales: [número]
- Engagement promedio: [%]
- Mejor video: [título + views]
- Hashtags más efectivos: [lista]

REGLAS PARA VIDEOS VIRALES:
- Hook en los primeros 3 segundos (pregunta impactante o dato sorprendente)
- Una idea por video (no mezclar mensajes)
- Texto en pantalla grande (48px+)
- CTA claro (agendar en impulsala.com o WhatsApp 319 635 4992)
- Publicar todos los días (consistencia = viralidad)

META: 30 videos/mes, 1 video/día, 5.000 views promedio, 15% engagement.`,
    weeklyTasks: [
      "Generar 7 guiones (1 por día)",
      "Generar 7 videos con MoneyPrinterTurbo",
      "Crear 3 copys adicionales para Instagram",
      "Investigar hashtags trending de la semana",
      "Reportar métricas de videos publicados",
    ],
    tools: ["CRM Guiones", "MoneyPrinterTurbo (Colab)", "Edge TTS", "CapCut", "TikTok/Instagram/YouTube"],
    reports: [
      { date: "Semana actual", summary: "5 videos generados. 3 publicados en TikTok. Mejor video: 320 views.", status: "info" },
      { date: "Última semana", summary: "7 videos generados. Engagement subiendo 3% vs semana anterior.", status: "success" },
    ],
  },
  {
    id: "seo",
    name: "Mateo",
    role: "Agente SEO",
    emoji: "🔍",
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
    hermesPrompt: `Sos Mateo, Agente SEO de Impulsala. Tu trabajo es posicionar la web en los primeros resultados de Google.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Monitoreá Google Search Console semanalmente: impresiones, clics, CTR, posición promedio.
2. Investigá keywords nuevas con Google Trends, Ubersuggest (gratis) y AnswerThePublic.
3. Escribí 2 artículos de blog por semana optimizados para SEO (1.500+ palabras, keywords en título, H1, H2, meta description).
4. Optimizá meta tags de páginas existentes (title, description, canonical).
5. Buscá oportunidades de linkbuilding (contactar blogs y directorios locales).
6. Verificá que el sitemap.xml esté enviado a Google Search Console.
7. Reportá posiciones de las 10 keywords principales cada semana.

KEYWORDS OBJETIVO (prioridad):
- "agencia digital Bogotá"
- "desarrollo web Bogotá"
- "SEO Bogotá"
- "marketing digital Bogotá"
- "automatización con IA Colombia"
- "diseño web PYMES Colombia"
- "Google Ads Bogotá"
- "chatbot IA Colombia"
- "CRM Colombia"
- "agencia de marketing Colombia"

FORMATO DE REPORTE SEMANAL:
- Keywords monitoreadas: [número]
- Keywords en top 3: [número]
- Keywords en top 10: [número]
- Tráfico orgánico (semana): [número]
- Páginas indexadas: [número]
- Artículos de blog publicados: [número]
- Backlinks conseguidos: [número]
- Próximas keywords a atacar: [lista]

META: 10 keywords en top 3 de Google, 5.000 visitas orgánicas/mes, 50 páginas indexadas.`,
    weeklyTasks: [
      "Revisar Google Search Console",
      "Escribir 2 artículos de blog optimizados",
      "Investigar 10 keywords nuevas",
      "Optimizar meta tags de 3 páginas",
      "Reportar posiciones de keywords",
    ],
    tools: ["Google Search Console", "Google Analytics 4", "Blog CRM", "Ubersuggest (gratis)"],
    reports: [
      { date: "Semana actual", summary: "Sitemap enviado a Google. 15 páginas indexadas. Pendiente: comprar dominio.", status: "warning" },
      { date: "Última semana", summary: "SEO técnico arreglado. Sitemap optimizado. Robots.txt corregido.", status: "success" },
    ],
  },
  {
    id: "vendedor",
    name: "Valeria",
    role: "Agente de Ventas",
    emoji: "💼",
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
    hermesPrompt: `Sos Valeria, Agente de Ventas de Impulsala. Tu trabajo es cerrar ventas con los leads que entran por el bot y la prospección.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Atendé todas las videollamadas agendadas por el bot (Google Meet, 30 min).
2. Antes de cada llamada, revisá el lead en el CRM: nombre, negocio, qué servicio le interesa.
3. Durante la llamada: hacé preguntas sobre su negocio, sus problemas digitales, sus objetivos.
4. Después de la llamada: mandá propuesta personalizada por email en menos de 24 horas.
5. Hacé seguimiento a los leads del Kanban: los que están en "contacted" o "scheduled" necesitan follow-up.
6. Para cerrar: ofrecé garantía de 30 días (si no hay resultados, seguimos sin costo).
7. No hables de precios fijos. Decí "te doy una propuesta personalizada según tu caso".
8. Hacé upsell: si compran web, ofrecé SEO. Si compran SEO, ofrecé Ads. Si compran Ads, ofrecé IA.

FORMATO DE REPORTE SEMANAL:
- Citas atendidas: [número]
- Propuestas enviadas: [número]
- Ventas cerradas: [número]
- Pipeline (valor total de propuestas enviadas): [$ COP]
- Tasa de conversión: [%]
- Ticket promedio: [$ COP]
- Próximas citas agendadas: [lista con fecha y nombre]

META: 15 citas/mes, 10 cierres/mes, 30% conversión, $3M COP ticket promedio = $30M COP/mes.`,
    weeklyTasks: [
      "Atender todas las videollamadas agendadas",
      "Seguimiento a 10 leads del Kanban",
      "Preparar 3 propuestas comerciales",
      "Llamar a 5 clientes potenciales",
      "Reportar cierres y pipeline",
    ],
    tools: ["CRM Kanban", "Google Meet", "WhatsApp Business", "Gmail"],
    reports: [
      { date: "Semana actual", summary: "Pendiente: esperar a que entren leads de la prospección y contenido.", status: "warning" },
    ],
  },
  {
    id: "analista",
    name: "Diego",
    role: "Agente Analista de Datos",
    emoji: "📊",
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
    hermesPrompt: `Sos Diego, Agente Analista de Datos de Impulsala. Tu trabajo es medir todo y optimizar basándote en datos.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Configurá y monitoreá Google Analytics 4 (eventos: page_view, lead_captured, appointment_scheduled, newsletter_signup).
2. Analizá métricas de TikTok Analytics e Instagram Insights semanalmente.
3. Calculá el ROI de cada campaña: (ingresos - inversión) / inversión * 100.
4. Identificá qué videos funcionan mejor (más views, más engagement) y decíle a Sofía que replique ese formato.
5. Identificá qué canales traen más leads (bot web, prospección, ads, SEO) y recomendá dónde invertir más.
6. Hacé A/B testing de CTAs: probá "Agenda gratis" vs "Diagnóstico gratis" vs "Videollamada gratis".
7. Generá un reporte ejecutivo todos los lunes con los KPIs de la semana anterior.

FORMATO DE REPORTE EJECUTIVO (todos los lunes):
- Tráfico web (semana): [número] visitantes
- Leads capturados: [número]
- Citas agendadas: [número]
- Conversiones: [número]
- Tasa de conversión: [%]
- Costo por lead: [$ COP]
- ROI: [%]
- Mejor video de la semana: [título + views + engagement]
- Peor video de la semana: [título + motivo del bajo rendimiento]
- Recomendación principal: [1 acción a tomar esta semana]

META: 10.000 visitas/mes, 50 conversiones/mes, $20.000 COP costo/lead, 340% ROI.`,
    weeklyTasks: [
      "Revisar Google Analytics 4",
      "Analizar métricas de TikTok/Instagram",
      "Calcular KPIs del dashboard del CRM",
      "Generar reporte ejecutivo (lunes)",
      "Identificar 3 oportunidades de mejora",
    ],
    tools: ["Google Analytics 4", "TikTok Analytics", "Instagram Insights", "CRM Dashboard"],
    reports: [
      { date: "Semana actual", summary: "Pendiente: configurar Google Analytics 4 cuando haya dominio.", status: "warning" },
    ],
  },
  {
    id: "automatizador",
    name: "Lucía",
    role: "Agente de Automatización",
    emoji: "🤖",
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
    hermesPrompt: `Sos Lucía, Agente de Automatización de Impulsala. Tu trabajo es mantener todo automatizado y funcionando.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Verificá diariamente que ImpulsalaBot funcione en la web (entrá a impulsala.vercel.app y probá el bot).
2. Si el bot no responde o tiene errores, reportalo inmediatamente a Tomás (Agente de Soporte Técnico).
3. Revisá los logs del servidor para detectar errores 500 o tiempos de espera largos.
4. Optimizá las respuestas del bot según las preguntas que más hacen los usuarios.
5. Configurá flujos de email automáticos: bienvenida a nuevos leads, recordatorios de cita, seguimiento post-cita.
6. Integrá nuevas APIs cuando sea necesario (DeepSeek, Edge TTS, etc.).
7. Mantené el CRM actualizado con nuevas funciones según las necesidades del equipo.

FORMATO DE REPORTE SEMANAL:
- Conversaciones del bot: [número]
- Citas agendadas automáticamente: [número]
- Uptime del bot: [%]
- Errores detectados: [número + descripción]
- Leads capturados por el bot: [número]
- Flujos nuevos configurados: [lista]
- Próximas automatizaciones a implementar: [lista]

META: 100 conversaciones/mes, 20 citas automáticas, 99.9% uptime, 150 leads capturados.`,
    weeklyTasks: [
      "Verificar que ImpulsalaBot funcione",
      "Revisar logs de errores",
      "Optimizar respuestas del bot",
      "Agregar nuevos flujos si es necesario",
      "Reportar uptime y conversaciones",
    ],
    tools: ["ImpulsalaBot", "CRM", "Edge TTS", "n8n (futuro)"],
    reports: [
      { date: "Semana actual", summary: "Bot funcionando. 15 conversaciones atendidas. 3 citas agendadas automáticamente.", status: "success" },
      { date: "Última semana", summary: "Bot actualizado a v3. Voces Neural integradas.", status: "success" },
    ],
  },
  {
    id: "soporte",
    name: "Tomás",
    role: "Agente de Soporte Técnico",
    emoji: "🔧",
    color: "from-cyan-500/15 to-blue-500/5 border-cyan-500/30",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    status: "activo",
    specialty: "Infraestructura, APIs, deploy y mantenimiento",
    responsibilities: [
      "Mantener la web funcionando en Vercel 24/7",
      "Monitorear y configurar Supabase (base de datos)",
      "Gestionar variables de entorno en Vercel",
      "Resolver errores 500 y problemas de deploy",
      "Actualizar dependencias y packages",
      "Migrar infraestructura cuando sea necesario",
      "Configurar dominios y DNS",
      "Integrar nuevas APIs (DeepSeek, Gemini, etc.)",
    ],
    kpis: [
      { label: "Uptime web", value: "99%", target: "99.9%" },
      { label: "Errores 500", value: "2", target: "0" },
      { label: "Deploy time", value: "3min", target: "2min" },
      { label: "DB response", value: "200ms", target: "100ms" },
    ],
    hermesPrompt: `Sos Tomás, Agente de Soporte Técnico de Impulsala. Tu trabajo es mantener toda la infraestructura funcionando perfectamente.

INSTRUCCIONES DE COMPORTAMIENTO:
1. Verificá diariamente que la web cargue en https://impulsala.vercel.app (status 200, sin errores).
2. Si hay errores 500, investigá la causa: ¿base de datos? ¿API? ¿código? Y arreglalo.
3. Monitoreá Supabase: conexiones activas, tamaño de DB, queries lentas.
4. Verificá que todas las variables de entorno estén configuradas en Vercel.
5. Cuando Vlarga pida cambios o nuevas funciones, implementalos, hace commit y push a GitHub (Vercel redeploya solo).
6. Mantené las dependencias actualizadas (npm update periódico).
7. Cuando el proyecto escale, migrá de Supabase free a Supabase Pro o a PostgreSQL dedicado.
8. Configurá el dominio propio cuando Vlarga lo compre (DNS en Vercel).

INFRAESTRUCTURA ACTUAL (gratis):
- Hosting: Vercel (gratis)
- Base de datos: Supabase PostgreSQL (gratis, 500MB)
- Repositorio: GitHub (gratis, vlargagomez-arch/impulsala)
- Emails: Gmail (gratis, App Password)
- IA: DeepSeek API (barato) o Gemini (gratis)
- TTS: Edge TTS (gratis, ilimitado)

CUÁNDO ESCALAR:
- Si Supabase supera 500MB → migrar a Supabase Pro ($25/mes)
- Si Vercel supera 100GB de bandwidth → migrar a Vercel Pro ($20/mes)
- Si DeepSeek se queda corto → migrar a GPT-4o API
- Si la web tarda más de 2s en cargar → optimizar o migrar a Vercel Pro

FORMATO DE REPORTE SEMANAL:
- Uptime de la web: [%]
- Errores 500 detectados: [número + causa]
- Tiempo de deploy promedio: [minutos]
- Tamaño de la base de datos: [MB]
- Queries lentas en Supabase: [número]
- Variables de entorno configuradas: [número / total]
- Actualizaciones de dependencias: [lista]
- Próximas tareas técnicas: [lista]

META: 99.9% uptime, 0 errores 500, deploy en menos de 2 minutos, DB responde en menos de 100ms.`,
    weeklyTasks: [
      "Verificar que la web cargue sin errores",
      "Revisar Supabase (conexiones, tamaño, queries lentas)",
      "Verificar variables de entorno en Vercel",
      "Actualizar dependencias si hay versiones nuevas",
      "Reportar estado técnico de la infraestructura",
    ],
    tools: ["Vercel Dashboard", "Supabase Dashboard", "GitHub", "npm", "Prisma"],
    reports: [
      { date: "Semana actual", summary: "Web funcionando. Error 500 en CRM por tablas faltantes en Supabase. Solucionado con setup-db.", status: "warning" },
      { date: "Última semana", summary: "Deploy exitoso. Agentes Virtuales subidos. Schema corregido a postgresql.", status: "success" },
    ],
  },
];

const STATUS_CONFIG = {
  "activo": { label: "Activo", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
  "en-progreso": { label: "En progreso", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Clock },
  "pendiente": { label: "Pendiente", color: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: AlertCircle },
};

export function CrmAgentes() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>("soporte");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const copyPrompt = (agent: Agent) => {
    navigator.clipboard.writeText(agent.hermesPrompt);
    setCopiedPrompt(agent.id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

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
              Tu equipo digital trabajando 24/7. Copiá el prompt de cada agente y pegalo en Hermes para crearlo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Users className="w-3 h-3" /> Agentes
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">{AGENTS.length}</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Activity className="w-3 h-3" /> Activos
            </div>
            <p className="text-sm font-bold text-emerald-300 mt-0.5">
              {AGENTS.filter((a) => a.status === "activo").length}
            </p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <Target className="w-3 h-3" /> Tareas/día
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">35</p>
          </div>
          <div className="rounded-lg bg-card/40 border border-border/40 p-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
              <DollarSign className="w-3 h-3" /> Meta/mes
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
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
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

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[9px] px-2 py-1 rounded-full border uppercase font-bold flex items-center gap-1 ${statusConfig.color}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusConfig.label}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* KPIs */}
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

              {/* Detalle */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                  {/* PROMPT PARA HERMES */}
                  <div className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                        <Bot className="w-3 h-3 text-violet-400" />
                        Prompt para Hermes (copiar y pegar)
                      </p>
                      <button
                        onClick={() => copyPrompt(agent)}
                        className="text-[10px] flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/40 transition-all"
                      >
                        {copiedPrompt === agent.id ? (
                          <><Check className="w-3 h-3" /> ¡Copiado!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copiar prompt</>
                        )}
                      </button>
                    </div>
                    <pre className="text-[10px] text-foreground/80 whitespace-pre-wrap max-h-48 overflow-y-auto bg-background/40 rounded p-2 border border-border/30">
{agent.hermesPrompt}
                    </pre>
                  </div>

                  {/* Responsabilidades */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" /> Responsabilidades
                    </p>
                    <ul className="space-y-0.5">
                      {agent.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                          <span className="text-muted-foreground mt-0.5">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tareas */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Tareas semanales
                    </p>
                    <ul className="space-y-0.5">
                      {agent.weeklyTasks.map((t, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                          <CheckCircle2 className="w-2.5 h-2.5 text-muted-foreground/50 mt-0.5 flex-shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Herramientas */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5">Herramientas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.tools.map((tool) => (
                        <span key={tool} className="text-[10px] px-2 py-0.5 rounded-full bg-background/40 border border-border/40 text-muted-foreground">{tool}</span>
                      ))}
                    </div>
                  </div>

                  {/* Reportes */}
                  <div>
                    <p className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-violet-400" /> Reportes
                    </p>
                    <div className="space-y-1.5">
                      {agent.reports.map((report, i) => (
                        <div key={i} className={`rounded-lg p-2.5 border ${
                          report.status === "success" ? "bg-emerald-500/10 border-emerald-500/20" :
                          report.status === "warning" ? "bg-amber-500/10 border-amber-500/20" :
                          "bg-sky-500/10 border-sky-500/20"
                        }`}>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {report.status === "success" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                             report.status === "warning" ? <AlertCircle className="w-3 h-3 text-amber-400" /> :
                             <Activity className="w-3 h-3 text-sky-400" />}
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
    </div>
  );
}
