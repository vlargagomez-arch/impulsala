import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StickyCTA } from "@/components/site/sticky-cta";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import WhatsAppButton from "@/components/site/ai-chat-fab";
import { ArrowRight, Calendar, Check, Clock, Gift, Sparkles, Star } from "lucide-react";
import dynamic from "next/dynamic";

const ContactoPage = dynamic(() => import("@/components/site/contacto-page").then((m) => m.ContactoPage));

export const metadata: Metadata = {
  title: "Diagnóstico Gratuito | Impulsala — Agenda tu Sesión Gratis",
  description:
    "Agenda tu diagnóstico gratuito de 30 minutos. Análisis de tu negocio, oportunidades de crecimiento y plan de acción. Sin costo, sin compromiso. Bogotá, Colombia.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/diagnostico-gratis",
  },
  openGraph: {
    title: "Diagnóstico Gratuito | Impulsala",
    description:
      "Agenda tu diagnóstico gratuito de 30 minutos. Sin costo, sin compromiso. Bogotá, Colombia.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/diagnostico-gratis",
    type: "website",
  },
};

export default function DiagnosticoGratisPage() {
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
            <span className="text-foreground">Diagnóstico gratis</span>
          </nav>

          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" />
              🎁 Oferta limitada — Diagnóstico 100% gratuito
            </span>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Agenda tu{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                diagnóstico gratuito
              </span>{" "}
              de 30 minutos
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              La agencia #1 en Colombia para PYMES. Analizamos tu negocio, identificamos oportunidades de crecimiento y te entregamos un plan de acción a 6 meses. Sin costo, sin compromiso, sin contratos forzosos.
            </p>
            <div className="mt-6 flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-1.5 text-sm font-semibold text-foreground">4.9/5 · 150+ empresas ya crecieron con nosotros</span>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Clock, title: "30 minutos", description: "Sesión por videollamada, sin costo" },
              { icon: Gift, title: "100% gratuito", description: "Sin compromiso, sin tarjeta de crédito" },
              { icon: Check, title: "Plan de acción", description: "Recibes plan a 6 meses por email" },
              { icon: Calendar, title: "Horario flexible", description: "Lun-Vie 9am-6pm (Bogotá)" },
            ].map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                  <b.icon className="h-5 w-5 text-primary" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>

          {/* Embedded contacto form */}
          <ContactoPage />
        </div>
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
