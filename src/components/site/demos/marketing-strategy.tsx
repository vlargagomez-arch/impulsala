"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Mail, Video, CalendarDays, BarChart3,
  Send, ArrowRight, Copy, Check, Play, Eye, MousePointerClick,
  Target, TrendingUp, DollarSign, Users, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/* ================================================================
   BENCHMARKS REALES POR SECTOR
   Fuentes: Mailchimp 2024, WordStream 2024, Hootsuite 2024,
   Sprout Social 2024, RivalIQ 2024, HubSpot 2024
   ================================================================ */

interface Benchmarks {
  label: string;
  emailOpen: number;
  emailCtr: number;
  emailConv: number;
  igEngagement: number;
  igCpm: number;
  ttEngagement: number;
  ttCpm: number;
  gCtr: number;
  gCpc: number;
  gConv: number;
  aov: number;
  budget: number;
  bestDay: string;
  bestTime: string;
  source: string;
}

const BENCHMARKS: Record<string, Benchmarks> = {
  restaurant: {
    label: "Restaurantes",
    emailOpen: 23.4, emailCtr: 2.8, emailConv: 1.8,
    igEngagement: 2.1, igCpm: 7500,
    ttEngagement: 5.8, ttCpm: 5000,
    gCtr: 5.12, gCpc: 1200, gConv: 5.8,
    aov: 65000, budget: 4500000,
    bestDay: "Mar-Jue", bestTime: "10-11 a.m.",
    source: "Mailchimp + WordStream 2024",
  },
  salud: {
    label: "Salud / Bienestar",
    emailOpen: 25.6, emailCtr: 3.2, emailConv: 2.1,
    igEngagement: 0.8, igCpm: 9000,
    ttEngagement: 2.4, ttCpm: 6500,
    gCtr: 3.85, gCpc: 3200, gConv: 4.2,
    aov: 450000, budget: 6000000,
    bestDay: "Mar-Mie", bestTime: "8-10 a.m.",
    source: "Mailchimp + Sprout Social 2024",
  },
  ecommerce: {
    label: "Tienda Online",
    emailOpen: 16.1, emailCtr: 2.1, emailConv: 1.5,
    igEngagement: 1.4, igCpm: 8000,
    ttEngagement: 3.9, ttCpm: 5500,
    gCtr: 2.96, gCpc: 1800, gConv: 3.5,
    aov: 120000, budget: 5500000,
    bestDay: "Mar-Jue", bestTime: "9-11 a.m.",
    source: "Campaign Monitor + WordStream 2024",
  },
  inmobiliaria: {
    label: "Inmobiliaria",
    emailOpen: 21.3, emailCtr: 2.6, emailConv: 1.9,
    igEngagement: 1.7, igCpm: 10000,
    ttEngagement: 3.2, ttCpm: 7000,
    gCtr: 4.62, gCpc: 4500, gConv: 3.8,
    aov: 18000000, budget: 8000000,
    bestDay: "Lun-Mie", bestTime: "9-10 a.m.",
    source: "Mailchimp + Sprout Social 2024",
  },
  saas: {
    label: "SaaS / Tecnologia",
    emailOpen: 22.7, emailCtr: 2.9, emailConv: 2.4,
    igEngagement: 1.1, igCpm: 8500,
    ttEngagement: 2.8, ttCpm: 6000,
    gCtr: 3.67, gCpc: 3800, gConv: 4.5,
    aov: 190000, budget: 7000000,
    bestDay: "Mar-Mie", bestTime: "10 a.m.",
    source: "HubSpot + WordStream 2024",
  },
  servicios: {
    label: "Consultora / Servicios",
    emailOpen: 24.2, emailCtr: 3.0, emailConv: 2.2,
    igEngagement: 1.3, igCpm: 7000,
    ttEngagement: 3.1, ttCpm: 5200,
    gCtr: 3.92, gCpc: 2800, gConv: 4.0,
    aov: 3500000, budget: 5000000,
    bestDay: "Mar-Jue", bestTime: "9-11 a.m.",
    source: "Campaign Monitor + WordStream 2024",
  },
};

/* ---- Industries for detection ---- */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  restaurant: ["restauran", "comida", "cafe", "bar", "panaderia", "food", "menu", "chef", "cocina", "delivery", "domicilio", "plato", "gastronomi"],
  salud: ["salud", "clinica", "medic", "dent", "bienestar", "spa", "nutri", "fisioterapia", "psicolo", "terapia", "estetica", "belleza"],
  ecommerce: ["tienda", "shop", "ecommerce", "e-commerce", "moda", "ropa", "zapat", "accesorio", "electronica", "venta online", "marketplace"],
  inmobiliaria: ["inmobil", "apartamento", "casa", "arriendo", "venta de inmueble", "propiedad", "terreno", "bienes raices", "finca", "lote"],
  saas: ["software", "saas", "app", "plataforma", "herramienta digital", "suscripcion", "suscripcion", "crm", "erp", "dashboard", "automatizacion"],
  servicios: ["consultor", "agencia", "marketing", "diseno", "asesor", "capacitacion", "coaching", "legal", "contab", "financiero"],
};

const AUDIENCES = [
  { id: "b2c_joven", label: "B2C - Jovenes (18-30)", icon: "Z" },
  { id: "b2c_familia", label: "B2C - Familias (30-50)", icon: "F" },
  { id: "b2c_profesional", label: "B2C - Profesionales (25-45)", icon: "P" },
  { id: "b2b_pyme", label: "B2B - PYMEs", icon: "B" },
  { id: "b2b_enterprise", label: "B2B - Empresas grandes", icon: "E" },
];

const CHANNELS = [
  { id: "email", label: "Email Marketing", icon: Mail },
  { id: "tiktok", label: "TikTok Ads", icon: Play },
  { id: "instagram", label: "Instagram Ads", icon: Eye },
  { id: "google", label: "Google Ads", icon: MousePointerClick },
];

/* ---- Detect industry from product name ---- */
function detectIndustry(product: string): string {
  const lower = product.toLowerCase();
  let bestMatch = "servicios";
  let bestScore = 0;
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry;
    }
  }
  return bestMatch;
}

