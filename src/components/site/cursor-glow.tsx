"use client";

import { useSyncExternalStore } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";

function subscribeFinePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * A glowing orb that follows the cursor with a soft trail. Hidden on touch / mobile.
 */
export function CursorGlow() {
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getServerSnapshot,
  );
  const pos = useMousePosition(0.18);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55] hidden md:block"
      aria-hidden
      style={{
        background: `radial-gradient(400px circle at ${(pos.x + 1) * 50}% ${
          (pos.y + 1) * 50
        }%, oklch(0.78 0.18 165 / 0.07), transparent 60%)`,
        transition: "background 60ms linear",
      }}
    />
  );
}
