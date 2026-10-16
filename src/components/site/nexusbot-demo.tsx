"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Zap, TrendingUp, Clock, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { BookingWizard, BookingConfirmation, type BookingData } from "@/components/site/booking-wizard";

type Msg = {
  role: "bot" | "user";
  text: string;
  metrics?: { label: string; value: string }[];
  list?: { title: string; items: string[] }[];
  suggestions?: string[];
  // Special content blocks rendered inline
  wizard?: true; // shows BookingWizard
  confirmation?: { scheduledAt: string; id: string; data: BookingData }; // shows BookingConfirmation
};

const QUICK_PROMPTS = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta?",
  "Necesito mejorar mi SEO",
  "Agendar diagnóstico",
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
    suggestions: ["¿Cuánto cuesta?", "Necesito mejorar mi SEO", "Quiero automatizar mi negocio"],
  },
  "¿cuánto cuesta?": {
    role: "bot",
    text: "Cada proyecto es único, por eso no vendemos paquetes genéricos. Hacemos un diagnóstico gratuito donde analizamos tus objetivos, presupuesto y timeline, y te entregamos una propuesta a medida. La inversión depende del alcance, pero trabajamos con ROI medible desde el primer mes.",
    metrics: [
      { label: "Diagnóstico", value: "Gratis" },
      { label: "ROI promedio", value: "3.2x" },
      { label: "Contratos forzosos", value: "0" },
    ],
    suggestions: ["Haganme una auditoria gratis", "Quiero automatizar mi negocio"],
  },
  "necesito mejorar mi seo": {
    role: "bot",
    text: "Nuestro servicio SEO está diseñado para posicionarte en las primeras posiciones de Google con resultados medibles y sostenibles. Trabajamos en 3 pilares: auditoría técnica, optimización on-page y estrategia off-page.",
    metrics: [
      { label: "Posiciones Top 3", value: "78%" },
      { label: "Tráfico orgánico", value: "+210%" },
      { label: "Keywords Top 10", value: "45+" },
    ],
    list: [
      {
        title: "Auditoría Técnica",
        items: [
          "Análisis de velocidad Core Web Vitals",
          "Revisión de estructura de URLs y sitemap",
          "Detección de errores 404 y redirecciones",
          "Validación de datos estructurados Schema",
        ],
      },
      {
        title: "Optimización On-Page",
        items: [
          "Meta tags y headings optimizados",
          "Contenido con keywords estratégicas",
          "Imágenes comprimidas y con alt text",
          "Internal linking estratégico",
        ],
      },
      {
        title: "Estrategia Off-Page",
        items: [
          "Link building con sitios de alta autoridad",
          "Perfil de backlinks natural y diverso",
          "Menciones de marca en directorios",
          "Guest posting en medios del sector",
        ],
      },
    ],
    suggestions: ["Haganme una auditoria gratis", "¿Cuánto tiempo toma ver resultados?"],
  },
  "quiero automatizar mi negocio": {
    role: "bot",
    text: "Automatizamos procesos repetitivos y creamos agentes de IA que trabajan 24/7 por ti. Promedio: 120 horas ahorradas al mes por cliente. Implementamos flujos automatizados, chatbots inteligentes, publicación automática en redes y agentes de venta con IA.",
    metrics: [
      { label: "Horas ahorradas", value: "120h/mes" },
      { label: "Operación", value: "24/7" },
      { label: "Tiempo de implementación", value: "2-4 semanas" },
    ],
    suggestions: ["¿Qué servicios ofrecen?", "¿Cuánto cuesta?"],
  },
  "haganme una auditoria gratis": {
    role: "bot",
    text: "¡Perfecto! Para agendar tu diagnóstico gratuito de 30 minutos, necesito algunos datos rápidos. He abierto un asistente de agendamiento debajo — solo completa tu nombre, negocio, web, correo y teléfono, y eliges el horario que mejor te funcione.",
    suggestions: ["Agendar diagnóstico"],
  },
  "agendar diagnóstico": {
    role: "bot",
    text: "¡Excelente! Vamos a agendar tu diagnóstico gratuito. Necesito algunos datos para reservar tu sesión de 30 minutos con nuestro equipo. He activado el asistente de agendamiento debajo 👇",
    wizard: true,
  },
  "¿cuánto tiempo toma ver resultados?": {
    role: "bot",
    text: "Depende del servicio: las campañas de Ads pueden mostrar resultados desde la semana 2, el SEO orgánico típicamente entrega mejoras visibles entre 3 y 6 meses, y las automatizaciones empiezan a ahorrar tiempo desde la primera semana de implementación.",
    metrics: [
      { label: "Ads", value: "2-4 sem" },
      { label: "SEO", value: "3-6 mes" },
      { label: "Automatización", value: "1 sem" },
    ],
    suggestions: ["Quiero automatizar mi negocio", "Necesito mejorar mi SEO"],
  },
  "agendar llamada de asesoría": {
    role: "bot",
    text: "¡Genial! Para agendar tu llamada de asesoría, completa el formulario de agendamiento debajo. Solo necesito tus datos de contacto y eliges el horario que te quede mejor. Te llegarán los detalles de la videollamada por correo.",
    wizard: true,
  },
  default: {
    role: "bot",
    text: "Gracias por tu pregunta. Para darte la mejor asesoría, necesito entender mejor tu necesidad. Puedo ayudarte con cualquier tema de marketing digital, desarrollo web o automatizaciones.",
    list: [
      {
        title: "Cuéntame sobre tu negocio",
        items: [
          "¿De qué sector eres y qué vendes?",
          "¿Tienes presencia digital actual?",
          "¿Cuál es tu objetivo principal a 6 meses?",
          "¿Tienes algún competidor que admires?",
        ],
      },
    ],
    suggestions: [
      "Necesito una página web",
      "Quiero mejorar mis ventas online",
      "Necesito automatizar procesos",
    ],
  },
};

