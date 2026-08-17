"use client";

import { motion } from "framer-motion";
import { Code2, Search, Megaphone, Bot } from "lucide-react";

/**
 * CosmicSystemMobile — versión ligera y optimizada del CosmicSystem para móvil.
 *
 * Diferencias vs CosmicSystem (desktop):
 *   - Solo 2 órbitas (en vez de 3)
 *   - 4 planetas (mismo número, mejor proporcionados)
 *   - 4 partículas (en vez de 9)
 *   - 8 estrellas (en vez de 18)
 *   - 1 cometa (en vez de 3)
 *   - Sin aurora líquida (reduce carga GPU en móvil)
 *   - ViewBox cuadrado 400x400 (mejor para pantallas verticales)
 *   - Opacidad más alta para mejor visibilidad
 */
export function CosmicSystemMobile() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Sistema solar animado"
      >
        <defs>
          <radialGradient id="mobile-sun-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.98 0.05 165)" stopOpacity="1" />
            <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.95" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="mobile-sun-corona" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id="mobile-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="mobile-strong-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== Estrellas (solo 8, bien distribuidas) ===== */}
        {MOBILE_STARS.map((star, i) => (
          <motion.circle
            key={`m-star-${i}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill={star.color}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ===== 1 cometa (ocasional) ===== */}
        <motion.g
          initial={{ x: -50, y: 60, opacity: 0 }}
          animate={{
            x: [null, 450],
            y: [null, 180],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 4,
            repeatDelay: 10,
            ease: "easeIn",
          }}
        >
          <line x1="0" y1="0" x2="-35" y2="-18" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <circle cx="0" cy="0" r="2.5" fill="var(--accent)" filter="url(#mobile-glow)" />
        </motion.g>

        {/* ===== 2 órbitas (más limpio que 3) ===== */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="100"
            ry="38"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.25"
            transform="rotate(15 200 200)"
          />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="155"
            ry="60"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.2"
            transform="rotate(-25 200 200)"
          />
        </motion.g>

        {/* ===== Sol corona ===== */}
        <motion.circle
          cx="200"
          cy="200"
          r="80"
          fill="url(#mobile-sun-corona)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* ===== Sol core ===== */}
        <motion.circle
          cx="200"
          cy="200"
          r="36"
          fill="url(#mobile-sun-core)"
          filter="url(#mobile-strong-glow)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Sol highlight */}
        <motion.circle
          cx="190"
          cy="192"
          r="10"
          fill="oklch(0.99 0.01 165)"
          opacity="0.6"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* ===== 4 planetas (mismo número, mejor tamaño) ===== */}

        {/* Software — órbita interna */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(300 200)">
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="18" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-10" y="-10" width="20" height="20">
                <div className="flex h-full w-full items-center justify-center">
                  <Code2 className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* SEO — órbita externa */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(355 200) rotate(-25)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="16" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-9" y="-9" width="18" height="18">
                <div className="flex h-full w-full items-center justify-center">
                  <Search className="h-3 w-3" style={{ color: "var(--accent)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* Ads — órbita interna opuesta */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(100 200)">
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="18" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-10" y="-10" width="20" height="20">
                <div className="flex h-full w-full items-center justify-center">
                  <Megaphone className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* IA — órbita externa opuesta */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(45 200) rotate(25)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="16" fill="var(--card)" stroke="oklch(0.7 0.2 320)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-9" y="-9" width="18" height="18">
                <div className="flex h-full w-full items-center justify-center">
                  <Bot className="h-3 w-3" style={{ color: "oklch(0.7 0.2 320)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* ===== 4 partículas orbitando (ligero) ===== */}
        {MOBILE_PARTICLES.map((p, i) => (
          <motion.g
            key={`m-particle-${i}`}
            style={{ transformOrigin: "200px 200px" }}
            animate={{ rotate: p.direction === 1 ? 360 : -360 }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          >
            <g transform={`translate(${200 + p.radius} 200) rotate(${p.tilt})`}>
              <motion.circle
                r={p.size}
                fill={p.color}
                filter="url(#mobile-glow)"
                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            </g>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

const MOBILE_STARS = [
  { x: 50, y: 60, r: 1.5, color: "var(--primary)", duration: 3, delay: 0 },
  { x: 340, y: 80, r: 1, color: "var(--accent)", duration: 4, delay: 0.5 },
  { x: 80, y: 340, r: 1.5, color: "var(--primary)", duration: 3.5, delay: 1 },
  { x: 320, y: 320, r: 1, color: "var(--accent)", duration: 4, delay: 1.5 },
  { x: 200, y: 30, r: 1.5, color: "var(--primary)", duration: 3.2, delay: 0.8 },
  { x: 30, y: 200, r: 1, color: "var(--accent)", duration: 4.5, delay: 2 },
  { x: 370, y: 200, r: 1.5, color: "var(--primary)", duration: 3.8, delay: 0.3 },
  { x: 200, y: 380, r: 1, color: "var(--accent)", duration: 4, delay: 1.2 },
];

const MOBILE_PARTICLES = [
  { radius: 100, size: 2.5, color: "var(--primary)", duration: 12, delay: 0, direction: 1, tilt: 15 },
  { radius: 100, size: 2, color: "var(--accent)", duration: 14, delay: 1, direction: 1, tilt: 15 },
  { radius: 155, size: 2.5, color: "var(--accent)", duration: 18, delay: 0.5, direction: -1, tilt: -25 },
  { radius: 155, size: 2, color: "var(--primary)", duration: 20, delay: 2, direction: -1, tilt: -25 },
];
