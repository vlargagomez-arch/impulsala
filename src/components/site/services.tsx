"use client";

import { motion } from "framer-motion";
import { Code2, Search, Megaphone, Bot, ArrowRight, Check, Layers } from "lucide-react";
import { TiltCard } from "@/components/site/tilt-card";
import { SectionHeading } from "@/components/site/section-heading";

type Service = {
  num: string;
  badge: string;
  badgeLabel: string;
  title: string;
  description: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  glow: string;
  cta: {
    icon: string;
    text: string;
    /** URL de la subpágina a la que lleva el botón */
    href: string;
    hover: string;
  };
};

const SERVICES: Service[] = [
  {
    num: "01",
    badge: "40+",
    badgeLabel: "Apps entregadas",
    title: "Desarrollo Web",
    description:
      "Nuestro desarrollo web profesional no es solo código: creamos aplicaciones web, plataformas e-commerce, CRM y sistemas a medida que impulsan la productividad de tu empresa. Especialistas en desarrollo web para PYMES en Bogotá y toda Colombia.",
    items: [
      "Aplicaciones web a medida",
      "Plataformas e-commerce",
      "CRM y sistemas internos",
      "Apps móviles",
    ],
    icon: Code2,
    accent: "from-emerald-500/25 to-emerald-500/0",
    glow: "oklch(0.78 0.18 165 / 0.35)",
    cta: {
      icon: "💻",
      text: "Cotizar mi proyecto",
      href: "/servicios/desarrollo-web",
      hover: "Presupuesto en 24 horas",
    },
  },
  {
    num: "02",
    badge: "3x",
    badgeLabel: "Más tráfico orgánico",
    title: "SEO y Posicionamiento",
    description:
      "Rediseñamos y optimizamos tu página web con desarrollo web enfocado en velocidad y SEO. Tu sitio aparecerá en los primeros resultados de Google de forma orgánica. Estrategias de SEO comprobadas para empresas en Colombia y LATAM.",
    items: [
      "Diseño y rediseño web",
      "Velocidad y UX/UI",
      "SEO orgánico avanzado",
      "Contenido estratégico",
    ],
    icon: Search,
    accent: "from-cyan-500/25 to-cyan-500/0",
    glow: "oklch(0.72 0.16 200 / 0.35)",
    cta: {
      icon: "🔍",
      text: "Analizar mi web gratis",
      href: "/servicios/seo",
      hover: "Auditoría SEO sin costo",
    },
  },
  {
    num: "03",
    badge: "340%",
    badgeLabel: "ROI promedio",
    title: "Campañas Publicitarias",
    description:
      "Marketing digital que genera leads, no solo likes. Diseñamos, gestionamos y optimizamos campañas en Google Ads, Meta Ads, TikTok Ads y YouTube Ads. Cada peso invertido genera resultados medibles para tu negocio en Colombia.",
    items: [
      "Google Ads",
      "Meta Ads (FB + IG)",
      "TikTok Ads",
      "YouTube Ads",
    ],
    icon: Megaphone,
    accent: "from-amber-500/25 to-amber-500/0",
    glow: "oklch(0.78 0.18 95 / 0.3)",
    cta: {
      icon: "📢",
      text: "Agendar cita para mis campañas",
      href: "/servicios/publicidad-digital",
      hover: "Estrategia personalizada",
    },
  },
  {
    num: "04",
    badge: "120h",
    badgeLabel: "Ahorradas al mes",
    title: "Automatización con IA",
    description:
      "Automatización con inteligencia artificial de última generación. Creamos chatbots inteligentes, flujos de trabajo y agentes de venta con IA que trabajan por ti las 24 horas. La inteligencia artificial aplicada a tu negocio en Colombia.",
    items: [
      "Flujos automatizados",
      "Chatbots inteligentes",
      "Publicación automática",
      "Agentes de venta con IA",
    ],
    icon: Bot,
    accent: "from-fuchsia-500/25 to-fuchsia-500/0",
    glow: "oklch(0.7 0.2 320 / 0.35)",
    cta: {
      icon: "🤖",
      text: "Agendar cita para mi automatización",
      href: "/servicios/automatizacion-ia",
      hover: "Demo en vivo 5 minutos",
    },
  },
];

export function Services() {
  return (
    <section id="servicios" className="relative py-20 sm:py-28 noise-overlay">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <SectionHeading
          index="01 / 04"
          label="Nuestros servicios"
          icon={Layers}
          title="Soluciones completas para"
          highlight="tu negocio"
          description="No somos una agencia más. Somos tu partner estratégico digital en Bogotá. Desde el desarrollo web hasta la venta, cubrimos todo el camino para que tú solo te preocupes de crecer. Diseñadas para PYMES, no para corporaciones."
        />

        {/* Cards — grid 1 col en móvil, 2 en desktop */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard max={8} className="h-full">
                <div
                  className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-6 transition-colors hover:border-primary/40 sm:p-8"
                >
                  {/* Gradient overlay */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  {/* Outer glow on hover */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{ background: s.glow }}
                  />

                  <div className="relative flex h-full flex-col">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-secondary/40 shadow-inner">
                          <s.icon className="h-6 w-6 text-primary" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground">
                            {s.num}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{s.title}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-primary">
                          {s.badge}
                        </div>
                        <div className="text-[11px] text-muted-foreground">{s.badgeLabel}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>

                    {/* Items */}
                    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {s.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 text-sm text-foreground/90"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                            <Check className="h-3 w-3 text-primary" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* CTA — botón que lleva a la subpágina del servicio */}
                    <div className="relative z-10 mt-6 flex flex-col gap-1.5">
                      <a
                        href={s.cta.href}
                        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
                        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/50 active:scale-95"
                      >
                        <span aria-hidden="true">{s.cta.icon}</span>
                        {s.cta.text}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                      <span className="text-[11px] text-muted-foreground/80">
                        ✓ {s.cta.hover}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
