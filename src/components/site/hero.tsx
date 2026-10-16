"use client";

import { ArrowRight, Play, Star, TrendingUp, Bot, DollarSign } from "lucide-react";
import { AnimatedCounter } from "@/components/site/animated-counter";
import { RotatingScrambleText } from "@/components/site/rotating-scramble-text";
import { PremiumHeroBackground } from "@/components/site/premium-hero-background";
import { openAiChat } from "@/lib/open-ai-chat";

const STATS = [
  { value: 150, suffix: "+", label: "PYMES transformadas en Bogotá y LATAM" },
  { value: 340, suffix: "%", label: "ROI promedio en marketing digital" },
  { value: 98, suffix: "%", label: "Retención de clientes en Colombia" },
  { value: 24, suffix: "/7", label: "Soporte dedicado para PYMES" },
];

export function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <PremiumHeroBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 items-center">
          {/* LEFT COLUMN — Text + CTAs */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="hero-fade-in inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              🔥 Diagnóstico gratuito disponible · Agencia en Bogotá · Servimos toda Colombia y LATAM
            </div>

            {/* H1 */}
            <h1 className="hero-fade-in-delay-1 mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[2.8rem] lg:leading-[1.1]">
              Tu negocio pierde clientes por tu{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                web lenta y olvidada
              </span>
            </h1>
            <p className="hero-fade-in-delay-1 mt-2 text-xs text-muted-foreground sm:text-sm">
              Especialistas en hacer crecer PYMES con tecnología e inteligencia artificial
            </p>

            {/* Subtitle */}
            <p className="hero-fade-in-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Rediseñamos tu sitio web con desarrollo web profesional, lo posicionamos en Google y automatizamos tus ventas con marketing digital e IA.{" "}
              <strong className="font-semibold text-foreground">Resultados medibles en 30 días</strong>{" "}
              o te devolvemos tu dinero.
            </p>

            {/* CTAs */}
            <div className="hero-fade-in-delay-3 mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={() => openAiChat({ startBooking: true })}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/50 sm:w-auto"
              >
                🗓️ Agendar diagnóstico gratis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="/demos"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/30 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-indigo-500 sm:w-auto"
              >
                <Play className="h-4 w-4" />
                Ver demo en vivo
              </a>
            </div>
            {/* Microcopy debajo de CTAs */}
            <p className="hero-fade-in-delay-3 mt-3 text-center text-xs text-muted-foreground sm:text-left">
              ✓ Sin tarjeta de crédito · ✓ Sin compromiso · ✓ Respuesta en menos de 2 horas
            </p>

            {/* Social proof */}
            <div className="hero-fade-in-delay-4 mt-7 flex flex-col sm:flex-row items-center gap-4 sm:gap-3 lg:items-start lg:justify-start">
              <div className="flex -space-x-2 sm:-space-x-3">
                {[
                  { img: "/portfolio/donxl.webp", nombre: "Don XL" },
                  { img: "/portfolio/cafeherencia.webp", nombre: "Café Herencia" },
                  { img: "/portfolio/chamanico.webp", nombre: "Chamánico" },
                ].map((cliente, i) => (
                  <img
                    key={i}
                    src={cliente.img}
                    alt={cliente.nombre}
                    title={cliente.nombre}
                    className="h-11 w-11 sm:h-10 sm:w-10 rounded-full border-2 border-background object-cover cursor-default transition-transform hover:scale-125 hover:z-10"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                  <span className="ml-1 text-sm font-semibold text-foreground">4.9/5</span>
                </div>
                <span className="text-xs text-muted-foreground mt-0.5">Don XL, Café Herencia, Chamánico y más clientes confían en nosotros</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Visual cards (visible solo en desktop) */}
          <div className="relative mt-6 lg:mt-0 hidden lg:block">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-radial from-indigo-500/8 to-transparent pointer-events-none" aria-hidden="true" />

            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:block lg:space-y-6">
              {/* Card 1 — Dashboard metric */}
              <div
                className="hero-card-float-1 lg:ml-8 rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-xl lg:shadow-2xl lg:col-span-2 lg:p-5"
              >
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-[10px] text-muted-foreground">Dashboard Impulsala</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-xl font-bold text-green-500">+187%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Tráfico orgánico este mes</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="hero-bar-grow h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                </div>
              </div>

              {/* Card 2 — AI Agent */}
              <div
                className="hero-card-float-2 lg:mr-16 lg:ml-2 rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-xl lg:shadow-2xl lg:p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <span className="text-xs font-semibold text-foreground">Agente IA activo</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">23 conversaciones hoy</p>
                <div className="mt-2 flex items-center gap-1">
                  {["CM", "AL", "JR", "+5"].map((c, i) => (
                    <span
                      key={i}
                      className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[8px] sm:text-[9px] font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, oklch(0.5 0.2 ${260 + i * 40}), oklch(0.5 0.2 ${320 + i * 20}))`,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">clientes atendidos ahora</p>
              </div>

              {/* Card 3 — Revenue */}
              <div
                className="hero-card-float-3 lg:ml-12 lg:mr-4 rounded-xl border border-border/60 bg-card p-3 sm:p-4 shadow-xl lg:shadow-2xl lg:p-5"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-xl font-bold text-indigo-500 dark:text-indigo-400">$2.4M</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Ventas esta semana</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">📈 +34% vs semana pasada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row — desktop: grid 4 columnas, móvil: carrusel deslizable */}
        <div className="hero-fade-in-delay-5 mt-12 flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group relative w-[80%] flex-shrink-0 snap-center overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 transition-colors hover:border-primary/40 sm:w-auto sm:p-5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                  <span className="text-gradient-primary">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de scroll en móvil */}
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {STATS.map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-bar-grow {
          from { width: 0; }
          to { width: 78%; }
        }
        @keyframes hero-float-1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes hero-float-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes hero-float-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .hero-fade-in { animation: hero-fade-in 0.5s ease-out both; }
        .hero-fade-in-delay-1 { animation: hero-fade-in 0.5s ease-out 0.05s both; }
        .hero-fade-in-delay-2 { animation: hero-fade-in 0.5s ease-out 0.12s both; }
        .hero-fade-in-delay-3 { animation: hero-fade-in 0.5s ease-out 0.18s both; }
        .hero-fade-in-delay-4 { animation: hero-fade-in 0.5s ease-out 0.25s both; }
        .hero-fade-in-delay-5 { animation: hero-fade-in 0.5s ease-out 0.4s both; }

        .hero-bar-grow { animation: hero-bar-grow 1.5s ease-out 0.8s both; }

        @media (min-width: 1024px) {
          .hero-card-float-1 { animation: hero-float-1 4s ease-in-out infinite; }
          .hero-card-float-2 { animation: hero-float-2 5s ease-in-out 1s infinite; }
          .hero-card-float-3 { animation: hero-float-3 4.5s ease-in-out 2s infinite; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-in,
          .hero-fade-in-delay-1,
          .hero-fade-in-delay-2,
          .hero-fade-in-delay-3,
          .hero-fade-in-delay-4,
          .hero-fade-in-delay-5,
          .hero-bar-grow,
          .hero-card-float-1,
          .hero-card-float-2,
          .hero-card-float-3 {
            animation: none !important;
          }
          .hero-bar-grow { width: 78% !important; }
        }
      `}</style>
    </section>
  );
}
