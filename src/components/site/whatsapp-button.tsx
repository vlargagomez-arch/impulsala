"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X, ChevronUp } from "lucide-react";

const PHONE = "573196354992";
const DEFAULT_MESSAGE =
  "¡Hola! 👋 Vengo de la página de VentasAI y quiero más información sobre cómo aumentar las ventas de mi negocio.";

const QUICK_MESSAGES = [
  { label: "Quiero una demo", text: "Hola, quiero agendar una demostración de VentasAI para mi negocio." },
  { label: "Precios y planes", text: "Hola, ¿pueden darme más información sobre los planes y precios de VentasAI?" },
  { label: "Soy agencia", text: "Hola, soy agencia y manejo varios clientes. ¿Me cuentan sobre el plan Scale?" },
  { label: "Tengo una duda", text: DEFAULT_MESSAGE },
];

const WHATSAPP_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Volver arriba */}
      {showScrollTop && !open && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          className="size-10 rounded-full border border-border bg-card text-muted-foreground shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
        >
          <ChevronUp className="size-5" />
        </button>
      )}

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel de chat */}
      {open && (
        <div className="absolute bottom-20 right-0 left-4 md:left-auto md:w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-[#e8e8ec] bg-white z-50">
          {/* Header */}
          <div className="flex items-center gap-3 p-3" style={{ background: "#075E54" }}>
            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">VentasAI · Soporte</p>
              <p className="text-xs text-white/80 truncate">En línea · Responde en minutos</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="size-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3" style={{ background: "#ECE5DD" }}>
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm mb-3 max-w-[85%]">
              <p className="text-sm" style={{ color: "#1a1a2e" }}>
                👋 ¡Hola! Soy el equipo de VentasAI.
              </p>
              <p className="text-sm mt-1" style={{ color: "#1a1a2e" }}>
                Estoy aquí para ayudarte a <strong>aumentar las ventas</strong> de tu negocio.
              </p>
            </div>

            <p className="text-xs mb-2" style={{ color: "#8a8a9a" }}>
              Mensajes rápidos:
            </p>

            <div className="space-y-2">
              {QUICK_MESSAGES.map((qm) => (
                <button
                  key={qm.label}
                  onClick={() => openWhatsApp(qm.text)}
                  className="w-full text-left bg-white rounded-lg p-2.5 shadow-sm hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>
                      {qm.label}
                    </span>
                    <span className="text-lg" style={{ color: "#25D366" }}>
                      →
                    </span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: "#8a8a9a" }}>
                    {qm.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between p-3 bg-white"
            style={{ borderTop: "1px solid #e8e8ec" }}
          >
            <span className="text-xs" style={{ color: "#8a8a9a" }}>
              Powered by WhatsApp
            </span>
            <button
              onClick={() => openWhatsApp(DEFAULT_MESSAGE)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
              style={{ background: "#25D366" }}
            >
              <MessageCircle className="size-3.5" />
              Abrir chat
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar" : "Abrir WhatsApp"}
        className="relative size-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105"
        style={{ background: "#25D366" }}
      >
        {open ? (
          <X className="size-7" />
        ) : (
          <>
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ background: "#25D366" }} />
            {/* Badge */}
            <span
              className="absolute -top-0.5 -right-0.5 size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "#ef4444", boxShadow: "0 0 0 2px #f8f7f4" }}
            >
              1
            </span>
            {WHATSAPP_SVG}
          </>
        )}
      </button>
    </div>
  );
}