/* ---- Format COP ---- */
function cop(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-CO")}`;
}

/* ================================================================
   GENERATE CAMPAIGN
   ================================================================ */

interface CampaignResult {
  industry: string;
  bench: Benchmarks;
  strategy: { summary: string; approach: string; kpis: string[] };
  email: { subject: string; preheader: string; body: string[] };
  video: { platform: string; duration: string; hook: string; body: string; cta: string; hashtags: string[]; tips: string[] };
  calendar: { day: number; type: string; content: string; channel: string }[];
  projection: { metric: string; value: string; detail: string }[];
}

function generateCampaign(
  product: string,
  audienceId: string,
  channelId: string,
): CampaignResult {
  const industry = detectIndustry(product);
  const b = BENCHMARKS[industry];
  const aud = AUDIENCES.find(a => a.id === audienceId);
  const audLabel = aud?.label || "tu audiencia";
  const ch = CHANNELS.find(c => c.id === channelId);
  const chLabel = ch?.label || channelId;
  const p = product;

  /* ---- STRATEGY ---- */
  const channelStrategy: Record<string, string> = {
    email: `Campaña de email marketing con 4 envíos mensuales dirigidos a ${audLabel}. Foco en apertura (${b.emailOpen}% benchmark) y conversión directa. Contenido de valor + oferta clara en cada email.`,
    tiktok: `Contenido nativo para TikTok enfocado en ${audLabel}. Videos cortos (20-40s) con alto engagement esperado (${b.ttEngagement}% benchmark). Combinación de contenido orgánico + Spark Ads para escalar alcance.`,
    instagram: `Estrategia de Instagram con Reels y Stories para ${audLabel}. Engagement esperado: ${b.igEngagement}%. Contenido visual de alto impacto + carousel educativos + ads con segmentación por intereses.`,
    google: `Campaña de Search Ads + Display para captar demanda existente. CTR esperado: ${b.gCtr}%. Foco en keywords de alta intención de compra con landing pages optimizadas.`,
  };

  const kpisByChannel: Record<string, string[]> = {
    email: [
      `Open Rate > ${b.emailOpen}% (benchmark sector)`,
      `CTR > ${b.emailCtr}%`,
      `Tasa de conversión > ${b.emailConv}%`,
      `Revenue por email enviado > ${cop(Math.round(b.aov * b.emailConv / 100))}`,
    ],
    tiktok: [
      `Engagement rate > ${b.ttEngagement}%`,
      `CPM < ${cop(b.ttCpm)}`,
      `Vistas promedio por video > 5.000`,
      `Conversión desde perfil > 2%`,
    ],
    instagram: [
      `Engagement rate > ${b.igEngagement}%`,
      `Alcance mensual > 50K`,
      `CPM < ${cop(b.igCpm)}`,
      `Clics en link bio > 3% del alcance`,
    ],
    google: [
      `CTR > ${b.gCtr}%`,
      `CPC < ${cop(b.gCpc)}`,
      `Tasa de conversión > ${b.gConv}%`,
      `Costo por lead < ${cop(Math.round(b.gCpc / (b.gConv / 100)))}`,
    ],
  };

  /* ---- EMAIL ---- */
  const emailSubjects: Record<string, string[]> = {
    restaurant: [
      `${p} - Reserva ahora con 20% de descuento`,
      `Probablemente no has probado ${p} asi`,
      `Menu exclusivo de esta semana en ${p}`,
    ],
    salud: [
      `5 beneficios de ${p} que no conocias`,
      `Valoracion gratuita de ${p} - solo esta semana`,
      `Resultados reales de ${p} - mira los antes y despues`,
    ],
    ecommerce: [
      `${p} - Envio gratis + 20% off esta semana`,
      `Lo que nadie te dice sobre ${p}`,
      `Ultimas unidades de ${p} - no te quedes sin el tuyo`,
    ],
    inmobiliaria: [
      `Tour virtual - Conoce ${p} sin salir de casa`,
      `Por que ${p} se agota antes del lanzamiento`,
      `Precios exclusivos en ${p} - solo suscriptores`,
    ],
    saas: [
      `${p} - Prueba gratis 14 dias (sin tarjeta)`,
      `Como ${p} ahorra 15 horas semanales a tu equipo`,
      `+200 empresas ya usan ${p} - caso de exito`,
    ],
    servicios: [
      `Diagnostico gratuito - ${p} en 45 minutos`,
      `Como ${p} ayudo a triplicar las ventas de [empresa]`,
      `Los 3 errores que te estan costando clientes`,
    ],
  };

  const emailBody: Record<string, string[]> = {
    restaurant: [
      `Hola [Nombre],`,
      `Si todavia no has probado ${p}, esta es tu oportunidad.`,
      `Hemos preparado una experiencia unica con ingredientes frescos y recetas que nos distinguen. Mas de 500 clientes este mes ya lo confirman con 4.8 estrellas.`,
      `RESERVA AHORA - Solo esta semana:`,
      `> 20% de descuento en tu primera visita`,
      `> Envio gratis a domicilio (pedidos +$50K)`,
      `> Bebida de bienvenida incluida`,
      `El link de reserva esta aqui abajo. Las mesas se llenan rapido.`,
      `Nos vemos pronto,`,
      `El equipo de ${p}`,
    ],
    salud: [
      `Hola [Nombre],`,
      `Sabemos que buscar la mejor opcion para tu bienestar no es facil. Por eso queremos mostrarte los resultados reales de ${p}.`,
      `Mas de 500 pacientes han confiado en nosotros este año con una tasa de satisfaccion del 98%. Todos con resultados documentados y seguimiento personalizado.`,
      `TE OFRECEMOS ESTA SEMANA:`,
      `> Valoracion inicial completamente gratuita`,
      `> Sin compromisos de permanencia`,
      `> Horarios flexibles adaptados a tu agenda`,
      `Agenda tu cita con un solo clic abajo.`,
      `Tu bienestar es nuestra prioridad.`,
      `El equipo de ${p}`,
    ],
    ecommerce: [
      `Hola [Nombre],`,
      `Acabamos de recibir ${p} y la respuesta ha sido increible. Las primeras unidades se estan agotando.`,
      `Con mas de 1.000 clientes satisfechos y 4.7 estrellas en reviews, sabemos que vas a quedar encantado. Ademas, esta semana tienes beneficios exclusivos:`,
      `> 20% de descuento - codigo: BIENVENIDO20`,
      `> Envio gratis a toda Colombia`,
      `> Garantia de 30 dias - si no te gusta, te devolvemos tu dinero`,
      `No dejes pasar esta oportunidad. El stock es limitado.`,
      `Compra ahora desde el link de abajo.`,
      `El equipo de ${p}`,
    ],
    inmobiliaria: [
      `Hola [Nombre],`,
      `Si estas buscando invertir o encontrar tu nuevo hogar, ${p} tiene algo especial para ti.`,
      `Ubicacion privilegiada, amenities completas y un esquema de pago flexible que se adapta a tus necesidades. Los proyectos con revalorizacion del 15% anual no esperan.`,
      `BENEFICIOS EXCLUSIVOS PARA SUSCRIPTORES:`,
      `> Tour virtual disponible 24/7`,
      `> Precios preferenciales en pre-venta`,
      `> Financiacion hasta 20 anos`,
      `> Escritura gratis en unidades seleccionadas`,
      `Agenda tu visita o recorrido virtual hoy.`,
      `El equipo de ${p}`,
    ],
    saas: [
      `Hola [Nombre],`,
      `Tu equipo todavia hace [tarea manual] de forma manual? ${p} lo automatiza en 3 clics.`,
      `Mas de 200 empresas ya ahorran entre 10 y 20 horas semanales. La integracion con las herramientas que ya usas toma menos de 5 minutos.`,
      `EMPIEZA GRATIS HOY:`,
      `> 14 dias de prueba gratuita - sin tarjeta de credito`,
      `> Setup asistido por nuestro equipo`,
      `> Soporte 24/7 en espanol`,
      `> ROI positivo desde el primer mes`,
      `Un clic abajo y empiezas tu prueba.`,
      `El equipo de ${p}`,
    ],
    servicios: [
      `Hola [Nombre],`,
      `Identificamos los 3 errores mas comunes que estan frenando el crecimiento de negocios como el tuyo. ${p} te ayuda a solucionarlos.`,
      `Hemos generado resultados medibles para mas de 50 empresas: incremento promedio del 300% en leads cualificados en 90 dias. Cases documentados con datos reales.`,
      `DIAGNOSTICO GRATUITO - 45 MINUTOS:`,
      `> Analisis de tu situacion actual`,
      `> Identificacion de oportunidades inmediatas`,
      `> Plan de accion concreto`,
      `> Sin compromiso`,
      `Solo 5 diagnosticos gratuitos al mes. Agenda el tuyo.`,
      `El equipo de ${p}`,
    ],
  };

  const subjects = emailSubjects[industry] || emailSubjects.servicios;
  const bodyLines = emailBody[industry] || emailBody.servicios;

  /* ---- VIDEO SCRIPT ---- */
  const videoScripts: Record<string, { platform: string; duration: string; hook: string; body: string; cta: string; hashtags: string[]; tips: string[] }> = {
    email: {
      platform: "N/A (Email)", duration: "N/A",
      hook: "N/A - Canal de email",
      body: "Este canal genera contenido escrito. El video no aplica.",
      cta: "El CTA principal es el boton dentro del email.",
      hashtags: [],
      tips: [
        "El asunto determina el 47% de la tasa de apertura",
        "Envia entre " + b.bestDay + " a las " + b.bestTime,
        "A/B test siempre: prueba 2 asuntos por envio",
        "El preheader es tu segunda oportunidad de captar atencion",
      ],
    },
    tiktok: {
      platform: "TikTok", duration: "20-40 seg",
      hook: getTikTokHook(industry, p),
      body: getTikTokBody(industry, p),
      cta: getTikTokCta(industry, p),
      hashtags: getHashtags(industry),
      tips: [
        "Usa audio trending + sonido original",
        "El primer frame decide si siguen o no",
        "Subtitulos siempre - el 70% ve sin audio",
        "Los videos sin produccion profesional funcionan mejor",
      ],
    },
    instagram: {
      platform: "Instagram Reels", duration: "15-30 seg",
      hook: getIgHook(industry, p),
      body: getIgBody(industry, p),
      cta: getIgCta(industry, p),
      hashtags: getHashtags(industry),
      tips: [
        "La estetica visual es mas importante que en TikTok",
        "Usa efectos de transicion nativos de Instagram",
        "La musica trending sube el alcance significativamente",
        "Combina con Stories para conversions directas",
      ],
    },
    google: {
      platform: "Google Ads (Search + Display)", duration: "N/A",
      hook: getGoogleHeadline(industry, p),
      body: getGoogleDesc(industry, p),
      cta: "Extensiones: Llamar ahora - Ver ubicacion - Chat de ventas",
      hashtags: [],
      tips: [
        "Foco en keywords de alta intencion (comprar, contratar, agendar)",
        "Landing page optimizada con carga < 3 segundos",
        "A/B test de al menos 3 titulos y 2 descripciones",
        "Negative keywords desde el dia 1 para reducir desperdicio",
      ],
    },
  };

  /* ---- CALENDAR ---- */
  const calendar = generateCalendar(industry, channelId, p);

  /* ---- PROJECTION ---- */
  const projection = generateProjection(industry, channelId, b);

  return {
    industry,
    bench: b,
    strategy: {
      summary: `Campana de ${p} para ${b.label} enfocada en ${audLabel} a traves de ${chLabel}.`,
      approach: channelStrategy[channelId] || channelStrategy.email,
      kpis: kpisByChannel[channelId] || kpisByChannel.email,
    },
    email: {
      subject: subjects[0],
      preheader: subjects[1] || "",
      body: bodyLines,
    },
    video: videoScripts[channelId] || videoScripts.email,
    calendar,
    projection,
  };
}

