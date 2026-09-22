"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { ArrowRight, Check, Star, Sparkles, Play } from "lucide-react";

// Lazy-load de componentes below-the-fold para que la página cargue más rápido
const Footer = dynamic(() => import("@/components/site/footer").then((m) => m.Footer));
const StickyCTA = dynamic(() => import("@/components/site/sticky-cta").then((m) => m.StickyCTA));
const WhatsAppButton = dynamic(() => import("@/components/site/ai-chat-fab"), {
  ssr: false,
});

export type ServicePageData = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  metaDescription: string;
  emoji: string;
  intro: string;
  benefits: string[];
  features: { title: string; description: string }[];
  ctaLabel: string;
  /** Servicio que se pasa al chatbot para que arranque el flujo de agendamiento */
  ctaService?: string;
  /** Si se define, el CTA principal abre esta URL en vez del chatbot */
  ctaHref?: string;
  /** Texto del CTA final */
  finalCtaLabel?: string;
};

/** Dispara el evento global que abre el chatbot flotante y arranca el flujo de agendamiento */
function openChatbotAndBook(service?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { startBooking: true, service },
      })
    );
  }
}

export function ServicePage({ data }: { data: ServicePageData }) {
  return <ServicePageContent data={data} />;
}

function ServicePageContent({ data }: { data: ServicePageData }) {
  const finalLabel = data.finalCtaLabel || "Agendar cita gratis";

  // Botón de CTA — si ctaHref existe, usa <a href>; si no, abre el chatbot y arranca el booking
  const CtaButton = ({
    label,
    className = "",
    showArrow = true,
  }: {
    label: string;
    className?: string;
    showArrow?: boolean;
  }) => {
    if (data.ctaHref) {
      return (
        <a
          href={data.ctaHref}
          className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/50 sm:w-auto ${className}`}
        >
          {label}
          {showArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </a>
      );
    }
    return (
      <button
        type="button"
        onClick={() => openChatbotAndBook(data.ctaService)}
        className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/50 sm:w-auto ${className}`}
      >
        {label}
        {showArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
    );
  };

  // Servicios relacionados para mostrar al final
  const RELATED_SERVICES: { label: string; href: string; emoji: string }[] = [
    { label: "Desarrollo Web", href: "/servicios/desarrollo-web", emoji: "💻" },
    { label: "SEO y Posicionamiento", href: "/servicios/seo", emoji: "🔍" },
    { label: "Campañas Publicitarias", href: "/servicios/publicidad-digital", emoji: "📢" },
    { label: "Automatización con IA", href: "/servicios/automatizacion-ia", emoji: "🤖" },
  ];

  // Filtra el servicio actual de la lista de relacionados
  const related = RELATED_SERVICES.filter((s) => s.href !== `/servicios/${data.slug}`);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/servicios" className="hover:text-foreground transition-colors">Servicios</Link>
            <span>/</span>
            <span className="text-foreground">{data.h1}</span>
          </nav>

          {/* Hero */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" />
              {data.emoji} {data.h1}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {data.h1} en{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Bogotá y toda Colombia
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {data.intro}
            </p>
            <div className="mt-6 flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-1.5 text-sm font-semibold text-foreground">4.9/5 · 150+ empresas en Colombia</span>
            </div>
          </div>

          {/* CTA principal */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton label={`${data.emoji} ${data.ctaLabel}`} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ✓ Sin tarjeta de crédito · ✓ Sin compromiso · ✓ Respuesta en menos de 2 horas
          </p>

          {/* Benefits */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              ¿Por qué elegir nuestro {data.h1.toLowerCase()}?
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.benefits.map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="text-sm text-foreground/90">{b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Qué incluye nuestro servicio
            </h2>
            <div className="mt-6 space-y-4">
              {data.features.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm"
                >
                  <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Final — única tarjeta */}
          <section className="mt-16 rounded-2xl border border-border/60 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent p-8 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              ¿Listo para empezar?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Agenda tu cita gratuita de 30 minutos con nuestro equipo. Revisamos tu caso y te damos una propuesta personalizada, sin compromiso.
            </p>
            <div className="mt-6 flex justify-center">
              <CtaButton label={`🗓️ ${finalLabel}`} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              📅 Horarios disponibles: Lunes a Viernes, 9am - 6pm (Bogotá, Colombia)
            </p>
          </section>

          {/* Servicios relacionados */}
          <section className="mt-12">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl text-center">
              Otros servicios que podrían interesarte
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-indigo-500/40 hover:bg-card/60"
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-foreground/90">{s.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-indigo-500" />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/demos"
                className="group relative block overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent p-5 transition-all hover:border-indigo-500/40 hover:from-indigo-500/15 hover:to-fuchsia-500/10 sm:p-6"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                    <Play className="h-5 w-5 text-white fill-white sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground sm:text-base">
                      Ver demos interactivas en vivo
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                      Prueba nuestros chatbots, dashboards y automatizaciones en tiempo real
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-indigo-500 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
