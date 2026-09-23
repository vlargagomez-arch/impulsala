/**
 * Cerebro comercial de Impulsala: datos verificados del negocio que TODOS los
 * agentes comparten. Si algo no está aquí, el agente debe decir que lo confirma
 * el equipo — nunca inventar precios, plazos ni casos de éxito.
 */

export const BUSINESS = {
  nombre: "Impulsala",
  tagline: "Impulsa tu negocio al siguiente nivel",
  ciudad: "Bogotá, Colombia",
  cobertura: "Colombia y LATAM (100% remoto)",
  whatsapp: "573196354992",
  whatsappHumano: "https://wa.me/573196354992",
  email: "contacto@impulsala.com",
  horario: "Lunes a viernes, 8:00 a.m. - 6:00 p.m. (hora Colombia)",
  cita: "Videollamada gratuita de 30 minutos con diagnóstico incluido",
  garantia: "Resultados medibles en 30 días o devolución del dinero",
} as const;

export const SERVICES = [
  {
    id: "desarrollo-web",
    nombre: "Desarrollo y rediseño web",
    que: "Páginas y tiendas ultra rápidas (Next.js, WordPress, Shopify, Wix) optimizadas para convertir visitantes en clientes.",
    incluye: [
      "Diseño UX/UI a medida y 100% móvil",
      "Velocidad y Core Web Vitals en verde",
      "SEO técnico base + datos estructurados",
      "Formularios y WhatsApp integrados",
      "Panel para que edites tu contenido",
    ],
    desde: "planes desde $500.000 COP (según alcance)",
    plazo: "Proyectos típicos: 1 a 3 semanas",
    url: "/servicios/desarrollo-web",
  },
  {
    id: "seo",
    nombre: "SEO y posicionamiento en Google",
    que: "Auditoría técnica, contenidos y autoridad para aparecer primero cuando tu cliente busca lo que vendes.",
    incluye: [
      "Auditoría técnica + palabras clave reales",
      "Corrección de errores que frenan tu ranking",
      "Contenido optimizado y Google Business Profile",
      "Reportes mensuales de posiciones y tráfico",
    ],
    desde: "diagnóstico gratuito y propuesta según competencia",
    plazo: "Primeros movimientos en 4-8 semanas; resultados sólidos a 3-6 meses",
    url: "/servicios/seo",
  },
  {
    id: "publicidad-digital",
    nombre: "Publicidad digital (Google, Meta y TikTok Ads)",
    que: "Campañas que traen clientes medibles, no clics. Optimizamos costo por lead y calidad del prospecto.",
    incluye: [
      "Estrategia, públicos y creativos",
      "Landing de conversión",
      "Medición con GA4 y eventos de WhatsApp",
      "Optimización semanal del costo por lead",
    ],
    desde: "inversión publicitaria + honorarios según presupuesto",
    plazo: "Datos útiles desde la primera semana",
    url: "/servicios/publicidad-digital",
  },
  {
    id: "automatizacion-ia",
    nombre: "Automatización con IA y agentes 24/7",
    que: "Agentes de IA que atienden, califican y agendan clientes todos los días, y automatizaciones que eliminan trabajo manual.",
    incluye: [
      "Agente de IA en la web (como el que estás usando ahora)",
      "Respuestas y agendamiento automático 24/7",
      "Integración con WhatsApp, CRM y calendario",
      "Reportes automáticos para el dueño del negocio",
    ],
    desde: "planes mensuales según volumen de conversaciones",
    plazo: "Implementación: 3 a 7 días",
    url: "/servicios/automatizacion-ia",
  },
] as const;

export const PROCESS = [
  "Diagnóstico gratis de 30 min: revisamos tu web, tus números y tus competidores.",
  "Propuesta clara con alcance, precio y fechas (sin letra pequeña).",
  "Ejecución con avances cada semana y un solo punto de contacto.",
  "Medición de resultados y ajustes. Si no hay resultados medibles en 30 días, devolvemos el dinero.",
];

