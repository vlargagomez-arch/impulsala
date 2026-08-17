"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Workflow, Play, Sparkles, Zap, Clock,
  CheckCircle2, ArrowRight, Smartphone, Gauge, Shield,
} from "lucide-react";
import dynamic from "next/dynamic";
import { SectionHeading } from "@/components/site/section-heading";

// Lazy-load demos pesados: solo se carga el demo que el usuario activa
// (El Agente de IA se quitó de aquí porque ya está disponible como botón flotante)
const SeoAnalyzerDemo = dynamic(() => import("@/components/site/demos/seo-analyzer"));
const AutomationDemo = dynamic(() => import("@/components/site/demos/automation-flow"));
const PortfolioDemo = dynamic(() => import("@/components/site/demos/portfolio"));

type DemoId = "seo" | "portfolio" | "automation";

type DemoConfig = {
  id: DemoId;
  label: string;
  shortLabel: string;
  description: string;
  howItWorks: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  colorClass: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  tag: string;
  features: string[];
  estimatedTime: string;
};

const DEMOS: DemoConfig[] = [
  {
    id: "seo",
    label: "Analizador SEO",
    shortLabel: "Analizador SEO",
    description: "Analiza el HTML real de cualquier web: title, meta tags, headings, seguridad SSL, tecnologías detectadas y más.",
    howItWorks: "Ingresa la URL de tu web o la de tu competencia. Analizamos el SEO real en segundos: title, meta tags, headings, imágenes, SSL, velocidad y más. Te mostramos las falencias y un plan de acción para corregirlas.",
    icon: Search,
    color: "var(--accent)",
    colorClass: "text-cyan-400",
    gradientFrom: "from-cyan-500/20",
    gradientTo: "to-cyan-500/5",
    borderColor: "border-cyan-500/30",
    tag: "Herramienta",
    features: ["Fetch real del HTML de cualquier URL", "Análisis de title, meta tags y headings", "Detección de SSL y tecnologías", "Score por categoría + plan de acción"],
    estimatedTime: "30 seg",
  },
  {
    id: "automation",
    label: "Automatizaciones",
    shortLabel: "Automatizaciones",
    description: "6 flujos visuales profesionales: e-commerce, marketing, redes, onboarding, reseñas y reportes.",
    howItWorks: "Selecciona un flujo (ej: venta e-commerce). Pulsa 'Ejecutar Flujo' y ve cómo cada paso se completa automáticamente: factura, email, WhatsApp, inventario. Así se vería tu negocio automatizado.",
    icon: Workflow,
    color: "oklch(0.78 0.18 95)",
    colorClass: "text-amber-400",
    gradientFrom: "from-amber-500/20",
    gradientTo: "to-amber-500/5",
    borderColor: "border-amber-500/30",
    tag: "6 Flujos Reales",
    features: ["6 flujos: e-commerce, marketing, redes, onboarding, reseñas, reportes", "Diagrama visual con nodos conectados", "Ejecución paso a paso en tiempo real", "120h ahorradas al mes en promedio"],
    estimatedTime: "3 min",
  },
  {
    id: "portfolio",
    label: "Portafolio",
    shortLabel: "Portafolio",
    description: "Mira ejemplos reales de páginas web que hemos diseñado. Haz clic para ver la demo en vivo.",
    howItWorks: "5 proyectos reales en producción: Don XL (perros calientes), Café Herencia (galería y café), Chamánico (restaurante), BCSbrand (artículos promocionales) y Raval Bienes Raíces. Cada uno con resultados y mejoras implementadas.",
    icon: Sparkles,
    color: "oklch(0.7 0.2 320)",
    colorClass: "text-violet-400",
    gradientFrom: "from-violet-500/20",
    gradientTo: "to-violet-500/5",
    borderColor: "border-violet-500/30",
    tag: "Casos de Éxito",
    features: ["6 proyectos de diferentes sectores", "Cada proyecto con demo en vivo", "Resultados reales (conversión, tráfico, ventas)", "Filtros por categoría"],
    estimatedTime: "2 min",
  },
];

const BENEFITS = [
  { icon: Smartphone, title: "Responsive", desc: "Se adapta a móvil, tablet y desktop" },
  { icon: Gauge, title: "Ultra rápido", desc: "Carga en menos de 1 segundo" },
  { icon: Shield, title: "Seguro", desc: "Cifrado SSL y datos protegidos" },
  { icon: Zap, title: "Automático", desc: "Trabaja 24/7 sin intervención" },
];

