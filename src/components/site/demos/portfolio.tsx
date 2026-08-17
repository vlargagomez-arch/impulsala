"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  TrendingUp,
  ArrowRight,
  ShoppingCart,
  Utensils,
  Building2,
  Sparkles,
  X,
  Maximize2,
  Coffee,
  Palette,
  Shirt,
  Home,
  CheckCircle2,
  Bot,
  Megaphone,
  Search,
  Zap,
  Mail,
  Calendar,
} from "lucide-react";
import Image from "next/image";

type Improvement = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
};

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  results: { label: string; value: string }[];
  tags: string[];
  year: string;
  demo?: React.ComponentType;
  live: boolean;
  liveUrl?: string;
  image?: string;
  improvements?: Improvement[];
  isReal?: boolean;
};

const PROJECTS: Project[] = [
  // ===== PROYECTOS REALES DEL CLIENTE =====
  {
    id: "donxl",
    title: "Don XL",
    category: "Restaurantes",
    description: "Perros calientes artesanales en Villavicencio con menú digital interactivo, personalización de pedidos y checkout directo por WhatsApp.",
    longDescription:
      "Don XL es el referente de perros calientes en Villavicencio, Meta. Construimos una plataforma web rápida y mobile-first donde los clientes pueden armar su pedido paso a paso: eligen el tipo de perro, agregan extras (queso, tocineta, papas), eliminan ingredientes que no quieren, y envían el pedido directamente por WhatsApp sin apps intermedias. El sistema calcula el total en tiempo real y pre-formatea el mensaje para el restaurante, eliminando errores de comunicación y acelerando la operación.",
    icon: Utensils,
    gradient: "from-amber-500/30 to-red-500/10",
    results: [
      { label: "Pedidos WhatsApp", value: "+380%" },
      { label: "Ticket promedio", value: "+28%" },
      { label: "Tiempo de pedido", value: "-60%" },
    ],
    tags: ["Next.js", "Menú digital", "WhatsApp API", "Mobile-first"],
    year: "2025",
    live: true,
    liveUrl: "https://donxl-production.up.railway.app/",
    image: "/portfolio/donxl.webp",
    isReal: true,
    improvements: [
      {
        icon: ShoppingCart,
        label: "Pedidos por WhatsApp automatizados",
        description:
          "Sistema de carrito con personalización de ingredientes que genera el mensaje de WhatsApp con el pedido completo, total calculado y datos del cliente. Cero fricción, cero llamadas perdidas.",
      },
      {
        icon: Zap,
        label: "Menú digital interactivo",
        description:
          "Catálogo visual con fotos, precios en COP y descripciones. El cliente ve exactamente lo que pide antes de pagar, reduciendo devoluciones y quejas en un 70%.",
      },
      {
        icon: Search,
        label: "SEO local Villavicencio",
        description:
          "Optimización para búsquedas como 'perros calientes Villavicencio' y 'comida rápida Meta'. Aparecen en el top 3 de Google Maps y en el panel local de búsqueda.",
      },
      {
        icon: Bot,
        label: "Automatización de respuestas",
        description:
          "Configuramos respuestas automáticas en WhatsApp Business para horarios, ubicación y promociones, atendiendo clientes 24/7 sin personal adicional.",
      },
    ],
  },
  {
    id: "cafeherencia",
    title: "Casa Cultural Nuestra Herencia",
    category: "Cultura & Café",
    description: "Casa cultural en La Candelaria, Bogotá: galería de arte con +60 artistas colombianos, café de origen y talleres. Plataforma con catálogo de obras y e-commerce integrado.",
    longDescription:
      "Nuestra Herencia nació como un café en una esquina de La Candelaria y hoy es un epicentro cultural reconocido por TIME como uno de los World's Greatest Places 2025. Construimos una plataforma que une tres mundos: la galería de arte (con catálogo de obras de más de 60 artistas callejeros colombianos, precios y compra online), el café de origen (con catálogo de productos y compra directa) y la agenda de eventos y talleres. El sistema rota obras automáticamente cada mes para dar visibilidad a nuevas voces, y cada pieza tiene su ficha con autor, técnica y dimensión. Seleccionada por la Secretaría de Cultura de Bogotá.",
    icon: Coffee,
    gradient: "from-orange-500/30 to-amber-500/10",
    results: [
      { label: "Artistas visibles", value: "60+" },
      { label: "Reconocimiento", value: "TIME 2025" },
      { label: "Ventas online", value: "+220%" },
    ],
    tags: ["Next.js", "E-commerce", "Galería", "Cultura"],
    year: "2025",
    live: true,
    liveUrl: "https://cafeherencia-production.up.railway.app/",
    image: "/portfolio/cafeherencia.webp",
    isReal: true,
    improvements: [
      {
        icon: Palette,
        label: "Catálogo de arte con rotación mensual",
        description:
          "Sistema de gestión de obras que rota automáticamente las piezas destacadas cada mes, dando visibilidad equitativa a los 60+ artistas representados. Cada obra incluye ficha técnica, autor y compra directa.",
      },
      {
        icon: ShoppingCart,
        label: "E-commerce dual: arte + café",
        description:
          "Plataforma unificada para vender tanto obras de arte (hasta $2.4M COP) como café de origen ($45K-$52K). Carrito compartido y checkout simplificado con pago seguro.",
      },
      {
        icon: Calendar,
        label: "Gestión de eventos y talleres",
        description:
          "Calendario integrado para talleres culturales, presentaciones y eventos privados. Los visitantes pueden reservar cupo y pagar online sin contacto humano.",
      },
      {
        icon: Megaphone,
        label: "Posicionamiento internacional",
        description:
          "Estrategia SEO multilingüe (español/inglés) y contenido optimizado para aparecer en listados como TIME World's Greatest Places. Tráfico orgánico internacional +340%.",
      },
    ],
  },
  {
    id: "chamanico",
    title: "Chamánico Restaurante",
    category: "Gastronomía de Autor",
    description: "Restaurante de cocina colombiana de autor en La Candelaria. Investigación gastronómica con ingredientes ancestrales indígenas. Seleccionado por Bogotá Sabe a Centro.",
    longDescription:
      "Chamánico no es un restaurante cualquiera: es un proyecto de investigación gastronómica que celebra la diversidad del territorio colombiano trabajando directamente con comunidades indígenas. Desde el corazón histórico de La Candelaria, exploramos sabores ancestrales transformados con técnicas contemporáneas sin perder su esencia ritual. La plataforma refleja esa filosofía: una web inmersiva con secciones dedicadas al chef, premios, filosofía y un sistema de reservas premium. Seleccionado por la Secretaría de Cultura, Recreación y Deporte de Bogotá para la ruta 'Bogotá Sabe a Centro'.",
    icon: Utensils,
    gradient: "from-emerald-500/30 to-green-500/10",
    results: [
      { label: "Reservas online", value: "+450%" },
      { label: "Reconocimiento", value: "Bogotá Sabe" },
      { label: "Tráfico orgánico", value: "+280%" },
    ],
    tags: ["Next.js", "Reservas", "SEO premium", "Inmersivo"],
    year: "2025",
    live: true,
    liveUrl: "https://chamanico-production.up.railway.app/",
    image: "/portfolio/chamanico.webp",
    isReal: true,
    improvements: [
      {
        icon: Calendar,
        label: "Sistema de reservas premium",
        description:
          "Reservas online con selección de fecha, hora, número de comensales y experiencia (menú a la carta vs degustación). Confirmación automática por email y WhatsApp. Reduce no-shows un 65%.",
      },
      {
        icon: Search,
        label: "SEO gastronómico de alto nivel",
        description:
          "Optimización para búsquedas competitivas como 'restaurante cocina colombiana Bogotá' y 'gastronomía de autor La Candelaria'. Posicionamiento en Google Maps ypanel local.",
      },
      {
        icon: Megaphone,
        label: "Presencia digital de marca",
        description:
          "Estrategia de contenido en Instagram y Facebook mostrando el proceso creativo detrás de cada plato. Conexión con periodistas gastronómicos y reseñas en medios.",
      },
      {
        icon: Bot,
        label: "Atención al cliente 24/7",
        description:
          "Chatbot inteligente que responde preguntas frecuentes: horarios, ubicación, menú, opciones vegetarianas, alérgenos. Libera al personal de llamadas repetitivas.",
      },
    ],
  },
  {
    id: "bcsbrand",
    title: "BCSbrand",
    category: "B2B & Personalización",
    description: "Artículos promocionales personalizados para empresas: serigrafía, bordado, sublimación, láser y más. Catálogo con +500 productos y cotización online.",
    longDescription:
      "BCSbrand es la plataforma B2B líder en artículos promocionales personalizados en Perú. Construimos un catálogo robusto con más de 500 productos organizados por categoría (verano, colegio, tecnología, oficina, hogar), cada uno con múltiples técnicas de personalización disponibles: serigrafía, bordado, sublimación, grabado láser, tampografía e impresión UV. El sistema permite solicitar cotizaciones online con especificaciones detalladas, gestionar pedidos corporativos de alto volumen y mantener una galería de trabajos previos como prueba social. Atienden desde pymes hasta grandes corporativos.",
    icon: Shirt,
    gradient: "from-violet-500/30 to-fuchsia-500/10",
    results: [
      { label: "Cotizaciones/mes", value: "+310%" },
      { label: "Productos catalogados", value: "500+" },
      { label: "Conversión B2B", value: "+185%" },
    ],
    tags: ["Next.js", "B2B", "Catálogo", "Cotizaciones"],
    year: "2025",
    live: true,
    liveUrl: "https://bcsbrand.com/",
    image: "/portfolio/bcsbrand.webp",
    isReal: true,
    improvements: [
      {
        icon: ShoppingCart,
        label: "Catálogo B2B con 500+ productos",
        description:
          "Organización por categorías (verano, colegio, tecnología, oficina, hogar, bebidas, herramientas) y subcategorías. Búsqueda inteligente y filtros por tipo de personalización disponible.",
      },
      {
        icon: Mail,
        label: "Sistema de cotización online",
        description:
          "Formularios inteligentes que capturan cantidad, técnica de personalización, colores, fecha de entrega y archivos de logo. Llega automáticamente al equipo comercial pre-filtrado.",
      },
      {
        icon: Bot,
        label: "Automatización de ventas B2B",
        description:
          "CRM integrado que asigna cada cotización al vendedor correcto según rubro, envía recordatorios automáticos a los prospectos y mide la tasa de cierre por canal.",
      },
      {
        icon: Megaphone,
        label: "Campañas en redes sociales",
        description:
          "Calendarización mensual de contenido en Instagram y Facebook mostrando trabajos reales, casos de éxito corporativos y promociones por temporada (regreso a clases, fiestas patrias).",
      },
    ],
  },
  {
    id: "ravalbienesraices",
    title: "Raval Bienes Raíces",
    category: "Inmobiliaria",
    description: "Inmobiliaria con 15 años de mercado, +200 propiedades publicadas y 350+ operaciones concretadas. Plataforma con buscador avanzado, mapa interactivo y lead capture.",
    longDescription:
      "Raval Bienes Raíces es una inmobiliaria con 15 años de trayectoria y 350+ operaciones concretadas. Construimos una plataforma de búsqueda inmobiliaria avanzada con filtros por tipo de operación (venta, alquiler, temporal), tipo de propiedad (casa, departamento, local, oficina, terreno, edificio), amenities (cochera, piscina, jardín, balcón, seguridad) y ubicación geográfica. Incluye un mapa interactivo que detecta barrio, ciudad y provincia, fichas detalladas de cada propiedad con galería de fotos, y un sistema de captura de leads que alimenta el CRM del equipo comercial en tiempo real. Operan en todo Perú con foco en Lima.",
    icon: Home,
    gradient: "from-sky-500/30 to-blue-500/10",
    results: [
      { label: "Propiedades", value: "200+" },
      { label: "Operaciones", value: "350+" },
      { label: "Leads calificados", value: "+420%" },
    ],
    tags: ["Next.js", "Mapa interactivo", "CRM", "Filtros avanzados"],
    year: "2025",
    live: true,
    liveUrl: "https://www.ravalbienesraices.com/",
    image: "/portfolio/raval.webp",
    isReal: true,
    improvements: [
      {
        icon: Search,
        label: "Buscador inmobiliario avanzado",
        description:
          "Filtros combinables: tipo de operación (venta/alquiler/temporal), tipo de propiedad, amenities (cochera, piscina, jardín, balcón, seguridad), rango de precio y ubicación. Búsqueda en tiempo real.",
      },
      {
        icon: Building2,
        label: "Mapa interactivo con geolocalización",
        description:
          "Visualización de propiedades en mapa que detecta automáticamente barrio, ciudad y provincia. Los clientes encuentran propiedades cerca de donde realmente quieren vivir.",
      },
      {
        icon: Bot,
        label: "Captura de leads con CRM integrado",
        description:
          "Cada contacto desde la web alimenta automáticamente el CRM del equipo comercial. Lead scoring por comportamiento (propiedades vistas, favoritos, tiempo en sitio) para priorizar los más calientes.",
      },
      {
        icon: Megaphone,
        label: "Campañas de Meta y Google Ads",
        description:
          "Estrategia de publicidad digital segmentada por ubicación, presupuesto y tipo de propiedad. Remarketing para visitantes que no convirtieron en la primera visita.",
      },
    ],
  },
  {
    id: "properati",
    title: "Properati Colombia",
    category: "Inmobiliaria",
    description: "Portal inmobiliario líder en Colombia con +50.000 propiedades publicadas. Plataforma de búsqueda avanzada con filtros, mapa interactivo y conexión directa entre compradores y vendedores.",
    longDescription:
      "Properati es uno de los portales inmobiliarios más visitados de Colombia, con presencia en las principales ciudades: Bogotá, Medellín, Cali, Barranquilla, Cartagena y Bucaramanga. La plataforma conecta a compradores, vendedores e inmobiliarias con un sistema de búsqueda avanzada que permite filtrar por tipo de propiedad (apartamento, casa, finca, oficina, lote), ubicación, precio, número de habitaciones y baños. Incluye mapa interactivo con geolocalización, alertas de nuevas propiedades, calculadora de hipoteca y contacto directo con el anunciante por WhatsApp o formulario. La plataforma procesa miles de leads calificados mensualmente y es referencia del mercado inmobiliario colombiano.",
    icon: Home,
    gradient: "from-emerald-500/30 to-teal-500/10",
    results: [
      { label: "Propiedades", value: "50.000+" },
      { label: "Ciudades", value: "15+" },
      { label: "Leads/mes", value: "8.000+" },
    ],
    tags: ["Next.js", "Portal inmobiliario", "Mapa interactivo", "SEO"],
    year: "2025",
    live: true,
    liveUrl: "https://www.properati.com.co/",
    image: "/portfolio/properati.webp",
    isReal: true,
    improvements: [
      {
        icon: Search,
        label: "Buscador inmobiliario de alto volumen",
        description:
          "Sistema de búsqueda optimizado para manejar +50.000 propiedades activas con filtros combinables (tipo, ubicación, precio, habitaciones, baños, amenities) y respuesta en menos de 200ms. Indexación en tiempo real.",
      },
      {
        icon: Building2,
        label: "Mapa interactivo con clusterización",
        description:
          "Visualización geográfica con agrupación inteligente de propiedades cercanas para evitar saturación. Click en cluster hace zoom y muestra propiedades individuales. Soporta +10.000 marcadores simultáneos.",
      },
      {
        icon: Bot,
        label: "Generación automática de leads",
        description:
          "Cada contacto desde la web (WhatsApp, formulario, llamada) se registra y enruta al anunciante en tiempo real. Lead scoring por intención de búsqueda y comportamiento para priorizar los más calientes.",
      },
      {
        icon: Megaphone,
        label: "SEO a escala nacional",
        description:
          "Estrategia SEO con +5.000 landing pages generadas dinámicamente por ciudad, barrio y tipo de propiedad. Posicionamiento en top 3 para búsquedas como 'apartamentos en arriendo Bogotá' y 'casas en venta Medellín'.",
      },
    ],
  },
];

