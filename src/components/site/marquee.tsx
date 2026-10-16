"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  className?: string;
  reverse?: boolean;
  duration?: number;
};

/**
 * Infinite marquee for logos / partners / tech stack.
 */
export function Marquee({ items, className, reverse = false, duration = 28 }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-12 pr-12 [animation:marquee_var(--duration)_linear_infinite] group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={
          {
            "--duration": `${duration}s`,
          } as React.CSSProperties
        }
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="text-2xl font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-12 pr-12 [animation:marquee_var(--duration)_linear_infinite] group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={
          {
            "--duration": `${duration}s`,
          } as React.CSSProperties
        }
        aria-hidden
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`dup-${item}-${i}`}
            className="text-2xl font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
