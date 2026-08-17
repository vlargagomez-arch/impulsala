"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Bot, User, Sparkles, Zap, TrendingUp, Clock, CheckCircle2, Calendar, User2, Mail, Phone, Building2, Loader2, X, MessageSquare } from "lucide-react";

/* ============================================================
   TIPOS
   ============================================================ */
type MsgRole = "bot" | "user";

type Metric = { label: string; value: string };
type ListBlock = { title: string; items: string[] };

type Msg = {
  role: MsgRole;
  text: string;
  metrics?: Metric[];
  list?: ListBlock[];
  suggestions?: string[];
  formField?: FormField;
  bookingConfirmation?: BookingData;
  bookingReview?: BookingData;
  showBackToStart?: boolean;
};

type FormField = {
  field: "name" | "email" | "phone" | "hasBusiness" | "datetime" | "consent" | null;
  label: string;
  placeholder: string;
  icon: "user" | "mail" | "phone" | "building";
  inputType: "text" | "email" | "tel" | "select" | "datetime" | "consent";
  options?: string[];
};

type BookingData = {
  name: string;
  email: string;
  phone: string;
  hasBusiness: string;
  datetime?: string;
  consent?: string;
  service?: string;
};

type ConversationMode = "general" | "booking" | "diagnostic";

/* ============================================================
   RESPUESTAS PREDEFINIDAS
   ============================================================ */
const QUICK_PROMPTS = [
  "Quiero agendar una cita",
  "¿Qué servicios ofrecen?",
];

