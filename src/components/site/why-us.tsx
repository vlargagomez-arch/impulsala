"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Cpu, HeartHandshake, Check, Zap, TrendingUp, Star, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/site/tilt-card";
import { SectionHeading } from "@/components/site/section-heading";

const DEFINING_QUALITIES = [
  "Sin contratos de permanencia",
  "Reportes transparentes",
  "Soporte técnico 24/7",
  "Consultoría estratégica incluida",
  "ROI medible desde el mes 1",
  "Adaptación ágil al mercado",
];

export function WhyUs() {
  return (
    <section id="por-que-nosotros" className="relative py-20 sm:py-28 noise-overlay">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="02 / 04"
          label="Por qué elegirnos"
          icon={Star}
          title="Tu éxito es"
          highlight="nuestra obsesión"
          description="No somos un proveedor más, somos tu aliado estratégico. Combinamos tecnología, creatividad y datos para transformar tu negocio digital."
        />

        {/* Bento grid — 6 cells in asymmetric layout */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Big cell — Garantía (col-span-2 row-span-2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:row-span-2"
            style={{ perspective: 1200 }}
          >
            <TiltCard max={6} className="h-full">
              <div className="relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card/40 to-card/40 p-7">
                {/* Soft glow decoration (lightweight) */}
                <motion.div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                      100% Garantía
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">
                    Garantía de resultados
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Nos comprometemos con tu éxito. Si no generamos resultados medibles, no nos pagas.
                    Tu confianza es nuestra prioridad y tu crecimiento es nuestra meta.
                  </p>
                </div>
                {/* Bottom mini-stats */}
                <div className="relative mt-6 flex gap-6">
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary">0</div>
                    <div className="text-[11px] text-muted-foreground">Contratos forzosos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary">100%</div>
                    <div className="text-[11px] text-muted-foreground">Compromiso</div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Equipo multidisciplinario */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ perspective: 1200 }}
          >
            <TiltCard max={8} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                      <Users className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-2xl font-bold text-gradient-primary">15+</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Equipo multidisciplinario
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Desarrolladores, diseñadores, estrategas y expertos en IA trabajan juntos en cada
                    proyecto para entregarte soluciones integrales.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Tecnología de punta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ perspective: 1200 }}
          >
            <TiltCard max={8} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                      <Cpu className="h-5 w-5 text-primary" />
                    </span>
                    <span className="text-2xl font-bold text-gradient-primary">24/7</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Tecnología de punta
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Usamos las herramientas y plataformas más avanzadas del mercado. IA,
                    automatización y plataformas siempre a la vanguardia.
                  </p>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Atención personalizada — col-span-2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="sm:col-span-2"
            style={{ perspective: 1200 }}
          >
            <TiltCard max={6} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-md">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
                        <HeartHandshake className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">
                          Atención personalizada
                        </h3>
                        <span className="text-[11px] text-primary">1:1 Dedicación</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Cada negocio es único. No vendemos paquetes genéricos. Analizamos tus
                      necesidades específicas y creamos estrategias a medida.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[Zap, TrendingUp, Sparkles].map((Icon, i) => (
                      <span
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/60"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Defining qualities strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-3xl border border-border/60 bg-card/30 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h3 className="text-xl font-semibold text-foreground">Lo que nos define</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Seis principios no negociables que aplicamos en cada proyecto y en cada relación con
                nuestros clientes.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              {DEFINING_QUALITIES.map((q, i) => (
                <motion.div
                  key={q}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/40 px-3.5 py-2.5 transition-colors hover:border-primary/40"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-sm text-foreground/90">{q}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