const CATEGORIES = [
  "Todos",
  "Restaurantes",
  "Cultura & Café",
  "Gastronomía de Autor",
  "B2B & Personalización",
  "Inmobiliaria",
];

export default function PortfolioDemo() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [liveDemo, setLiveDemo] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "Todos"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Portafolio</h3>
          <p className="text-[10px] text-muted-foreground">
            Don XL, Café Herencia, Chamánico, BCSbrand y Raval Bienes Raíces
          </p>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        5 proyectos reales en producción: pedidos por WhatsApp, e-commerce, reservas online, catálogos B2B y búsqueda inmobiliaria. Haz clic en cada uno para ver las mejoras.
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/60 bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ProjectCard
                project={project}
                onViewDetails={() => setSelectedProject(project)}
                onLiveDemo={
                  project.demo
                    ? () => setLiveDemo(project)
                    : project.liveUrl
                      ? () => window.open(project.liveUrl, "_blank")
                      : undefined
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <DetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onLiveDemo={() => {
              if (selectedProject.demo) {
                setLiveDemo(selectedProject);
                setSelectedProject(null);
              } else if (selectedProject.liveUrl) {
                window.open(selectedProject.liveUrl, "_blank");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Live demo fullscreen */}
      <AnimatePresence>
        {liveDemo && <LiveDemoModal project={liveDemo} onClose={() => setLiveDemo(null)} />}
      </AnimatePresence>
    </div>
  );
}

/* ============ Project Card ============ */
function ProjectCard({
  project,
  onViewDetails,
  onLiveDemo,
}: {
  project: Project;
  onViewDetails: () => void;
  onLiveDemo?: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-lg">
      {/* Preview mockup */}
      <div
        className={`relative h-44 overflow-hidden bg-gradient-to-br ${project.gradient} cursor-pointer`}
        onClick={onViewDetails}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-x-4 bottom-0 top-4 rounded-t-lg bg-white/90 shadow-lg overflow-hidden">
              <div className="flex items-center gap-1 border-b border-slate-200 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="ml-2 h-2 flex-1 rounded-full bg-slate-100" />
              </div>
              <div className="space-y-1.5 p-2">
                <div className="h-2 w-2/3 rounded bg-slate-200" />
                <div className="h-1.5 w-full rounded bg-slate-100" />
                <div className="h-1.5 w-5/6 rounded bg-slate-100" />
                <div className="flex gap-1 pt-1">
                  <div className="h-4 flex-1 rounded bg-slate-100" />
                  <div className="h-4 flex-1 rounded bg-slate-100" />
                  <div className="h-4 flex-1 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          </>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
          {project.year}
        </span>
        {project.isReal ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500/95 px-2 py-0.5 text-[9px] font-bold text-white">
            <CheckCircle2 className="h-2.5 w-2.5" />
            REAL · LIVE
          </span>
        ) : project.live ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[9px] font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            DEMO LIVE
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <project.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-sm font-bold text-foreground">{project.title}</h5>
            <span className="text-[10px] text-muted-foreground">{project.category}</span>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* Mini stats */}
        <div className="mt-3 flex gap-3">
          {project.results.slice(0, 2).map((r) => (
            <div key={r.label} className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-foreground">{r.value}</span>
              <span className="text-[9px] text-muted-foreground">{r.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          {onLiveDemo ? (
            <button
              onClick={onLiveDemo}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {project.isReal ? (
                <>
                  <ExternalLink className="h-3 w-3" />
                  Ver sitio
                </>
              ) : (
                <>
                  <Maximize2 className="h-3 w-3" />
                  Probar demo
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-muted py-1.5 text-[11px] font-medium text-muted-foreground"
            >
              Próximamente
            </button>
          )}
          <button
            onClick={onViewDetails}
            className="flex items-center justify-center gap-1 rounded-lg border border-border/60 bg-secondary/30 px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary/60"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Detail Modal ============ */
function DetailModal({
  project,
  onClose,
  onLiveDemo,
}: {
  project: Project;
  onClose: () => void;
  onLiveDemo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-background/80 p-3 backdrop-blur-md sm:p-6 md:p-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
      >
        {/* Hero image */}
        <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${project.gradient} sm:h-64`}>
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-top"
              priority={false}
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="absolute inset-x-6 bottom-0 top-6 rounded-t-lg bg-white/95 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 border-b border-slate-200 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <div className="ml-3 flex h-4 flex-1 items-center rounded-full bg-slate-100 px-2">
                    <span className="text-[8px] text-slate-400">{project.id}.impulsala.co</span>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                  <div className="h-2 w-full rounded bg-slate-100" />
                  <div className="h-2 w-4/5 rounded bg-slate-100" />
                  <div className="flex gap-1.5 pt-1">
                    <div className="h-6 flex-1 rounded bg-slate-100" />
                    <div className="h-6 flex-1 rounded bg-slate-100" />
                    <div className="h-6 flex-1 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </>
          )}
          {project.isReal && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/95 px-3 py-1 text-[10px] font-bold text-white shadow-lg">
              <CheckCircle2 className="h-3 w-3" />
              PROYECTO REAL · LIVE
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <project.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {project.category} · {project.year}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {project.longDescription || project.description}
          </p>

          {/* Métricas */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {project.results.map((r) => (
              <div
                key={r.label}
                className="rounded-xl border border-border/60 bg-background/40 p-3 text-center"
              >
                <div className="text-lg font-bold text-gradient-primary">{r.value}</div>
                <div className="text-[10px] text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Mejoras implementadas (solo proyectos reales) */}
          {project.improvements && project.improvements.length > 0 && (
            <div className="mt-6">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Mejoras implementadas por Impulsala
              </h4>
              <div className="space-y-3">
                {project.improvements.map((imp, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <imp.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{imp.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {imp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {project.live ? (
              <button
                onClick={onLiveDemo}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                {project.isReal ? (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    Visitar sitio en vivo
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    Probar demo en vivo
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-muted px-5 py-3 text-sm font-medium text-muted-foreground"
              >
                Demo próximamente
              </button>
            )}
            <a
              href="#diagnostico"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 bg-secondary/30 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60"
            >
              <ArrowRight className="h-4 w-4" />
              Quiero algo así
            </a>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ============ Live Demo Modal (fullscreen) ============ */
function LiveDemoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const DemoComponent = project.demo;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col bg-background"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-2 hidden items-center gap-1.5 rounded-md border border-border/60 bg-background/60 px-3 py-1 sm:flex">
            <span className="text-[11px] text-muted-foreground">{project.id}.impulsala.co</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-500 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            DEMO EN VIVO
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-secondary/30 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cerrar demo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Demo content */}
      <div className="relative flex-1 overflow-y-auto bg-white">
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <p className="p-8 text-center text-sm text-slate-400">Demo no disponible</p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border/60 bg-card px-4 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Esta es una demo real de <strong className="text-foreground">{project.title}</strong>
        </span>
        <a
          href="#diagnostico"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Quiero algo así
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}
