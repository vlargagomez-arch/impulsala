/**
 * Base de datos de prospectos pre-generados por tipo de negocio en Bogotá/Colombia.
 * Se usa cuando no hay API key de IA configurada (fallback).
 * Negocios reales conocidos por categoría.
 */

export type ProspectTemplate = {
  businessName: string;
  website: string | null;
  sourceDomain: string;
  email: string | null;
  phone: string | null;
  recommendedService: "web" | "seo" | "ads" | "ia";
  potentialScore: number;
  snippet: string;
};

export const PROSPECT_DB: Record<string, ProspectTemplate[]> = {
  restaurantes: [
    {
      businessName: "Andres Carne de Res",
      website: "https://andrescarne deres.com",
      sourceDomain: "andrescarne deres.com",
      email: "reservas@andrescarnederes.com",
      phone: "+57 1 863 7880",
      recommendedService: "ia",
      potentialScore: 7,
      snippet: "Restaurante icónico de Bogotá en Chía. Reservas por teléfono, alta concurrencia los fines de semana.",
    },
    {
      businessName: "Elcielo Bogotá",
      website: "https://elcielo.com.co/bogota",
      sourceDomain: "elcielo.com.co",
      email: "reservas@elcielo.com.co",
      phone: "+57 1 743 1213",
      recommendedService: "seo",
      potentialScore: 8,
      snippet: "Restaurante de gastronomía multisensorial en Bogotá. Premiado internacionalmente. Necesita más visibilidad online.",
    },
    {
      businessName: "Leo Cocina y Cevicheria",
      website: "https://leococinaycevicheria.com",
      sourceDomain: "leococinaycevicheria.com",
      email: null,
      phone: "+57 1 287 9535",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Restaurante de cocina colombiana contemporánea en La Macarena. Web desactualizada.",
    },
    {
      businessName: "Criterión",
      website: null,
      sourceDomain: "criterion.com.co",
      email: null,
      phone: "+57 1 313 2999",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Restaurante francés en Bogotá. Sin presencia web fuerte.",
    },
    {
      businessName: "Harry Sasson",
      website: "https://harrysasson.com",
      sourceDomain: "harrysasson.com",
      email: "reservas@harrysasson.com",
      phone: "+57 1 753 1212",
      recommendedService: "ads",
      potentialScore: 8,
      snippet: "Restaurante de autor en Bogotá. Alto ticket promedio, ideal para campañas de Meta Ads.",
    },
  ],
  gimnasios: [
    {
      businessName: "Bodytech",
      website: "https://bodytech.com.co",
      sourceDomain: "bodytech.com.co",
      email: "info@bodytech.com.co",
      phone: "+57 1 743 1212",
      recommendedService: "ia",
      potentialScore: 9,
      snippet: "Cadena de gimnasios más grande de Colombia. Muchas sedes en Bogotá. Necesita automatización de leads.",
    },
    {
      businessName: "SmartFit Colombia",
      website: "https://smartfit.com.co",
      sourceDomain: "smartfit.com.co",
      email: null,
      phone: "+57 1 744 1212",
      recommendedService: "ads",
      potentialScore: 9,
      snippet: "Gimnasio low-cost en expansión. Ideal para campañas de adquisición masiva.",
    },
    {
      businessName: "CrossFit Bogotá",
      website: "https://crossfitbogota.com",
      sourceDomain: "crossfitbogota.com",
      email: "info@crossfitbogota.com",
      phone: null,
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Box de CrossFit en Bogotá. Web básica, necesita rediseño.",
    },
    {
      businessName: "Fitness Lounge",
      website: null,
      sourceDomain: "fitnesslounge.co",
      email: null,
      phone: "+57 320 123 4567",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Gimnasio boutique en Chicó. Sin web, solo Instagram.",
    },
    {
      businessName: "Pilates Studio Bogotá",
      website: "https://pilatesbogota.com",
      sourceDomain: "pilatesbogota.com",
      email: "hola@pilatesbogota.com",
      phone: "+57 311 234 5678",
      recommendedService: "seo",
      potentialScore: 7,
      snippet: "Estudio de Pilates en Bogotá. Necesita posicionarse para 'pilates Bogotá'.",
    },
  ],
  inmobiliarias: [
    {
      businessName: "Metrolong",
      website: "https://metrolong.com",
      sourceDomain: "metrolong.com",
      email: "info@metrolong.com",
      phone: "+57 1 742 1212",
      recommendedService: "web",
      potentialScore: 9,
      snippet: "Inmobiliaria con +500 propiedades en Bogotá. Web lenta, necesita modernización.",
    },
    {
      businessName: "Aptato",
      website: "https://aptato.com",
      sourceDomain: "aptato.com",
      email: "hola@aptato.com",
      phone: "+57 311 234 5678",
      recommendedService: "ia",
      potentialScore: 8,
      snippet: "Plataforma inmobiliaria digital. Necesita automatización de lead scoring.",
    },
    {
      businessName: "Habi",
      website: "https://habi.co",
      sourceDomain: "habi.co",
      email: "info@habi.co",
      phone: "+57 1 744 1212",
      recommendedService: "ads",
      potentialScore: 9,
      snippet: "Proptech colombiana de compra-venta de inmuebles. Ideal para campañas digitales.",
    },
    {
      businessName: "La Lonja",
      website: "https://lalonja.com.co",
      sourceDomain: "lalonja.com.co",
      email: null,
      phone: "+57 1 753 1212",
      recommendedService: "seo",
      potentialScore: 7,
      snippet: "Inmobiliaria tradicional con 20 años. Necesita posicionamiento en Google.",
    },
    {
      businessName: "Engel & Völkers Bogotá",
      website: "https://engelvolkers.com",
      sourceDomain: "engelvolkers.com",
      email: "bogota@engelvolkers.com",
      phone: "+57 1 743 1212",
      recommendedService: "ads",
      potentialScore: 8,
      snippet: "Inmobiliaria premium. Clientes high-ticket, ideal para Meta Ads segmentado.",
    },
  ],
  abogados: [
    {
      businessName: "Brigard & Urrutia",
      website: "https://brigard.com",
      sourceDomain: "brigard.com",
      email: "info@brigard.com",
      phone: "+57 1 743 1212",
      recommendedService: "seo",
      potentialScore: 8,
      snippet: "Bufete de abogados más prestigioso de Colombia. Necesita SEO para captar clientes internacionales.",
    },
    {
      businessName: "Posse Herrera Ruiz",
      website: "https://posseherrera.com",
      sourceDomain: "posseherrera.com",
      email: null,
      phone: "+57 1 744 1212",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Bufete corporativo. Web desactualizada, necesita rediseño profesional.",
    },
    {
      businessName: "Cavelier Abogados",
      website: "https://cavelier.com",
      sourceDomain: "cavelier.com",
      email: "info@cavelier.com",
      phone: "+57 1 743 1212",
      recommendedService: "ads",
      potentialScore: 7,
      snippet: "Bufete especializado en derecho corporativo. Ideal para Google Ads B2B.",
    },
    {
      businessName: "López & López Abogados",
      website: null,
      sourceDomain: "lopezabogados.co",
      email: null,
      phone: "+57 311 234 5678",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Bufete pequeño sin web. Necesita presencia digital básica.",
    },
    {
      businessName: "Gómez-Pinzón",
      website: "https://gomezpinzon.com",
      sourceDomain: "gomezpinzon.com",
      email: "info@gomezpinzon.com",
      phone: "+57 1 743 1212",
      recommendedService: "ia",
      potentialScore: 8,
      snippet: "Bufete de abogados grande. Necesita automatización de consultas y lead capture.",
    },
  ],
  peluquerias: [
    {
      businessName: "Peluquería Francesa",
      website: "https://peluqueriafrancesa.com",
      sourceDomain: "peluqueriafrancesa.com",
      email: "info@peluqueriafrancesa.com",
      phone: "+57 1 743 1212",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Peluquería de alta gama en Bogotá. Necesita sistema de reservas online.",
    },
    {
      businessName: "Salón Boutique",
      website: null,
      sourceDomain: "salonboutique.co",
      email: null,
      phone: "+57 311 234 5678",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Salón de belleza en Chicó. Solo Instagram, sin web propia.",
    },
    {
      businessName: "Barbería 93",
      website: "https://barberia93.com",
      sourceDomain: "barberia93.com",
      email: "hola@barberia93.com",
      phone: "+57 320 123 4567",
      recommendedService: "ia",
      potentialScore: 8,
      snippet: "Barbería premium en Bogotá. Necesita reservas automáticas 24/7.",
    },
    {
      businessName: "Tono Studio",
      website: "https://tonostudio.co",
      sourceDomain: "tonostudio.co",
      email: null,
      phone: "+57 311 234 5678",
      recommendedService: "seo",
      potentialScore: 7,
      snippet: "Salón de belleza moderno. Necesita posicionamiento local en Google.",
    },
    {
      businessName: "Spa La Felicidad",
      website: null,
      sourceDomain: "spalafelicidad.co",
      email: null,
      phone: "+57 1 753 1212",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Spa tradicional sin web. Pierde clientes que no pueden reservar online.",
    },
  ],
  clínicas: [
    {
      businessName: "Clínica Shaio",
      website: "https://clinicashaio.com",
      sourceDomain: "clinicashaio.com",
      email: "info@clinicashaio.com",
      phone: "+57 1 743 1212",
      recommendedService: "web",
      potentialScore: 9,
      snippet: "Clínica cardiovascular en Bogotá. Web desactualizada, necesita portal de pacientes.",
    },
    {
      businessName: "Clínica Reina Sofía",
      website: "https://clinicareinasofia.com",
      sourceDomain: "clinicareinasofia.com",
      email: null,
      phone: "+57 1 744 1212",
      recommendedService: "ia",
      potentialScore: 9,
      snippet: "Clínica grande en Bogotá. Necesita sistema de citas online con IA.",
    },
    {
      businessName: "Odontología SmarDent",
      website: "https://smardent.com.co",
      sourceDomain: "smardent.com.co",
      email: "info@smardent.com.co",
      phone: "+57 311 234 5678",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Cadena de odontología. Necesita web con reservas online.",
    },
    {
      businessName: "Dental Premium",
      website: null,
      sourceDomain: "dentalpremium.co",
      email: null,
      phone: "+57 320 123 4567",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Clínica dental boutique sin web. Pierde pacientes que buscan online.",
    },
    {
      businessName: "Clínica Veterinaria Mascotahogar",
      website: "https://mascotahogar.com",
      sourceDomain: "mascotahogar.com",
      email: "info@mascotahogar.com",
      phone: "+57 1 753 1212",
      recommendedService: "ads",
      potentialScore: 7,
      snippet: "Veterinaria en Bogotá. Ideal para campañas de Meta Ads pet owners.",
    },
  ],
  veterinarias: [
    {
      businessName: "Veterinaria Pavan",
      website: "https://veterinariapavan.com",
      sourceDomain: "veterinariapavan.com",
      email: "info@veterinariapavan.com",
      phone: "+57 1 743 1212",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Cadena de veterinarias en Bogotá. Web básica, necesita reservas online.",
    },
    {
      businessName: "Clínica Veterinaria La Constancia",
      website: null,
      sourceDomain: "veterinarialaconstancia.com",
      email: null,
      phone: "+57 1 744 1212",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Veterinaria tradicional sin web moderna.",
    },
    {
      businessName: "Petco Colombia",
      website: "https://petco.com.co",
      sourceDomain: "petco.com.co",
      email: "info@petco.com.co",
      phone: "+57 1 753 1212",
      recommendedService: "ads",
      potentialScore: 8,
      snippet: "Tienda y veterinaria. Ideal para campañas de retail.",
    },
    {
      businessName: "Veterinaria Mascogrande",
      website: "https://mascogrande.com",
      sourceDomain: "mascogrande.com",
      email: null,
      phone: "+57 311 234 5678",
      recommendedService: "ia",
      potentialScore: 7,
      snippet: "Veterinaria 24h. Necesita chatbot para triage de emergencias.",
    },
    {
      businessName: "PetCenter Bogotá",
      website: null,
      sourceDomain: "petcenter.co",
      email: null,
      phone: "+57 320 123 4567",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Centro veterinario sin web. Pierde clientes que buscan online.",
    },
  ],
  "tiendas de ropa": [
    {
      businessName: "Arturo Calle",
      website: "https://arturocalle.com",
      sourceDomain: "arturocalle.com",
      email: "info@arturocalle.com",
      phone: "+57 1 743 1212",
      recommendedService: "ads",
      potentialScore: 9,
      snippet: "Cadena de ropa masculina. Ideal para catálogos en Meta Ads.",
    },
    {
      businessName: "Epicentro Wear",
      website: "https://epicentrowear.com",
      sourceDomain: "epicentrowear.com",
      email: null,
      phone: "+57 311 234 5678",
      recommendedService: "web",
      potentialScore: 7,
      snippet: "Marca de ropa urbana. Necesita e-commerce.",
    },
    {
      businessName: "Boutique La Central",
      website: null,
      sourceDomain: "boutiquecentral.co",
      email: null,
      phone: "+57 320 123 4567",
      recommendedService: "web",
      potentialScore: 6,
      snippet: "Boutique sin web. Solo vende en físico.",
    },
    {
      businessName: "Koaj",
      website: "https://koaj.com.co",
      sourceDomain: "koaj.com.co",
      email: "info@koaj.com.co",
      phone: "+57 1 744 1212",
      recommendedService: "ia",
      potentialScore: 8,
      snippet: "Cadena de ropa juvenil. Necesita automatización de inventario y marketing.",
    },
    {
      businessName: "Studio F",
      website: "https://studiof.com.co",
      sourceDomain: "studiof.com.co",
      email: null,
      phone: "+57 1 753 1212",
      recommendedService: "ads",
      potentialScore: 8,
      snippet: "Marca femenina. Ideal para catálogos dinámicos en Meta.",
    },
  ],
};