export default function Demos() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("seo");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const currentDemo = DEMOS.find((d) => d.id === activeDemo)!;

  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector(`[data-tab="${activeDemo}"]`) as HTMLElement;
    if (!activeTab) return;
    const containerRect = tabsRef.current.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    setIndicatorStyle({ left: tabRect.left - containerRect.left, width: tabRect.width });
  }, [activeDemo]);

  return (
    <section id="demos" className="relative bg-background py-20 sm:py-28 noise-overlay">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="04 / 05"
          label="Demos interactivas"
          icon={Play}
          title="Prueba nuestros servicios"
          highlight="en vivo"
          description="No solo te lo contamos, te lo demostramos. Interactúa con herramientas reales y descubre el poder de lo que podemos construir para tu negocio."
        />

        {/* Tabs */}
        <div className="mt-10">
          <div ref={tabsRef} className="scrollbar-thin relative flex gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-2">
            <motion.div className="absolute top-2 bottom-2 rounded-xl bg-primary/15 ring-1 ring-primary/30" animate={{ left: indicatorStyle.left, width: indicatorStyle.width }} transition={{ type: "spring", stiffness: 300, damping: 30 }} style={{ left: indicatorStyle.left, width: indicatorStyle.width }} />
            {DEMOS.map((demo) => {
              const isActive = demo.id === activeDemo;
              return (
                <button key={demo.id} data-tab={demo.id} onClick={() => setActiveDemo(demo.id)} className={`group relative z-10 flex flex-1 sm:flex-none flex-shrink-0 items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl px-2 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <demo.icon className="h-4 w-4 flex-shrink-0 transition-colors" style={isActive ? { color: demo.color } : undefined} />
                  <span className="hidden sm:inline">{demo.label}</span>
                  <span className="sm:hidden">{demo.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explicación compacta de la demo activa — solo desktop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDemo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-4 hidden rounded-2xl border border-border/60 bg-card/40 p-4 sm:block"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              {/* Left: icon + title + description */}
              <div className="flex items-start gap-3 flex-1">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${currentDemo.borderColor} bg-gradient-to-br ${currentDemo.gradientFrom} ${currentDemo.gradientTo}`}>
                  <currentDemo.icon className={`h-5 w-5 ${currentDemo.colorClass}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground">{currentDemo.label}</h3>
                    <span className={`rounded-full border ${currentDemo.borderColor} ${currentDemo.colorClass} px-2 py-0.5 text-[9px] font-semibold`}>{currentDemo.tag}</span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" />{currentDemo.estimatedTime}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{currentDemo.howItWorks}</p>
                </div>
              </div>
              {/* Right: features (desktop only) */}
              <div className="hidden lg:flex flex-shrink-0 flex-col gap-1.5 border-l border-border/40 pl-4">
                {currentDemo.features.slice(0, 3).map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 flex-shrink-0" style={{ color: currentDemo.color }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Demo container (app window style) */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDemo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card/80"
            >
              {/* Top bar */}
              <div className="flex items-center gap-3 border-b border-border/60 bg-secondary/30 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full" style={{ background: "#ef4444" }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: "#10b981" }} />
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-3 py-1 text-[11px] text-muted-foreground">
                    <currentDemo.icon className="h-3 w-3" style={{ color: currentDemo.color }} />
                    <span>impulsala.com/demos/{currentDemo.id}</span>
                  </div>
                </div>
                <span className={`hidden items-center gap-1 rounded-md border ${currentDemo.borderColor} px-2 py-0.5 text-[10px] font-medium ${currentDemo.colorClass} sm:flex`}>
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: currentDemo.color }} />
                  EN VIVO
                </span>
              </div>
              {/* Demo content */}
              <div className="p-4 sm:p-6">
                {currentDemo.id === "seo" && <SeoAnalyzerDemo />}
                {currentDemo.id === "portfolio" && <PortfolioDemo />}
                {currentDemo.id === "automation" && <AutomationDemo />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Benefits strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/40 p-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <b.icon className="h-4.5 w-4.5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{b.title}</p>
                <p className="text-[10px] text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
