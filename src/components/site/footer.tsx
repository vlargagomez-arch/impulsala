"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Youtube, Facebook, Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { LegalModal, type LegalDoc } from "@/components/site/legal-modal";
import { useToast } from "@/hooks/use-toast";

// Ícono TikTok (lucide no lo trae, lo creamos como SVG inline)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.5a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.93z" />
    </svg>
  );
}

// Ícono WhatsApp oficial (logo real, no la burbuja de mensaje de lucide)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  {
    title: "Servicios",
    links: [
      { label: "Desarrollo Web", href: null },
      { label: "SEO y Posicionamiento", href: null },
      { label: "Campañas Publicitarias", href: null },
      { label: "Automatización con IA", href: null },
      { label: "Chatbots Inteligentes", href: "__chatbot__" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Casos de Éxito", href: "/#casos-exito" },
      { label: "Demos Interactivas", href: "/demos" },
      { label: "Preguntas Frecuentes", href: "/#faq" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/impulsala" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/impulsala" },
  { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com/@impulsala" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@impulsala" },
  { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/573196354992" },
];

type SubscribeState = "idle" | "loading" | "success" | "error";

export function Footer() {
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;

    setState("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        toast({
          title: "No se pudo suscribir",
          description: data.error || "Intenta de nuevo más tarde.",
          variant: "destructive",
        });
        return;
      }

      setState("success");
      setEmail("");
      toast({
        title: data.alreadySubscribed ? "Ya estabas suscrito" : "¡Suscripción exitosa!",
        description: data.message || "Recibirás estrategias digitales cada semana.",
      });

      // Reset to idle after 4 seconds so the user can subscribe again if needed
      setTimeout(() => setState("idle"), 4000);
    } catch {
      setState("error");
      toast({
        title: "Error de conexión",
        description: "Verifica tu internet e intenta de nuevo.",
        variant: "destructive",
      });
      setTimeout(() => setState("idle"), 3000);
    }
  }

  return (
    <>
      <footer className="relative mt-auto border-t border-border/60 bg-card">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {/* Responsive padding: tight on mobile, expanded on desktop */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          {/* Same 4-column structure, just becomes 2x2 grid on mobile */}
          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4 lg:gap-10">
            {/* Brand — spans 2 cols on mobile for breathing room */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5">
                <img src="/impulsala-logo.svg" alt="Impulsala" className="h-9 w-9" />
                <span className="text-base font-extrabold tracking-tight">
                  Impuls<span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">ala</span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:text-sm">
                Agencia de desarrollo web, SEO y automatización con IA. Transformamos negocios con tecnología de punta.
              </p>
              <div className="mt-4 flex items-center gap-2 sm:mt-5">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-secondary/30 text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 sm:h-9 sm:w-9"
                  >
                    <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider sm:text-sm sm:normal-case sm:tracking-normal">
                  {col.title}
                </h3>
                <ul className="mt-2 space-y-1.5 sm:mt-4 sm:space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.href === null ? (
                        // Link deshabilitado (servicios individuales)
                        <span
                          className="text-xs text-muted-foreground/50 cursor-not-allowed sm:text-sm"
                          title="Próximamente"
                        >
                          {l.label}
                        </span>
                      ) : l.href === "__chatbot__" ? (
                        // Link que abre el chatbot
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.dispatchEvent(new CustomEvent("open-ai-chat"));
                            }
                          }}
                          className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
                        >
                          {l.label}
                        </button>
                      ) : (
                        <Link href={l.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact + Newsletter */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider sm:text-sm sm:normal-case sm:tracking-normal">
                Contacto
              </h3>
              <div className="mt-2 space-y-1.5 text-xs text-muted-foreground sm:mt-4 sm:space-y-2.5 sm:text-sm">
                <a href="mailto:contacto@impulsala.co" className="flex items-center gap-2 transition-colors hover:text-foreground">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400 sm:h-4 sm:w-4" />
                  contacto@impulsala.co
                </a>
                <a href="https://wa.me/573196354992" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400 sm:h-4 sm:w-4" />
                  319 635 4992
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400 sm:h-4 sm:w-4" />
                  <span>Bogotá, Colombia · Trabajamos en toda LATAM</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-4 sm:mt-5">
                <p className="text-xs font-semibold text-foreground mb-1">Recibe estrategias digitales</p>
                <p className="text-[10px] text-muted-foreground mb-2">Únete a 2,500+ empresarios. Un email por semana. Cancela cuando quieras.</p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    disabled={state === "loading" || state === "success"}
                    className="flex-1 min-w-0 rounded-lg border border-border/60 bg-input px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading" || state === "success" || !email.trim()}
                    aria-label="Suscribirse"
                    className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state === "loading" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : state === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                  </button>
                </form>
                {state === "success" && (
                  <p className="mt-1.5 text-[10px] text-green-500 dark:text-green-400">
                    ✓ ¡Listo! Revisa tu email.
                  </p>
                )}
                {state === "error" && (
                  <p className="mt-1.5 text-[10px] text-red-500 dark:text-red-400">
                    ✗ No se pudo suscribir. Intenta de nuevo.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-4 sm:mt-10 sm:flex-row sm:gap-4 sm:pt-6">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Impulsala. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-5 text-xs text-muted-foreground">
              <button onClick={() => setLegalDoc("terminos")} className="transition-colors hover:text-foreground">
                Política de Privacidad
              </button>
              <button onClick={() => setLegalDoc("terminos")} className="transition-colors hover:text-foreground">
                Términos de Servicio
              </button>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </>
  );
}