/* ---- Video helpers ---- */
function getTikTokHook(ind: string, p: string): string {
  const hooks: Record<string, string> = {
    restaurant: `[Primer plano del plato, camara lenta] "Este es ${p} y te voy a mostrar por que la gente hace fila por el..."`,
    salud: `"Sabias que el 80% de las personas ignora esta senal de su cuerpo?" [Muestra el tema de ${p}]`,
    ecommerce: `[Unboxing en camara rapida] "Acabo de recibir ${p} y miren esto..."`,
    inmobiliaria: `[Drone shot del edificio/propiedad] "Este proyecto tiene algo que no has visto en otra parte..."`,
    saas: `"Tu equipo todavia hace eso manual? ${p} lo hace en 3 clics."`,
    servicios: `"3 errores que estan frenando tu negocio - y como solucionarlos hoy."`,
  };
  return hooks[ind] || hooks.servicios;
}

function getTikTokBody(ind: string, p: string): string {
  const bodies: Record<string, string> = {
    restaurant: `[3-8s] Behind the scenes: ingredientes frescos, chef preparando.\n[8-18s] Proceso de preparacion acelerado con transiciones rapidas.\n[18-25s] Plato terminado + reaccion genuina al probarlo.`,
    salud: `[3-15s] Explica el problema comun de forma simple y visual.\n[15-30s] Muestra como ${p} lo resuelve con antes/despues reales.\n[30-40s] Testimonial corto de 5 segundos de un paciente.`,
    ecommerce: `[3-10s] Muestra el producto de cerca - texturas, detalles, tamanio real.\n[10-20s] Demostracion rapida: como se usa en la vida real.\n[20-28s] Reaccion genuina + mencion del precio/valor.`,
    inmobiliaria: `[3-15s] Tour rapido por espacios comunes - amenities, vistas.\n[15-30s] Interior de un apartamento tipo - muestra el tamanio real.\n[30-40s] Muestra la zona: transporte, comercios, parques cercanos.`,
    saas: `[3-10s] Pantalla: muestra lo que toma hacer X tarea manualmente (cronometro corriendo).\n[10-20s] Pantalla: muestra como ${p} lo automatiza (mismo cronometro, 3 segundos).\n[20-28s] Dashboard final con los resultados.`,
    servicios: `[3-12s] Error 1: [problema comun] + solucion rapida.\n[12-22s] Error 2: [problema comun] + lo que deberias hacer.\n[22-32s] Error 3: [problema comun] + resultado de un caso real.`,
  };
  return bodies[ind] || bodies.servicios;
}

