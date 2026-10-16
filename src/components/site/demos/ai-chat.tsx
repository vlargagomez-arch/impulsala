"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Bot, User, Sparkles, Zap, TrendingUp, Clock, CheckCircle2, Calendar, User2, Mail, Phone, Building2, Loader2 } from "lucide-react";

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
  // Formulario de agendamiento (cuando el bot pide datos)
  formField?: FormField;
  // Confirmación final con resumen de datos
  bookingConfirmation?: BookingData;
};

type FormField = {
  field: "name" | "email" | "phone" | "hasBusiness" | null;
  label: string;
  placeholder: string;
  icon: "user" | "mail" | "phone" | "building";
  inputType: "text" | "email" | "tel" | "select";
  options?: string[]; // para select
};

type BookingData = {
  name: string;
  email: string;
  phone: string;
  hasBusiness: string;
  service?: string;
};

/* ============================================================
   ESTADO DE LA CONVERSACIÓN
   ============================================================ */
type ConversationMode = "general" | "booking";

/* ============================================================
   RESPUESTAS PREDEFINIDAS (modo general)
   ============================================================ */
const QUICK_PROMPTS = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta?",
  "Necesito mejorar mi SEO",
  "Quiero agendar una cita",
];

const RESPONSES: Record<string, Msg> = {
  "¿qué servicios ofrecen?": {
    role: "bot",
    text: "En Impulsala ofrecemos 4 servicios integrados: desarrollo de software a medida, mejoramiento web + SEO, campañas publicitarias (Google/Meta/TikTok/YouTube Ads) y automatizaciones + IA. Todo pensado para que tu negocio crezca desde el día uno.",
    metrics: [
      { label: "Apps entregadas", value: "40+" },
      { label: "ROI promedio", value: "340%" },
      { label: "Tiempo de respuesta", value: "< 2h" },
    ],
    suggestions: ["¿Cuánto cuesta?", "Necesito mejorar mi SEO", "Quiero agendar una cita"],
  },
  "¿cuánto cuesta?": {
    role: "bot",
    text: "Cada proyecto es único, por eso no vendemos paquetes genéricos. Hacemos un diagnóstico gratuito donde analizamos tus objetivos, presupuesto y timeline, y te entregamos una propuesta a medida. La inversión depende del alcance, pero trabajamos con ROI medible desde el primer mes.",
    metrics: [
      { label: "Diagnóstico", value: "Gratis" },
      { label: "ROI promedio", value: "3.2x" },
      { label: "Contratos forzosos", value: "0" },
    ],
    suggestions: ["Agendar diagnóstico gratis", "Quiero automatizar mi negocio"],
  },
  "necesito mejorar mi seo": {
    role: "bot",
    text: "Nuestro servicio SEO está diseñado para posicionarte en las primeras posiciones de Google con resultados medibles y sostenibles. Trabajamos en 3 pilares: auditoría técnica, optimización on-page y estrategia off-page.",
    metrics: [
      { label: "Posiciones Top 3", value: "78%" },
      { label: "Tráfico orgánico", value: "+210%" },
      { label: "Keywords Top 10", value: "45+" },
    ],
    suggestions: ["Agendar auditoría gratis", "¿Cuánto tiempo toma ver resultados?"],
  },
  "quiero automatizar mi negocio": {
    role: "bot",
    text: "Automatizamos procesos repetitivos y creamos agentes de IA que trabajan 24/7 por ti. Promedio: 120 horas ahorradas al mes por cliente. Implementamos flujos automatizados, chatbots inteligentes, publicación automática en redes y agentes de venta con IA.",
    metrics: [
      { label: "Horas ahorradas", value: "120h/mes" },
      { label: "Operación", value: "24/7" },
      { label: "Implementación", value: "2-4 sem" },
    ],
    suggestions: ["¿Qué servicios ofrecen?", "Quiero agendar una cita"],
  },
  "¿cuánto tiempo toma ver resultados?": {
    role: "bot",
    text: "Depende del servicio: las campañas de Ads pueden mostrar resultados desde la semana 2, el SEO orgánico típicamente entrega mejoras visibles entre 3 y 6 meses, y las automatizaciones empiezan a ahorrar tiempo desde la primera semana de implementación.",
    metrics: [
      { label: "Ads", value: "2-4 sem" },
      { label: "SEO", value: "3-6 mes" },
      { label: "Automatización", value: "1 sem" },
    ],
    suggestions: ["Quiero agendar una cita", "Necesito mejorar mi SEO"],
  },
  default: {
    role: "bot",
    text: "Gracias por tu mensaje. Puedo ayudarte con información sobre nuestros servicios, precios, SEO, automatización con IA, y también puedo agendarte una cita gratuita con nuestro equipo. ¿Qué te gustaría hacer?",
    suggestions: ["¿Qué servicios ofrecen?", "¿Cuánto cuesta?", "Quiero agendar una cita"],
  },
};