const RESPONSES: Record<string, Msg> = {
  "¿qué servicios ofrecen?": {
    role: "bot",
    text: "En Impulsala hacemos crecer tu negocio con 4 servicios diseñados para traerte resultados reales:\n\n• Páginas Web & Software — Webs rápidas que venden por ti, CRM y software a medida\n• SEO — Posicionamiento en Google para que te encuentren cuando buscan lo que ofreces\n• Campañas Publicitarias — Google, Meta y TikTok Ads que reducen tu costo por cliente\n• Automatización con IA — Chatbots y flujos automáticos que trabajan 24/7\n\n¿Qué necesitas específicamente?",
    metrics: [
      { label: "Proyectos", value: "40+" },
      { label: "ROI promedio", value: "340%" },
      { label: "Respuesta", value: "< 2h" },
    ],
    suggestions: ["Quiero una página web", "Necesito un CRM", "Quiero un software", "Quiero mejorar mis campañas publicitarias", "Quiero una automatización", "Necesito mejorar mi SEO", "Quiero agendar una cita"],
  showBackToStart: true,
  },
  "quiero una página web": {
    role: "bot",
    text: "Construimos páginas web que no solo se ven increíbles, sino que convierten visitantes en clientes. Tu web será tu mejor vendedor, trabajando las 24 horas, los 7 días de la semana.\n\n• Diseño responsive impecable en celular, tablet y desktop\n• Carga en menos de 2 segundos (Google lo premia con mejores posiciones)\n• SEO técnico incluido desde el día uno\n• Integración directa con WhatsApp, email y calendario\n• Optimizada para vender, no solo para verse bonita\n• Analytics y métricas para medir cada peso que entra",
    metrics: [
      { label: "Velocidad", value: "<2s" },
      { label: "Conversión", value: "+180%" },
      { label: "Mobile", value: "100%" },
    ],
    suggestions: ["Agendar cita para mi página web"],
  showBackToStart: true,
  },
  "necesito un crm": {
    role: "bot",
    text: "Diseñamos CRM a medida que automatizan la operación de tu negocio. Imagina tener todas tus citas, leads, clientes y recordatorios en un solo panel, sin perder ningún cliente por falta de seguimiento.\n\n• Gestiona citas, leads y clientes desde un solo panel\n• Recordatorios automáticos por email y WhatsApp\n• Campañas de email masivas con un clic\n• Reportes en tiempo real para tomar mejores decisiones\n• Integración con WhatsApp, Google Calendar y más\n• Nunca más pierdas un cliente por no dar seguimiento\n\nRecupera horas de trabajo manual cada semana y enfócate en lo que importa: cerrar ventas.",
    metrics: [
      { label: "Horas ahorradas", value: "80h/mes" },
      { label: "Seguimiento", value: "100%" },
      { label: "Conversión", value: "+45%" },
    ],
    suggestions: ["Agendar cita para mi CRM"],
  showBackToStart: true,
  },
  "quiero un software": {
    role: "bot",
    text: "Desarrollamos software a medida que se adapta exactamente a cómo funciona tu negocio. Deja de pelear con herramientas genéricas que no entienden tu operación: nosotros construimos la solución perfecta para ti.\n\n• Sistemas internos y plataformas a tu medida\n• E-commerce y apps web con experiencia premium\n• Integraciones con las APIs que ya usas\n• Si lo imaginas, lo programamos\n• Soporte continuo y mejoras constantes\n• Escalable: crece con tu negocio\n\nSoftware que se adapta a ti, no al revés. Tu negocio merece herramientas que trabajen a tu ritmo.",
    metrics: [
      { label: "Proyectos", value: "40+" },
      { label: "Tecnologías", value: "15+" },
      { label: "Soporte", value: "24/7" },
    ],
    suggestions: ["Agendar cita para mi software"],
  showBackToStart: true,
  },
  "quiero mejorar mis campañas publicitarias": {
    role: "bot",
    text: "Optimizamos tus campañas en Google Ads, Meta Ads (Facebook e Instagram), TikTok Ads y YouTube Ads para que cada peso invertido genere retornos. Más clientes por menos dinero, sin gastos desperdiciados.\n\n• Reducimos tu costo por lead hasta en un 60%\n• Multiplicamos resultados con el mismo presupuesto\n• Segmentación precisa de tu cliente ideal\n• Anuncios con copy creativo que detiene el scroll\n• Reportes claros y transparentes cada mes\n• Optimización continua basada en datos reales\n\nEn 2 a 4 semanas vas a ver cómo tus campañas empiezan a generar resultados reales.",
    metrics: [
      { label: "Costo/lead", value: "-60%" },
      { label: "ROI", value: "3.2x" },
      { label: "Plataformas", value: "4+" },
    ],
    suggestions: ["Agendar cita para mis campañas publicitarias"],
  showBackToStart: true,
  },
  "quiero una automatización": {
    role: "bot",
    text: "Automatizamos los procesos repetitivos de tu negocio con IA que trabaja sin descanso. Imagina ahorrar cientos de horas al mes en tareas manuales, mientras un chatbot atiende a tus clientes 24/7 y un agente de IA califica tus leads automáticamente.\n\n• Chatbots inteligentes que atienden a tus clientes 24/7\n• Flujos automatizados que conectan tus herramientas\n• Publicación automática en redes sociales\n• Agentes de venta con IA que califican leads\n• Integraciones con WhatsApp, email y CRM\n• Reportes automáticos de productividad\n\nPromedio: 120 horas ahorradas al mes por cliente. Es como tener 3 empleados extra sin pagar su sueldo.",
    metrics: [
      { label: "Horas ahorradas", value: "120h/mes" },
      { label: "Operación", value: "24/7" },
      { label: "Implementación", value: "2-4 sem" },
    ],
    suggestions: ["Agendar cita para mi automatización con IA"],
  showBackToStart: true,
  },
  "necesito mejorar mi seo": {
    role: "bot",
    text: "Te posicionamos en las primeras posiciones de Google para que tus clientes te encuentren cuando ya están listos para comprar. Imagina esto: alguien busca lo que ofrecés, y aparecés vos primero. Esa es la magia del SEO bien hecho.\n\n• Auditoría técnica completa de tu web\n• Optimización on-page con las keywords correctas\n• Estrategia off-page con autoridad real\n• Contenido optimizado que Google premia\n• Linkbuilding ético y sostenible\n• Reportes claros cada mes con resultados medibles\n\nResultados visibles en 3 a 6 meses. Tu negocio aparecerá justo cuando alguien busca lo que ofreces.",
    metrics: [
      { label: "Top 3 Google", value: "78%" },
      { label: "Más tráfico", value: "+210%" },
      { label: "Keywords", value: "45+" },
    ],
    suggestions: ["Agendar cita para mi SEO"],
  showBackToStart: true,
  },
  "¿cuánto tiempo toma ver resultados?": {
    role: "bot",
    text: "Depende del servicio, pero estos son los tiempos típicos:\n\n• Campañas Ads: primeros resultados desde la semana 2\n• SEO: mejoras visibles en 3 a 6 meses\n• Automatización con IA: ahorra tiempo desde la semana 1\n• Páginas Web: entregadas en 2 a 4 semanas\n\nCada caso es único. En tu cita gratuita te damos un timeline exacto según tu industria y objetivo.",
    metrics: [
      { label: "Ads", value: "2-4 sem" },
      { label: "SEO", value: "3-6 mes" },
      { label: "Automatización", value: "1 sem" },
    ],
    suggestions: ["Quiero agendar una cita"],
  showBackToStart: true,
  },
  default: {
    role: "bot",
    text: "💬 Puedo ayudarte con información detallada sobre nuestros servicios o agendarte una videollamada gratuita de 30 minutos con nuestro equipo. ¿Qué necesitas?",
    suggestions: ["Quiero agendar una cita", "¿Qué servicios ofrecen?"],
  showBackToStart: true,
  },
};

