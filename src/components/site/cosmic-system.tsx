"use client";

import { motion } from "framer-motion";
import { Code2, Search, Megaphone, Bot } from "lucide-react";

/**
 * CosmicSystem — visual animado tipo "sistema solar" para una agencia de marketing.
 *
 * Concepto: Impulsala es el sol en el centro; los 4 servicios principales orbitan
 * como planetas (Software, SEO, Ads, IA). Partículas atrapadas en órbita representan
 * leads/clientes. Cometas ocasionales cruzan el espacio. Aurora líquida de fondo.
 *
 * A diferencia de las versiones anteriores, este componente:
 *   - Es visible en TODOS los tamaños (mobile, tablet, desktop)
 *   - Tiene animaciones reales en móvil
 *   - No usa cards ni dashboards (concepto totalmente distinto)
 *   - 100% SVG + Framer Motion + CSS vars (theme-aware)
 */
export function CosmicSystem() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* ===== Layer 1: Liquid Aurora Background ===== */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="aurora-1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aurora-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="aurora-3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.6 0.18 95)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="oklch(0.6 0.18 95)" stopOpacity="0" />
          </radialGradient>

          {/* Sun core gradient */}
          <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.98 0.05 165)" stopOpacity="1" />
            <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.95" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          {/* Sun corona */}
          <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="60%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Aurora blobs — movimientos lentos y orgánicos */}
        <motion.circle
          cx="200"
          cy="200"
          r="280"
          fill="url(#aurora-1)"
          animate={{
            cx: [200, 350, 150, 200],
            cy: [200, 150, 280, 200],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="600"
          cy="400"
          r="260"
          fill="url(#aurora-2)"
          animate={{
            cx: [600, 450, 650, 600],
            cy: [400, 450, 320, 400],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="200"
          fill="url(#aurora-3)"
          animate={{
            cx: [400, 500, 300, 400],
            cy: [300, 250, 350, 300],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* ===== Star field ===== */}
        {STARS.map((star, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill={star.color}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* ===== Comets (occasional crossing) ===== */}
        {COMETS.map((comet, i) => (
          <motion.g
            key={`comet-${i}`}
            initial={{ x: -100, y: comet.startY, opacity: 0 }}
            animate={{
              x: [null, 900],
              y: [null, comet.endY],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: comet.delay,
              repeatDelay: 8,
              ease: "easeIn",
            }}
          >
            {/* Comet tail */}
            <line
              x1="0"
              y1="0"
              x2="-50"
              y2="-25"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="0" cy="0" r="3" fill="var(--accent)" filter="url(#glow)" />
          </motion.g>
        ))}

        {/* ===== Orbits (3 elliptical rings) ===== */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="400"
            cy="300"
            rx="160"
            ry="60"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.2"
            transform="rotate(15 400 300)"
          />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="400"
            cy="300"
            rx="230"
            ry="90"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            opacity="0.2"
            transform="rotate(-30 400 300)"
          />
        </motion.g>
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="400"
            cy="300"
            rx="300"
            ry="120"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.15"
            transform="rotate(45 400 300)"
          />
        </motion.g>

        {/* ===== Sun corona (pulsing) ===== */}
        <motion.circle
          cx="400"
          cy="300"
          r="120"
          fill="url(#sun-corona)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* ===== Sun core ===== */}
        <motion.circle
          cx="400"
          cy="300"
          r="50"
          fill="url(#sun-core)"
          filter="url(#strong-glow)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Sun inner highlight */}
        <motion.circle
          cx="388"
          cy="290"
          r="14"
          fill="oklch(0.99 0.01 165)"
          opacity="0.6"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* ===== Service planets orbiting ===== */}
        {/* Software (Code2) — inner orbit */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(560 300)">
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="22" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-12" y="-12" width="24" height="24">
                <div className="flex h-full w-full items-center justify-center">
                  <Code2 className="h-4 w-4" style={{ color: "var(--primary)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
            {/* Glow halo */}
            <motion.circle
              r="22"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1"
              opacity="0.4"
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              style={{ transformOrigin: "center" }}
            />
          </g>
        </motion.g>

        {/* SEO (Search) — middle orbit */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(630 300) rotate(-30)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="20" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-11" y="-11" width="22" height="22">
                <div className="flex h-full w-full items-center justify-center">
                  <Search className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* Ads (Megaphone) — outer orbit */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(700 300) rotate(45)">
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="22" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-12" y="-12" width="24" height="24">
                <div className="flex h-full w-full items-center justify-center">
                  <Megaphone className="h-4 w-4" style={{ color: "var(--primary)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* IA (Bot) — middle orbit, opposite side */}
        <motion.g
          style={{ transformOrigin: "400px 300px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <g transform="translate(170 300) rotate(30)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            >
              <circle r="20" fill="var(--card)" stroke="oklch(0.7 0.2 320)" strokeWidth="1.5" opacity="0.95" />
              <foreignObject x="-11" y="-11" width="22" height="22">
                <div className="flex h-full w-full items-center justify-center">
                  <Bot className="h-3.5 w-3.5" style={{ color: "oklch(0.7 0.2 320)" }} strokeWidth={2.2} />
                </div>
              </foreignObject>
            </motion.g>
          </g>
        </motion.g>

        {/* ===== Orbiting particles (small dots caught in gravity) ===== */}
        {ORBITING_PARTICLES.map((p, i) => (
          <motion.g
            key={`particle-${i}`}
            style={{ transformOrigin: "400px 300px" }}
            animate={{ rotate: p.direction === 1 ? 360 : -360 }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          >
            <g transform={`translate(${400 + p.radius} 300) rotate(${p.tilt})`}>
              <motion.circle
                r={p.size}
                fill={p.color}
                filter="url(#glow)"
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

/* ============ Data ============ */

const STARS = [
  { x: 80, y: 100, r: 1.5, color: "var(--primary)", duration: 3, delay: 0 },
  { x: 150, y: 50, r: 1, color: "var(--accent)", duration: 4, delay: 0.5 },
  { x: 250, y: 80, r: 2, color: "var(--primary)", duration: 3.5, delay: 1 },
  { x: 380, y: 60, r: 1, color: "oklch(0.6 0.18 95)", duration: 4.5, delay: 1.5 },
  { x: 520, y: 100, r: 1.5, color: "var(--accent)", duration: 3.2, delay: 0.8 },
  { x: 680, y: 80, r: 1, color: "var(--primary)", duration: 4, delay: 2 },
  { x: 750, y: 150, r: 2, color: "var(--accent)", duration: 3.8, delay: 0.3 },
  { x: 100, y: 250, r: 1, color: "var(--primary)", duration: 4.2, delay: 2.5 },
  { x: 60, y: 400, r: 1.5, color: "var(--accent)", duration: 3.5, delay: 1.2 },
  { x: 200, y: 500, r: 1, color: "oklch(0.6 0.18 95)", duration: 4, delay: 0.6 },
  { x: 350, y: 540, r: 2, color: "var(--primary)", duration: 3.3, delay: 1.8 },
  { x: 500, y: 500, r: 1, color: "var(--accent)", duration: 4.5, delay: 2.2 },
  { x: 650, y: 530, r: 1.5, color: "var(--primary)", duration: 3.6, delay: 0.4 },
  { x: 730, y: 450, r: 1, color: "var(--accent)", duration: 4.1, delay: 1.4 },
  { x: 770, y: 280, r: 2, color: "var(--primary)", duration: 3.7, delay: 2.8 },
  { x: 40, y: 150, r: 1, color: "var(--accent)", duration: 4.3, delay: 0.9 },
  { x: 180, y: 380, r: 1.5, color: "oklch(0.6 0.18 95)", duration: 3.4, delay: 1.7 },
  { x: 580, y: 380, r: 1, color: "var(--primary)", duration: 4.4, delay: 0.7 },
];

const COMETS = [
  { startY: 80, endY: 180, delay: 2 },
  { startY: 350, endY: 250, delay: 10 },
  { startY: 480, endY: 380, delay: 18 },
];

const ORBITING_PARTICLES = [
  // Inner orbit particles (rx 160, ry 60)
  { radius: 160, size: 3, color: "var(--primary)", duration: 14, delay: 0, direction: 1, tilt: 15 },
  { radius: 160, size: 2.5, color: "var(--accent)", duration: 16, delay: 1.5, direction: 1, tilt: 15 },
  { radius: 160, size: 2, color: "var(--primary)", duration: 18, delay: 3, direction: 1, tilt: 15 },
  // Middle orbit particles (rx 230, ry 90)
  { radius: 230, size: 3, color: "var(--accent)", duration: 20, delay: 0.5, direction: -1, tilt: -30 },
  { radius: 230, size: 2.5, color: "var(--primary)", duration: 22, delay: 2, direction: -1, tilt: -30 },
  { radius: 230, size: 2, color: "oklch(0.7 0.2 320)", duration: 24, delay: 3.5, direction: -1, tilt: -30 },
  // Outer orbit particles (rx 300, ry 120)
  { radius: 300, size: 3.5, color: "var(--primary)", duration: 30, delay: 1, direction: 1, tilt: 45 },
  { radius: 300, size: 2.5, color: "var(--accent)", duration: 32, delay: 2.5, direction: 1, tilt: 45 },
  { radius: 300, size: 2, color: "oklch(0.6 0.18 95)", duration: 34, delay: 4, direction: 1, tilt: 45 },
];