/* ============================================================
   FLUJO DE AGENDAMIENTO — pasos del formulario
   ============================================================ */
const BOOKING_STEPS: FormField[] = [
  {
    field: "name",
    label: "¿Cómo te llamas?",
    placeholder: "Ej: María López",
    icon: "user",
    inputType: "text",
  },
  {
    field: "email",
    label: "¿Cuál es tu correo electrónico?",
    placeholder: "Ej: maria@email.com",
    icon: "mail",
    inputType: "email",
  },
  {
    field: "phone",
    label: "¿Cuál es tu número de WhatsApp/teléfono?",
    placeholder: "Ej: 319 635 4992",
    icon: "phone",
    inputType: "tel",
  },
  {
    field: "hasBusiness",
    label: "¿Tienes un negocio actualmente?",
    placeholder: "Selecciona una opción",
    icon: "building",
    inputType: "select",
    options: ["Sí, tengo un negocio", "Soy emprendedor", "Trabajo en una empresa", "Aún no tengo negocio"],
  },
];

/* ============================================================
   MENSAJE INICIAL
   ============================================================ */
const INITIAL_MESSAGE: Msg = {
  role: "bot",
  text: "¡Hola! Soy ImpulsaBot, el asistente de IA de Impulsala. Puedo ayudarte con información sobre nuestros servicios, precios, SEO, automatización con IA... y también puedo agendarte una cita gratuita. ¿En qué te puedo ayudar?",
  suggestions: QUICK_PROMPTS,
};

/* ============================================================
   HELPERS
   ============================================================ */
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

/* ============================================================
   ICONOS DE FORMULARIO
   ============================================================ */