function getTikTokCta(ind: string, p: string): string {
  const ctas: Record<string, string> = {
    restaurant: `"Si estas en la ciudad, el link en la bio es para reservar. Comment MENU y te envio la carta por DM."`,
    salud: `"Si te identificas, agenda una valoracion gratuita - link en bio. Sin compromiso."`,
    ecommerce: `"Link en bio - envio gratis a toda Colombia. Si te gusto, guarda el video."`,
    inmobiliaria: `"Agenda un tour virtual o presencial - link en bio. Las mejores unidades se venden rapido."`,
    saas: `"Link en bio - prueba gratis 14 dias, sin tarjeta."`,
    servicios: `"Si tu negocio tiene alguno de estos problemas, agenda un diagnostico gratuito - link en bio."`,
  };
  return ctas[ind] || ctas.servicios;
}

function getIgHook(ind: string, p: string): string {
  const hooks: Record<string, string> = {
    restaurant: `[Montaje cinematografico del plato + POV] "El momento en que pruebas ${p} por primera vez"`,
    salud: `[Transformacion visual: antes/despues] "90 dias con ${p} - estos son los resultados reales."`,
    ecommerce: `[Producto en lifestyle setting] "Algo que no sabias que necesitabas - hasta ahora."`,
    inmobiliaria: `[Shot aereo con transicion al interior] "Si estas buscando hogar, esto es lo que necesitas ver."`,
    saas: `[Screen recording rapido] "Automatizamos en 3 clics lo que tu equipo hace en 5 horas."`,
    servicios: `[Texto en pantalla] "Como ayudamos a [empresa] a multiplicar sus ventas"`,
  };
  return hooks[ind] || hooks.servicios;
}

function getIgBody(ind: string, p: string): string {
  const bodies: Record<string, string> = {
    restaurant: `[5-15s] Secuencia rapida: preparacion, emplatado, servicio.\n[15-25s] Reaccion de clientes + shot del ambiente del restaurante.`,
    salud: `[5-15s] Muestra el proceso: sesion, seguimiento, evolucion.\n[15-25s] Testimonial en video (5-8 segundos) + resultados visibles.`,
    ecommerce: `[5-12s] Producto en 3 contextos de uso diferentes.\n[12-20s] Detalles de calidad + sticker de precio.\n[20-25s] CTA con swipe up.`,
    inmobiliaria: `[5-15s] Tour cinematografico del proyecto.\n[15-25s] Amenities + shot del entorno.\n[25-32s] Planos y precios.`,
    saas: `[5-12s] Comparacion visual: manual vs automatizado.\n[12-20s] Dashboard con metricas + testimonio breve.`,
    servicios: `[5-15s] Explica el problema y la solucion de forma visual.\n[15-25s] Numeros concretos: "En 90 dias: +340% en leads".\n[25-30s] Logo del cliente + screenshot del resultado.`,
  };
  return bodies[ind] || bodies.servicios;
}

function getIgCta(ind: string, p: string): string {
  const ctas: Record<string, string> = {
    restaurant: `"Guarda este reel y ven a visitarnos. Link en bio para reservar."`,
    salud: `"Link en bio para agendar tu valoracion gratuita. Resultados reales, sin promesas vacias."`,
    ecommerce: `"Compra por el link en bio - envio gratis + garantia de 30 dias."`,
    inmobiliaria: `"Link en bio para agendar tu visita. Las mejores torres se venden rapido."`,
    saas: `"Link en bio - prueba gratis 14 dias."`,
    servicios: `"Link en bio para agendar tu diagnostico gratuito."`,
  };
  return ctas[ind] || ctas.servicios;
}