const BOOKING_STEPS: FormField[] = [
  { field: "name", label: "¿Cómo te llamas?", placeholder: "Ej: María López", icon: "user", inputType: "text" },
  { field: "email", label: "¿Cuál es tu correo electrónico?", placeholder: "Ej: maria@email.com", icon: "mail", inputType: "email" },
  { field: "phone", label: "¿Cuál es tu número de WhatsApp/teléfono?", placeholder: "Ej: 319 635 4992", icon: "phone", inputType: "tel" },
  {
    field: "hasBusiness",
    label: "¿Tienes un negocio actualmente?",
    placeholder: "Selecciona una opción",
    icon: "building",
    inputType: "select",
    options: ["Sí, tengo un negocio", "Soy emprendedor", "Trabajo en una empresa", "Aún no tengo negocio"],
  },
  {
    field: "datetime",
    label: "¿Qué horario te queda mejor para la videollamada de 30 minutos?",
    placeholder: "Selecciona un horario disponible",
    icon: "building",
    inputType: "datetime",
  },
];

const INITIAL_MESSAGE: Msg = {
  role: "bot",
  text: "🤝 ¡Hola! Soy ImpulsalaBot, tu asistente en Impulsala.\n\nQué bueno que estás por aquí. Estoy para ayudarte a hacer crecer tu negocio: te puedo contar sobre nuestros servicios o agendarte una videollamada gratuita de 30 minutos con nuestro equipo, donde revisamos tu caso y te damos una propuesta personalizada.\n\n¿En qué te puedo ayudar hoy?",
  suggestions: QUICK_PROMPTS,
};

function normalize(text: string) {
  return text.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()\-.]{7,20}$/;

function validateField(field: FormField, value: string): string | null {
  const v = value.trim();
  if (!v) return "Este campo es obligatorio";
  if (field.field === "email" && !EMAIL_RE.test(v)) return "Email inválido. Ej: maria@email.com";
  if (field.field === "phone" && !PHONE_RE.test(v)) return "Teléfono inválido. Ej: 319 635 4992";
  if (field.field === "name" && v.length < 2) return "Tu nombre debe tener al menos 2 caracteres";
  return null;
}

function pickGeneralResponse(input: string): Msg {
  const n = normalize(input);
  for (const key of Object.keys(RESPONSES)) {
    if (key === "default") continue;
    const cleanKey = normalize(key.replace(/[?¿]/g, ""));
    if (n.includes(cleanKey)) return RESPONSES[key];
  }
  if (n.includes("precio") || n.includes("costo") || n.includes("cuesta")) return RESPONSES["¿cuánto cuesta?"];
  if (n.includes("seo") || n.includes("google") || n.includes("posicionar")) return RESPONSES["necesito mejorar mi seo"];
  if (n.includes("automat") || n.includes("bot") || n.includes("ia")) return RESPONSES["quiero automatizar mi negocio"];
  if (n.includes("servicio") || n.includes("ofrecen")) return RESPONSES["¿qué servicios ofrecen?"];
  if (n.includes("tiempo") || n.includes("resultado")) return RESPONSES["¿cuánto tiempo toma ver resultados?"];
  return RESPONSES.default;
}

function wantsToBook(input: string): boolean {
  const n = normalize(input);
  return n.includes("agendar") || n.includes("cita") || n.includes("diagnostico") ||
         n.includes("asesoria") || n.includes("calendario") || n.includes("horario") ||
         n.includes("auditoria gratis") || n.includes("reservar") || n.includes("reunion") ||
         n.includes("videollamada") || n.includes("contactar") || n.includes("llamen");
}

function FormIcon({ icon }: { icon: FormField["icon"] }) {
  if (icon === "user") return <User2 className="h-4 w-4" />;
  if (icon === "mail") return <Mail className="h-4 w-4" />;
  if (icon === "phone") return <Phone className="h-4 w-4" />;
  return <Building2 className="h-4 w-4" />;
}

/* ============================================================
   COMPONENTE PRINCIPAL — Widget flotante ImpulsalaBot
   ============================================================ */