const INITIAL_MESSAGE: Msg = {
  role: "bot",
  text: "Hola, soy ImpulsaBot, el asistente de IA de Impulsala. Estoy entrenado para ayudarte con desarrollo web, marketing digital, automatizaciones y estrategia de crecimiento. Pregúntame lo que necesites.",
  suggestions: QUICK_PROMPTS,
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pickResponse(input: string): Msg {
  const n = normalize(input);

  // Booking intent takes priority — many phrasings should trigger the wizard
  if (
    n.includes("agendar") ||
    n.includes("agendo") ||
    n.includes("agendo") ||
    n.includes("reservar") ||
    n.includes("reservar cita") ||
    n.includes("cita") ||
    n.includes("llamada") ||
    n.includes("asesoria") ||
    n.includes("asesoría") ||
    n.includes("reunion") ||
    n.includes("reunión") ||
    n.includes("diagnostico") ||
    n.includes("diagnóstico") ||
    n.includes("calendario") ||
    n.includes("horario")
  ) {
    return RESPONSES["agendar diagnóstico"];
  }

  for (const key of Object.keys(RESPONSES)) {
    if (key === "default") continue;
    if (n.includes(normalize(key.replace(/[?¿]/g, "")))) {
      return RESPONSES[key];
    }
  }
  // Fuzzy keyword match
  if (n.includes("precio") || n.includes("costo") || n.includes("cuesta") || n.includes("cobran")) return RESPONSES["¿cuánto cuesta?"];
  if (n.includes("seo") || n.includes("google") || n.includes("posicionar")) return RESPONSES["necesito mejorar mi seo"];
  if (n.includes("automat") || n.includes("bot") || n.includes("ia")) return RESPONSES["quiero automatizar mi negocio"];
  if (n.includes("servicio") || n.includes("ofrecen") || n.includes("hacen")) return RESPONSES["¿qué servicios ofrecen?"];
  if (n.includes("auditoria") || n.includes("gratis")) return RESPONSES["haganme una auditoria gratis"];
  if (n.includes("tiempo") || n.includes("resultado") || n.includes("demora")) return RESPONSES["¿cuánto tiempo toma ver resultados?"];
  if (n.includes("contacto") || n.includes("contactar")) return RESPONSES["agendar llamada de asesoría"];
  return RESPONSES.default;
}

export function ImpulsaBotDemo() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setTyping(true);
    setTimeout(() => {
      const reply = pickResponse(trimmed);
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  }

  /** Replace the last wizard message with the confirmation card */
  function handleBookingComplete(result: { scheduledAt: string; id: string; data: BookingData }) {
    const { scheduledAt, id, data } = result;
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].wizard) {
          next[i] = {
            role: "bot",
            text: "",
            confirmation: { scheduledAt, id, data },
          };
          break;
        }
      }
      return next;
    });
  }

  function handleBookingCancel() {
    setMessages((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].wizard) {
          next[i] = {
            role: "bot",
            text: "No hay problema. Cuando quieras agendar tu diagnóstico, solo dime 'agendar' y reactivamos el asistente. ¿Hay algo más en lo que pueda ayudarte?",
            suggestions: ["¿Qué servicios ofrecen?", "¿Cuánto cuesta?"],
          };
          break;
        }
      }
      return next;
    });
  }

  function handleBookingReset() {
    setMessages((prev) => {
      // Remove confirmation messages
      return prev.filter((m) => !m.confirmation);
    });
    // Trigger wizard again
    setMessages((prev) => [
      ...prev,
      { role: "user", text: "Agendar otra cita" },
    ]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "¡Perfecto! Vamos a agendar otra cita. Completa el formulario nuevamente 👇",
          wizard: true,
        },
      ]);
    }, 500);
  }

  return (
    <section id="demos" className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <SectionHeading
          index="05 / 07"
          label="Demo en vivo"
          icon={Play}
          title="Prueba nuestros servicios"
          highlight="en vivo"
          description="No solo te lo contamos, te lo demostramos. Interactúa con ImpulsaBot y descubre el poder de lo que podemos construir para tu negocio."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Chat panel */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 backdrop-blur-sm">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-secondary/30 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-card bg-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">ImpulsaBot</span>
                    <span className="text-xs text-muted-foreground">En línea · Responde sobre servicios, precios, SEO y más</span>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                  <Zap className="h-3 w-3" />
                  GPT-4o
                </span>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="scrollbar-thin h-[460px] space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
              >
                <AnimatePresence initial={false}>
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[88%] gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                            m.role === "user"
                              ? "bg-secondary text-foreground"
                              : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                          }`}
                        >
                          {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div className="space-y-2.5">
                          {/* Bubble */}
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              m.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary/60 text-foreground"
                            }`}
                          >
                            {m.text}
                          </div>

                          {/* Metrics */}
                          {m.metrics && (
                            <div className="grid grid-cols-3 gap-2">
                              {m.metrics.map((metric) => (
                                <div
                                  key={metric.label}
                                  className="rounded-xl border border-border/60 bg-background/40 px-2 py-2 text-center"
                                >
                                  <div className="text-sm font-bold text-gradient-primary">{metric.value}</div>
                                  <div className="text-[10px] text-muted-foreground">{metric.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Expandable lists */}
                          {m.list && (
                            <div className="space-y-2">
                              {m.list.map((block) => (
                                <div
                                  key={block.title}
                                  className="rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
                                >
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

                          {/* Booking wizard — only render for the LAST wizard message */}
                          {m.wizard && i === messages.findLastIndex((mm) => mm.wizard) && (
                            <BookingWizard
                              onComplete={handleBookingComplete}
                              onCancel={handleBookingCancel}
                            />
                          )}

                          {/* Booking confirmation */}
                          {m.confirmation && (
                            <BookingConfirmation
                              data={m.confirmation.data}
                              scheduledAt={m.confirmation.scheduledAt}
                              id={m.confirmation.id}
                              onReset={handleBookingReset}
                            />
                          )}

                          {/* Quick suggestion chips */}
                          {m.suggestions && m.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {m.suggestions.map((sug) => (
                                <button
                                  key={sug}
                                  onClick={() => send(sug)}
                                  disabled={typing}
                                  className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 disabled:opacity-50"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl bg-secondary/60 px-4 py-3.5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-foreground/60 animate-typing"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="border-t border-border/60 bg-secondary/20 px-4 py-3 sm:px-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta sobre nuestros servicios..."
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
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                  ImpulsaBot v2.0 · Asistente inteligente de Impulsala
                </p>
              </div>
            </div>
          </div>

          {/* Side stats panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-foreground">Capacidades de ImpulsaBot</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Un asistente conversacional con respuestas estructuradas, métricas reales, casos de
                éxito, secciones expandibles y sugerencias contextuales inteligentes.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Zap, label: "Respuesta instantánea", value: "< 2s", note: "Disponible 24/7" },
                  { icon: Sparkles, label: "Temas dominados", value: "12+", note: "Marketing y desarrollo" },
                  { icon: TrendingUp, label: "Precisión temática", value: "94%", note: "En respuestas relevantes" },
                ].map(({ icon: Icon, label, value, note }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"
                  >
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

            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Prueba gratuita</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                Implementa un agente como este en tu negocio
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Entrenado con tu data, integrado a tu CRM y redes. Disponible 24/7 para tus clientes.
              </p>
              <a
                href="#diagnostico"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Solicitar demo personalizada
                <Send className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
