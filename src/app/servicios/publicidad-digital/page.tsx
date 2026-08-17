import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/site/service-page";

export const metadata: Metadata = {
  title: "Campañas Publicitarias (Google Ads, Meta Ads) | Impulsala Colombia",
  description:
    "Marketing digital que genera leads, no solo likes. Google Ads, Meta Ads, TikTok Ads y YouTube Ads. ROI promedio 340%. Desde $1.5M COP/mes para PYMES en Colombia.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/servicios/publicidad-digital",
  },
  openGraph: {
    title: "Campañas Publicitarias (Google Ads, Meta Ads) | Impulsala Colombia",
    description:
      "Marketing digital que genera leads, no solo likes. Google Ads, Meta Ads, TikTok Ads y YouTube Ads. ROI promedio 340%.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/servicios/publicidad-digital",
    type: "website",
  },
};

const DATA: ServicePageData = {
  slug: "publicidad-digital",
  title: "Campañas Publicitarias | Impulsala Colombia",
  h1: "Campañas Publicitarias",
  description: "Marketing digital con ROI medible",
  metaDescription:
    "Marketing digital que genera leads, no solo likes. Google Ads, Meta Ads, TikTok Ads y YouTube Ads. ROI promedio 340%.",
  emoji: "📢",
  intro:
    "Marketing digital que genera leads, no solo likes. Diseñamos, gestionamos y optimizamos campañas en Google Ads, Meta Ads, TikTok Ads y YouTube Ads para PYMES en Colombia. Cada peso invertido genera resultados medibles. Tu agencia de marketing digital en Bogotá con ROI promedio del 340%.",
  benefits: [
    "ROI promedio del 340% en los primeros 90 días",
    "Leads cualificados, no solo impresiones o clics",
    "Optimización semanal con datos reales, no suposiciones",
    "Segmentación precisa por ubicación, edad, intereses y comportamiento",
    "Reportes transparentes cada semana",
    "Sin contratos de permanencia",
  ],
  features: [
    {
      title: "Google Ads (Search, Display, YouTube)",
      description:
        "Apareces cuando tus clientes te buscan. Search Ads para intención alta, Display para branding, YouTube Ads para alcance masivo. Optimización de calidad de anuncio y costo por clic.",
    },
    {
      title: "Meta Ads (Facebook + Instagram)",
      description:
        "Llega a tus clientes ideales en Facebook e Instagram. Anuncios en feed, stories, reels y marketplace. Creatividades que convierten, no solo se ven bonitas.",
    },
    {
      title: "TikTok Ads",
      description:
        "Aprovecha la red social de más rápido crecimiento en LATAM. Anuncios in-feed, spark ads, topview. Ideal para marcas que quieren conectar con audiencias jóvenes.",
    },
    {
      title: "Landing pages optimizadas",
      description:
        "No basta con buenos anuncios. Creamos landing pages que convierten visitantes en leads. A/B testing, copywriting persuasivo, diseño centrado en conversión.",
    },
  ],
  ctaLabel: "Agendar cita para mis campañas",
  ctaService: "campañas publicitarias",
  finalCtaLabel: "Agendar cita para mis campañas publicitarias",
};

export default function Page() {
  return <ServicePage data={DATA} />;
}
