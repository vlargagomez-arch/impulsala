"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
};

/**
 * Number that counts up when scrolled into view.
 *
 * Muestra el valor final directamente hasta que la animación comienza,
 * para evitar el flash de "0" durante la hidratación.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration,
}: AnimatedCounterProps) {
  const { ref, value: animatedValue, formatted } = useCountUp(value, duration, decimals);

  // Valor final formateado (para SSR y para evitar flash de 0)
  const finalFormatted = value.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Si la animación no ha empezado (valor es 0 y es el valor final real),
  // mostrar el valor final para evitar flash de "0"
  const hasStarted = animatedValue > 0;
  const display = hasStarted ? formatted : finalFormatted;

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
