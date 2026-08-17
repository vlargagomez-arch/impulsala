import dynamic from "next/dynamic";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { ClientMarquee } from "@/components/site/client-marquee";
import { ScrollProgress } from "@/components/site/top-progress-bar";
import { StickyCTA } from "@/components/site/sticky-cta";
import { ChevronDown } from "lucide-react";

// Lazy-load below-fold components for faster initial page load
const Demos = dynamic(() => import("@/components/site/demos").then((m) => m.default));
const Services = dynamic(() => import("@/components/site/services").then((m) => m.Services));
const WhyUs = dynamic(() => import("@/components/site/why-us").then((m) => m.WhyUs));
const Process = dynamic(() => import("@/components/site/process").then((m) => m.Process));
const Footer = dynamic(() => import("@/components/site/footer").then((m) => m.Footer));
// Botón flotante del Agente IA — lazy-loaded (666 líneas, no es crítico para LCP)
const WhatsAppButton = dynamic(() => import("@/components/site/ai-chat-fab"));

const FAQ_ITEMS = [
  {
    q: "¿Cuánto cuesta desarrollar una página web?",
    a: "Depende de tus necesidades. Ofrecemos proyectos desde $500,000 COP. Agenda un diagnóstico gratuito y te damos una cotización personalizada sin compromiso. El precio varía según el alcance: número de páginas, funcionalidades (e-commerce, reservas, login), integraciones con APIs externas y nivel de personalización del diseño.",
  },
  {
    q: "¿En cuánto tiempo veo resultados del SEO?",
    a: "El SEO orgánico muestra mejoras visibles entre 1 y 2 meses máximo. Las campañas de Google Ads y Meta Ads pueden mostrar resultados desde la semana 2. Las automatizaciones con IA empiezan a ahorrar tiempo desde la primera semana de implementación. Trabajamos con ROI medible desde el primer mes.",
  },
  {
    q: "¿Ofrecen garantía de resultados?",
    a: "Sí. Si después de 30 días no generamos resultados medibles, seguimos trabajando sin costo hasta lograrlos. Sin contratos de permanencia obligatorios. Tu confianza es nuestra prioridad y tu crecimiento es nuestra meta.",
  },
  {
    q: "¿Trabajan con empresas de cualquier tamaño?",
    a: "Trabajamos con todo tipo de empresas: negocios pequeños, medianos y grandes. Desde emprendedores hasta corporaciones. Cada proyecto se adapta al presupuesto y objetivos del cliente. Si necesitas una automatización, se te hace, sin importar el tamaño de tu negocio.",
  },
  {
    q: "¿En qué países trabajan?",
    a: "Tenemos base en Bogotá, Colombia, pero trabajamos remotamente con clientes en toda LATAM: México, Argentina, Perú, Chile, Ecuador y más. Todo nuestro proceso es 100% remoto con videollamadas y entrega digital.",
  },
  {
    q: "¿Qué incluye el diagnóstico gratuito?",
    a: "Análisis de tu presencia digital actual, identificación de oportunidades de crecimiento, propuesta inicial con métricas estimadas y plan de acción a 6 meses. Todo sin costo ni compromiso. La sesión dura 30 minutos por videollamada.",
  },
  {
    q: "¿Usan inteligencia artificial en sus servicios?",
    a: "Sí. Implementamos agentes de IA con GPT-4o para ventas 24/7, chatbots inteligentes, automatización de procesos con n8n, análisis predictivo de campañas publicitarias y generación de contenido con IA. La inteligencia artificial está integrada en todos nuestros servicios para PYMES en Colombia.",
  },
  {
    q: "¿Pueden rediseñar mi página web actual?",
    a: "Sí. Rediseñamos sitios web existentes mejorando velocidad, SEO, diseño UX/UI y conversión. Trabajamos con WordPress, Shopify, Wix y plataformas custom. Migramos tu contenido sin perder datos ni posicionamiento SEO.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        {/* 1. QUÉ HACEMOS */}
        <Hero />

        {/* 2. PRUEBA SOCIAL */}
        <ClientMarquee />

        {/* 3. DEMOS EN VIVO — primero para enganchar al cliente */}
        <Demos />

        {/* 4. QUÉ OFRECEMOS */}
        <Services />

        {/* 5. POR QUÉ ELEGIRNOS */}
        <WhyUs />

        {/* 6. CÓMO TRABAJAMOS */}
        <Process />

        {/* 7. FAQ — SEO + Featured Snippets */}
        <section id="faq" className="relative py-20 sm:py-28 noise-overlay scroll-mt-20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground">
                Preguntas frecuentes
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-foreground">
                Resolvemos tus dudas
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Todo lo que necesitas saber sobre desarrollo web, SEO, marketing digital e inteligencia artificial para PYMES en Bogotá y Colombia
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group rounded-xl border border-border/60 bg-card/60">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm font-semibold text-foreground">
                    {item.q}
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />
      <WhatsAppButton />
    </div>
  );
}