function getGoogleHeadline(ind: string, p: string): string {
  const h: Record<string, string> = {
    restaurant: `${p} | Reserva Online - "Mejor Restaurante en la Ciudad"`,
    salud: `${p} | Valoracion Gratis - "Clinica #1 en Satisfaccion"`,
    ecommerce: `${p} - Envio Gratis - "Nueva Coleccion Disponible"`,
    inmobiliaria: `${p} - Tour Virtual - "Invierte con Retorno del 12%"`,
    saas: `${p} - Prueba Gratis 14 Dias - "Automatiza en 3 Clics"`,
    servicios: `${p} | Diagnostico Gratis - "Ayudamos a Crecer +300%"`,
  };
  return h[ind] || h.servicios;
}

function getGoogleDesc(ind: string, p: string): string {
  const d: Record<string, string> = {
    restaurant: `Descubre ${p}: ingredientes frescos, preparacion artesanal. Mas de 500 clientes satisfechos este mes. 4.8 estrellas en Google. Reserva online o pide a domicilio.`,
    salud: `${p}: mas de 500 pacientes atendidos con resultados documentados. Equipo certificado con +10 anos de experiencia. Agenda tu cita gratuita hoy.`,
    ecommerce: `Compra ${p} con envio gratis a toda Colombia. Garantia de 30 dias y soporte por WhatsApp. Mas de 1.000 clientes satisfechos.`,
    inmobiliaria: `Descubre ${p}: ubicacion privilegiada, amenities completas y esquema de pago flexible. Proyectos con revalorizacion del 15% anual. Agenda tu visita.`,
    saas: `${p} automatiza procesos y ahorra 10-20 horas semanales a tu equipo. Integracion con las herramientas que ya usas. Prueba gratis sin compromiso.`,
    servicios: `${p}: diagnostico gratuito de 45 minutos para identificar las mayores oportunidades de tu negocio. Hemos generado resultados medibles para +50 empresas.`,
  };
  return d[ind] || d.servicios;
}

function getHashtags(ind: string): string[] {
  const tags: Record<string, string[]> = {
    restaurant: ["#comidacolombiana", "#foodtiktok", "#restaurant", "#foodie", "#receta"],
    salud: ["#salud", "#bienestar", "#consejosdesalud", "#saludnatural"],
    ecommerce: ["#unboxing", "#compras", "#founditonTikTok", "#productofavorito"],
    inmobiliaria: ["#inmobiliaria", "#casas", "#apartamentos", "#bienesraices"],
    saas: ["#productividad", "#startup", "#herramientas", "#tecnologia"],
    servicios: ["#negocios", "#emprendimiento", "#consultoria", "#crecimiento"],
  };
  return tags[ind] || tags.servicios;
}

/* ---- Calendar generator ---- */
function generateCalendar(
  industry: string,
  channelId: string,
  p: string,
): { day: number; type: string; content: string; channel: string }[] {
  const items: { day: number; type: string; content: string; channel: string }[] = [];

  const contentByType: Record<string, string[]> = {
    promo: getCalendarContent(industry, "promo", p),
    educativo: getCalendarContent(industry, "educativo", p),
    social: getCalendarContent(industry, "social", p),
    interactivo: getCalendarContent(industry, "interactivo", p),
    bts: getCalendarContent(industry, "bts", p),
  };

  const channelMap: Record<string, string> = {
    email: "Email",
    tiktok: "TikTok",
    instagram: "Instagram",
    google: "Google Ads",
  };

  const typeOrder = ["promo", "educativo", "social", "interactivo", "bts"];
  const schedule: Record<string, number[]> = {
    email: [1, 7, 14, 21, 28],
    tiktok: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26],
    instagram: [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27],
    google: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  };

  const days = schedule[channelId] || schedule.email;

  for (const day of days) {
    const typeIdx = (day - 1) % typeOrder.length;
    const typeName = typeOrder[typeIdx];
    const contentArr = contentByType[typeName] || [];
    const contentIdx = Math.floor((day - 1) / typeOrder.length) % contentArr.length;
    const content = contentArr[contentIdx] || `${p} - contenido del dia ${day}`;
    items.push({
      day,
      type: typeName.charAt(0).toUpperCase() + typeName.slice(1),
      content,
      channel: channelMap[channelId] || channelId,
    });
  }

  return items.slice(0, 30);
}

