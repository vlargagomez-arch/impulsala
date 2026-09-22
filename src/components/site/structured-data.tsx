const SITE_URL = "https://w14nq5fjb3z1-d.space-z.ai";

/**
 * StructuredData — Schema.org JSON-LD scripts.
 *
 * Componente servidor puro (sin JS cliente).
 * Se renderiza al final del body para no bloquear el primer paint.
 * Los motores de búsqueda lo parsean igual sin importar dónde esté.
 */
export function StructuredData() {
  const schemas = [
    // 1. LocalBusiness / ProfessionalService
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Impulsala",
      description:
        "Agencia de desarrollo web, SEO, marketing digital y automatización con IA en Bogotá, Colombia",
      url: SITE_URL,
      telephone: "+57-319-635-4992",
      email: "contacto@impulsala.co",
      priceRange: "$$",
      openingHours: "Mo-Fr 08:00-18:00",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CO",
        addressLocality: "Bogotá",
      },
      sameAs: [
        "https://linkedin.com/company/impulsala",
        "https://instagram.com/impulsala",
        "https://twitter.com/impulsala",
        "https://youtube.com/@impulsala",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "150",
        bestRating: "5",
        worstRating: "1",
      },
    },
    // 2. Service Catalog
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Desarrollo Web, SEO, Marketing Digital y Automatización con IA",
      provider: { "@type": "ProfessionalService", name: "Impulsala", url: SITE_URL },
      areaServed: ["Colombia", "México", "Argentina", "Perú", "Chile", "Ecuador"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios Digitales Impulsala",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Desarrollo de Software",
              description: "Aplicaciones web, plataformas e-commerce, CRM y sistemas a medida",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Mejoramiento Web + SEO",
              description: "Rediseño web, optimización de velocidad, SEO orgánico avanzado",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Campañas Publicitarias",
              description: "Google Ads, Meta Ads, TikTok Ads, YouTube Ads",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Automatizaciones + IA",
              description: "Chatbots inteligentes, flujos automatizados, agentes de venta con IA",
            },
          },
        ],
      },
    },
    // 3. FAQPage
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cuánto cuesta desarrollar una página web?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Depende de tus necesidades. Ofrecemos proyectos desde $500,000 COP. Agenda un diagnóstico gratuito y te damos una cotización personalizada sin compromiso.",
          },
        },
        {
          "@type": "Question",
          name: "¿En cuánto tiempo ven resultados del SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El SEO orgánico muestra mejoras visibles entre 1 y 2 meses máximo. Las campañas de Ads pueden mostrar resultados desde la semana 2. Las automatizaciones empiezan a ahorrar tiempo desde la primera semana.",
          },
        },
        {
          "@type": "Question",
          name: "¿Ofrecen garantía de resultados?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Si después de 30 días no generamos resultados medibles, seguimos trabajando sin costo hasta lograrlos. Sin contratos de permanencia obligatorios.",
          },
        },
        {
          "@type": "Question",
          name: "¿Trabajan con empresas de cualquier tamaño?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Trabajamos con todo tipo de empresas: negocios pequeños, medianos y grandes. Desde emprendedores hasta corporaciones. Si necesitas una automatización, se te hace, sin importar el tamaño de tu negocio.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué países trabajan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tenemos base en Bogotá, Colombia, pero trabajamos remotamente con clientes en toda LATAM: México, Argentina, Perú, Chile, Ecuador y más.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué incluye el diagnóstico gratuito?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Análisis de tu presencia digital actual, identificación de oportunidades de crecimiento, propuesta inicial con métricas estimadas y plan de acción a 6 meses. Todo sin costo ni compromiso.",
          },
        },
      ],
    },
    // 4. BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      ],
    },
    // 5. Review #1 — Carlos Méndez
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "ProfessionalService", name: "Impulsala" },
      author: { "@type": "Person", name: "Carlos Méndez" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "En 3 meses pasamos de 200 a 1,800 visitas orgánicas. Impulsala no solo rediseñó nuestra web, nos enseñaron marketing digital de verdad. La mejor inversión para PYMES en Bogotá.",
      publisher: { "@type": "Organization", name: "TechSolutions MX" },
    },
    // 6. Review #2 — Andrea López
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "ProfessionalService", name: "Impulsala" },
      author: { "@type": "Person", name: "Andrea López" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "El agente de IA atiende a mis clientes a las 11pm. Pasamos de 5 a 17 ventas diarias. La inteligencia artificial de verdad funciona. La mejor agencia de marketing digital en Colombia.",
      publisher: { "@type": "Organization", name: "FitPro Colombia" },
    },
    // 7. Review #3 — Javier Rodríguez
    {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: { "@type": "ProfessionalService", name: "Impulsala" },
      author: { "@type": "Person", name: "Javier Rodríguez" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Como PYME, necesitábamos resultados rápidos. Redujeron nuestro costo por lead en Google Ads un 60%. Mismo presupuesto, 2.5x más leads. Empresas de Bogotá confían en ellos por algo.",
      publisher: { "@type": "Organization", name: "Constructora Bogotá" },
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
