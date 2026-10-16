import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/site/service-page";

export const metadata: Metadata = {
  title: "SEO y Posicionamiento en Google | Impulsala Bogotá",
  description:
    "Posiciona tu web en los primeros resultados de Google. Auditoría SEO gratis. Estrategias comprobadas para PYMES en Colombia. Resultados en 3-6 meses.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/servicios/seo",
  },
  openGraph: {
    title: "SEO y Posicionamiento en Google | Impulsala Bogotá",
    description:
      "Posiciona tu web en los primeros resultados de Google. Auditoría SEO gratis. Estrategias comprobadas para PYMES en Colombia.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/servicios/seo",
    type: "website",
  },
};

const DATA: ServicePageData = {
  slug: "seo",
  title: "SEO y Posicionamiento en Google | Impulsala Bogotá",
  h1: "SEO y Posicionamiento",
  description: "SEO orgánico avanzado",
  metaDescription:
    "Posiciona tu web en los primeros resultados de Google. Auditoría SEO gratis. Estrategias comprobadas para PYMES en Colombia.",
  emoji: "🔍",
  intro:
    "Tu web puede ser la más bonita del mundo, pero si no aparece en Google, no existe. Nuestro SEO orgánico avanzado posiciona tu sitio en los primeros resultados para las keywords que tus clientes buscan. Especialistas en SEO local para PYMES en Bogotá, Colombia y LATAM.",
  benefits: [
    "Apareces en los primeros resultados de Google",
    "Tráfico orgánico de calidad, sin pagar por clic",
    "Auditoría SEO completa y gratuita",
    "Reportes mensuales transparentes con métricas reales",
    "Optimización on-page, off-page y técnica",
    "Contenido optimizado para tu nicho y ubicación",
  ],
  features: [
    {
      title: "Auditoría SEO inicial",
      description:
        "Analizamos tu web actual: velocidad, estructura, keywords, contenido, backlinks, competencia. Te entregamos un reporte detallado con oportunidades de mejora priorizadas.",
    },
    {
      title: "SEO on-page",
      description:
        "Optimizamos títulos, meta descriptions, headings, imágenes, URLs y contenido de cada página. Cada página está optimizada para una keyword específica.",
    },
    {
      title: "SEO técnico",
      description:
        "Mejoramos velocidad de carga,Core Web Vitals, schema markup, sitemap.xml, robots.txt, indexación y arquitectura de la información. Google ama las webs rápidas y bien estructuradas.",
    },
    {
      title: "Contenido y linkbuilding",
      description:
        "Creamos contenido optimizado para SEO que atrae tráfico orgánico mes tras mes. Estrategia de linkbuilding white-hat para aumentar tu autoridad de dominio.",
    },
  ],
  ctaLabel: "Analizar mi web gratis",
  ctaService: "SEO",
  finalCtaLabel: "Agendar cita para mi SEO",
};

export default function Page() {
  return <ServicePage data={DATA} />;
}
