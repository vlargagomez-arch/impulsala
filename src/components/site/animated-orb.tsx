"use client";

import { motion } from "framer-motion";

/**
 * AnimatedOrb — visual hero animado.
 * Orbe central con gradiente + anillos orbitando + partículas + halo pulsante.
 * 100% SVG + Framer Motion, sin dependencias externas ni imágenes.
 */
export function AnimatedOrb() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        role="img"
        aria-label="Visual abstracto animado"
      >
        <defs>
          {/* Orbe central gradient */}
          <radialGradient id="orb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.18 165)" stopOpacity="1" />
            <stop offset="40%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0.95" />
            <stop offset="80%" stopColor="oklch(0.55 0.18 200)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.4 0.15 260)" stopOpacity="0" />
          </radialGradient>

          {/* Halo gradient */}
          <radialGradient id="orb-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0" />
            <stop offset="60%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0" />
            <stop offset="80%" stopColor="oklch(0.72 0.16 200)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 200)" stopOpacity="0" />
          </radialGradient>

          {/* Ring gradient */}
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="oklch(0.72 0.16 200)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="ring-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.78 0.18 95)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 320)" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer halo — pulsing */}
        <motion.circle
          cx="200"
          cy="200"
          r="180"
          fill="url(#orb-halo)"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Ring 3 — outer, slowest */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="160"
            ry="60"
            fill="none"
            stroke="url(#ring-grad-2)"
            strokeWidth="1.5"
            opacity="0.4"
            transform="rotate(45 200 200)"
          />
        </motion.g>

        {/* Ring 2 — medium, counter-rotating */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="130"
            ry="50"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="2"
            opacity="0.7"
            transform="rotate(-30 200 200)"
          />
          {/* Small dot on ring 2 */}
          <circle cx="330" cy="200" r="4" fill="oklch(0.78 0.18 165)" filter="url(#particle-glow)" />
        </motion.g>

        {/* Ring 1 — inner, faster */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <ellipse
            cx="200"
            cy="200"
            rx="100"
            ry="40"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="2.5"
            opacity="0.9"
          />
          {/* Dot on ring 1 */}
          <circle cx="300" cy="200" r="5" fill="oklch(0.85 0.18 165)" filter="url(#particle-glow)" />
          <circle cx="100" cy="200" r="3" fill="oklch(0.72 0.16 200)" filter="url(#particle-glow)" />
        </motion.g>

        {/* Orbe central — subtle pulse */}
        <motion.circle
          cx="200"
          cy="200"
          r="70"
          fill="url(#orb-core)"
          filter="url(#orb-glow)"
          animate={{
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Inner highlight */}
        <motion.circle
          cx="185"
          cy="180"
          r="18"
          fill="oklch(0.98 0.01 250)"
          opacity="0.5"
          animate={{
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.color}
            filter="url(#particle-glow)"
            animate={{
              y: [0, -p.float, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {/* Connection lines (subtle network effect) */}
        <g opacity="0.15" stroke="oklch(0.78 0.18 165)" strokeWidth="0.8" fill="none">
          <motion.line
            x1="200"
            y1="200"
            x2="80"
            y2="80"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0 }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="330"
            y2="120"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="120"
            y2="320"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
          <motion.line
            x1="200"
            y1="200"
            x2="320"
            y2="280"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, delay: 3 }}
          />
        </g>
      </svg>
    </div>
  );
}

const PARTICLES = [
  { x: 80, y: 80, r: 3, color: "oklch(0.78 0.18 165)", float: 14, duration: 4, delay: 0 },
  { x: 330, y: 120, r: 4, color: "oklch(0.72 0.16 200)", float: 18, duration: 5, delay: 0.8 },
  { x: 120, y: 320, r: 2.5, color: "oklch(0.78 0.18 165)", float: 12, duration: 4.5, delay: 1.5 },
  { x: 320, y: 280, r: 3.5, color: "oklch(0.78 0.18 95)", float: 16, duration: 5.5, delay: 2.2 },
  { x: 60, y: 200, r: 2, color: "oklch(0.72 0.16 200)", float: 10, duration: 4, delay: 0.4 },
  { x: 340, y: 220, r: 3, color: "oklch(0.7 0.2 320)", float: 14, duration: 5, delay: 1.8 },
  { x: 200, y: 50, r: 2.5, color: "oklch(0.78 0.18 165)", float: 16, duration: 4.8, delay: 1.2 },
  { x: 200, y: 360, r: 3, color: "oklch(0.72 0.16 200)", float: 14, duration: 5.2, delay: 2.6 },
];