function FormIcon({ icon }: { icon: FormField["icon"] }) {
  if (icon === "user") return <User2 className="h-4 w-4" />;
  if (icon === "mail") return <Mail className="h-4 w-4" />;
  if (icon === "phone") return <Phone className="h-4 w-4" />;
  return <Building2 className="h-4 w-4" />;
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */
export default function AiChatDemo() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<ConversationMode>("general");
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Agrega un mensaje del bot con delay de typing
  const pushBotMessage = useCallback((msg: Msg, delay = 350) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, msg]);
      setTyping(false);
    }, delay + Math.random() * 150);
  }, []);

  // Inicia el flujo de agendamiento
  const startBooking = useCallback(() => {
    setMode("booking");
    setBookingStep(0);
    setBookingData({});
    setFormError(null);
    pushBotMessage({
      role: "bot",
      text: "¡Perfecto! Te voy a agendar una cita gratuita de 30 minutos con nuestro equipo. Solo necesito algunos datos para contactarte. Empecemos 👇",
    }, 400);
    // Después de 1.5s, enviar la primera pregunta
    setTimeout(() => {
      pushBotMessage({
        role: "bot",
        text: BOOKING_STEPS[0].label,
        formField: BOOKING_STEPS[0],
      }, 600);
    }, 1500);
  }, [pushBotMessage]);

  // Procesa la respuesta de un campo del formulario
  const processBookingField = useCallback(async (value: string) => {
    const currentField = BOOKING_STEPS[bookingStep];
    if (!currentField.field) return;

    const error = validateField(currentField, value);
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);

    // Guardar el dato
    const newData = { ...bookingData, [currentField.field]: value.trim() };
    setBookingData(newData);

    // Avanzar al siguiente paso
    const nextStep = bookingStep + 1;
    setBookingStep(nextStep);

    // Si hay más pasos, enviar la siguiente pregunta
    if (nextStep < BOOKING_STEPS.length) {
      const nextField = BOOKING_STEPS[nextStep];
      pushBotMessage({
        role: "bot",
        text: `¡Gracias ${currentField.field === "name" ? value.trim() : ""}! ${nextField.label}`,
        formField: nextField,
      }, 500);
    } else {
      // Era el último paso — enviar confirmación
      const finalData: BookingData = {
        name: newData.name || "",
        email: newData.email || "",
        phone: newData.phone || "",
        hasBusiness: newData.hasBusiness || "",
      };
      // Guardar el lead en el backend
      setSubmittingBooking(true);
      pushBotMessage({
        role: "bot",
        text: "¡Perfecto! Estoy guardando tus datos y agendando tu cita...",
      }, 500);

      try {
        const res = await fetch("/api/booking-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: finalData.name,
            email: finalData.email,
            phone: finalData.phone,
            hasBusiness: finalData.hasBusiness,
            source: "ai-chat",
          }),
        });
        const result = await res.json();

        setSubmittingBooking(false);
        setMode("general");

        if (res.ok) {
          setMessages((prev) => [...prev, {
            role: "bot",
            text: result.alreadyExists
              ? `¡Hola ${finalData.name}! Ya recibimos tu solicitud recientemente. Nuestro equipo te contactará muy pronto al ${finalData.phone}. 📞`
              : `¡Listo ${finalData.name}! Tu cita gratuita ha sido agendada exitosamente. 🎉 Nuestro equipo te contactará en menos de 2 horas hábiles al ${finalData.phone} o por correo ${finalData.email} para confirmar el horario de tu videollamada de 30 minutos.`,
            bookingConfirmation: finalData,
            suggestions: ["¿Qué servicios ofrecen?", "¿Cuánto cuesta?"],
          }]);
        } else {
          setMessages((prev) => [...prev, {
            role: "bot",
            text: `Hubo un problema técnico guardando tus datos (${result.error || "error desconocido"}). Por favor escríbenos directamente por WhatsApp al 319 635 4992 o intenta de nuevo.`,
            suggestions: ["Quiero agendar una cita", "¿Qué servicios ofrecen?"],
          }]);
        }
      } catch (err) {
        setSubmittingBooking(false);
        setMode("general");
        setMessages((prev) => [...prev, {
          role: "bot",
          text: "No pude conectar con el servidor. Por favor escríbenos directamente por WhatsApp al 319 635 4992 para agendar tu cita.",
          suggestions: ["Quiero agendar una cita", "¿Qué servicios ofrecen?"],
        }]);
      }
    }
  }, [bookingStep, bookingData, pushBotMessage]);

  // Envía un mensaje (texto del usuario)
  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    // Si estamos en modo booking y hay un campo activo, procesar como respuesta de formulario
    if (mode === "booking" && bookingStep < BOOKING_STEPS.length) {
      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      processBookingField(trimmed);
      return;
    }

    // Modo general
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);

    // ¿El usuario quiere agendar?
    if (wantsToBook(trimmed)) {
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          role: "bot",
          text: "¡Excelente! Te puedo agendar una cita gratuita de 30 minutos con nuestro equipo. Voy a pedirte algunos datos para contactarte. ¿Comenzamos?",
          suggestions: ["Sí, agendar mi cita", "Antes cuéntame de los servicios"],
        }]);
        setTyping(false);
      }, 350 + Math.random() * 150);
      return;
    }

    // Respuesta general
    setTyping(true);
    setTimeout(() => {
      const reply = pickGeneralResponse(trimmed);
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 300 + Math.random() * 200);
  }, [typing, mode, bookingStep, processBookingField]);

  // Maneja click en sugerencia
  const handleSuggestion = useCallback((suggestion: string) => {
    // Si la sugerencia es "Sí, agendar mi cita" o similar
    const n = normalize(suggestion);
    if (n.includes("agendar mi cita") || n.includes("auditoria gratis") || n.includes("diagnostico gratis")) {
      setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
      startBooking();
      return;
    }
    if (n.includes("antes cuentame") || n.includes("servicios")) {
      // Volver a modo general
      setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
      setMode("general");
      pushBotMessage(RESPONSES["¿qué servicios ofrecen?"], 400);
      return;
    }
    send(suggestion);
  }, [send, startBooking, pushBotMessage]);

  // Render del icono de avatar
  function renderAvatar(role: MsgRole) {
    if (role === "user") {
      return (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
          <User className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
        <Bot className="h-4 w-4" />
      </div>
    );
  }

  // Campo de formulario inline (cuando el bot pide un dato)
  const currentField = mode === "booking" && bookingStep < BOOKING_STEPS.length ? BOOKING_STEPS[bookingStep] : null;
  const showFormInput = currentField && !submittingBooking;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-secondary/30 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-card bg-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">ImpulsaBot</span>
                <span className="text-xs text-muted-foreground">En línea · Agenda citas y responde dudas</span>
              </div>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary sm:inline-flex">
              <Zap className="h-3 w-3" />
              GPT-4o
            </span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="scrollbar-thin h-[460px] space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ai-chat-fade-in`}>
                <div className={`flex max-w-[88%] gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {renderAvatar(m.role)}
                  <div className="space-y-2.5">
                    {/* Texto del mensaje */}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-foreground"}`}>
                      {m.text}
                    </div>

                    {/* Métricas */}
                    {m.metrics && (
                      <div className="grid grid-cols-3 gap-2">
                        {m.metrics.map((metric) => (
                          <div key={metric.label} className="rounded-xl border border-border/60 bg-background/40 px-2 py-2 text-center">
                            <div className="text-sm font-bold text-gradient-primary">{metric.value}</div>
                            <div className="text-[10px] text-muted-foreground">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Listas */}
                    {m.list && (
                      <div className="space-y-2">
                        {m.list.map((block) => (
                          <div key={block.title} className="rounded-xl border border-border/60 bg-background/40 px-3 py-2.5">
                            <div className="mb-1.5 text-xs font-semibold text-primary">{block.title}</div>
                            <ul className="space-y-1">
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

                    {/* Confirmación de agendamiento */}
                    {m.bookingConfirmation && (
                      <BookingConfirmationCard data={m.bookingConfirmation} />
                    )}

                    {/* Sugerencias */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestions.map((sug) => (
                          <button
                            key={sug}
                            onClick={() => handleSuggestion(sug)}
                            disabled={typing || submittingBooking}
                            className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Indicador de typing */}
            {typing && (
              <div className="flex justify-start ai-chat-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-4 py-3.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Estado de guardando cita */}
            {submittingBooking && (
              <div className="flex justify-start ai-chat-fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
                    Guardando tu cita...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border/60 bg-secondary/20 px-4 py-3 sm:px-5">
            {/* Si estamos pidiendo un campo de formulario, mostrar input especial */}
            {showFormInput && currentField ? (
              <div className="space-y-2">
                {formError && (
                  <p className="text-xs text-red-500 dark:text-red-400">{formError}</p>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentField.inputType === "select") return; // se maneja con los botones
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <FormIcon icon={currentField.icon} />
                  </div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentField.placeholder}
                    type={currentField.inputType === "tel" ? "tel" : currentField.inputType === "email" ? "email" : "text"}
                    autoFocus
                    className="flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    aria-label="Enviar"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
                {/* Si es select, mostrar botones de opciones */}
                {currentField.inputType === "select" && currentField.options && (
                  <div className="flex flex-wrap gap-2 pl-12">
                    {currentField.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setMessages((prev) => [...prev, { role: "user", text: opt }]);
                          processBookingField(opt);
                        }}
                        disabled={typing || submittingBooking}
                        className="rounded-full border border-border/60 bg-secondary/40 px-3 py-2 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
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
                  placeholder="Escribe tu pregunta o pide agendar una cita..."
                  className="flex-1 rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing || submittingBooking}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              ImpulsaBot v2.0 · Agenda citas y responde dudas 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-foreground">Capacidades de ImpulsaBot</h3>
          <p className="mt-1 text-xs text-muted-foreground">Asistente conversacional que responde dudas, muestra métricas reales y agenda citas automáticamente pidiendo tus datos paso a paso.</p>
          <div className="mt-5 space-y-3">
            {[
              { icon: Calendar, label: "Agenda citas", value: "Auto", note: "Nombre, email, teléfono, negocio" },
              { icon: Zap, label: "Respuesta instantánea", value: "< 2s", note: "Disponible 24/7" },
              { icon: Sparkles, label: "Temas dominados", value: "12+", note: "Marketing y desarrollo" },
              { icon: TrendingUp, label: "Precisión temática", value: "94%", note: "En respuestas relevantes" },
            ].map(({ icon: Icon, label, value, note }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-semibold text-foreground">{note}</div>
                </div>
                <div className="text-lg font-bold text-gradient-primary">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Prueba gratuita</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground">Implementa un agente como este en tu negocio</h3>
          <p className="mt-1.5 text-xs text-muted-foreground">Entrenado con tu data, integrado a tu CRM y WhatsApp. Agenda citas y califica leads 24/7 sin intervención humana.</p>
          <a href="/diagnostico-gratis" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Solicitar demo personalizada
            <Send className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes ai-chat-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-chat-fade-in {
          animation: ai-chat-fade-in 0.25s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .ai-chat-fade-in { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   TARJETA DE CONFIRMACIÓN DE AGENDAMIENTO
   ============================================================ */
function BookingConfirmationCard({ data }: { data: BookingData }) {
  const rows = [
    { icon: User2, label: "Nombre", value: data.name },
    { icon: Mail, label: "Email", value: data.email },
    { icon: Phone, label: "Teléfono", value: data.phone },
    { icon: Building2, label: "Negocio", value: data.hasBusiness },
  ];

  return (
    <div className="rounded-xl border-2 border-emerald-400/30 bg-emerald-400/5 overflow-hidden">
      <div className="flex items-center gap-2 bg-emerald-400/10 px-4 py-2.5 border-b border-emerald-400/20">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">CITA AGENDADA — Resumen</span>
      </div>
      <div className="p-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2.5 text-xs">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-foreground/70">
              <row.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground w-20 flex-shrink-0">{row.label}:</span>
            <span className="font-semibold text-foreground truncate">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center gap-2.5 text-xs pt-2 border-t border-border/40 mt-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <span className="text-muted-foreground">Próximo paso:</span>
          <span className="font-semibold text-foreground">Te contactamos en &lt;2 horas</span>
        </div>
      </div>
    </div>
  );
}