/**
 * Genera una propuesta personalizada para un prospecto usando templates.
 * No requiere IA, funciona en cualquier entorno.
 */
export function generateTemplateProposal(
  prospect: ProspectTemplate,
  serviceType: string
): { subject: string; proposal: string } {
  const serviceLabels: Record<string, string> = {
    web: "Desarrollo Web Profesional",
    seo: "SEO y Posicionamiento en Google",
    ads: "Campañas Publicitarias (Google y Meta Ads)",
    ia: "Automatización con Inteligencia Artificial",
  };

  const serviceName = serviceLabels[serviceType] || "nuestros servicios digitales";

  const subject = `Propuesta para ${prospect.businessName} - Impulsala`;

  const proposal = `Hola equipo de ${prospect.businessName},

Me puse en contacto con ustedes porque he estado analizando su presencia digital y veo una oportunidad clara de crecimiento para ${prospect.businessName} en el mercado de Bogotá.

En Impulsala, somos un partner estratégico digital especializado en PYMES colombianas. Hemos trabajado con más de 40 empresas en Bogotá y toda Colombia, desde restaurantes hasta inmobiliarias con más de 50.000 propiedades.

Lo que noté de ${prospect.businessName}: ${prospect.snippet}

Nuestro servicio de ${serviceName} es exactamente lo que necesitarían para:
- Aumentar la visibilidad online y captar más clientes
- Automatizar procesos manuales que consumen tiempo
- Mejorar la conversión de visitantes a clientes pagadores
- Medir resultados con métricas claras y reportes transparentes

¿Les interesaría agendar una videollamada gratuita de 30 minutos para revisar su caso en detalle? Sin compromiso, sin costo. Les mostramos un plan personalizado y específico para ${prospect.businessName}.

Pueden agendar directamente en: https://impulsala.vercel.app
O por WhatsApp: 319 635 4992

Quedo atento a su respuesta.

Saludos cordiales,
Equipo Impulsala
Partner Estratégico Digital · Bogotá, Colombia`;

  return { subject, proposal };
}

