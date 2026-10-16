"use client";

import { motion } from "framer-motion";
import type { BlogCategory } from "@/components/site/blog-data";

/**
 * Ilustraciones SVG abstractas animadas para los covers del blog.
 * Una por categoría — cada una con su propio patrón visual y movimiento.
 */
export function BlogCoverArt({ category }: { category: BlogCategory }) {
  switch (category) {
    case "IA y Chatbots":
      return <AIChatArt />;
    case "SEO Orgánico":
      return <SEOArt />;
    case "Ads y Performance":
      return <AdsArt />;
    case "Automatización":
      return <AutomationArt />;
    case "Nuevas tecnologías":
      return <TechArt />;
    case "Desarrollo Software":
      return <SoftwareArt />;
  }
}

/* ---------- IA y Chatbots: nodos conectados conversacionales ---------- */
function AIChatArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ai-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 200)" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Chat bubbles */}
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="40" y="60" width="120" height="36" rx="18" fill="url(#ai-g)" opacity="0.7" />
        <rect x="40" y="60" width="120" height="36" rx="18" fill="none" stroke="oklch(0.78 0.18 165)" strokeWidth="1" opacity="0.5" />
        <circle cx="60" cy="78" r="3" fill="oklch(0.95 0.05 165)" />
        <circle cx="75" cy="78" r="3" fill="oklch(0.95 0.05 165)" />
        <circle cx="90" cy="78" r="3" fill="oklch(0.95 0.05 165)" />
      </motion.g>
      <motion.g
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <rect x="240" y="100" width="120" height="36" rx="18" fill="url(#ai-g)" opacity="0.9" />
        <rect x="240" y="100" width="120" height="36" rx="18" fill="none" stroke="oklch(0.78 0.18 165)" strokeWidth="1" opacity="0.7" />
        <circle cx="260" cy="118" r="3" fill="oklch(0.95 0.05 165)" />
        <circle cx="275" cy="118" r="3" fill="oklch(0.95 0.05 165)" />
        <circle cx="290" cy="118" r="3" fill="oklch(0.95 0.05 165)" />
      </motion.g>
      {/* Connection */}
      <motion.path
        d="M 160 78 Q 200 90 240 118"
        fill="none"
        stroke="oklch(0.78 0.18 165)"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.5"
        animate={{ strokeDashoffset: [0, -12] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      {/* Floating dots */}
      {[
        { x: 200, y: 50, d: 0 },
        { x: 200, y: 150, d: 1.5 },
        { x: 100, y: 30, d: 0.8 },
        { x: 300, y: 170, d: 2.2 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.5"
          fill="oklch(0.78 0.18 165)"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: p.d }}
        />
      ))}
    </svg>
  );
}

