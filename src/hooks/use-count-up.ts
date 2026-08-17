"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `end` when the element enters the viewport.
 *
 * Robust implementation: checks on mount whether the element is already
 * visible (above-the-fold) and starts the animation immediately. Falls back
 * to an IntersectionObserver for below-the-fold elements.
 *
 * On mobile, the animation is skipped (shows final value directly) for
 * better performance.
 */
export function useCountUp(end: number, duration = 1800, decimals = 0) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1. Synchronous check: is the element already in the viewport?
    const checkInView = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const visible =
        rect.top < vh &&
        rect.bottom > 0 &&
        rect.left < vw &&
        rect.right > 0;
      if (visible) {
        setInView(true);
        return true;
      }
      return false;
    };

    if (checkInView()) return;

    // 2. Otherwise observe until it scrolls into view
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px", threshold: 0.1 }
    );
    observer.observe(el);

    // 3. Safety fallback: if observer hasn't fired within 1.5s, start anyway
    const fallback = window.setTimeout(() => {
      setInView(true);
    }, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!inView) return;

    // En móvil, mostrar el valor final directamente (sin animación) para mejor performance
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const raf = requestAnimationFrame(() => setValue(end));
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const formatted = value.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return { ref, value, formatted };
}
