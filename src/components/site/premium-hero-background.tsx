"use client";

import { useEffect, useRef } from "react";

/**
 * PremiumHeroBackground — visual limpio y ligero.
 * - Blur reducido para mejor performance en scroll
 * - Animaciones se pausan cuando el hero no es visible (IntersectionObserver)
 * - En móvil: sin animaciones (solo estático)
 */
export function PremiumHeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Pausar animaciones cuando el hero sale del viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const state = entry.isIntersecting ? "running" : "paused";
          el.style.animationPlayState = state;
          el.querySelectorAll<HTMLElement>(".hero-blob-1, .hero-blob-2").forEach((blob) => {
            blob.style.animationPlayState = state;
          });
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Primary blob — blur reducido de 100px a 60px */}
      <div
        className="absolute -top-1/4 left-1/4 h-[55vh] w-[55vh] rounded-full blur-[60px] will-change-transform hero-blob-1 hidden sm:block"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />
      {/* Secondary blob — blur reducido de 100px a 60px */}
      <div
        className="absolute top-1/3 -right-1/4 h-[45vh] w-[45vh] rounded-full blur-[60px] will-change-transform hero-blob-2 hidden sm:block"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />
      {/* Static glow center — blur reducido de 80px a 50px */}
      <div
        className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px] opacity-50"
        style={{
          background: "radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid mask-fade-bottom opacity-30 sm:opacity-40" />

      <style jsx>{`
        @keyframes hero-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes hero-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-35px, 25px) scale(0.92); }
          66% { transform: translate(25px, -15px) scale(1.08); }
        }
        .hero-blob-1 { animation: hero-blob-1 24s ease-in-out infinite; }
        .hero-blob-2 { animation: hero-blob-2 28s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hero-blob-1, .hero-blob-2 { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
