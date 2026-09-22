"use client";

import { motion } from "framer-motion";
import { DollarSign, Repeat, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { TiltCard } from "@/components/site/tilt-card";
import { AnimatedCounter } from "@/components/site/animated-counter";
import { SectionHeading } from "@/components/site/section-heading";

const IMPACT = [
  {
    value: 2.5,
    prefix: "$",
    suffix: "M+",
    decimals: 1,
    label: "Ingresos generados para clientes",
    icon: DollarSign,
    color: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    value: 94,
    suffix: "%",
    decimals: 0,
    label: "Tasa de retención",
    icon: Repeat,
    color: "from-cyan-500/20 to-cyan-500/0",
  },
  {
    value: 3.2,
    suffix: "x",
    decimals: 1,
    label: "ROI promedio entregado",
    icon: TrendingUp,
    color: "from-amber-500/20 to-amber-500/0",
  },
  {
    value: 2,
    prefix: "<",
    suffix: "h",
    decimals: 0,
    label: "Tiempo de respuesta promedio",
    icon: Clock,
    color: "from-fuchsia-500/20 to-fuchsia-500/0",
  },
];

export function Impact() {
  return (
    <section id="impacto" className="relative py-20 sm:py-28 noise-overlay">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="05 / 05"
          label="Nuestro impacto"
          icon={BarChart3}
          title="Resultados que hablan"
          highlight="por sí solos"
          description="Números reales que reflejan el compromiso con el crecimiento sostenible de cada cliente. Estos son los resultados que entregamos mes a mes."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {IMPACT.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ perspective: 1000 }}
            >
              <TiltCard max={10} className="h-full">
                <div
                  className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 text-center transition-colors hover:border-primary/40 sm:p-8"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative" style={{ transform: "translateZ(40px)" }}>
                    <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                      <m.icon className="h-5 w-5 text-primary" />
                    </span>
                    <div className="text-4xl font-bold tracking-tight sm:text-5xl">
                      <span className="text-gradient-animated">
                        <AnimatedCounter
                          value={m.value}
                          decimals={m.decimals}
                          prefix={m.prefix}
                          suffix={m.suffix}
                        />
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground sm:text-sm">
                      {m.label}
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