export const FAQ = [
  {
    q: "¿Trabajan con webs hechas en WordPress, Wix o Shopify?",
    a: "Sí. Rediseñamos sitios existentes mejorando velocidad, SEO, diseño UX/UI y conversión, y migramos el contenido sin perder posicionamiento.",
  },
  { q: "¿Atienden fuera de Bogotá?", a: "Sí, trabajamos 100% remoto en toda Colombia y LATAM." },
  { q: "¿Cómo se paga?", a: "Se define en la propuesta: normalmente un anticipo para arrancar y el saldo contra entrega. Aceptamos transferencia y pasarelas digitales." },
  { q: "¿Quién es el dueño de mi web?", a: "Tú. Dominio, hosting y accesos quedan a tu nombre." },
  { q: "¿En cuánto tiempo veo resultados?", a: "Con publicidad y automatización, datos desde la primera semana. El SEO orgánico toma de 1 a 2 meses en mostrar movimientos y 3 a 6 meses para resultados sólidos." },
];

export const DIFFERENTIATORS = [
  "Un solo proveedor para web, SEO, pauta y automatización con IA.",
  "Medimos todo: sin reportes, no hay promesas.",
  "Garantía de 30 días con resultados medibles.",
  "Atención directa por WhatsApp, sin call centers.",
];

/** Resumen compacto del negocio para inyectar en el prompt (ahorra tokens). */
export function knowledgeDigest(): string {
  const servicios = SERVICES.map(
    (s) => `- ${s.nombre}: ${s.que} Incluye: ${s.incluye.join("; ")}. Inversión: ${s.desde}. Tiempo: ${s.plazo}.`,
  ).join("\n");
  const faq = FAQ.map((f) => `- P: ${f.q} R: ${f.a}`).join("\n");

  return [
    `NEGOCIO: ${BUSINESS.nombre} — agencia de ${BUSINESS.ciudad}. ${BUSINESS.tagline}.`,
    `Cobertura: ${BUSINESS.cobertura}. Horario de atención humana: ${BUSINESS.horario}.`,
    `WhatsApp humano: +${BUSINESS.whatsapp} (${BUSINESS.whatsappHumano}).`,
    `Oferta principal: ${BUSINESS.cita}. Garantía: ${BUSINESS.garantia}.`,
    `SERVICIOS:\n${servicios}`,
    `PROCESO:\n${PROCESS.map((p, i) => `${i + 1}. ${p}`).join("\n")}`,
    `PREGUNTAS FRECUENTES:\n${faq}`,
    `DIFERENCIALES:\n${DIFFERENTIATORS.map((d) => `- ${d}`).join("\n")}`,
  ].join("\n\n");
}

/** Reglas que ningún agente de cara al cliente puede romper. */
export const GUARDRAILS = [
  "Responde SIEMPRE en español neutro colombiano, cercano y profesional. Nunca en inglés.",
  "Escribe como una persona por WhatsApp: 2 a 5 líneas por mensaje, sin bullets eternos, sin markdown pesado.",
  "NUNCA inventes precios exactos, plazos, garantías, casos de éxito, nombres de clientes ni cifras. Si no está en el conocimiento, di que lo confirmas con el equipo y ofrece agendar.",
  "Nunca prometas resultados garantizados de posicionamiento ni de ventas.",
  "Tu meta es agendar la videollamada gratuita de 30 minutos o dejar el contacto del prospecto (nombre, teléfono y correo) en el CRM.",
  "Pide los datos de a UNO por mensaje, de forma natural, no como formulario.",
  "Si el prospecto pide hablar con una persona, comparte el WhatsApp +57 319 635 4992 de inmediato.",
  "Si no sabes algo, dilo y ofrece pasar con el equipo humano. No rellenes con relleno.",
  "Nunca menciones que eres un modelo, ni 'DeepSeek', ni 'GPT'. Eres el asistente virtual de Impulsala.",
].join("\n- ");
