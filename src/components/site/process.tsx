"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Target, Rocket, LineChart, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const STEPS = [
  {
    num: "01",
    icon: ClipboardCheck,
    title: "Diagnóstico gratuito",
    duration: "1-2 días",
    description:
      "Analizamos tu negocio, competencia, mercado actual y presencia digital. Identificamos oportunidades de crecimiento con un enfoque basado en datos.",
  },
  {
    num: "02",
    icon: Target,
    title: "Estrategia personalizada",
    duration: "3-5 días",
    description:
      "Diseñamos un plan de acción a medida basado en tus objetivos, presupuesto y timeline. Metas medibles y plazos definidos.",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Ejecución integral",
    duration: "Continuo",
    description:
      "Nuestro equipo multidisciplinario implementa la estrategia: desarrollamos, optimizamos, lanzamos campañas y configuramos automatizaciones.",
  },
  {
    num: "04",
    icon: LineChart,
    title: "Medición y optimización",
    duration: "Permanente",
    description:
      "Monitoreamos resultados en tiempo real, optimizamos campañas y procesos continuamente. Reportes transparentes con métricas claras.",
  },
];

export function Process() {
  return (
    <section id="proceso" className="relative py-20 sm:py-28 noise-overlay">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03 / 04"
          label="Cómo trabajamos"
          icon={Workflow}
          title="Un proceso"
          highlight="claro y efectivo"
          description="Metodología probada que garantiza resultados. Desde el primer contacto hasta el crecimiento continuo, cada paso maximiza tu ROI."
        />

        <div className="relative mt-14">
          {/* Animated connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-12 hidden h-px origin-left bg-gradient-to-r from-primary via-accent to-primary lg:block"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative"
                style={{ perspective: 1000 }}
              >
                <div
                  className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/50"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Spotlight on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="relative" style={{ transform: "translateZ(30px)" }}>
                    {/* Step number badge */}
                    <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-background shadow-lg">
                      <span className="text-2xl font-bold text-gradient-primary">
                        {s.num}
                      </span>
                      {/* Pulsing ring */}
                      <span className="absolute inset-0 rounded-2xl border border-primary/30 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    <div className="mt-4 flex justify-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20 transition-transform group-hover:scale-110">
                        <s.icon className="h-5 w-5 text-primary" />
                      </span>
                    </div>

                    <h3 className="mt-4 text-center text-base font-semibold text-foreground">
                      {s.title}
                    </h3>

                    <span className="mt-1.5 block text-center text-[11px] font-medium uppercase tracking-wider text-primary">
                      {s.duration}
                    </span>

                    <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
