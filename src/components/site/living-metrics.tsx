"use client";

import { motion } from "framer-motion";
import { Heart, Share2, MessageCircle, TrendingUp, Users, Eye } from "lucide-react";

/**
 * LivingMetrics — constelación flotante de cards glassmorphic en 3D.
 * Cada card es una mini-visualización animada que cuenta una historia de marketing:
 *   - Line chart creciendo (resultados)
 *   - Donut completándose (conversión)
 *   - Número tickando (KPI)
 *   - Bar chart (engagement por canal)
 *   - Progress ring (retención)
 *   - Social engagement (likes/shares/comments)
 *
 * Las cards flotan a distintas profundidades (translateZ) con oscilación suave.
 * Conectadas por líneas con partículas fluyendo.
 * Todo theme-aware (usa CSS vars) y 100% SVG + Framer Motion.
 */
export function LivingMetrics() {
  return (
    <div className="relative h-full w-full" style={{ perspective: "1400px" }}>
      {/* Background morphing blob — soft aurora behind cards */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <radialGradient id="blob-glow-1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob-glow-2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.circle
          cx="240"
          cy="220"
          r="220"
          fill="url(#blob-glow-1)"
          animate={{ cx: [240, 320, 200, 240], cy: [220, 280, 180, 220], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="560"
          cy="380"
          r="200"
          fill="url(#blob-glow-2)"
          animate={{ cx: [560, 480, 600, 560], cy: [380, 320, 420, 380], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </svg>

      {/* Floating cards container */}
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {/* Connection lines (behind cards) */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {CONNECTIONS.map((c, i) => (
            <g key={i}>
              <line
                x1={c.from.x}
                y1={c.from.y}
                x2={c.to.x}
                y2={c.to.y}
                stroke="var(--primary)"
                strokeWidth="1"
                opacity="0.15"
              />
              <motion.circle
                r="3"
                fill="var(--accent)"
                animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: "linear" }}
                style={{
                  offsetPath: `path("M ${c.from.x} ${c.from.y} L ${c.to.x} ${c.to.y}")`,
                }}
              />
            </g>
          ))}
        </svg>

        {/* Card 1: Line chart growing (top-left) */}
        <FloatingCard x="8%" y="18%" depth={-60} floatDelay={0} floatDuration={6}>
          <LineChartCard />
        </FloatingCard>

        {/* Card 2: Donut filling (top-right) */}
        <FloatingCard x="68%" y="10%" depth={-40} floatDelay={1.5} floatDuration={7}>
          <DonutCard />
        </FloatingCard>

        {/* Card 3: Number ticker (center) */}
        <FloatingCard x="42%" y="38%" depth={-100} floatDelay={0.8} floatDuration={5.5} scale={1.15}>
          <TickerCard />
        </FloatingCard>

        {/* Card 4: Bar chart (bottom-left) */}
        <FloatingCard x="5%" y="62%" depth={-30} floatDelay={2.2} floatDuration={6.5}>
          <BarChartCard />
        </FloatingCard>

        {/* Card 5: Progress ring (bottom-right) */}
        <FloatingCard x="72%" y="62%" depth={-50} floatDelay={0.4} floatDuration={6.8}>
          <ProgressRingCard />
        </FloatingCard>

        {/* Card 6: Social engagement (bottom-center) */}
        <FloatingCard x="38%" y="74%" depth={-20} floatDelay={1.2} floatDuration={7.2}>
          <SocialCard />
        </FloatingCard>

        {/* Sparkle particles scattered */}
        {SPARKLES.map((s, i) => (
          <motion.span
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent)",
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ Floating Card Wrapper ============ */

function FloatingCard({
  children,
  x,
  y,
  depth,
  floatDelay,
  floatDuration,
  scale = 1,
}: {
  children: React.ReactNode;
  x: string;
  y: string;
  depth: number;
  floatDelay: number;
  floatDuration: number;
  scale?: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: `translateZ(${depth}px) scale(${scale})`,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 30, scale: scale * 0.7 }}
      animate={{
        opacity: 1,
        y: [30, 0, -10, 0, 30],
        scale: scale,
      }}
      transition={{
        opacity: { duration: 0.6, delay: floatDelay },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          delay: floatDelay,
          ease: "easeInOut",
        },
        scale: { duration: 0.6, delay: floatDelay },
      }}
    >
      <div
        className="glass w-[170px] overflow-hidden rounded-2xl p-3.5 shadow-2xl"
        style={{
          boxShadow: "0 20px 50px -20px color-mix(in oklch, var(--primary) 40%, transparent)",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ============ Card 1: Line Chart ============ */
function LineChartCard() {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground">Tráfico orgánico</span>
        <TrendingUp className="h-3 w-3 text-primary" />
      </div>
      <div className="mb-1.5 flex items-baseline gap-1">
        <span className="text-lg font-bold text-gradient-primary">+210%</span>
        <span className="text-[9px] text-emerald-500">↑ 12%</span>
      </div>
      <svg viewBox="0 0 140 40" className="h-10 w-full">
        <defs>
          <linearGradient id="line-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 35 L 25 30 L 50 25 L 75 18 L 100 12 L 140 4"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.85, 1] }}
        />
        <motion.path
          d="M 0 35 L 25 30 L 50 25 L 75 18 L 100 12 L 140 4 L 140 40 L 0 40 Z"
          fill="url(#line-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 0.85, 1] }}
        />
        <motion.circle
          cx="140"
          cy="4"
          r="3"
          fill="var(--primary)"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

/* ============ Card 2: Donut Chart ============ */
function DonutCard() {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 70 70" className="h-full w-full -rotate-90">
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="6"
            opacity="0.3"
          />
          <motion.circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: [circumference, circumference * 0.22, circumference] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.6, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-base font-bold text-gradient-primary"
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
          >
            78%
          </motion.span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground">Conversión</div>
        <div className="text-xs font-semibold text-foreground">Top 3 Google</div>
        <div className="mt-0.5 text-[9px] text-emerald-500">↑ 24% vs mes anterior</div>
      </div>
    </div>
  );
}

/* ============ Card 3: Ticker Number ============ */
function TickerCard() {
  return (
    <div className="text-center">
      <div className="mb-1 flex items-center justify-center gap-1.5">
        <TrendingUp className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-medium text-muted-foreground">ROI promedio</span>
      </div>
      <div className="text-3xl font-bold leading-none text-gradient-animated">
        <AnimatedTicker value={340} suffix="%" prefix="+" />
      </div>
      <div className="mt-2 flex justify-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="h-1 w-1 rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <div className="mt-1 text-[9px] text-muted-foreground">Últimos 12 meses</div>
    </div>
  );
}

function AnimatedTicker({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      <motion.span
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block"
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

/* ============ Card 4: Bar Chart ============ */
function BarChartCard() {
  const bars = [
    { label: "G", height: 60, delay: 0 },
    { label: "M", height: 85, delay: 0.2 },
    { label: "F", height: 70, delay: 0.4 },
    { label: "I", height: 95, delay: 0.6 },
    { label: "T", height: 50, delay: 0.8 },
  ];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-medium text-muted-foreground">Engagement</span>
        <Users className="h-3 w-3 text-primary" />
      </div>
      <div className="flex h-12 items-end justify-between gap-1.5">
        {bars.map((bar, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t"
              style={{
                background: "linear-gradient(to top, var(--primary), var(--accent))",
              }}
              initial={{ height: 0 }}
              animate={{ height: [`${bar.height}%`, `${bar.height * 0.85}%`, `${bar.height}%`] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: bar.delay,
                ease: "easeInOut",
              }}
            />
            <span className="text-[8px] text-muted-foreground">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Card 5: Progress Ring ============ */
function ProgressRingCard() {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="5"
            opacity="0.3"
          />
          <motion.circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: [circumference, circumference * 0.02, circumference] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.7, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-foreground">98%</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground">Retención</div>
        <div className="text-xs font-semibold text-foreground">Clientes activos</div>
        <div className="mt-0.5 flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full" style={{ background: "var(--accent)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Card 6: Social Engagement ============ */
function SocialCard() {
  const items = [
    { icon: Heart, value: "2.4K", color: "oklch(0.65 0.22 25)", delay: 0 },
    { icon: MessageCircle, value: "184", color: "var(--primary)", delay: 0.5 },
    { icon: Share2, value: "312", color: "var(--accent)", delay: 1 },
    { icon: Eye, value: "45K", color: "oklch(0.6 0.18 95)", delay: 1.5 },
  ];
  return (
    <div>
      <div className="mb-2 text-[10px] font-medium text-muted-foreground">Campaña Meta Ads</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
          >
            <item.icon className="h-3 w-3" style={{ color: item.color }} />
            <span className="text-[11px] font-semibold text-foreground">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ Data ============ */

const CONNECTIONS = [
  { from: { x: 145, y: 145 }, to: { x: 400, y: 290 }, duration: 4, delay: 0 },
  { from: { x: 400, y: 290 }, to: { x: 655, y: 100 }, duration: 5, delay: 0.8 },
  { from: { x: 400, y: 290 }, to: { x: 130, y: 470 }, duration: 4.5, delay: 1.5 },
  { from: { x: 400, y: 290 }, to: { x: 655, y: 440 }, duration: 5, delay: 2.2 },
  { from: { x: 400, y: 290 }, to: { x: 380, y: 510 }, duration: 4, delay: 0.4 },
];

const SPARKLES = [
  { x: 20, y: 35, size: 3, delay: 0 },
  { x: 80, y: 25, size: 2, delay: 0.8 },
  { x: 60, y: 55, size: 4, delay: 1.5 },
  { x: 30, y: 80, size: 2, delay: 2.2 },
  { x: 88, y: 70, size: 3, delay: 0.5 },
  { x: 50, y: 15, size: 2, delay: 1.8 },
  { x: 15, y: 55, size: 3, delay: 2.5 },
  { x: 75, y: 90, size: 2, delay: 1.2 },
];
