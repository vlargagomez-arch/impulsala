"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { openAiChat } from "@/lib/open-ai-chat";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;

    function update() {
      if (dismissed) {
        setVisible(false);
        ticking = false;
        return;
      }
      const scrolled = window.scrollY;
      const pastHero = scrolled > window.innerHeight * 0.6;
      setVisible(pastHero);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-300
                  bottom-20 sm:bottom-3
                  ${visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"}
                  w-auto max-w-[calc(100%-1.5rem)] sm:max-w-md lg:max-w-lg`}
      role="complementary"
      aria-hidden={!visible}
    >
      <div
        className="relative flex items-center gap-2 overflow-hidden rounded-full border border-border/60 bg-card/95 shadow-xl shadow-black/20
                   p-1.5 pl-3 sm:gap-3 sm:p-1.5 sm:pl-5"
      >
        {/* Punto de estado verde (sutil, "en vivo") */}
        <span className="relative hidden h-2 w-2 flex-shrink-0 sm:flex">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        {/* Texto compacto */}
        <div className="min-w-0 flex-1 py-0.5 sm:py-1">
          <p className="truncate text-xs font-semibold leading-tight text-foreground sm:text-sm">
            Diagnóstico gratuito disponible
          </p>
          <p className="truncate text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
            Respuesta en &lt;2h · Sin compromiso
          </p>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => openAiChat({ startBooking: true })}
          className="group flex flex-shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-sky-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110 active:scale-95
                     sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-xs lg:text-sm"
        >
          <span className="hidden sm:inline">Agendar ahora</span>
          <span className="sm:hidden">Agendar</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
        </button>

        {/* Botón cerrar — circular, siempre visible y clicable en móvil */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar aviso"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-rose-500/15 hover:text-rose-400 active:scale-90
                     sm:h-8 sm:w-8"
        >
          <X className="h-4 w-4 sm:h-4 sm:w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
