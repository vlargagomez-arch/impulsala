"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrambleText — efecto decode/scramble para texto.
 *
 * Renderiza caracteres aleatorios que se van "resolviendo" uno a uno
 * hasta mostrar el texto final. Ideal para títulos hero estilo hacker/tech.
 *
 * @param text      Texto final a mostrar
 * @param duration  Duración total del efecto en ms (default 1200)
 * @param charset   Caracteres a usar para el scramble (default mix alfanumérico + símbolos)
 */
const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>/\\";

export function useScrambleText(
  text: string,
  { duration = 1200, charset = DEFAULT_CHARSET }: { duration?: number; charset?: string } = {},
) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const len = text.length;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);

      // Cuántos caracteres ya están "resueltos" (de izquierda a derecha)
      const resolved = Math.floor(progress * len);

      // Construir string: caracteres resueltos + caracteres en scramble
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        // Preservar espacios
        if (ch === " ") {
          out += " ";
          continue;
        }
        if (i < resolved) {
          out += ch;
        } else {
          // Carácter aleatorio del charset
          out += charset[Math.floor(Math.random() * charset.length)];
        }
      }

      setDisplay(out);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, duration, charset]);

  return display;
}
