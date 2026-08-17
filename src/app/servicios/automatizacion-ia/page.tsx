import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/site/service-page";

export const metadata: Metadata = {
  title: "Automatización con Inteligencia Artificial | Impulsala Colombia",
  description:
    "Implementamos agentes de IA, chatbots inteligentes y automatizaciones que trabajan 24/7. Demo en vivo 5 minutos. Inteligencia artificial aplicada a PYMES en Colombia.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/servicios/automatizacion-ia",
  },
  openGraph: {
    title: "Automatización con Inteligencia Artificial | Impulsala Colombia",
    description:
      "Implementamos agentes de IA, chatbots inteligentes y automatizaciones que trabajan 24/7. Inteligencia artificial aplicada a PYMES en Colombia.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/servicios/automatizacion-ia",
    type: "website",
  },
};

const DATA: ServicePageData = {
  slug: "automatizacion-ia",
  title: "Automatización con IA | Impulsala Colombia",
  h1: "Automatización con IA",
  description: "Inteligencia artificial aplicada a tu negocio",
  metaDescription:
    "Implementamos agentes de IA, chatbots inteligentes y automatizaciones que trabajan 24/7. Inteligencia artificial aplicada a PYMES en Colombia.",
  emoji: "🤖",
  intro:
    "Automatización con inteligencia artificial de última generación. Implementamos agentes de IA, chatbots inteligentes y flujos de trabajo que trabajan 24/7 por ti. La inteligencia artificial aplicada a tu negocio en Colombia. Tus clientes atendidos a las 11pm, leads calificados automáticamente, ventas cerradas sin intervención humana.",
  benefits: [
    "Atención al cliente 24/7 sin contratar personal",
    "Reduce hasta 70% el trabajo repetitivo de tu equipo",
    "Agentes de IA que califican leads y agendan citas solos",
    "Integración con WhatsApp, Instagram, tu CRM y web",
    "GPT-4o y modelos de última generación",
    "Reportes automáticos de conversaciones y ventas",
  ],
  features: [
    {
      title: "Agentes de IA para ventas",
      description:
        "Agentes con GPT-4o que conversan con tus clientes como un humano, califican leads, responden FAQs, agendan citas y cierran ventas. Disponibles 24/7 en tu web, WhatsApp y redes sociales.",
    },
    {
      title: "Chatbots inteligentes",
      description:
        "No son chatbots de árbol de decisión antiguos. Son chatbots con IA generativa que entienden contexto, recordatorio de conversaciones previas y escalamiento a humano cuando es necesario.",
    },
    {
      title: "Automatizaciones de procesos",
      description:
        "Conectamos tus herramientas: cuando llega un lead, se guarda en tu CRM, se envía email de bienvenida, se notifica a tu equipo y se agenda seguimiento. Todo automático con n8n y Zapier.",
    },
    {
      title: "Análisis predictivo con IA",
      description:
        "La inteligencia artificial analiza tus datos de ventas para predecir qué clientes van a comprar, qué productos van a tener más demanda y cuándo. Decisiones con datos, no intuición.",
    },
  ],
  ctaLabel: "Ver demo de IA",
  ctaService: "automatización con IA",
  finalCtaLabel: "Agendar cita para mi automatización con IA",
};

export default function Page() {
  return <ServicePage data={DATA} />;
}
