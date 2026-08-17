import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StickyCTA } from "@/components/site/sticky-cta";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { ArrowRight, Code2, Search, Megaphone, Bot, Star } from "lucide-react";
import { Services } from "@/components/site/services";

export const metadata: Metadata = {
  title: "Servicios de Desarrollo Web, SEO, Marketing Digital e IA | Impulsala Bogotá",
  description:
    "Agencia digital en Bogotá, Colombia. Desarrollo web, SEO orgánico, campañas publicitarias y automatización con IA. Especialistas en PYMES. Diagnóstico gratis.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/servicios",
  },
  openGraph: {
    title: "Servicios de Desarrollo Web, SEO, Marketing Digital e IA | Impulsala Bogotá",
    description:
      "Agencia digital en Bogotá, Colombia. Desarrollo web, SEO, marketing digital y automatización con IA para PYMES.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/servicios",
    type: "website",
  },
};

const SERVICES_OVERVIEW = [
  {
    href: "/servicios/desarrollo-web",
    icon: Code2,
    title: "Desarrollo Web",
    description: "Sitios web y aplicaciones a medida para PYMES en Bogotá y Colombia.",
    cta: "💻 Cotizar mi proyecto",
  },
  {
    href: "/servicios/seo",
    icon: Search,
    title: "SEO y Posicionamiento",
    description: "Posiciona tu web en los primeros resultados de Google. Auditoría gratis.",
    cta: "🔍 Analizar mi web gratis",
  },
  {
    href: "/servicios/publicidad-digital",
    icon: Megaphone,
    title: "Campañas Publicitarias",
    description: "Marketing digital con ROI medible. Google Ads, Meta Ads, TikTok Ads.",
    cta: "📢 Ver paquetes de Ads",
  },
  {
    href: "/servicios/automatizacion-ia",
    icon: Bot,
    title: "Automatización con IA",
    description: "Agentes de IA, chatbots y automatizaciones que trabajan 24/7.",
    cta: "🤖 Ver demo de IA",
  },
];

export default function ServiciosPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <ScrollProgress />
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-foreground">Servicios</span>
          </nav>

          {/* Hero */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Servicios para{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                PYMES en Bogotá
              </span>{" "}
              y toda Colombia
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Agencia digital especializada en desarrollo web, SEO, marketing digital y automatización con inteligencia artificial. Soluciones completas para hacer crecer tu negocio en Colombia y LATAM.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-1.5 text-sm font-semibold text-foreground">4.9/5 · 150+ empresas en Colombia</span>
            </div>
          </div>

          {/* Service cards grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SERVICES_OVERVIEW.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border/60 bg-secondary/40">
                    <s.icon className="h-6 w-6 text-primary" />
                  </span>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">{s.title}</h2>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {s.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-border/60 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-transparent p-8 backdrop-blur-sm text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              ¿No sabes qué servicio necesitas?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Agenda un diagnóstico gratuito de 30 minutos. Analizamos tu negocio y te recomendamos el camino más rápido para crecer. Sin compromiso.
            </p>
            <a
              href="/diagnostico-gratis"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
            >
              🗓️ Agendar diagnóstico gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              ✓ Sin tarjeta de crédito · ✓ Sin compromiso · ✓ Respuesta en menos de 2 horas
            </p>
          </div>
        </div>

        {/* Reuse the Services section component for visual consistency */}
        <div className="mt-16">
          <Services />
        </div>
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
