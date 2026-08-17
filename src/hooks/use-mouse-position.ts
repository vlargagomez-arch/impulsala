"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks the mouse position relative to the viewport (normalized -1..1).
 * Optionally smoothed via lerp for parallax effects.
 */
export function useMousePosition(smoothing = 0.1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const loop = () => {
      current.current = {
        x: current.current.x + (target.current.x - current.current.x) * smoothing,
        y: current.current.y + (target.current.y - current.current.y) * smoothing,
      };
      setPos({ ...current.current });
      raf.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [smoothing]);

  return pos;
}