function getCalendarContent(ind: string, type: string, p: string): string[] {
  const data: Record<string, Record<string, string[]>> = {
    restaurant: {
      promo: [
        `Lanzamiento especial de ${p} con descuento`,
        "Happy hour 2x1 en bebidas",
        `Promo del dia: ${p} + bebida incluida`,
        "Noche tematica - reserva anticipada",
        "Combo familiar: 4 platos por precio especial",
      ],
      educativo: [
        `Receta: los 3 secretos detras de ${p}`,
        "Historia: como nacio ${p} en nuestra cocina",
        "Tip: como maridar ${p} como un profesional",
        "Consejo del chef: el ingrediente que marca la diferencia",
      ],
      social: [
        "Resena de la semana + foto del plato",
        "Story: un dia en nuestro restaurante",
        "Video: reacciones reales al probarlo",
        "Google Reviews: destacados del mes",
      ],
      interactivo: [
        `Como prefieres ${p}? - Encuesta`,
        "Challenge: reta a un amigo a visitarnos",
        "Preguntale al chef sobre " + p,
        "Concurso: comparte tu foto y gana un menu",
      ],
      bts: [
        "Video: seleccion de ingredientes en el mercado",
        "Preparando el servicio del fin de semana",
        "El equipo que prepara tu comida",
        "Antes y despues de nuestra remodelacion",
      ],
    },
    salud: {
      promo: [
        "Valoracion gratuita - cupos limitados",
        "Segunda sesion con 50% de descuento",
        "Plan familiar con precio especial",
        "Promo de referencia: trae un amigo, ambos ganan",
      ],
      educativo: [
        `5 beneficios de ${p} con respaldo cientifico`,
        "Como identificar si necesitas " + p,
        "Mitos vs realidades sobre " + p,
        "Tip diario de bienestar",
      ],
      social: [
        "Testimonial en video: antes y despues",
        "Satisfaccion del mes: 98% pacientes recomiendan",
        "Resultados de un caso real (con permiso)",
        "Google Reviews: destacados del mes",
      ],
      interactivo: [
        "Encuesta: cual es tu mayor preocupacion de salud?",
        "Quiz: necesitas " + p + "? Descubrelo",
        "Pregunta tus dudas con un especialista",
        "Desafio de bienestar de 7 dias",
      ],
      bts: [
        "Conoce a nuestro equipo medico",
        "Un dia en la clinica",
        "La tecnologia detras de " + p,
        "Como preparamos tu plan personalizado",
      ],
    },
    ecommerce: {
      promo: [
        `Lanzamiento de ${p} - early bird 20% off`,
        "Flash sale 24 horas",
        `Compra ${p} y recibe envio gratis`,
        "Black Friday anticipado en categorias seleccionadas",
        "Compra 2 unidades de " + p + ", la tercera es gratis",
      ],
      educativo: [
        `Como elegir el mejor ${p} para ti`,
        "Guia de tallas / especificaciones de " + p,
        "Comparativa: " + p + " vs alternativas del mercado",
        "Tips de cuidado para que " + p + " dure mas",
      ],
      social: [
        "Review del cliente del mes",
        "Fotos reales de clientes usando " + p,
        "Unboxing: lo que llega cuando compras " + p,
        "Rating de la semana: 4.8/5 estrellas",
      ],
      interactivo: [
        "Cual es tu color/talla favorita? - Encuesta",
        "Concurso: comparte tu foto con " + p,
        "Quiz: que " + p + " es perfecto para ti?",
        "Vota: cual producto lanzamos el proximo mes?",
      ],
      bts: [
        "Como empacamos tu pedido",
        "El proceso de diseno de " + p,
        "Conoce al equipo detras de la tienda",
        "Un dia en el almacen - preparando envios",
      ],
    },
    inmobiliaria: {
      promo: [
        "Open house este sabado - confirma asistencia",
        "Precios preferenciales en pre-venta",
        "Promo: escritura gratis en unidades seleccionadas",
        "Tour virtual exclusivo para suscriptores",
      ],
      educativo: [
        "Guia: como elegir el barrio ideal para ti?",
        "Que buscar en una visita a un apartamento",
        "Entendiendo los esquemas de financiacion",
        "Tendencias del mercado inmobiliario 2025",
      ],
      social: [
        "Testimonio: familia que encontro su hogar",
        "Case: inversion que genero 15% de revalorizacion",
        "Resenas de Google - destacados del mes",
        "Antes y despues: proyecto terminado vs renders",
      ],
      interactivo: [
        "Que prefieres: apto o casa? - Encuesta",
        "Quiz: cuanto puedes financiar?",
        "Responde dudas con un asesor inmobiliario",
        "Concurso: comparte tu sueno de hogar",
      ],
      bts: [
        "Avance de obra - semana a semana",
        "El proceso de diseno arquitectonico",
        "Conoce al equipo de ventas",
        "Recorrido por la zona del proyecto",
      ],
    },
    saas: {
      promo: [
        "Prueba gratis 14 dias - sin tarjeta",
        "Plan anual con 2 meses gratis",
        "Demo personalizada para tu equipo",
        "Upgrade: caracteristicas premium al 50%",
      ],
      educativo: [
        `Tutorial: como configurar ${p} en 5 minutos`,
        "Caso de uso: como una empresa ahorra 15h/semana",
        "Guia completa de features que no conocias",
        "Webinar: mejores practicas con " + p,
      ],
      social: [
        "Case de exito: empresa que crecio 3x",
        "Rating G2: 4.7/5 estrellas",
        "Testimonial en video del CEO",
        "Numeros: +200 empresas activas",
      ],
      interactivo: [
        "Encuesta: que feature te gustaria ver?",
        "Demo en vivo este jueves - registrate",
        "Preguntale al equipo de producto",
        "Concurso: comparte tu uso creativo de " + p,
      ],
      bts: [
        "Un dia en el equipo de desarrollo",
        "Como construimos el roadmap de features",
        "El soporte detras de " + p,
        "Nuevas integraciones que estamos construyendo",
      ],
    },
    servicios: {
      promo: [
        "Diagnostico gratuito - solo 5 al mes",
        "Workshop de estrategia al 30% de descuento",
        "Referencia: trae un cliente, recibe 1 mes gratis",
        "Retainer anual con condiciones especiales",
      ],
      educativo: [
        "Los 3 errores mas comunes en tu industria",
        "Como calcular el ROI de " + p,
        "Guia: 5 metricas que debes rastrear",
        "Case study completo: de X a Y en 90 dias",
      ],
      social: [
        "Testimonio: empresa que triplico sus ventas",
        "Resultado del mes: numeros generados",
        "Resena de cliente B2B",
        "Antes y despues: metricas de un caso real",
      ],
      interactivo: [
        "Cual es tu mayor desafio? - Encuesta",
        "Quiz: estas listo para escalar tu negocio?",
        "Sesion de preguntas con un consultor",
        "Concurso: diagnostico express en vivo",
      ],
      bts: [
        "Un dia en Impulsala",
        "Como construimos estrategias para clientes",
        "El proceso detras de cada diagnostico",
        "Nuestro equipo de consultores",
      ],
    },
  };
  return data[ind]?.[type] || data.servicios[type] || [p];
}

