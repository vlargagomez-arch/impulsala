"use client";

import { useSyncExternalStore, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};
function getTouchSnapshot() {
  return typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
}
function getServerTouchSnapshot() {
  return false;
}

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
  /** Glare effect on hover */
  glare?: boolean;
  /** Spotlight following the cursor */
  spotlight?: boolean;
  spotlightColor?: string;
};

/**
 * A 3D tilt card that rotates based on cursor position with optional
 * glare and spotlight effects. Pure CSS transforms — no WebGL.
 */
export function TiltCard({
  children,
  className,
  max = 12,
  glare = true,
  spotlight = true,
  spotlightColor = "oklch(0.78 0.18 165 / 0.25)",
}: TiltCardProps) {
  const isTouchDevice = useSyncExternalStore(emptySubscribe, getTouchSnapshot, getServerTouchSnapshot);
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  // Glare position
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  // Spotlight position (px)
  const spotlightX = useTransform(sx, (v) => `${v * 100}%`);
  const spotlightY = useTransform(sy, (v) => `${v * 100}%`);

  // Pre-computed overlays (called unconditionally to satisfy rules-of-hooks)
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([lx, ly]: string[]) =>
      `radial-gradient(280px circle at ${lx} ${ly}, ${spotlightColor}, transparent 70%)`,
  );
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]: string[]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 60%)`,
  );

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
    setHovered(false);
  }

  if (isTouchDevice) {
    // En móvil: retornar children directo SIN wrapper para evitar problemas de hit-testing en taps
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        perspective: 1200,
      }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {children}

        {/* Spotlight overlay */}
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              background: spotlightBg,
              opacity: hovered ? 1 : 0,
            }}
          />
        )}

        {/* Glare overlay */}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
            style={{
              background: glareBg,
              opacity: hovered ? 0.6 : 0,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
