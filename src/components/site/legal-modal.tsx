"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield, Cookie, ChevronDown } from "lucide-react";

export type LegalDoc = "terminos" | "privacidad" | "cookies";

type LegalContent = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
  sections: { id: string; heading: string; body: string[] }[];
};

const LEGAL_CONTENT: Record<LegalDoc, LegalContent> = {
  terminos: {
    title: "Términos y Condiciones",
    subtitle: "Términos legales del uso de nuestros servicios",
    icon: FileText,
    lastUpdated: "1 de julio de 2026",
    sections: [
      {
        id: "aceptacion",
        heading: "1. Aceptación de los términos",
        body: [
          "Al acceder y utilizar los servicios de Impulsala (en adelante, \"la Empresa\"), aceptas estar sujeto a los presentes Términos y Condiciones. Si no estás de acuerdo con alguno de los términos aquí establecidos, te pedimos que no utilices nuestros servicios.",
          "Estos términos aplican a todos los visitantes, usuarios y clientes de Impulsala, incluyendo但不限于 nuestro sitio web, demos interactivas, asistente conversacional (ImpulsaBot), y cualquier otro servicio digital que ofrezcamos.",
          "Impulsala se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en esta página. Es responsabilidad del usuario revisar periódicamente esta sección.",
        ],
      },
      {
        id: "servicios",
        heading: "2. Descripción de servicios",
        body: [
          "Impulsala ofrece servicios de desarrollo de software, marketing digital (SEO, Ads), automatizaciones y agentes de IA. Los servicios específicos contratados por cada cliente se detallarán en una propuesta comercial firmada entre las partes.",
          "La Empresa se compromete a prestar los servicios con diligencia profesional y de acuerdo con las mejores prácticas de la industria. Sin embargo, los resultados pueden variar según factores externos como el mercado, la competencia, cambios en algoritmos de terceros (Google, Meta, TikTok) y la colaboración del cliente.",
          "Los plazos de entrega estimados en las propuestas comerciales son aproximados y pueden verse afectados por factores fuera del control de Impulsala, incluyendo demoras en la entrega de información por parte del cliente, cambios de alcance solicitados, o problemas técnicos externos.",
        ],
      },
      {
        id: "pagos",
        heading: "3. Pagos y facturación",
        body: [
          "Los precios de los servicios se establecen en la propuesta comercial correspondiente. Salvo acuerdo contrario, el 50% del valor total se cancela al inicio del proyecto y el 50% restante al momento de la entrega.",
          "Para servicios recurrentes (mantenimiento, campañas mensuales, soporte), la facturación se realiza mensualmente por anticipado. El pago debe efectuarse dentro de los 15 días posteriores a la emisión de la factura.",
          "En caso de mora, Impulsala se reserva el derecho de suspender temporalmente los servicios hasta que el pago sea regularizado. Los pagos realizados no son reembolsables, salvo lo estipulado en la sección de garantía.",
        ],
      },
      {
        id: "garantia",
        heading: "4. Garantía de resultados",
        body: [
          "Impulsala ofrece una garantía de resultados medibles en los servicios de marketing digital y SEO. Si después de 90 días de implementación no se observan mejoras medibles respecto a los KPIs acordados, la Empresa continuará trabajando sin costo adicional hasta lograr dichos resultados.",
          "Esta garantía aplica únicamente cuando el cliente ha cumplido con todas las recomendaciones técnicas y estratégicas proporcionadas por Impulsala, incluyendo pero no limitándose a: acceso a plataformas, aprobación de contenidos, implementación de cambios técnicos, y provisión de información necesaria.",
          "La garantía no aplica para servicios de desarrollo de software a medida, donde el alcance y entregables se definen contractualmente, ni para campañas publicitarias donde el presupuesto es controlado por el cliente.",
        ],
      },
      {
        id: "propiedad",
        heading: "5. Propiedad intelectual",
        body: [
          "Todo el código fuente, diseños, contenidos, estrategias y materiales desarrollados por Impulsala para el cliente pasan a ser propiedad del cliente una vez completado el pago total del proyecto.",
          "Impulsala retiene el derecho de mostrar el trabajo realizado en su portafolio, casos de estudio y materiales promocionales, salvo que exista un acuerdo de confidencialidad firmado que lo prohíba.",
          "Las herramientas, plantillas, frameworks y metodologías propias desarrolladas por Impulsala antes o independientemente del proyecto siguen siendo propiedad de la Empresa y pueden ser utilizadas en otros proyectos.",
        ],
      },
      {
        id: "confidencialidad",
        heading: "6. Confidencialidad",
        body: [
          "Ambas partes se comprometen a mantener confidencialidad sobre cualquier información sensible que compartan durante la relación comercial, incluyendo datos de clientes, estrategias de negocio, información financiera y credenciales de acceso.",
          "Esta obligación de confidencialidad persistirá durante la vigencia del contrato y por un período de 2 años posteriores a su finalización.",
          "Impulsala implementa medidas técnicas y administrativas para proteger la información del cliente, incluyendo cifrado en tránsito y reposo, control de accesos basado en roles, y registros de auditoría.",
        ],
      },
      {
        id: "cancelacion",
        heading: "7. Cancelación y rescisión",
        body: [
          "Cualquiera de las partes puede rescindir el contrato con un preaviso mínimo de 30 días calendario. En caso de rescisión anticipada por parte del cliente, los pagos ya realizados no son reembolsables.",
          "Impulsala puede rescindir el contrato de forma inmediata en caso de: (a) incumplimiento de pago superior a 60 días, (b) uso de los servicios para actividades ilegales, (c) comportamiento abusivo hacia el equipo de la Empresa, o (d) solicitud de servicios fuera del alcance acordado.",
          "Tras la rescisión, Impulsala entregará al cliente todos los materiales y accesos correspondientes en un plazo máximo de 15 días, previo pago de cualquier saldo pendiente.",
        ],
      },
      {
        id: "responsabilidad",
        heading: "8. Limitación de responsabilidad",
        body: [
          "Impulsala no será responsable por daños indirectos, incidentales, consecuentes o pérdida de ganancias derivados del uso de nuestros servicios, salvo en casos de dolo o negligencia grave demostrada.",
          "La responsabilidad total de Impulsala frente a un cliente se limita al valor facturado por los servicios en los 3 meses anteriores al evento que originó el reclamo.",
          "La Empresa no se hace responsable por interrupciones de servicio causadas por terceros (proveedores de hosting, plataformas de publicidad, cambios en APIs de Google/Meta/TikTok, ataques cibernéticos, etc.).",
        ],
      },
      {
        id: "jurisdiccion",
        heading: "9. Jurisdicción y ley aplicable",
        body: [
          "Los presentes Términos y Condiciones se rigen por las leyes de la República de Colombia.",
          "Cualquier controversia derivada de la interpretación o ejecución de estos términos será resuelta preferentemente mediante conciliación extrajudicial. De no llegar a acuerdo, las partes se someten a la jurisdicción de los jueces de Bogotá, Colombia.",
        ],
      },
    ],
  },
  privacidad: {
    title: "Política de Privacidad",
    subtitle: "Cómo recopilamos, usamos y protegemos tus datos",
    icon: Shield,
    lastUpdated: "1 de julio de 2026",
    sections: [
      {
        id: "intro",
        heading: "1. Introducción",
        body: [
          "En Impulsala respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos la información que nos proporcionas cuando utilizas nuestro sitio web, demos interactivas, o contratas nuestros servicios.",
          "Esta política cumple con la Ley 1581 de 2012 (Ley de Protección de Datos Personales de Colombia) y el Reglamento General de Protección de Datos (GDPR) de la Unión Europea, en lo aplicable.",
          "Al utilizar nuestros servicios, consientes el tratamiento de tus datos personales conforme a lo descrito en esta política.",
        ],
      },
      {
        id: "datos-recopilados",
        heading: "2. Datos que recopilamos",
        body: [
          "Recopilamos los siguientes datos personales cuando solicitas un diagnóstico gratuito, agiendas una cita a través de ImpulsaBot, o completes formularios en nuestro sitio:",
          "• Datos de identificación: nombre completo, nombre del negocio o empresa.",
          "• Datos de contacto: correo electrónico, teléfono, WhatsApp.",
          "• Datos del proyecto: tipo de servicio solicitado, presencia digital actual, objetivos de negocio.",
          "• Datos técnicos (automáticos): dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de permanencia, fuente de tráfico. Estos se recopilan mediante cookies y tecnologías similares.",
          "Cuando utilizas el Analizador SEO, recopilamos la URL que ingresas para procesarla y devolverte el análisis. Esta URL no se almacena permanentemente en nuestros servidores.",
        ],
      },
      {
        id: "uso-datos",
        heading: "3. Cómo usamos tus datos",
        body: [
          "Utilizamos tus datos personales para las siguientes finalidades:",
          "• Contactarte para agendar y confirmar citas de diagnóstico.",
          "• Enviarte propuestas comerciales, cotizaciones y información sobre nuestros servicios.",
          "• Proveer los servicios contratados y dar seguimiento a los proyectos.",
          "• Enviar comunicaciones de marketing (newsletter, promociones) — solo si has dado tu consentimiento expreso.",
          "• Mejorar nuestros servicios, contenidos y experiencia de usuario mediante análisis de datos agregados.",
          "• Cumplir con obligaciones legales y requerimientos de autoridades competentes.",
        ],
      },
      {
        id: "base-legal",
        heading: "4. Base legal del tratamiento",
        body: [
          "El tratamiento de tus datos personales se realiza con base en:",
          "• Tu consentimiento expreso, otorgado al completar formularios o aceptar esta política.",
          "• La ejecución de un contrato comercial cuando contratas nuestros servicios.",
          "• El interés legítimo de Impulsala para mejorar sus servicios y prevenir fraude.",
          "• El cumplimiento de obligaciones legales (facturación, contabilidad, requerimientos de autoridades).",
        ],
      },
      {
        id: "comparticion",
        heading: "5. Compartición de datos con terceros",
        body: [
          "Impulsala no vende, alquila ni comercializa tus datos personales. Compartimos tu información únicamente en los siguientes casos:",
          "• Con proveedores de servicios necesarios para operar (Google Workspace, proveedores de email marketing, herramientas de analítica, pasarelas de pago). Estos proveedores están obligados a mantener la confidencialidad y cumplir con estándares de seguridad.",
          "• Con autoridades competentes cuando sea requerido por ley o resolución judicial.",
          "• En caso de fusiones, adquisiciones o venta de activos de Impulsala, los datos podrán ser transferidos a la entidad adquirente, quien asumirá las mismas obligaciones de esta política.",
        ],
      },
      {
        id: "almacenamiento",
        heading: "6. Almacenamiento y seguridad",
        body: [
          "Tus datos se almacenan en servidores ubicados en Estados Unidos y Europa, proveídos por empresas certificadas (AWS, Google Cloud, Vercel). La transferencia internacional de datos se realiza bajo cláusulas contractuales tipo aprobadas por la autoridad competente.",
          "Implementamos las siguientes medidas de seguridad técnicas y organizativas:",
          "• Cifrado TLS 1.3 en tránsito y AES-256 en reposo.",
          "• Control de accesos basado en roles (RBAC) con autenticación de dos factores.",
          "• Auditorías de seguridad periódicas y monitoreo 24/7.",
          "• Copias de seguridad cifradas con retención de 30 días.",
          "• Capacitación en seguridad de la información para todo el personal.",
          "Mantendremos tus datos durante el tiempo necesario para cumplir con las finalidades descritas, y posteriormente durante los plazos legales aplicables (10 años para documentos contables, 5 años para registros comerciales).",
        ],
      },
      {
        id: "derechos",
        heading: "7. Tus derechos como titular",
        body: [
          "Como titular de los datos personales, tienes los siguientes derechos:",
          "• Acceso: conocer qué datos tenemos sobre ti y cómo los tratamos.",
          "• Rectificación: solicitar la corrección de datos inexactos o incompletos.",
          "• Supresión: solicitar la eliminación de tus datos cuando no sean necesarios para los fines recogidos.",
          "• Oposición: oponerte al tratamiento de tus datos para fines de marketing directo.",
          "• Portabilidad: recibir tus datos en un formato estructurado y transferible.",
          "• Revocación del consentimiento: retirar tu consentimiento en cualquier momento sin que ello afecte la licitud del tratamiento previo.",
          "Para ejercer estos derechos, envía un correo a privacidad@impulsala.co con copia de tu documento de identidad. Responderemos tu solicitud en un plazo máximo de 15 días hábiles.",
        ],
      },
      {
        id: "cookies",
        heading: "8. Cookies y tecnologías similares",
        body: [
          "Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puedes gestionar tus preferencias de cookies en nuestra Política de Cookies.",
          "Las cookies esenciales (técnica, de sesión) son necesarias para el funcionamiento del sitio y no pueden desactivarse. Las cookies analíticas y de marketing requieren tu consentimiento previo.",
        ],
      },
      {
        id: "menores",
        heading: "9. Privacidad de menores",
        body: [
          "Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos deliberadamente datos personales de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado datos, contáctanos para proceder a su eliminación inmediata.",
        ],
      },
      {
        id: "cambios",
        heading: "10. Cambios a esta política",
        body: [
          "Impulsala puede actualizar esta Política de Privacidad en cualquier momento. Te notificaremos sobre cambios significativos mediante un aviso destacado en nuestro sitio o por correo electrónico (si tenemos tu correo).",
          "La fecha de última actualización al inicio de esta política indica cuándo fue revisada por última vez.",
        ],
      },
      {
        id: "contacto",
        heading: "11. Contacto",
        body: [
          "Si tienes preguntas, solicitudes o reclamos sobre esta Política de Privacidad o el tratamiento de tus datos personales, contáctanos:",
          "• Correo: privacidad@impulsala.co",
          "• Teléfono: 319 635 4992",
          "• Dirección: Bogotá, Colombia",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de Cookies",
    subtitle: "Cómo usamos cookies y cómo gestionarlas",
    icon: Cookie,
    lastUpdated: "1 de julio de 2026",
    sections: [
      {
        id: "que-son",
        heading: "1. ¿Qué son las cookies?",
        body: [
          "Las cookies son pequeños archivos de texto que un sitio web almacena en tu navegador cuando lo visitas. Permiten al sitio recordar información sobre tu visita, como tus preferencias, datos de sesión, o comportamiento de navegación.",
          "Las cookies son ampliamente utilizadas en internet y no dañan tu dispositivo. Sin embargo, recopilan información sobre tu actividad, por lo que es importante que sepas cómo las usamos y cómo puedes controlarlas.",
        ],
      },
      {
        id: "tipos",
        heading: "2. Tipos de cookies que usamos",
        body: [
          "Clasificamos las cookies en cuatro categorías según su finalidad:",
          "• Cookies esenciales (técnicas): necesarias para el funcionamiento básico del sitio (sesión de usuario, seguridad, carga de páginas). No pueden desactivarse.",
          "• Cookies de preferencias: recuerdan tus elecciones (idioma, tema claro/oscuro, configuración de demos) para ofrecerte una experiencia personalizada.",
          "• Cookies analíticas: recopilan información anónima sobre cómo usas el sitio (páginas visitadas, tiempo de permanencia, clics) para que podamos mejorarlo. Usamos Google Analytics con IP anonimizada.",
          "• Cookies de marketing: utilizadas para mostrar publicidad relevante a tus intereses, principalmente en Meta Ads, Google Ads y TikTok Ads. Solo se activan con tu consentimiento.",
        ],
      },
      {
        id: "tabla-cookies",
        heading: "3. Cookies específicas que utilizamos",
        body: [
          "A continuación listamos las cookies que utiliza impulsala.co:",
          "• nexus-theme: almacena tu preferencia de tema (claro/oscuro). Duración: 1 año. Propia.",
          "• nexus-session: mantiene tu sesión activa durante la visita. Duración: sesión. Propia.",
          "• _ga, _ga_XXXX: Google Analytics para métricas de uso anónimas. Duración: 2 años. Tercero (Google).",
          "• _gcl_au: Google Ads para medir conversiones de campañas. Duración: 3 meses. Tercero (Google).",
          "• _fbp: Meta Pixel para medir conversiones de campañas en Facebook/Instagram. Duración: 3 meses. Tercero (Meta).",
          "• ttclid: TikTok Pixel para medir conversiones de campañas en TikTok. Duración: sesión. Tercero (TikTok).",
        ],
      },
      {
        id: "consentimiento",
        heading: "4. Consentimiento y gestión",
        body: [
          "Cuando visitas nuestro sitio por primera vez, te mostramos un banner de consentimiento de cookies. Puedes elegir:",
          "• Aceptar todas las cookies (incluyendo analíticas y de marketing).",
          "• Aceptar solo las esenciales (rechazar analíticas y de marketing).",
          "• Personalizar: seleccionar qué categorías de cookies aceptas.",
          "Puedes cambiar tus preferencias en cualquier momento haciendo clic en el icono de cookies en la esquina inferior izquierda del sitio, o eliminando las cookies desde la configuración de tu navegador.",
        ],
      },
      {
        id: "terceros",
        heading: "5. Cookies de terceros",
        body: [
          "Impulsala utiliza servicios de terceros que pueden instalar cookies en tu navegador:",
          "• Google Analytics: para análisis de tráfico. Más información en https://policies.google.com/technologies/cookies",
          "• Google Ads: para medición de conversiones publicitarias.",
          "• Meta (Facebook/Instagram): para medición de campañas en sus plataformas.",
          "• TikTok: para medición de campañas publicitarias.",
          "• Vercel: hosting del sitio, puede recopilar métricas técnicas.",
          "Impulsala no controla las cookies de terceros. Te recomendamos revisar las políticas de privacidad de cada uno.",
        ],
      },
      {
        id: "gestion-navegador",
        heading: "6. Cómo gestionar cookies desde tu navegador",
        body: [
          "Además de nuestro banner de consentimiento, puedes gestionar o eliminar cookies directamente desde tu navegador:",
          "• Google Chrome: Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.",
          "• Mozilla Firefox: Preferencias → Privacidad y seguridad → Cookies y datos de sitios.",
          "• Safari: Preferencias → Privacidad → Cookies y datos de sitios web.",
          "• Microsoft Edge: Configuración → Cookies y permisos del sitio.",
          "Ten en cuenta que desactivar todas las cookies puede afectar el funcionamiento de ciertas características del sitio (inicio de sesión, preferencias de tema, etc.).",
        ],
      },
      {
        id: "actualizaciones",
        heading: "7. Actualizaciones de esta política",
        body: [
          "Impulsala puede actualizar esta Política de Cookies cuando incorporemos nuevos servicios, cambiemos proveedores, o por requerimientos legales. La fecha de última actualización al inicio indica la última revisión.",
          "Si realizamos cambios significativos en el uso de cookies, te notificaremos mediante un aviso destacado en el sitio.",
        ],
      },
      {
        id: "contacto",
        heading: "8. Contacto",
        body: [
          "Si tienes preguntas sobre nuestra Política de Cookies, contáctanos en:",
          "• Correo: privacidad@impulsala.co",
          "• Teléfono: 319 635 4992",
        ],
      },
    ],
  },
};

export function LegalModal({
  doc,
  onClose,
}: {
  doc: LegalDoc | null;
  onClose: () => void;
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (doc) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [doc]);

  const content = doc ? LEGAL_CONTENT[doc] : null;

  return (
    <AnimatePresence>
      {content && (
        <LegalModalContent
          key={doc}
          content={content}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

function LegalModalContent({
  content,
  onClose,
}: {
  content: LegalContent;
  onClose: () => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    content.sections[0]?.id ?? null,
  );

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
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
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
                    <content.icon className="h-6 w-6 text-primary" />
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {content.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{content.subtitle}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Última actualización: {content.lastUpdated}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="scrollbar-thin max-h-[calc(90vh-12rem)] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              {/* Quick nav */}
              <div className="mb-6 rounded-2xl border border-border/60 bg-background/40 p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Contenido
                </p>
                <div className="flex flex-wrap gap-2">
                  {content.sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedSection(s.id);
                        document.getElementById(`section-${s.id}`)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      className="rounded-lg border border-border/60 bg-secondary/30 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {s.heading}
                    </a>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                {content.sections.map((section) => {
                  const isExpanded = expandedSection === section.id;
                  return (
                    <div
                      key={section.id}
                      id={`section-${section.id}`}
                      className="overflow-hidden rounded-2xl border border-border/60 bg-background/40"
                    >
                      <button
                        onClick={() =>
                          setExpandedSection(isExpanded ? null : section.id)
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/30 sm:px-5"
                      >
                        <h3 className="text-sm font-semibold text-foreground sm:text-base">
                          {section.heading}
                        </h3>
                        <ChevronDown
                          className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? "auto" : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 px-4 pb-4 pt-1 sm:px-5">
                          {section.body.map((para, i) => (
                            <p
                              key={i}
                              className="text-[13px] leading-relaxed text-foreground/85 sm:text-sm"
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  ¿Tienes preguntas sobre este documento?
                </p>
                <a
                  href="mailto:privacidad@impulsala.co"
                  className="mt-1 inline-block text-sm font-medium text-primary hover:underline"
                >
                  privacidad@impulsala.co
                </a>
              </div>
            </div>
          </motion.div>
    </motion.div>
  );
}
