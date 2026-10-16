"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated aurora/gradient mesh background. Pure CSS, GPU-friendly.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -top-1/4 left-1/4 h-[60vh] w-[60vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 165 / 0.35), transparent 70%)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 h-[50vh] w-[50vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.16 200 / 0.3), transparent 70%)",
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[40vh] w-[40vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.18 95 / 0.18), transparent 70%)",
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </div>
  );
}