/* ---------- SEO: gráfico de crecimiento con keyword tags ---------- */
function SEOArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="seo-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 165)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="oklch(0.95 0.05 250)" strokeWidth="0.5" opacity="0.15" />
      ))}
      {/* Area chart */}
      <motion.path
        d="M 30 170 L 80 150 L 130 160 L 180 120 L 230 100 L 280 70 L 330 50 L 380 30 L 380 200 L 30 200 Z"
        fill="url(#seo-area)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Line chart */}
      <motion.path
        d="M 30 170 L 80 150 L 130 160 L 180 120 L 230 100 L 280 70 L 330 50 L 380 30"
        fill="none"
        stroke="oklch(0.78 0.18 165)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {/* End dot pulsing */}
      <motion.circle
        cx="380"
        cy="30"
        r="5"
        fill="oklch(0.95 0.18 165)"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Keyword tags floating */}
      {[
        { x: 60, y: 40, t: "#seo", d: 0 },
        { x: 200, y: 25, t: "#google", d: 0.5 },
        { x: 320, y: 80, t: "#ranking", d: 1 },
        { x: 100, y: 110, t: "#keywords", d: 1.5 },
      ].map((tag, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: tag.d }}
        >
          <rect x={tag.x} y={tag.y} width={tag.t.length * 8 + 12} height="18" rx="9" fill="oklch(0.78 0.18 165)" opacity="0.2" />
          <text x={tag.x + 6} y={tag.y + 13} fontSize="10" fill="oklch(0.85 0.18 165)" fontFamily="monospace">
            {tag.t}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------- Ads: funnel con monedas cayendo ---------- */
function AdsArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {/* Funnel shape */}
      <motion.path
        d="M 80 40 L 320 40 L 240 100 L 240 160 L 160 160 L 160 100 Z"
        fill="oklch(0.78 0.18 95)"
        opacity="0.15"
        stroke="oklch(0.78 0.18 95)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Stage indicators */}
      {[
        { y: 55, w: 240, label: "Impresiones" },
        { y: 90, w: 180, label: "Clics" },
        { y: 125, w: 120, label: "Leads" },
        { y: 155, w: 80, label: "Ventas" },
      ].map((stage, i) => (
        <motion.rect
          key={i}
          x={200 - stage.w / 2}
          y={stage.y}
          width={stage.w}
          height="8"
          rx="4"
          fill="oklch(0.78 0.18 95)"
          opacity={0.7 - i * 0.12}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
          style={{ transformOrigin: "200px" }}
        />
      ))}
      {/* Coins falling */}
      {[
        { x: 150, d: 0 },
        { x: 200, d: 0.7 },
        { x: 250, d: 1.4 },
        { x: 180, d: 2.1 },
        { x: 220, d: 2.8 },
      ].map((coin, i) => (
        <motion.g
          key={i}
          animate={{
            y: [-10, 180],
            opacity: [0, 1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: coin.d,
            ease: "easeIn",
          }}
        >
          <circle cx={coin.x} cy="20" r="6" fill="oklch(0.85 0.18 95)" />
          <circle cx={coin.x} cy="20" r="6" fill="none" stroke="oklch(0.65 0.18 95)" strokeWidth="1" />
          <text x={coin.x - 2} y={24} fontSize="7" fontWeight="bold" fill="oklch(0.4 0.1 95)">
            $
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------- Automatización: nodos conectados con flujo ---------- */
function AutomationArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {/* Nodes */}
      {[
        { x: 60, y: 100, label: "Trigger" },
        { x: 180, y: 60, label: "Process" },
        { x: 180, y: 140, label: "Filter" },
        { x: 320, y: 100, label: "Action" },
      ].map((node, i) => (
        <motion.g
          key={i}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
        >
          <rect
            x={node.x - 35}
            y={node.y - 18}
            width="70"
            height="36"
            rx="8"
            fill="oklch(0.7 0.2 320)"
            opacity="0.2"
            stroke="oklch(0.78 0.18 320)"
            strokeWidth="1.2"
          />
          <circle cx={node.x - 22} cy={node.y} r="4" fill="oklch(0.78 0.18 320)" />
          <text x={node.x - 12} y={node.y + 4} fontSize="9" fill="oklch(0.9 0.1 320)" fontFamily="monospace">
            {node.label}
          </text>
        </motion.g>
      ))}
      {/* Connection lines with flowing animation */}
      {[
        { d: "M 95 100 Q 130 80 145 60" },
        { d: "M 95 100 Q 130 120 145 140" },
        { d: "M 215 60 Q 260 80 285 100" },
        { d: "M 215 140 Q 260 120 285 100" },
      ].map((line, i) => (
        <g key={i}>
          <path d={line.d} fill="none" stroke="oklch(0.78 0.18 320)" strokeWidth="1" opacity="0.3" />
          <motion.circle
            r="3"
            fill="oklch(0.78 0.18 320)"
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            style={{
              offsetPath: `path("${line.d}")`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Nuevas tecnologías: constelación futurista ---------- */
function TechArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="tech-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.18 95)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="oklch(0.78 0.18 95)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Glow background */}
      <motion.circle
        cx="200"
        cy="100"
        r="80"
        fill="url(#tech-glow)"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      {/* Hexagons (tech motif) */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "200px 100px" }}
      >
        {[40, 60, 80].map((r, i) => (
          <polygon
            key={i}
            points={hexPoints(200, 100, r)}
            fill="none"
            stroke="oklch(0.78 0.18 95)"
            strokeWidth="1"
            opacity={0.4 - i * 0.1}
          />
        ))}
      </motion.g>
      {/* Central node */}
      <motion.circle
        cx="200"
        cy="100"
        r="6"
        fill="oklch(0.95 0.18 95)"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Constellation stars */}
      {[
        { x: 100, y: 60, d: 0 },
        { x: 300, y: 70, d: 0.4 },
        { x: 80, y: 140, d: 0.8 },
        { x: 320, y: 150, d: 1.2 },
        { x: 200, y: 30, d: 1.6 },
        { x: 200, y: 170, d: 2.0 },
      ].map((star, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={star.x}
            cy={star.y}
            r="2.5"
            fill="oklch(0.78 0.18 95)"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: star.d }}
          />
          <motion.line
            x1="200"
            y1="100"
            x2={star.x}
            y2={star.y}
            stroke="oklch(0.78 0.18 95)"
            strokeWidth="0.6"
            opacity="0.3"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: star.d }}
          />
        </motion.g>
      ))}
    </svg>
  );
}

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

/* ---------- Desarrollo Software: bloques de código + ventana ---------- */
function SoftwareArt() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {/* Code window frame */}
      <rect x="60" y="40" width="280" height="120" rx="10" fill="oklch(0.2 0.02 260)" opacity="0.6" />
      <rect x="60" y="40" width="280" height="120" rx="10" fill="none" stroke="oklch(0.72 0.16 200)" strokeWidth="1.2" opacity="0.5" />
      {/* Window top bar */}
      <rect x="60" y="40" width="280" height="20" rx="10" fill="oklch(0.25 0.02 260)" opacity="0.8" />
      <circle cx="75" cy="50" r="3" fill="oklch(0.65 0.22 25)" opacity="0.7" />
      <circle cx="86" cy="50" r="3" fill="oklch(0.78 0.18 95)" opacity="0.7" />
      <circle cx="97" cy="50" r="3" fill="oklch(0.78 0.18 165)" opacity="0.7" />
      {/* Code lines */}
      {[
        { y: 80, w: 180, color: "oklch(0.78 0.18 165)", delay: 0 },
        { y: 95, w: 140, color: "oklch(0.72 0.16 200)", delay: 0.3 },
        { y: 110, w: 200, color: "oklch(0.78 0.18 95)", delay: 0.6 },
        { y: 125, w: 160, color: "oklch(0.7 0.2 320)", delay: 0.9 },
        { y: 140, w: 120, color: "oklch(0.78 0.18 165)", delay: 1.2 },
      ].map((line, i) => (
        <motion.g key={i}>
          <rect x="80" y={line.y - 6} width="6" height="6" rx="1" fill={line.color} opacity="0.5" />
          <motion.rect
            x="92"
            y={line.y - 4}
            width={line.w}
            height="4"
            rx="2"
            fill={line.color}
            opacity="0.4"
            initial={{ width: 0 }}
            animate={{ width: line.w }}
            transition={{ duration: 0.8, delay: line.delay, ease: "easeOut" }}
          />
        </motion.g>
      ))}
      {/* Cursor blinking */}
      <motion.rect
        x={92 + 180 + 4}
        y={76}
        width="2"
        height="12"
        fill="oklch(0.95 0.05 250)"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {/* Floating tags */}
      {[
        { x: 30, y: 100, t: "</>", d: 0 },
        { x: 360, y: 90, t: "{ }", d: 1 },
        { x: 360, y: 150, t: "()", d: 2 },
      ].map((tag, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: tag.d }}
        >
          <circle cx={tag.x} cy={tag.y} r="12" fill="oklch(0.72 0.16 200)" opacity="0.15" />
          <text x={tag.x - 6} y={tag.y + 4} fontSize="10" fill="oklch(0.78 0.16 200)" fontFamily="monospace">
            {tag.t}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
