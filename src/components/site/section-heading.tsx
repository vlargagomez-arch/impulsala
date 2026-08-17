"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** E.g. "01 / 06" */
  index?: string;
  /** Small chip text above title, e.g. "Nuestros servicios" */
  label?: string;
  /** Main headline. Supports a highlighted segment via `highlight`. */
  title: string;
  /** Optional second segment of the title rendered with gradient. */
  highlight?: string;
  /** Supporting paragraph below the title. */
  description?: string;
  /** Optional icon shown next to the label. */
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
};

/**
 * Consistent section heading: numbered chip + label + animated gradient title + description.
 * Used by every section so the customer always knows where they are in the journey.
 */
export function SectionHeading({
  index,
  label,
  title,
  highlight,
  description,
  icon: Icon,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn("mx-auto max-w-3xl text-center", className)}
    >
      {/* Chip with index + label */}
      {(index || label) && (
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-secondary/30 px-3 py-1.5">
          {index && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono font-medium text-primary">
              {index}
            </span>
          )}
          {Icon && <Icon className="h-3 w-3 text-primary" />}
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}{" "}
        {highlight && (
          <span className="text-gradient-animated">
            {highlight}
          </span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </motion.div>
  );
}