/* ---- Projection generator ---- */
function generateProjection(
  industry: string,
  channelId: string,
  b: Benchmarks,
): { metric: string; value: string; detail: string }[] {
  const budget = b.budget;
  const metrics: { metric: string; value: string; detail: string }[] = [];

  if (channelId === "email") {
    const sends = 5000;
    const opens = Math.round(sends * b.emailOpen / 100);
    const clicks = Math.round(opens * b.emailCtr / 100);
    const conversions = Math.round(clicks * b.emailConv / 100);
    const revenue = conversions * b.aov;
    const roi = Math.round(((revenue - budget) / budget) * 100);
    metrics.push(
      { metric: "Envios mensuales", value: sends.toLocaleString(), detail: "Base recomendada para campana de email" },
      { metric: "Tasa de apertura", value: b.emailOpen + "%", detail: `Benchmark ${b.label}: ${b.emailOpen}%` },
      { metric: "Tasa de clics", value: b.emailCtr + "%", detail: `${opens.toLocaleString()} correos abiertos = ${clicks.toLocaleString()} clics` },
      { metric: "Conversiones/mes", value: conversions.toLocaleString(), detail: `${clicks} clics x ${b.emailConv}% conv = ${conversions} ventas` },
      { metric: "Ticket promedio", value: cop(b.aov), detail: `AOV benchmark para ${b.label}` },
      { metric: "Ingresos proyectados", value: cop(revenue), detail: `${conversions} ventas x ${cop(b.aov)}` },
      { metric: "ROI estimado", value: roi + "%", detail: `Ingresos ${cop(revenue)} - Inversion ${cop(budget)}` },
    );
  } else if (channelId === "tiktok") {
    const paidImpressions = Math.round(budget / b.ttCpm * 1000);
    const paidViews = Math.round(paidImpressions * 0.8);
    const engagements = Math.round(paidViews * b.ttEngagement / 100);
    const organicViews = 12 * 5000;
    const totalViews = paidViews + organicViews;
    const convRate = 1.5;
    const conversions = Math.round((engagements + organicViews * 0.01) * convRate / 100);
    const totalRevenue = conversions * b.aov;
    metrics.push(
      { metric: "Presupuesto mensual", value: cop(budget), detail: "Inversion recomendada para TikTok Ads" },
      { metric: "Impresiones pagadas", value: (paidImpressions / 1000).toFixed(0) + "K", detail: `${cop(budget)} / CPM ${cop(b.ttCpm)}` },
      { metric: "Engagement rate", value: b.ttEngagement + "%", detail: `Benchmark ${b.label} en TikTok: ${b.ttEngagement}%` },
      { metric: "Vistas organicas/mes", value: (organicViews / 1000).toFixed(0) + "K", detail: "12 posts x ~5.000 vistas promedio" },
      { metric: "Vistas totales/mes", value: (totalViews / 1000).toFixed(0) + "K", detail: "Pagadas + Organicas" },
      { metric: "Conversiones estimadas", value: conversions.toLocaleString(), detail: `De engagements + vistas organicas` },
      { metric: "Ingresos proyectados", value: cop(totalRevenue), detail: `${conversions} x ${cop(b.aov)} AOV` },
    );
  } else if (channelId === "instagram") {
    const posts = 15;
    const followers = 5000;
    const totalReach = Math.round(followers * posts * 0.7);
    const adImpressions = Math.round((budget * 0.6) / b.igCpm * 1000);
    const engagements = Math.round((totalReach + adImpressions) * b.igEngagement / 100);
    const linkClicks = Math.round(engagements * 0.15);
    const conversions = Math.round(linkClicks * 0.03);
    const totalRevenue = conversions * b.aov;
    metrics.push(
      { metric: "Alcance mensual (organico)", value: (totalReach / 1000).toFixed(0) + "K", detail: `15 posts x ~${(totalReach/posts/1000).toFixed(1)}K alcance promedio` },
      { metric: "Engagement rate", value: b.igEngagement + "%", detail: `Benchmark ${b.label} en Instagram: ${b.igEngagement}%` },
      { metric: "Impresiones pagadas", value: (adImpressions / 1000).toFixed(0) + "K", detail: `60% presupuesto en ads: ${cop(budget*0.6)}` },
      { metric: "Clics en link bio", value: linkClicks.toLocaleString(), detail: "~15% de engagements clican el link" },
      { metric: "Conversiones estimadas", value: conversions.toLocaleString(), detail: `~3% de clics convierten` },
      { metric: "Ingresos proyectados", value: cop(totalRevenue), detail: `Organico + Ads = ${conversions} ventas` },
    );
  } else {
    const clicks = Math.round(budget / b.gCpc);
    const conversions = Math.round(clicks * b.gConv / 100);
    const revenue = conversions * b.aov;
    const roi = Math.round(((revenue - budget) / budget) * 100);
    const cpl = Math.round(b.gCpc / (b.gConv / 100));
    metrics.push(
      { metric: "Presupuesto mensual", value: cop(budget), detail: "Inversion recomendada para Google Ads" },
      { metric: "CTR esperado", value: b.gCtr + "%", detail: `Benchmark ${b.label} en Search Ads: ${b.gCtr}%` },
      { metric: "CPC estimado", value: cop(b.gCpc), detail: `Costo por clic promedio para ${b.label}` },
      { metric: "Clics mensuales", value: clicks.toLocaleString(), detail: `${cop(budget)} / ${cop(b.gCpc)} CPC` },
      { metric: "Conversiones/mes", value: conversions.toLocaleString(), detail: `${clicks} clics x ${b.gConv}% conv` },
      { metric: "Costo por lead", value: cop(cpl), detail: `CPC / tasa de conversion` },
      { metric: "Ingresos proyectados", value: cop(revenue), detail: `${conversions} x ${cop(b.aov)} AOV` },
      { metric: "ROI estimado", value: roi + "%", detail: `Ingresos ${cop(revenue)} - Inversion ${cop(budget)}` },
    );
  }

  metrics.push(
    { metric: "Fuente de datos", value: b.source, detail: "Benchmarks actualizados 2024" },
  );

  return metrics;
}

/* ================================================================
   UI COMPONENT
   ================================================================ */

const TABS = [
  { id: "strategy", label: "Estrategia", icon: Target },
  { id: "email", label: "Email", icon: Mail },
  { id: "video", label: "Video/Guion", icon: Video },
  { id: "calendar", label: "Calendario 30 dias", icon: CalendarDays },
  { id: "projection", label: "Proyeccion", icon: BarChart3 },
];