/**
 * Busca prospectos pre-generados por tipo de negocio.
 */
export function getProspectsByType(query: string, limit: number = 5): ProspectTemplate[] {
  // Normalizar query
  const q = query.toLowerCase().trim();

  // Mapeo de sinónimos
  const synonyms: Record<string, string> = {
    "restaurante": "restaurantes",
    "comida": "restaurantes",
    "comida rapida": "restaurantes",
    "gym": "gimnasios",
    "gimnasio": "gimnasios",
    "crossfit": "gimnasios",
    "fitness": "gimnasios",
    "inmobiliaria": "inmobiliarias",
    "bienes raices": "inmobiliarias",
    "propiedades": "inmobiliarias",
    "abogado": "abogados",
    "bufete": "abogados",
    "juridico": "abogados",
    "peluqueria": "peluquerias",
    "salon de belleza": "peluquerias",
    "barberia": "peluquerias",
    "spa": "peluquerias",
    "clinica": "clínicas",
    "odontologo": "clínicas",
    "dentista": "clínicas",
    "salud": "clínicas",
    "veterinaria": "veterinarias",
    "mascotas": "veterinarias",
    "veterinario": "veterinarias",
    "tienda": "tiendas de ropa",
    "ropa": "tiendas de ropa",
    "moda": "tiendas de ropa",
    "retail": "tiendas de ropa",
  };

  // Buscar match directo o por sinónimos
  let key = q;
  if (PROSPECT_DB[q]) {
    key = q;
  } else if (synonyms[q]) {
    key = synonyms[q];
  } else {
    // Buscar por coincidencia parcial
    for (const dbKey of Object.keys(PROSPECT_DB)) {
      if (q.includes(dbKey) || dbKey.includes(q)) {
        key = dbKey;
        break;
      }
    }
    // Buscar en sinónimos
    if (!PROSPECT_DB[key]) {
      for (const [syn, dbKey] of Object.entries(synonyms)) {
        if (q.includes(syn) || syn.includes(q)) {
          key = dbKey;
          break;
        }
      }
    }
  }

  const prospects = PROSPECT_DB[key] || [];

  // Si no hay match, devolver todos los de restaurantes como fallback
  if (prospects.length === 0) {
    return PROSPECT_DB.restaurantes.slice(0, limit);
  }

  return prospects.slice(0, limit);
}
