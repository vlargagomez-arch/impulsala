"use client";

import { motion } from "framer-motion";
import { Megaphone, TrendingUp, Users, Target, BarChart3, Mail, ShoppingBag } from "lucide-react";

/**
 * MarketingHeroBackground — visual animado temático de marketing digital.
 * Combina 4 capas:
 *   1. Red de nodos (audiencia/leads conectados)
 *   2. Curva de crecimiento animada (resultados medibles)
 *   3. Iconos de marketing flotando (servicios)
 *   4. Métricas flotantes (proof de resultados)
 *   5. Anillos de conversión pulsantes (engagement)
 *
 * 100% SVG + Framer Motion. Usa CSS vars para adaptarse a light/dark.
 */
export function MarketingHeroBackground() {
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 800 600"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Visual de marketing digital animado"
      >
        <defs>
          <linearGradient id="growth-line" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="growth-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <filter id="node-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* === Layer 1: Background grid (very subtle) === */}
        <g opacity="0.15">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50}
              x2="800"
              y2={i * 50}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 50}
              y1="0"
              x2={i * 50}
              y2="600"
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* === Layer 2: Growth curve (animated draw) === */}
        <g>
          {/* Area under curve */}
          <motion.path
            d="M 50 500 Q 200 480 280 420 T 450 280 T 620 180 T 770 80 L 770 600 L 50 600 Z"
            fill="url(#growth-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Line chart */}
          <motion.path
            d="M 50 500 Q 200 480 280 420 T 450 280 T 620 180 T 770 80"
            fill="none"
            stroke="url(#growth-line)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
          />
          {/* Data points on the curve */}
          {[
            { x: 50, y: 500, delay: 0.5 },
            { x: 280, y: 420, delay: 1.5 },
            { x: 450, y: 280, delay: 2.5 },
            { x: 620, y: 180, delay: 3.5 },
            { x: 770, y: 80, delay: 4.5 },
          ].map((p, i) => (
            <motion.circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="var(--primary)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1, 1.4, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* === Layer 3: Network nodes (audience graph) === */}
        <g>
          {/* Connection lines */}
          {NETWORK_LINES.map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="var(--primary)"
              strokeWidth="1"
              opacity="0.25"
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
          {/* Nodes */}
          {NETWORK_NODES.map((node, i) => (
            <motion.g key={`node-${i}`}>
              {/* Glow halo */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="14"
                fill="url(#node-glow)"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
              {/* Core dot */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="var(--primary)"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
              {/* Conversion ring (only some nodes) */}
              {node.converts && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 3.5], opacity: [0.8, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>

        {/* === Layer 4: Floating marketing icons === */}
        {FLOATING_ICONS.map((item, i) => (
          <motion.g
            key={`icon-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1],
            }}
            style={{ transformOrigin: `${item.x}px ${item.y}px` }}
          >
            <circle
              cx={item.x}
              cy={item.y}
              r="22"
              fill="var(--card)"
              stroke="var(--primary)"
              strokeWidth="1.5"
              opacity="0.95"
            />
            <foreignObject
              x={item.x - 12}
              y={item.y - 12}
              width="24"
              height="24"
            >
              <div className="flex h-full w-full items-center justify-center">
                <item.icon
                  className="h-4 w-4"
                  style={{ color: "var(--primary)" }}
                  strokeWidth={2.2}
                />
              </div>
            </foreignObject>
          </motion.g>
        ))}

        {/* === Layer 5: Floating metric badges === */}
        {METRIC_BADGES.map((badge, i) => (
          <motion.g
            key={`badge-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [10, 0, -8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: badge.delay,
              ease: "easeInOut",
              times: [0, 0.25, 0.75, 1],
            }}
          >
            <rect
              x={badge.x}
              y={badge.y}
              width="110"
              height="44"
              rx="10"
              fill="var(--card)"
              stroke="var(--primary)"
              strokeWidth="1"
              opacity="0.95"
            />
            {/* Value */}
            <text
              x={badge.x + 10}
              y={badge.y + 20}
              fontSize="14"
              fontWeight="700"
              fill="var(--primary)"
              fontFamily="var(--font-geist-sans), sans-serif"
            >
              {badge.value}
            </text>
            {/* Label */}
            <text
              x={badge.x + 10}
              y={badge.y + 35}
              fontSize="9"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-geist-sans), sans-serif"
            >
              {badge.label}
            </text>
            {/* Sparkle indicator */}
            <circle
              cx={badge.x + 96}
              cy={badge.y + 12}
              r="3"
              fill="var(--accent)"
              opacity="0.9"
            />
          </motion.g>
        ))}

        {/* === Layer 6: Flowing particles along connections === */}
        {FLOWING_PARTICLES.map((p, i) => (
          <motion.circle
            key={`flow-${i}`}
            r="2.5"
            fill="var(--accent)"
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              offsetPath: `path("${p.path}")`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ============ Data ============ */

const NETWORK_NODES = [
  { x: 150, y: 180, r: 5, converts: false },
  { x: 280, y: 120, r: 4, converts: false },
  { x: 380, y: 200, r: 6, converts: true },
  { x: 520, y: 130, r: 4, converts: false },
  { x: 650, y: 220, r: 5, converts: false },
  { x: 180, y: 380, r: 4, converts: false },
  { x: 320, y: 440, r: 6, converts: true },
  { x: 480, y: 380, r: 4, converts: false },
  { x: 600, y: 440, r: 5, converts: false },
  { x: 720, y: 360, r: 4, converts: false },
  { x: 100, y: 280, r: 3, converts: false },
  { x: 240, y: 280, r: 3, converts: false },
  { x: 420, y: 320, r: 3, converts: false },
  { x: 560, y: 320, r: 3, converts: false },
];

const NETWORK_LINES = [
  { from: { x: 150, y: 180 }, to: { x: 280, y: 120 } },
  { from: { x: 280, y: 120 }, to: { x: 380, y: 200 } },
  { from: { x: 380, y: 200 }, to: { x: 520, y: 130 } },
  { from: { x: 520, y: 130 }, to: { x: 650, y: 220 } },
  { from: { x: 150, y: 180 }, to: { x: 100, y: 280 } },
  { from: { x: 100, y: 280 }, to: { x: 240, y: 280 } },
  { from: { x: 240, y: 280 }, to: { x: 320, y: 440 } },
  { from: { x: 320, y: 440 }, to: { x: 480, y: 380 } },
  { from: { x: 480, y: 380 }, to: { x: 600, y: 440 } },
  { from: { x: 600, y: 440 }, to: { x: 720, y: 360 } },
  { from: { x: 380, y: 200 }, to: { x: 420, y: 320 } },
  { from: { x: 420, y: 320 }, to: { x: 480, y: 380 } },
  { from: { x: 560, y: 320 }, to: { x: 650, y: 220 } },
  { from: { x: 560, y: 320 }, to: { x: 600, y: 440 } },
  { from: { x: 240, y: 280 }, to: { x: 180, y: 380 } },
  { from: { x: 180, y: 380 }, to: { x: 320, y: 440 } },
  { from: { x: 420, y: 320 }, to: { x: 560, y: 320 } },
];

const FLOATING_ICONS = [
  { x: 220, y: 70, icon: Megaphone, delay: 0 },
  { x: 700, y: 130, icon: TrendingUp, delay: 1.5 },
  { x: 100, y: 470, icon: Users, delay: 3 },
  { x: 680, y: 510, icon: Target, delay: 4.5 },
  { x: 410, y: 540, icon: BarChart3, delay: 6 },
];

const METRIC_BADGES = [
  { x: 580, y: 60, value: "+340%", label: "ROI promedio", delay: 0.5 },
  { x: 50, y: 100, value: "+210%", label: "Tráfico orgánico", delay: 2.5 },
  { x: 540, y: 480, value: "98%", label: "Retención", delay: 4.5 },
];

const FLOWING_PARTICLES = [
  {
    path: "M 150 180 L 280 120 L 380 200 L 520 130 L 650 220",
    duration: 6,
    delay: 0,
  },
  {
    path: "M 100 280 L 240 280 L 320 440 L 480 380 L 600 440 L 720 360",
    duration: 7,
    delay: 1,
  },
  {
    path: "M 380 200 L 420 320 L 560 320 L 650 220",
    duration: 5,
    delay: 2,
  },
];