const TYPE_COLORS: Record<string, string> = {
  Promo: "bg-amber-100 text-amber-700 border-amber-200",
  Educativo: "bg-blue-100 text-blue-700 border-blue-200",
  Social: "bg-green-100 text-green-700 border-green-200",
  Interactivo: "bg-purple-100 text-purple-700 border-purple-200",
  Bts: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function MarketingStrategyDemo() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [channel, setChannel] = useState("email");
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [activeTab, setActiveTab] = useState("strategy");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!product.trim() || !audience) return;
    const r = generateCampaign(product.trim(), audience, channel);
    setResult(r);
    setActiveTab("strategy");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Form */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Producto / Servicio
          </label>
          <input
            type="text"
            placeholder="Ej: Restaurante La Casa, SaaSFlow, Boutique Moda..."
            value={product}
            onChange={e => setProduct(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/50 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Audiencia Objetivo
          </label>
          <select
            value={audience}
            onChange={e => setAudience(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/50 transition-all"
          >
            <option value="">Selecciona...</option>
            {AUDIENCES.map(a => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Canal Principal
          </label>
          <select
            value={channel}
            onChange={e => setChannel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/30 focus:border-neon-purple/50 transition-all"
          >
            {CHANNELS.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!product.trim() || !audience}
        className="w-full sm:w-auto bg-gradient-to-r from-neon-purple to-purple-600 hover:from-neon-purple/90 hover:to-purple-600/90 text-white rounded-xl px-8 py-2.5 text-sm font-semibold shadow-lg shadow-purple-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generar Campana Completa
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Industry badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                {result.bench.label}
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 text-muted-foreground border border-slate-200">
                {result.bench.source}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const sel = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                      sel
                        ? "bg-neon-purple/10 text-neon-purple border-neon-purple/20 shadow-sm"
                        : "text-muted-foreground border-transparent hover:bg-slate-50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="min-h-[300px]">
              {activeTab === "strategy" && (
                <StrategyTab result={result} />
              )}
              {activeTab === "email" && (
                <EmailTab result={result} onCopy={handleCopy} copied={copied} />
              )}
              {activeTab === "video" && (
                <VideoTab result={result} />
              )}
              {activeTab === "calendar" && (
                <CalendarTab result={result} />
              )}
              {activeTab === "projection" && (
                <ProjectionTab result={result} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   TAB COMPONENTS
   ================================================================ */

function StrategyTab({ result }: { result: CampaignResult }) {
  const s = result.strategy;
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-neon-purple/5 to-purple-50/50 border border-neon-purple/10 p-4">
        <h4 className="text-sm font-bold text-neon-purple mb-1">Resumen</h4>
        <p className="text-sm text-foreground leading-relaxed">{s.summary}</p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Enfoque Estrategico</h4>
        <p className="text-sm text-foreground leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{s.approach}</p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">KPIs a Medir</h4>
        <div className="grid gap-2">
          {s.kpis.map((kpi, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              <Target className="w-3.5 h-3.5 text-neon-purple shrink-0" />
              <span>{kpi}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailTab({ result, onCopy, copied }: { result: CampaignResult; onCopy: (t: string) => void; copied: boolean }) {
  const e = result.email;
  const fullText = `Asunto: ${e.subject}\nPreheader: ${e.preheader}\n\n${e.body.join("\n")}`;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold">Email de Ventas Completo</h4>
        <button
          onClick={() => onCopy(fullText)}
          className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Asunto</div>
          <div className="text-sm font-semibold text-foreground mt-0.5">{e.subject}</div>
        </div>
        {e.preheader && (
          <div className="bg-slate-50/50 px-4 py-2 border-b border-dashed border-slate-200">
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Preheader</div>
            <div className="text-xs text-muted-foreground mt-0.5 italic">{e.preheader}</div>
          </div>
        )}
        <div className="px-4 py-4 space-y-2">
          {e.body.map((line, i) => (
            <p key={i} className={`text-sm leading-relaxed ${line.startsWith(">") ? "font-semibold text-foreground pl-2" : line.endsWith(":") ? "font-bold text-foreground mt-3" : "text-muted-foreground"}`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoTab({ result }: { result: CampaignResult }) {
  const v = result.video;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Plataforma</div>
          <div className="text-sm font-semibold mt-0.5">{v.platform}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Duracion</div>
          <div className="text-sm font-semibold mt-0.5">{v.duration}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Hook (gancho)</h4>
          <div className="rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-3 text-sm font-medium">{v.hook}</div>
        </div>
        <div>
          <h4 className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Cuerpo del video</h4>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm text-muted-foreground whitespace-pre-line">{v.body}</div>
        </div>
        <div>
          <h4 className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">CTA (llamado a la accion)</h4>
          <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-3 text-sm font-medium">{v.cta}</div>
        </div>
      </div>

      {v.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {v.hashtags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Tips de Produccion</h4>
        <div className="grid gap-1.5">
          {v.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarTab({ result }: { result: CampaignResult }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarDays className="w-3.5 h-3.5" />
        <span>Calendario de 30 dias - {result.calendar.length} actividades programadas</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto space-y-1.5 pr-1">
        {result.calendar.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-xs">
            <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-neon-purple shrink-0">
              {item.day}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${TYPE_COLORS[item.type] || "bg-slate-100 text-slate-500"}`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-muted-foreground">{item.channel}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed truncate">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectionTab({ result }: { result: CampaignResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-neon-purple/5 to-purple-50/50 border border-neon-purple/10 p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-neon-purple" />
          <h4 className="text-sm font-bold text-neon-purple">Proyeccion de Resultados</h4>
        </div>
        <p className="text-xs text-muted-foreground">
          Calculado con benchmarks reales de {result.bench.label} ({result.bench.source})
        </p>
      </div>

      <div className="grid gap-2">
        {result.projection.map((item, i) => {
          const isHighlight = i === result.projection.length - 2;
          return (
            <div
              key={i}
              className={`rounded-xl p-3 border ${
                isHighlight
                  ? "bg-gradient-to-r from-neon-purple/5 to-purple-50/30 border-neon-purple/15"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-muted-foreground">{item.metric}</span>
                <span className={`text-sm font-bold ${isHighlight ? "text-neon-purple" : "text-foreground"}`}>
                  {item.value}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}