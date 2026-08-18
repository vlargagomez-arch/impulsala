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
  Utensils,
  Home,
  Dumbbell,
  ShoppingBag,
  Scissors,
  GraduationCap,
  Stethoscope,
  Briefcase,
} from "lucide-react";

type ScriptType = "hook" | "reel" | "testimonio" | "tutorial" | "promocion";
type ServiceType = "general" | "web" | "seo" | "ads" | "ia";
type BusinessType =
  | "general"
  | "restaurante"
  | "inmobiliaria"
  | "gimnasio"
  | "retail"
  | "belleza"
  | "educacion"
  | "salud"
  | "profesional";

type Script = {
  id: string;
  type: ScriptType;
  service: ServiceType;
  business: BusinessType;
  title: string;
  duration: string;
  platform: string;
  hook: string;
  scenes: { time: string; visual: string; voiceover: string; textOverlay?: string }[];
  cta: string;
  hashtags: string[];
};

const SCRIPTS: Script[] = [
  // ===== GUIONES POR TIPO DE NEGOCIO: RESTAURANTE =====
  {
    id: "restaurante-web-1",
    type: "reel",
    service: "web",
    business: "restaurante",
    title: "Restaurantes: tu menú digital que vende por WhatsApp",
    duration: "35s",
    platform: "TikTok / Reels",
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
        voiceover: "Esto es lo que hicimos con Don XL en Villavicencio. El cliente arma su pedido paso a paso en la web: elige tipo, agregos, extras. Se envía solo por WhatsApp. Cero errores, cero llamadas perdidas.",
        textOverlay: "Pedido → WhatsApp automático",
      },
      {
        time: "15-25s",
        visual: "Estadísticas animadas: +380% pedidos WhatsApp, +28% ticket promedio, -60% tiempo de pedido.",
        voiceover: "Resultados: 380% más pedidos por WhatsApp. Ticket promedio subió 28% porque la gente agrega más cuando lo ve visual. Tiempo de pedido bajó 60%.",
        textOverlay: "+380% pedidos · +28% ticket",
      },
      {
        time: "25-35s",
        visual: "Dueño restaurante sonriendo con celular. Logo Impulsala + CTA.",
        voiceover: "Si tenés restaurante, cafetería o comida rápida, esto lo podés tener funcionando en 2 semanas. Videollamada gratis y te muestro tu caso.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Menú digital + WhatsApp: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Restaurantes", "#MenuDigital", "#PedidosWhatsApp", "#Bogota", "#Colombia", "#Impulsala", "#RestaurantesColombia"],
  },
  {
    id: "restaurante-ia-1",
    type: "tutorial",
    service: "ia",
    business: "restaurante",
    title: "Reservas automáticas 24/7 para restaurantes con IA",
    duration: "45s",
    platform: "Reels / YouTube Shorts",
    hook: "Mientras tu restaurante está cerrado a las 11pm, tus clientes quieren reservar. Si no respondés, se van a otro lado. Te muestro la solución.",
    scenes: [
      {
        time: "0-5s",
        visual: "Reloj 11pm. Mensaje WhatsApp entrante: 'Hola, quiero reservar mesa para 4 el sábado'. Nadie responde. Cliente va a otro restaurante.",
        voiceover: "Mientras tu restaurante está cerrado a las 11pm, tus clientes quieren reservar. Si no respondés, se van a otro lado. Te muestro la solución.",
        textOverlay: "Cliente perdido a las 11pm",
      },
      {
        time: "5-15s",
        visual: "Mismo mensaje entrando. Agente IA responde instantáneo: 'Hola! Tenemos mesas disponibles el sábado a las 8pm y 9:30pm. ¿Cuál preferís?'.",
        voiceover: "Agente de IA que responde a tus clientes 24/7. Reserva mesas, contesta preguntas del menú, toma pedidos. Incluso a las 3am del domingo.",
        textOverlay: "Reservas 24/7 con IA",
      },
      {
        time: "15-25s",
        visual: "Dashboard mostrando 47 reservas tomadas automáticamente esta semana. Calendario lleno.",
        voiceover: "Nuestros restaurantes atienden un promedio de 47 reservas por semana automáticamente. Vos dormís, la IA trabaja. Vos llegás al restaurante y ya tenés la agenda llena.",
        textOverlay: "47 reservas automáticas/semana",
      },
      {
        time: "25-35s",
        visual: "Captura: agente IA confirmando reserva, pidiendo nombre, teléfono, número de personas.",
        voiceover: "El agente confirma la reserva, pide nombre, teléfono y número de personas. Todo se guarda en tu sistema. Si el cliente no aparece, le mandás recordatorio automático.",
        textOverlay: "Confirmación + recordatorio",
      },
      {
        time: "35-45s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Demo gratis de 5 minutos. Te mostramos tu agente de IA funcionando. Agenda en impulsala.com o WhatsApp al 319 635 4992.",
        textOverlay: "Demo gratis → impulsala.com",
      },
    ],
    cta: "Agente IA para restaurantes: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Restaurantes", "#ReservasAutomaticas", "#IA", "#Chatbot", "#Bogota", "#Impulsala", "#RestaurantesColombia"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: INMOBILIARIA =====
  {
    id: "inmobiliaria-web-1",
    type: "reel",
    service: "web",
    business: "inmobiliaria",
    title: "Inmobiliarias: portal con +50.000 propiedades que carga en 200ms",
    duration: "40s",
    platform: "TikTok / Reels",
    hook: "Si tenés inmobiliaria y tu web no carga rápido, perdés clientes. Properati tiene 50.000 propiedades y carga en 200ms. Te muestro cómo lo hicimos.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona intentando buscar apartamento en web lenta. Se frustra, cierra. Cronómetro: 8 segundos.",
        voiceover: "Si tenés inmobiliaria y tu web no carga rápido, perdés clientes. Properati tiene 50.000 propiedades y carga en 200ms. Te muestro cómo lo hicimos.",
        textOverlay: "Web lenta = clientes perdidos",
      },
      {
        time: "5-15s",
        visual: "Captura: Properati cargando instantáneo. Mapa interactivo con miles de propiedades. Filtros: tipo, precio, ubicación, habitaciones.",
        voiceover: "Properati: portal inmobiliario con 50.000 propiedades. Mapa interactivo con clusterización inteligente. Filtros combinables: tipo, precio, ubicación, habitaciones, baños. Todo en 200 milisegundos.",
        textOverlay: "50.000 propiedades · 200ms carga",
      },
      {
        time: "15-25s",
        visual: "Captura del mapa: click en cluster, hace zoom, muestra propiedades individuales. Soporta 10.000 marcadores simultáneos.",
        voiceover: "Mapa con agrupación inteligente: si hay 100 propiedades juntas, las agrupa en un cluster. Hacés clic y hace zoom mostrando cada una. Soporta 10.000 marcadores sin trabarse.",
        textOverlay: "Clusterización inteligente",
      },
      {
        time: "25-35s",
        visual: "Captura: lead entra por web, se guarda en CRM automáticamente. Lead scoring automático.",
        voiceover: "Cada contacto se guarda en tu CRM automáticamente. El sistema califica el lead según propiedades vistas y tiempo en la web. Vos solo atendés los calientes.",
        textOverlay: "Lead scoring automático",
      },
      {
        time: "35-40s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "¿Tenés inmobiliaria? Agenda videollamada gratis y te mostramos cómo potenciar tu portal.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Portal inmobiliario + CRM: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Inmobiliaria", "#BienesRaices", "#PortalInmobiliario", "#Bogota", "#Colombia", "#Impulsala", "#Propiedades"],
  },
  {
    id: "inmobiliaria-ads-1",
    type: "testimonio",
    service: "ads",
    business: "inmobiliaria",
    title: "Raval Bienes Raíces: +420% leads calificados con Google Ads",
    duration: "50s",
    platform: "Reels / YouTube Shorts",
    hook: "Raval Bienes Raíces tenía 200 propiedades y pocas visitas. En 3 meses llegamos a 420% más leads calificados. Te cuento cómo.",
    scenes: [
      {
        time: "0-5s",
        visual: "Inmobiliaria con agentes aburridos, sin clientes. Estadística: pocas visitas.",
        voiceover: "Raval Bienes Raíces tenía 200 propiedades y pocas visitas. En 3 meses llegamos a 420% más leads calificados. Te cuento cómo.",
        textOverlay: "+420% leads calificados",
      },
      {
        time: "5-15s",
        visual: "Antes: anuncios genéricos sin segmentar. Después: anuncios hiper segmentados por ubicación, presupuesto, tipo propiedad.",
        voiceover: "Antes: anuncios genéricos que veía cualquiera. Después: segmentación precisa. Anuncio de apartamento en Chapinero lo ve solo quien busca en Chapinero con ese presupuesto. Cero plata desperdiciada.",
        textOverlay: "Segmentación precisa",
      },
      {
        time: "15-25s",
        visual: "Pantallazo Google Ads: CPC bajo, conversiones altas. ROI 3.2x.",
        voiceover: "Costo por lead bajó 60%. ROI de 3.2 pesos por cada peso invertido. Es decir: si invertís 1 millón, recuperás 3.2 millones en comisiones.",
        textOverlay: "ROI: 3.2x",
      },
      {
        time: "25-35s",
        visual: "Captura: landing pages específicas por tipo de propiedad (apartamento Bogotá, casa Medellín, finca suburbana).",
        voiceover: "Creamos landing pages específicas: si alguien busca 'apartamento arriendo Bogotá', aterriza en una página que muestra solo eso. No una home genérica. Conversión sube 4x.",
        textOverlay: "Landing pages específicas",
      },
      {
        time: "35-50s",
        visual: "Agente inmobiliario feliz, llamando a leads. Logo Impulsala + CTA.",
        voiceover: "Raval pasó de 350 a 1.800 operaciones en 2 años. Si tenés inmobiliaria y querés más leads calificados, agenda videollamada gratis con Impulsala.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Más leads inmobiliarios: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Inmobiliaria", "#GoogleAds", "#LeadsInmobiliarios", "#Bogota", "#Impulsala", "#CasoDeExito", "#MarketingInmobiliario"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: GIMNASIO =====
  {
    id: "gimnasio-web-1",
    type: "reel",
    service: "web",
    business: "gimnasio",
    title: "Gimnasios: web con plan de entrenamiento personalizado",
    duration: "35s",
    platform: "TikTok / Reels",
    hook: "Tu gimnasio pierde socios porque no les das seguimiento. Con una web bien hecha, cada socio recibe su plan automáticamente. Te muestro cómo.",
    scenes: [
      {
        time: "0-5s",
        visual: "Socio nuevo entrando al gimnasio, confundido. Nadie lo atiende. Se va.",
        voiceover: "Tu gimnasio pierde socios porque no les das seguimiento. Con una web bien hecha, cada socio recibe su plan automáticamente. Te muestro cómo.",
        textOverlay: "¿Socios que se van? Tu gimnasio pierde plata",
      },
      {
        time: "5-15s",
        visual: "Web móvil: socio nuevo completa formulario (objetivo, peso, días disponibles). Recibe plan automáticamente por email + WhatsApp.",
        voiceover: "Socio nuevo entra a tu web, completa su objetivo (bajar peso, ganar masa), peso y días disponibles. Recibe plan personalizado en su email y WhatsApp en 30 segundos. Sin que muevas un dedo.",
        textOverlay: "Plan automático en 30s",
      },
      {
        time: "15-25s",
        visual: "Captura: socio recibe recordatorio diario por WhatsApp: 'Hoy toca piernas, ¿vienes?'",
        voiceover: "Cada día recibe recordatorio por WhatsApp: 'Hoy toca piernas, ¿vienes?'. Si no responde, le seguimos al día siguiente. Resultado: 70% más retención de socios.",
        textOverlay: "+70% retención socios",
      },
      {
        time: "25-35s",
        visual: "Gimnasio lleno. Dueño contando plata. Logo Impulsala + CTA.",
        voiceover: "Más socios que se quedan = más plata. Más referidos = más socios nuevos. Si tenés gimnasio, crossfit box o studio de yoga, esto lo podés tener en 2 semanas. Videollamada gratis.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Web para gimnasios: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Gimnasio", "#Fitness", "#Crossfit", "#Bogota", "#Yoga", "#Impulsala", "#GimnasiosColombia"],
  },
  {
    id: "gimnasio-ia-1",
    type: "tutorial",
    service: "ia",
    business: "gimnasio",
    title: "Chatbot que resuelve dudas de tu gimnasio 24/7",
    duration: "40s",
    platform: "YouTube Shorts / Reels",
    hook: "Las preguntas que más te cansan en tu gimnasio: '¿cuánto cuesta?', '¿qué horarios?', '¿tienen parqueadero?'. Un chatbot las responde por vos. 24/7.",
    scenes: [
      {
        time: "0-5s",
        visual: "Persona en recepción respondiendo la misma pregunta por décima vez. Cara de cansancio.",
        voiceover: "Las preguntas que más te cansan en tu gimnasio: '¿cuánto cuesta?', '¿qué horarios?', '¿tienen parqueadero?'. Un chatbot las responde por vos. 24/7.",
        textOverlay: "Cansado de las mismas preguntas?",
      },
      {
        time: "5-15s",
        visual: "Captura: chatbot en web del gimnasio. Cliente pregunta, chatbot responde con info exacta (precios, horarios, ubicación, planes).",
        voiceover: "Chatbot inteligente en tu web y WhatsApp. Responde precios, horarios, ubicación, planes disponibles, clases del día. Conoce tu gimnasio mejor que vos.",
        textOverlay: "Responde: precios, horarios, planes",
      },
      {
        time: "15-25s",
        visual: "Captura: chatbot agendando clase de prueba automáticamente. Confirmación al cliente.",
        voiceover: "Si el cliente está interesado, le ofrece clase de prueba gratis. Agenda automáticamente. Le manda recordatorio el día anterior. Vos solo recibís al cliente nuevo en la puerta.",
        textOverlay: "Clase prueba automática",
      },
      {
        time: "25-35s",
        visual: "Dashboard: 38 clases de prueba agendadas este mes. 22 se convirtieron en socios.",
        voiceover: "Un gimnasio nuestro atiende 38 consultas al día automáticamente. 22 se convierten en socios pagos. Eso es $9 millones extra al mes en membresías.",
        textOverlay: "+$9M COP/mes extra",
      },
      {
        time: "35-40s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Si tenés gym, box o studio, esto lo podés tener en 2 semanas. Demo gratis en impulsala.com.",
        textOverlay: "Demo gratis → impulsala.com",
      },
    ],
    cta: "Chatbot para gimnasios: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Gimnasio", "#Chatbot", "#IA", "#Fitness", "#Bogota", "#Impulsala", "#MarketingFitness"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: RETAIL / TIENDA =====
  {
    id: "retail-web-1",
    type: "reel",
    service: "web",
    business: "retail",
    title: "Tiendas online que venden solas con e-commerce",
    duration: "30s",
    platform: "TikTok / Reels",
    hook: "Si vendés productos y no tenés tienda online, estás perdiendo 70% de tus ventas potenciales. Te muestro cómo se hace.",
    scenes: [
      {
        time: "0-3s",
        visual: "Persona en tienda física vendiendo. Cliente: '¿tienen tienda online?'. Vendedor: 'No'. Cliente se va.",
        voiceover: "Si vendés productos y no tenés tienda online, estás perdiendo 70% de tus ventas potenciales. Te muestro cómo se hace.",
        textOverlay: "¿Sin tienda online? -70% ventas",
      },
      {
        time: "3-12s",
        visual: "Captura: tienda online Impulsala. Catálogo de productos, carrito, checkout con Wompi/PayU.",
        voiceover: "Tienda online con catálogo, carrito de compras, checkout integrado con Wompi, PayU, Mercado Pago. Tus clientes compran a cualquier hora. Mientras vos dormís, vendés.",
        textOverlay: "E-commerce que vende 24/7",
      },
      {
        time: "12-22s",
        visual: "Captura: gestión de inventario automática. Stock baja solo cuando se vende.",
        voiceover: "Gestión de inventario automática: cuando alguien compra, el stock baja solo. Si te quedás sin stock, el producto se oculta. Nunca vendés algo que no tenés.",
        textOverlay: "Inventario automático",
      },
      {
        time: "22-30s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Tienda online lista en 2-4 semanas. Integrada con pasarelas colombianas. Videollamada gratis.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Tienda online: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#TiendaOnline", "#Ecommerce", "#Colombia", "#Bogota", "#VenderOnline", "#Impulsala", "#Wompi"],
  },
  {
    id: "retail-ads-1",
    type: "hook",
    service: "ads",
    business: "retail",
    title: "Vendé más con catálogos en Meta Ads",
    duration: "25s",
    platform: "TikTok / Reels",
    hook: "¿Sabías que podés mostrar TODO tu catálogo en un solo anuncio de Facebook? Y Facebook elige automáticamente qué producto mostrar a cada persona.",
    scenes: [
      {
        time: "0-5s",
        visual: "Mosaico animado de 100 productos. Pasa a un anuncio único que se adapta a cada usuario.",
        voiceover: "¿Sabías que podés mostrar TODO tu catálogo en un solo anuncio de Facebook? Y Facebook elige automáticamente qué producto mostrar a cada persona.",
        textOverlay: "1 anuncio → 100 productos",
      },
      {
        time: "5-15s",
        visual: "Usuario A ve zapatos. Usuario B ve camisetas. Usuario C ve pantalones. Mismo anuncio, distintos productos.",
        voiceover: "A Juan le muestra zapatos porque vio zapatos ayer. A María le muestra camisetas porque le gustan. A Pedro pantalones. Mismo anuncio, productos distintos. Por persona.",
        textOverlay: "Anuncios personalizados por persona",
      },
      {
        time: "15-25s",
        visual: "Estadísticas: +180% conversión, -60% costo por venta. Logo Impulsala.",
        voiceover: "Resultado: 180% más conversión, 60% menos costo por venta. Si tenés tienda con productos, esto es obligatorio. Agenda videollamada gratis.",
        textOverlay: "+180% conversión → impulsala.com",
      },
    ],
    cta: "Catálogos en Meta Ads: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#MetaAds", "#FacebookAds", "#Ecommerce", "#Retail", "#Bogota", "#Impulsala", "#TiendaOnline"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: BELLEZA / SPA =====
  {
    id: "belleza-web-1",
    type: "reel",
    service: "web",
    business: "belleza",
    title: "Spa y peluquerías: reservas online que llenan tu agenda",
    duration: "30s",
    platform: "TikTok / Reels",
    hook: "Tu peluquería o spa pierde clientes porque contestás tarde el WhatsApp. Con reservas online automáticas, llenás tu agenda sin mover un dedo.",
    scenes: [
      {
        time: "0-3s",
        visual: "Mujer cortándose el pelo ella misma.Texto: 'No pudo reservar'.",
        voiceover: "Tu peluquería o spa pierde clientes porque contestás tarde el WhatsApp. Con reservas online automáticas, llenás tu agenda sin mover un dedo.",
        textOverlay: "Cliente perdida = -1 reserva",
      },
      {
        time: "3-12s",
        visual: "Captura: web con calendario de horarios disponibles. Cliente elige servicio + hora + profesional. Reserva confirmada.",
        voiceover: "Calendario online en tu web. La cliente elige servicio, horario y profesional. Reserva confirmada al instante. Se le manda recordatorio por WhatsApp 2 horas antes.",
        textOverlay: "Reservas 24/7 automáticas",
      },
      {
        time: "12-22s",
        visual: "Captura: dashboard de reservas con agenda llena. Reducción de no-shows.",
        voiceover: "Reducción del 80% en no-shows. Cuando la cliente recibe recordatorio por WhatsApp, casi nunca falta. Tu agenda siempre llena, tu caja siempre arriba.",
        textOverlay: "-80% no-shows",
      },
      {
        time: "22-30s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Si tenés spa, peluquería, barbería o nail bar, esto lo tenés en 2 semanas. Videollamada gratis.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Reservas online para spa/peluquería: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Spa", "#Peluqueria", "#ReservasOnline", "#Bogota", "#Belleza", "#Impulsala", "#Barberia"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: EDUCACIÓN =====
  {
    id: "educacion-web-1",
    type: "tutorial",
    service: "web",
    business: "educacion",
    title: "Colegios y academias: web con matrículas online",
    duration: "40s",
    platform: "Reels / YouTube Shorts",
    hook: "Tu colegio o academia pierde matrículas porque el proceso es engorroso. Con matrículas online, duplicás inscripciones.",
    scenes: [
      {
        time: "0-5s",
        visual: "Padre frustrado llenando formularios en papel. Luego fila para pagar.",
        voiceover: "Tu colegio o academia pierde matrículas porque el proceso es engorroso. Con matrículas online, duplicás inscripciones.",
        textOverlay: "Matrículas engorrosas = -50% inscripciones",
      },
      {
        time: "5-15s",
        visual: "Captura: web con formulario de matrícula online. Padre completa en 5 minutos desde casa. Paga con Wompi.",
        voiceover: "Formulario de matrícula online. Padre lo completa en 5 minutos desde casa. Adjunta documentos, paga matrícula con Wompi. Todo guardado en tu sistema.",
        textOverlay: "Matrícula en 5 minutos",
      },
      {
        time: "15-25s",
        visual: "Captura: panel de control con todas las matrículas. Comunicación automática con padres.",
        voiceover: "Panel donde ves todas las matrículas, pagos pendientes, documentos. Comunicación automática con padres por email y WhatsApp: recordatorios, notificaciones, calificaciones.",
        textOverlay: "Panel de control + comunicación",
      },
      {
        time: "25-35s",
        visual: "Estadísticas: +120% matrículas, -90% tiempo administrativo, +95% satisfacción padres.",
        voiceover: "Resultados: 120% más matrículas, 90% menos tiempo administrativo, 95% satisfacción de padres. Tu personal se enfoca en enseñar, no en papeleo.",
        textOverlay: "+120% matrículas · -90% papeleo",
      },
      {
        time: "35-40s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Si tenés colegio, academia, curso online o instituto, esto lo tenés en 3 semanas. Videollamada gratis.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Matrículas online para educación: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Educacion", "#Colegios", "#Academias", "#Bogota", "#Colombia", "#Impulsala", "#Matriculas"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: SALUD =====
  {
    id: "salud-web-1",
    type: "reel",
    service: "web",
    business: "salud",
    title: "Clínicas y consultorios: citas online + historia clínica digital",
    duration: "35s",
    platform: "Reels / YouTube Shorts",
    hook: "Tu clínica pierde pacientes porque el WhatsApp no lo atendés rápido. Con citas online + historia clínica digital, automatizás todo.",
    scenes: [
      {
        time: "0-5s",
        visual: "Paciente con dolor llamando a clínica. Nadie contesta. Paciente va a otra clínica.",
        voiceover: "Tu clínica pierde pacientes porque el WhatsApp no lo atendés rápido. Con citas online + historia clínica digital, automatizás todo.",
        textOverlay: "Paciente perdido = -$200.000 COP",
      },
      {
        time: "5-15s",
        visual: "Captura: web de clínica con calendario de disponibilidad por médico. Paciente elige hora, especialista, reason de consulta.",
        voiceover: "Calendario online con disponibilidad por médico. Paciente elige especialista, hora y motivo de consulta. Se le manda confirmación y recordatorio.",
        textOverlay: "Citas online 24/7",
      },
      {
        time: "15-25s",
        visual: "Captura: historia clínica digital. Doctor ve antecedentes, recetas anteriores, alergias.",
        voiceover: "Historia clínica digital: antecedentes, medicamentos, alergias, recetas anteriores. Tu doctor entra y tiene todo el contexto. Cero papel, cero pérdidas.",
        textOverlay: "Historia clínica digital",
      },
      {
        time: "25-35s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Si tenés clínica, consultorio, odontólogo o veterinaria, esto lo tenés en 4 semanas. Cumple normatividad de protección de datos. Videollamada gratis.",
        textOverlay: "Videollamada gratis → impulsala.com",
      },
    ],
    cta: "Citas + historia clínica digital: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Clinica", "#Salud", "#CitasOnline", "#Bogota", "#Medicos", "#Impulsala", "#HistoriaClinica"],
  },

  // ===== GUIONES POR TIPO DE NEGOCIO: PROFESIONAL (abogado, contador, etc) =====
  {
    id: "profesional-seo-1",
    type: "tutorial",
    service: "seo",
    business: "profesional",
    title: "Abogados: cómo aparecer primero en Google cuando buscan tus servicios",
    duration: "50s",
    platform: "YouTube Shorts / Reels",
    hook: "Si sos abogado, contador o arquitecto y no aparecés en Google cuando alguien busca tu servicio, estás perdiendo clientes. Te muestro cómo aparecer primero.",
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
        voiceover: "Tres cosas: 1) Investigar qué buscan tus clientes (ej: 'abogado divorcios Bogotá'). 2) Crear contenido optimizado para esas keywords. 3) Conseguir links de otros sitios que te mencionen.",
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
        visual: "Estadísticas: +210% tráfico orgánico, 78% aparece en top 3 Google.",
        voiceover: "Resultados: 210% más tráfico orgánico. 78% de las keywords en top 3 de Google. Es decir: 8 de cada 10 búsquedas, aparecemos primeros.",
        textOverlay: "+210% tráfico · 78% top 3 Google",
      },
      {
        time: "35-50s",
        visual: "Logo Impulsala + CTA.",
        voiceover: "Si sos profesional independiente, agenda auditoría SEO gratis. Te decimos qué están buscando tus clientes y cómo aparecer primero.",
        textOverlay: "Auditoría gratis → impulsala.com",
      },
    ],
    cta: "SEO para profesionales: impulsala.com · WhatsApp: 319 635 4992",
    hashtags: ["#Abogados", "#Contadores", "#SEO", "#Bogota", "#Profesionales", "#Impulsala", "#Google"],
  },

  // ===== GUIONES BRAND / GENERAL (mantener algunos existentes) =====
  {
    id: "brand-1",
    type: "promocion",
    service: "general",
    business: "general",
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
        textOverlay: "4.9/5 estrellas",
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
    business: "general",
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

const BUSINESS_LABELS: Record<BusinessType, string> = {
  general: "General",
  restaurante: "Restaurantes",
  inmobiliaria: "Inmobiliarias",
  gimnasio: "Gimnasios / Fitness",
  retail: "Tiendas / Retail",
  belleza: "Spa / Peluquería",
  educacion: "Educación",
  salud: "Salud / Clínicas",
  profesional: "Profesionales",
};

const BUSINESS_ICONS: Record<BusinessType, React.ComponentType<{ className?: string }>> = {
  general: Sparkles,
  restaurante: Utensils,
  inmobiliaria: Home,
  gimnasio: Dumbbell,
  retail: ShoppingBag,
  belleza: Scissors,
  educacion: GraduationCap,
  salud: Stethoscope,
  profesional: Briefcase,
};

const SERVICE_ICONS: Record<ServiceType, React.ComponentType<{ className?: string }>> = {
  general: Sparkles,
  web: Code2,
  seo: Search,
  ads: Megaphone,
  ia: Bot,
};

const TYPE_LABELS: Record<ScriptType, string> = {
  hook: "Hook (15-25s)",
  reel: "Reel completo (30s)",
  testimonio: "Testimonio cliente",
  tutorial: "Tutorial educativo",
  promocion: "Promoción marca",
};

export function CrmMarketing() {
  const [filterService, setFilterService] = useState<ServiceType | "all">("all");
  const [filterBusiness, setFilterBusiness] = useState<BusinessType | "all">("all");
  const [filterType, setFilterType] = useState<ScriptType | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = SCRIPTS.filter((s) => {
    if (filterService !== "all" && s.service !== filterService) return false;
    if (filterBusiness !== "all" && s.business !== filterBusiness) return false;
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
    text += `Servicio: ${SERVICE_LABELS[script.service]} | Negocio: ${BUSINESS_LABELS[script.business]}\n\n`;
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
              Guiones por tipo de negocio y servicio. TikTok, Reels, YouTube Shorts. Copialos y dáselos a Hermes.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            {SCRIPTS.length} guiones
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase className="w-3.5 h-3.5 text-violet-400" />
            8 tipos de negocio
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
            4 servicios
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            20s a 60s
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Tipo de negocio
          </label>
          <select
            value={filterBusiness}
            onChange={(e) => setFilterBusiness(e.target.value as BusinessType | "all")}
            className="w-full px-3 py-2 bg-card/60 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
          >
            <option value="all">Todos los negocios</option>
            {(Object.keys(BUSINESS_LABELS) as BusinessType[]).map((b) => (
              <option key={b} value={b}>
                {BUSINESS_LABELS[b]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Servicio
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
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Tipo de video
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
            const ServiceIcon = SERVICE_ICONS[script.service];
            const BizIcon = BUSINESS_ICONS[script.business];
            const isExpanded = expandedId === script.id;
            const isCopied = copiedId === script.id;
            return (
              <div
                key={script.id}
                className="backdrop-blur-xl bg-card/60 border border-border/50 rounded-2xl overflow-hidden transition-all hover:border-fuchsia-500/40"
              >
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : script.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <BizIcon className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-400">
                          {BUSINESS_LABELS[script.business]}
                        </span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <ServiceIcon className="w-3.5 h-3.5 text-fuchsia-400 flex-shrink-0" />
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

                {/* Hook preview */}
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
          <li>Elegí el tipo de negocio que querés promocionar (restaurante, inmobiliaria, etc.)</li>
          <li>Elegí el servicio (web, SEO, Ads, IA)</li>
          <li>Hacé clic en el guion para expandirlo y ver todas las escenas</li>
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