export default function AiChatFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<ConversationMode>("general");
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Reset conversación al cerrar
  const handleClose = useCallback(() => {
    setOpen(false);
    setHasNewMessage(true);
  }, []);

  const pushBotMessage = useCallback((msg: Msg, delay = 350) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, msg]);
      setTyping(false);
    }, delay + Math.random() * 150);
  }, []);

  const startBooking = useCallback((service?: string) => {
    setMode("booking");
    setBookingStep(0);
    setBookingData({});
    setFormError(null);
    if (service) setBookingData({ service });

    const welcomeText = service
      ? `🤝 ¡Qué bueno! Vamos a agendar tu videollamada gratuita de 30 minutos sobre ${service}. Solo necesito unos cuantos datos para coordinar todo contigo.`
      : "🤝 ¡Qué bueno! Vamos a agendar tu videollamada gratuita de 30 minutos con nuestro equipo. Solo necesito unos cuantos datos para coordinar todo contigo.";

    pushBotMessage({
      role: "bot",
      text: welcomeText,
    }, 400);
    setTimeout(() => {
      pushBotMessage({
        role: "bot",
        text: BOOKING_STEPS[0].label,
        formField: BOOKING_STEPS[0],
      }, 600);
    }, 1500);
  }, [pushBotMessage]);

  // Iniciar conversación de diagnóstico (desde el blog)
  const startDiagnostic = useCallback(() => {
    setMode("diagnostic");
    setMessages([]);
    pushBotMessage({
      role: "bot",
      text: "✨ ¡Hola! Qué gusto tenerte por aquí. Soy ImpulsalaBot, tu asistente en Impulsala.",
    }, 400);
    setTimeout(() => {
      pushBotMessage({
        role: "bot",
        text: "Veo que quieres un diagnóstico gratis. Para poder ayudarte mejor, cuéntame: ¿Qué necesitas para tu negocio?",
        suggestions: [
          "Desarrollar una página web",
          "Automatización con IA",
          "Campañas publicitarias (Ads)",
          "SEO y posicionamiento",
          "No estoy seguro, ayúdame",
        ],
      }, 600);
    }, 1200);
  }, [pushBotMessage]);

  // Escuchar evento global para abrir el chat (disparado por botones "Agendar")
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { startBooking?: boolean; diagnostic?: boolean; service?: string } | undefined;
      setOpen(true);
      setHasNewMessage(false);
      if (detail?.startBooking && detail?.service) {
        setTimeout(() => startBooking(detail.service), 600);
      } else if (detail?.startBooking) {
        setTimeout(() => startBooking(), 600);
      } else if (detail?.diagnostic) {
        setTimeout(() => startDiagnostic(), 600);
      }
    };
    window.addEventListener("open-ai-chat", handleOpen as EventListener);
    return () => window.removeEventListener("open-ai-chat", handleOpen as EventListener);
  }, [startBooking, startDiagnostic]);

  const processBookingField = useCallback(async (value: string) => {
    const currentField = BOOKING_STEPS[bookingStep];
    if (!currentField.field) return;

    const error = validateField(currentField, value);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);

    const newData = { ...bookingData, [currentField.field]: value.trim() };
    setBookingData(newData);

    const nextStep = bookingStep + 1;
    setBookingStep(nextStep);

    if (nextStep < BOOKING_STEPS.length) {
      const nextField = BOOKING_STEPS[nextStep];
      pushBotMessage({
        role: "bot",
        text: `¡Gracias ${currentField.field === "name" ? value.trim() : ""}! ${nextField.label}`,
        formField: nextField,
      }, 500);
    } else {
      const finalData: BookingData = {
        name: newData.name || "",
        email: newData.email || "",
        phone: newData.phone || "",
        hasBusiness: newData.hasBusiness || "",
        datetime: newData.datetime || "",
        consent: newData.consent || "",
      };
      // Mostrar resumen para confirmación (NO agendar aún)
      const fechaCita = finalData.datetime
        ? new Date(finalData.datetime).toLocaleString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "próximamente";

      pushBotMessage({
        role: "bot",
        text: `¡Perfecto ${finalData.name}! Revisa que tus datos estén correctos y confirma tu cita para ${fechaCita}:`,
        bookingReview: finalData,
      }, 500);
    }
  }, [bookingStep, bookingData, pushBotMessage]);

  // Confirmar la cita después de la revisión
  const confirmBooking = useCallback(async (data: BookingData) => {
    setSubmittingBooking(true);
    setMessages((prev) => [...prev, { role: "user", text: "Confirmar cita" }]);
    pushBotMessage({
      role: "bot",
      text: "⏳ ¡Perfecto! Estoy guardando tus datos y agendando tu cita...",
    }, 400);

    try {
      const apptRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          business: data.hasBusiness,
          hasWebsite: "no",
          email: data.email,
          phone: data.phone,
          scheduledAt: data.datetime,
        }),
      });

      await fetch("/api/booking-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          hasBusiness: data.hasBusiness,
          source: "ai-chat",
        }),
      });

      const result = await apptRes.json();
      setSubmittingBooking(false);
      setMode("general");

      if (apptRes.ok) {
        const fechaCita = data.datetime
          ? new Date(data.datetime).toLocaleString("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "próximamente";

        // Mostrar confirmación con link de Meet generado automáticamente
        const meetLink = result.meetLink || "";
        const meetText = meetLink
          ? `\n\nLink de la videollamada:\n${meetLink}\n\nGuarda este enlace, lo usarás el día de la cita.`
          : "";

        // Texto de servicio (si viene de un botón específico)
        const serviceText = data.service ? ` sobre ${data.service}` : "";

        setMessages((prev) => [...prev, {
          role: "bot",
          text: `✅ ¡Cita confirmada!

${data.name}, tu cita gratuita${serviceText} ha sido agendada para ${fechaCita} (30 minutos).${meetText}

Te enviaremos un correo a ${data.email} con todos los detalles. Pronto nos vemos en la videollamada.`,
          bookingConfirmation: { ...data, meetLink },
          showBackToStart: true,
        }]);

        // Mensaje de seguimiento
        setTimeout(() => {
          pushBotMessage({
            role: "bot",
            text: `📌 Si tienes alguna duda antes de la cita, escríbenos al 319 635 4992 o a este mismo chat. Estamos para ayudarte.`,
          }, 800);
        }, 2000);
      } else {
        setMessages((prev) => [...prev, {
          role: "bot",
          text: `Hubo un problema agendando tu cita (${result.error || "error desconocido"}). Por favor escríbenos directamente por WhatsApp al 319 635 4992.`,
          suggestions: ["Quiero agendar una cita"],
        }]);
      }
    } catch (err) {
      setSubmittingBooking(false);
      setMode("general");
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "No pude conectar con el servidor. Por favor escríbenos directamente por WhatsApp al 319 635 4992 para agendar tu cita.",
        suggestions: ["Quiero agendar una cita"],
  showBackToStart: true,
      }]);
    }
  }, [pushBotMessage]);

  // Editar los datos — reinicia el flujo desde el principio
  const editBooking = useCallback(() => {
    setMessages((prev) => [...prev, { role: "user", text: "Editar datos" }]);
    setMode("general");
    setBookingStep(0);
    setBookingData({});
    setFormError(null);
    pushBotMessage({
      role: "bot",
      text: "✏️ ¡Claro! Vamos a editar tus datos. Empecemos de nuevo.",
    }, 400);
    setTimeout(() => {
      pushBotMessage({
        role: "bot",
        text: BOOKING_STEPS[0].label,
        formField: BOOKING_STEPS[0],
      }, 600);
    }, 1200);
  }, [pushBotMessage]);

  // Volver al inicio — reinicia la conversación al mensaje inicial
  const backToStart = useCallback(() => {
    setMessages((prev) => [...prev, { role: "user", text: "Volver al inicio" }]);
    setMode("general");
    setBookingStep(0);
    setBookingData({});
    setFormError(null);
    setTimeout(() => {
      setMessages([INITIAL_MESSAGE]);
    }, 400);
  }, []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    if (mode === "booking" && bookingStep < BOOKING_STEPS.length) {
      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      processBookingField(trimmed);
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);

    // Modo diagnóstico — responder según el servicio que le interesa
    if (mode === "diagnostic") {
      setTyping(true);
      setTimeout(() => {
        const n = normalize(trimmed);
        let response: Msg;

        if (n.includes("web") || n.includes("pagina") || n.includes("sitio")) {
          response = {
            role: "bot",
            text: "¡Excelente! Desarrollamos páginas web ultra rápidas con Next.js, optimizadas para Google y diseñadas para convertir visitantes en clientes. Desde $500.000 COP. ¿Quieres que agendemos una videollamata de 30 minutos para revisar tu caso?",
            suggestions: ["Sí, agendar cita gratis"],
          };
        } else if (n.includes("automat") || n.includes("bot") || n.includes("ia")) {
          response = {
            role: "bot",
            text: "¡Perfecto! Implementamos agentes de IA que atienden clientes 24/7, chatbots inteligentes y automatización de procesos. Imagina que tu negocio nunca duerme. ¿Te gustaría agendar una cita para contarnos tu caso?",
            suggestions: ["Sí, agendar cita gratis"],
          };
        } else if (n.includes("ads") || n.includes("publicidad") || n.includes("google") || n.includes("meta") || n.includes("instagram") || n.includes("tiktok")) {
          response = {
            role: "bot",
            text: "¡Genial! Manejamos campañas en Google Ads, Meta Ads (Facebook/Instagram) y TikTok Ads. Reducimos tu costo por lead y aumentamos tus ventas. ¿Agendamos una videollamata para tu estrategia?",
            suggestions: ["Sí, agendar cita gratis"],
          };
        } else if (n.includes("seo") || n.includes("posicion") || n.includes("google")) {
          response = {
            role: "bot",
            text: "¡Excelente! Nuestro SEO orgánico muestra resultados en 1-2 meses. Te posicionamos en los primeros resultados de Google. ¿Quieres agendar una cita para auditar tu web?",
            suggestions: ["Sí, agendar cita gratis"],
          };
        } else if (n.includes("no estoy seguro") || n.includes("ayuda") || n.includes("no se")) {
          response = {
            role: "bot",
            text: "¡No te preocupes! Para eso estoy aquí. Cuéntame un poco sobre tu negocio: ¿Qué vendes? ¿Tienes página web? ¿Cómo consigues clientes actualmente?",
            suggestions: ["Tengo un negocio físico", "Vendo online", "No tengo web aún"],
          };
        } else {
          response = {
            role: "bot",
            text: "¡Entendido! Lo que necesitas suena muy interesante. Te recomiendo agendar una videollamata gratuita de 30 minutos con nuestro equipo. Ahí podemos revisar tu caso en detalle y darte una propuesta personalizada. ¿Te animas?",
            suggestions: ["Sí, agendar cita gratis"],
          };
        }
        setMessages((prev) => [...prev, response]);
        setTyping(false);
      }, 400 + Math.random() * 200);
      return;
    }

    if (wantsToBook(trimmed)) {
      startBooking();
      return;
    }

    setTyping(true);
    setTimeout(() => {
      const reply = pickGeneralResponse(trimmed);
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 300 + Math.random() * 200);
  }, [typing, mode, bookingStep, processBookingField]);

  const handleSuggestion = useCallback((suggestion: string) => {
    const n = normalize(suggestion);

    // En modo diagnóstico, procesar sugerencias de servicio
    if (mode === "diagnostic") {
      if (n.includes("agendar") || n.includes("cita")) {
        setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
        // Detectar servicio específico
        const serviceMatch = suggestion.match(/para mi\s+(.+?)(?:\s*$|$)/i);
        startBooking(serviceMatch ? serviceMatch[1] : undefined);
        return;
      }
      if (n.includes("cuanto cuesta") || n.includes("precio")) {
        setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
        pushBotMessage(RESPONSES["¿cuánto cuesta?"], 400);
        return;
      }
      if (n.includes("servicios")) {
        setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
        setMode("general");
        pushBotMessage(RESPONSES["¿qué servicios ofrecen?"], 400);
        return;
      }
      // Sugerencias de servicio del diagnóstico
      send(suggestion);
      return;
    }

    // Detectar "Agendar cita para mi [servicio]"
    if (n.includes("agendar cita para")) {
      setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
      // Extraer el servicio del texto del botón
      const serviceMatch = suggestion.match(/para mi\s+(.+?)$/i) || suggestion.match(/para\s+(.+?)$/i);
      const service = serviceMatch ? serviceMatch[1].trim() : undefined;
      startBooking(service);
      return;
    }

    if (n.includes("agendar") || n.includes("cita") || n.includes("auditoria gratis") || n.includes("diagnostico gratis")) {
      setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
      startBooking();
      return;
    }
    if (n.includes("antes cuentame") || n.includes("servicios")) {
      setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
      setMode("general");
      pushBotMessage(RESPONSES["¿qué servicios ofrecen?"], 400);
      return;
    }
    send(suggestion);
  }, [send, startBooking, pushBotMessage, mode]);

  function renderAvatar(role: MsgRole) {
    if (role === "user") {
      return (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
          <User className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white">
        <Bot className="h-3.5 w-3.5" />
      </div>
    );
  }

  const currentField = mode === "booking" && bookingStep < BOOKING_STEPS.length ? BOOKING_STEPS[bookingStep] : null;
  const showFormInput = currentField && !submittingBooking;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Panel del chat flotante */}
      {open && (
        <div
          className="fixed inset-x-2 bottom-2 top-12 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl
                     lg:static lg:inset-auto lg:bottom-auto lg:top-auto lg:w-[420px]"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          {/* Header con gradiente Impulsala */}
          <div className="flex flex-shrink-0 items-center gap-3 p-3 bg-gradient-to-r from-violet-600 to-sky-600">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full border-2 border-violet-600 bg-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">ImpulsalaBot · Asistente IA</p>
              <p className="text-xs text-white/80 truncate flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                En línea · Agenda tu cita gratis
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              className="size-7 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="scrollbar-thin flex-1 min-h-0 space-y-3 overflow-y-auto px-3 py-3 sm:px-4 bg-background/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ai-chat-fade-in`}>
                <div className={`flex max-w-[90%] gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {renderAvatar(m.role)}
                  <div className="space-y-2 min-w-0">
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-gradient-to-br from-violet-600 to-sky-600 text-white" : "bg-secondary/60 text-foreground"}`}>
                      {m.text}
                    </div>

                    {m.metrics && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {m.metrics.map((metric) => (
                          <div key={metric.label} className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent px-1.5 py-1.5 text-center transition-all hover:border-primary/50 hover:from-primary/15">
                            <div className="text-xs font-bold text-gradient-primary">{metric.value}</div>
                            <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.list && (
                      <div className="space-y-1.5">
                        {m.list.map((block) => (
                          <div key={block.title} className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
                            <div className="mb-1 text-xs font-semibold text-primary">{block.title}</div>
                            <ul className="space-y-0.5">
                              {block.items.map((it) => (
                                <li key={it} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                  <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.bookingConfirmation && <BookingConfirmationCard data={m.bookingConfirmation} />}
                    {m.bookingReview && (
                      <BookingReviewCard
                        data={m.bookingReview}
                        onConfirm={() => confirmBooking(m.bookingReview!)}
                        onEdit={editBooking}
                        disabled={typing || submittingBooking}
                      />
                    )}

                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sug) => (
                          <button
                            key={sug}
                            onClick={() => handleSuggestion(sug)}
                            disabled={typing || submittingBooking}
                            className="rounded-full border border-primary/40 bg-gradient-to-r from-primary/10 to-transparent px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/60 hover:from-primary/20 hover:shadow-sm disabled:opacity-50"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.showBackToStart && (
                      <button
                        onClick={backToStart}
                        disabled={typing || submittingBooking}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                      >
                        Volver al inicio
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start ai-chat-fade-in">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {submittingBooking && (
              <div className="flex justify-start ai-chat-fade-in">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-secondary/60 px-3.5 py-2.5 text-sm text-muted-foreground">
                    Guardando tu cita...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-border/60 bg-secondary/20 px-3 py-2.5 sm:px-4">
            {showFormInput && currentField ? (
              <div className="space-y-2">
                {formError && (
                  <p className="text-xs text-red-500 dark:text-red-400">{formError}</p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentField.inputType === "select" || currentField.inputType === "consent") return;
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <FormIcon icon={currentField.icon} />
                  </div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentField.placeholder}
                    type={currentField.inputType === "tel" ? "tel" : currentField.inputType === "email" ? "email" : "text"}
                    autoFocus
                    className="flex-1 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-sky-600 text-white transition-colors hover:opacity-90 disabled:opacity-50"
                    aria-label="Enviar"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {currentField.inputType === "select" && currentField.options && (
                  <div className="flex flex-col gap-2 pl-11">
                    {currentField.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setMessages((prev) => [...prev, { role: "user", text: opt }]);
                          processBookingField(opt);
                        }}
                        disabled={typing || submittingBooking}
                        className="w-full rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50 text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {currentField.inputType === "datetime" && (
                  <DateTimePicker
                    onSelect={(label, isoDate) => {
                      setMessages((prev) => [...prev, { role: "user", text: label }]);
                      processBookingField(isoDate);
                    }}
                    disabled={typing || submittingBooking}
                  />
                )}
                {currentField.inputType === "consent" && currentField.options && (
                  <div className="flex flex-wrap gap-1.5 pl-11">
                    {currentField.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setMessages((prev) => [...prev, { role: "user", text: opt }]);
                          processBookingField(opt);
                        }}
                        disabled={typing || submittingBooking}
                        className={`rounded-full border px-2.5 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50 ${
                          opt.includes("Sí") || opt.includes("autorizo") ? "border-emerald-500/30 bg-emerald-500/10" : "border-border/60 bg-secondary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing || submittingBooking}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-sky-600 text-white transition-colors hover:opacity-90 disabled:opacity-50"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
              ImpulsalaBot · Agenda citas y responde dudas 24/7
            </p>
          </div>
        </div>
      )}

      {/* FAB — Botón flotante del Agente IA */}
      <button
        onClick={() => { setOpen((v) => !v); setHasNewMessage(false); }}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente ImpulsalaBot"}
        className="relative size-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105 bg-gradient-to-br from-violet-600 to-sky-600"
      >
        {open ? (
          <X className="size-6" />
        ) : (
          <>
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-violet-500" />
            {/* Badge de nuevo mensaje */}
            {hasNewMessage && (
              <span
                className="absolute -top-0.5 -right-0.5 size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: "#ef4444", boxShadow: "0 0 0 2px var(--background)" }}
              >
                1
              </span>
            )}
            <MessageSquare className="size-6" fill="currentColor" />
          </>
        )}
      </button>
    </div>
  );
}

/* ============================================================
   SELECTOR DE HORARIOS DISPONIBLES
   ============================================================ */
function DateTimePicker({
  onSelect,
  disabled,
}: {
  onSelect: (label: string, isoDate: string) => void;
  disabled?: boolean;
}) {
  const [dates, setDates] = useState<{ date: string; label: string; weekday: string; slots: { startUtc: string; label: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/appointments/slots?days=14")
      .then((r) => r.json())
      .then((data) => {
        setDates(data.dates || []);
        // Seleccionar el primer día con slots por defecto
        if (data.dates && data.dates.length > 0) {
          setSelectedDate(data.dates[0].date);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No pude cargar los horarios. Intenta de nuevo.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 pl-11 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Cargando horarios disponibles...
      </div>
    );
  }

  if (error) {
    return <p className="pl-11 text-xs text-red-500">{error}</p>;
  }

  if (dates.length === 0) {
    return (
      <p className="pl-11 text-xs text-muted-foreground">
        No hay horarios disponibles en los próximos 14 días. Escríbenos por WhatsApp al 319 635 4992.
      </p>
    );
  }

  const currentDate = dates.find((d) => d.date === selectedDate);

  return (
    <div className="space-y-2">
      {/* Días disponibles — scrollable horizontal */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            disabled={disabled}
            className={`flex flex-shrink-0 flex-col items-center rounded-lg border px-2.5 py-1.5 text-center transition-colors ${
              selectedDate === d.date
                ? "border-primary bg-primary/15 text-foreground"
                : "border-border/60 bg-secondary/40 text-muted-foreground hover:border-primary/40"
            } disabled:opacity-50`}
          >
            <span className="text-[10px] font-medium uppercase">{d.weekday}</span>
            <span className="text-xs font-bold">{d.label.split(" ")[1]}</span>
          </button>
        ))}
      </div>

      {/* Horarios del día seleccionado — grid scrollear vertical */}
      {currentDate && (
        <div className="max-h-32 overflow-y-auto rounded-lg bg-background/40 p-2">
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {currentDate.slots.map((slot) => (
              <button
                key={slot.startUtc}
                onClick={() => {
                  const dateLabel = `${currentDate.label} a las ${slot.label}`;
                  onSelect(dateLabel, slot.startUtc);
                }}
                disabled={disabled}
                className="rounded-md border border-border/60 bg-secondary/40 px-1.5 py-1.5 text-[11px] font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-[10px] text-muted-foreground">
        📅 Lunes a Viernes, 8:00 a. m. - 6:00 p. m. (Hora Colombia)
      </p>
    </div>
  );
}

/* ============================================================
   TARJETA DE REVISIÓN — Confirmar o Editar
   ============================================================ */
function BookingReviewCard({
  data,
  onConfirm,
  onEdit,
  disabled,
}: {
  data: BookingData;
  onConfirm: () => void;
  onEdit: () => void;
  disabled?: boolean;
}) {
  const fechaFormateada = data.datetime
    ? new Date(data.datetime).toLocaleString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "próximamente";

  const rows = [
    { icon: User2, label: "Nombre", value: data.name },
    { icon: Mail, label: "Email", value: data.email },
    { icon: Phone, label: "Teléfono", value: data.phone },
    { icon: Building2, label: "Negocio", value: data.hasBusiness },
    ...(data.consent ? [{ icon: CheckCircle2, label: "Contacto", value: data.consent }] : []),
  ];

  return (
    <div className="rounded-xl border-2 border-violet-400/40 bg-violet-400/5 overflow-hidden">
      <div className="flex items-center gap-2 bg-violet-400/10 px-3 py-2 border-b border-violet-400/20">
        <CheckCircle2 className="h-4 w-4 text-violet-500 dark:text-violet-400" />
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400">REVISIÓN DE DATOS</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-xs">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-secondary/60 text-foreground/70">
              <row.icon className="h-3 w-3" />
            </div>
            <span className="text-muted-foreground w-16 flex-shrink-0">{row.label}:</span>
            <span className="font-semibold text-foreground truncate">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs pt-1.5 border-t border-border/40 mt-1.5">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Calendar className="h-3 w-3" />
          </div>
          <span className="text-muted-foreground w-16 flex-shrink-0">Cita:</span>
          <span className="font-semibold text-foreground capitalize">{fechaFormateada}</span>
        </div>
      </div>

      {/* Botones de confirmación */}
      <div className="flex gap-2 border-t border-border/40 p-2.5">
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirmar cita
        </button>
        <button
          onClick={onEdit}
          disabled={disabled}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-50"
        >
          Editar datos
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   TARJETA DE CONFIRMACIÓN DE AGENDAMIENTO
   ============================================================ */
function BookingConfirmationCard({ data }: { data: BookingData }) {
  const fechaFormateada = data.datetime
    ? new Date(data.datetime).toLocaleString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const rows = [
    { icon: User2, label: "Nombre", value: data.name },
    { icon: Mail, label: "Email", value: data.email },
    { icon: Phone, label: "Teléfono", value: data.phone },
    { icon: Building2, label: "Negocio", value: data.hasBusiness },
    ...(data.consent ? [{ icon: CheckCircle2, label: "Contacto", value: data.consent }] : []),
  ];

  return (
    <div className="rounded-xl border-2 border-emerald-400/30 bg-emerald-400/5 overflow-hidden">
      <div className="flex items-center gap-2 bg-emerald-400/10 px-3 py-2 border-b border-emerald-400/20">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">CITA AGENDADA — Resumen</span>
      </div>
      <div className="p-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2 text-xs">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-secondary/60 text-foreground/70">
              <row.icon className="h-3 w-3" />
            </div>
            <span className="text-muted-foreground w-16 flex-shrink-0">{row.label}:</span>
            <span className="font-semibold text-foreground truncate">{row.value}</span>
          </div>
        ))}
        {fechaFormateada && (
          <div className="flex items-center gap-2 text-xs pt-1.5 border-t border-border/40 mt-1.5">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="text-muted-foreground w-16 flex-shrink-0">Cita:</span>
            <span className="font-semibold text-foreground capitalize">{fechaFormateada}</span>
          </div>
        )}
      </div>
    </div>
  );
}
// eof
