"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  personName: string;
  personRole: string;
  personPhoto: string;
  businessName: string;
  businessCategory: string;
  websiteUrl: string;
  websiteImage: string;
  testimonial: string;
  improvements: string[];
};

const TESTIMONIALS: Testimonial[] = [
  {
    personName: "Andrés Gómez",
    personRole: "Dueño",
    personPhoto: "/testimonials/donxl-owner.webp",
    businessName: "Don XL",
    businessCategory: "Perros calientes · Villavicencio",
    websiteUrl: "https://donxl-production.up.railway.app/",
    websiteImage: "/portfolio/donxl.webp",
    testimonial:
      "Antes tomábamos pedidos solo por teléfono y era un caos. Impulsala nos creó una web donde los clientes arman su perro paso a paso y el pedido me llega directo por WhatsApp. Las ventas nocturnas se duplicaron en el primer mes.",
    improvements: [
      "Sitio web mobile-first con menú digital interactivo",
      "Sistema de pedidos por WhatsApp con carrito y personalización",
      "Automatización de respuestas a clientes 24/7",
      "SEO local para 'perros calientes Villavicencio'",
    ],
  },
  {
    personName: "Edwar Ordóñez",
    personRole: "Fundador",
    personPhoto: "/testimonials/cafe-owner.webp",
    businessName: "Casa Cultural Nuestra Herencia",
    businessCategory: "Café · Galería · Bogotá",
    websiteUrl: "https://cafeherencia-production.up.railway.app/",
    websiteImage: "/portfolio/cafeherencia.webp",
    testimonial:
      "Nació como un café y hoy es un epicentro cultural. Impulsala construyó una plataforma donde vendo tanto obras de arte como café de origen, y el sistema rota los artistas cada mes. Hasta TIME nos destacó en World's Greatest Places 2025.",
    improvements: [
      "E-commerce dual: galería de arte + café de origen",
      "Catálogo con rotación automática mensual de artistas",
      "Gestión de eventos y talleres con reservas online",
      "SEO multilingüe para posicionamiento internacional",
    ],
  },
  {
    personName: "Mateo Salazar",
    personRole: "Chef y Fundador",
    personPhoto: "/testimonials/chef-owner.webp",
    businessName: "Chamánico Restaurante",
    businessCategory: "Gastronomía de Autor · Bogotá",
    websiteUrl: "https://chamanico-production.up.railway.app/",
    websiteImage: "/portfolio/chamanico.webp",
    testimonial:
      "Investigamos gastronomía ancestral colombiana y necesitábamos una web que reflejara esa filosofía. Impulsala creó una plataforma inmersiva con reservas online que reduce los no-shows. La Secretaría de Cultura nos seleccionó para 'Bogotá Sabe a Centro'.",
    improvements: [
      "Sitio inmersivo con sistema de reservas premium",
      "Confirmación automática por email y WhatsApp",
      "SEO gastronómico para 'cocina colombiana de autor'",
      "Chatbot inteligente que atiende dudas 24/7",
    ],
  },
];

export function ClientMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="casos-exito" className="relative border-y border-border/40 bg-card/60 py-12 sm:py-16 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Lo que dicen nuestros clientes en Bogotá y Colombia
        </p>

        {/* Móvil: carrusel horizontal deslizable · Desktop: grid 3 columnas */}
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.businessName}
              className={`group flex w-[85%] flex-shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-500 hover:border-primary/40 hover:shadow-xl
                          lg:w-auto ${
                            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                          }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Pantallazo del sitio web (clickeable) — ampliado */}
              <a
                href={t.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-28 w-full overflow-hidden bg-secondary/40 sm:h-32"
                aria-label={`Visitar ${t.businessName}`}
              >
                <Image
                  src={t.websiteImage}
                  alt={`Sitio web de ${t.businessName}`}
                  fill
                  sizes="(max-width: 1024px) 85vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {/* Overlay con nombre del negocio */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{t.businessName}</p>
                    <p className="truncate text-[11px] text-white/80">{t.businessCategory}</p>
                  </div>
                  <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-white/30">
                    <ExternalLink className="h-3 w-3" />
                    Visitar
                  </span>
                </div>
              </a>

              {/* Nombre de la persona (sin avatar) */}
              <div className="border-b border-border/40 px-4 py-2.5">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.personName}</span> · {t.personRole}
                </p>
              </div>

              {/* Testimonio */}
              <div className="px-4 py-3">
                <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.testimonial}&rdquo;</p>
              </div>

              {/* Mejoras implementadas */}
              <div className="mt-auto border-t border-border/40 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mejoras implementadas
                </p>
                <ul className="space-y-1.5">
                  {t.improvements.map((imp) => (
                    <li key={imp} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Indicador de scroll en móvil */}
        <div className="mt-4 flex justify-center gap-1.5 lg:hidden">
          {TESTIMONIALS.map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          ))}
        </div>
      </div>
    </section>
  );
}
