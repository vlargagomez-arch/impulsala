import type { Metadata } from "next";
import { ServicePage, type ServicePageData } from "@/components/site/service-page";

export const metadata: Metadata = {
  title: "Desarrollo Web Profesional en Bogotá | Impulsala",
  description:
    "Desarrollo web a medida para PYMES en Colombia: e-commerce, CRM, aplicaciones web y sistemas internos. Presupuesto en 24 horas. Resultados garantizados.",
  alternates: {
    canonical: "https://w14nq5fjb3z1-d.space-z.ai/servicios/desarrollo-web",
  },
  openGraph: {
    title: "Desarrollo Web Profesional en Bogotá | Impulsala",
    description:
      "Desarrollo web a medida para PYMES en Colombia: e-commerce, CRM, aplicaciones web y sistemas internos.",
    url: "https://w14nq5fjb3z1-d.space-z.ai/servicios/desarrollo-web",
    type: "website",
  },
};

const DATA: ServicePageData = {
  slug: "desarrollo-web",
  title: "Desarrollo Web Profesional en Bogotá | Impulsala",
  h1: "Desarrollo Web",
  description: "Desarrollo web profesional",
  metaDescription:
    "Desarrollo web a medida para PYMES en Colombia: e-commerce, CRM, aplicaciones web y sistemas internos. Presupuesto en 24 horas.",
  emoji: "💻",
  intro:
    "Creamos sitios web y aplicaciones a medida que cargan rápido, se ven increíbles y convierten visitantes en clientes. Especialistas en desarrollo web para PYMES en Bogotá y toda Colombia. Tu proyecto de desarrollo web entregado en tiempo récord.",
  benefits: [
    "Sitios web que cargan en menos de 2 segundos",
    "Diseño responsivo que se ve perfecto en móvil, tablet y PC",
    "Código limpio y escalable, fácil de mantener",
    "Integración con pasarelas de pago y herramientas que ya usas",
    "Panel de administración intuitivo, sin conocimientos técnicos",
    "Soporte técnico 24/7 en español",
  ],
  features: [
    {
      title: "Sitios web corporativos",
      description:
        "Tu presencia digital profesional con desarrollo web de alto nivel. Páginas que comunican tu propuesta de valor y generan confianza desde el primer scroll.",
    },
    {
      title: "Plataformas e-commerce",
      description:
        "Tiendas online que venden solas. Integración con Wompi, PayU, Mercado Pago y todas las pasarelas de pago de Colombia. Carrito de compras, gestión de inventario y analíticas.",
    },
    {
      title: "CRM y sistemas internos",
      description:
        "Software a medida para tu empresa. Gestión de clientes, inventarios, facturación, reportes. Automatizamos lo que hoy haces manualmente.",
    },
    {
      title: "Aplicaciones web progresivas (PWA)",
      description:
        "Apps que funcionan offline y se instalan como aplicaciones nativas. La mejor experiencia de usuario sin pagar comisiones a App Store o Play Store.",
    },
  ],
  ctaLabel: "Cotizar mi proyecto",
  ctaService: "página web",
  finalCtaLabel: "Agendar cita para mi página web",
};

export default function Page() {
  return <ServicePage data={DATA} />;
}
