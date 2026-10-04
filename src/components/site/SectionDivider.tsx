"use client"

import { motion } from "framer-motion"

interface SectionDividerProps {
  variant?: "wave" | "gradient" | "dots" | "spikes"
  className?: string
}

/**
 * Decorative animated section divider for between landing page sections.
 * Variants: wave (animated SVG wave), gradient (gradient line), dots (row of glowing dots), spikes (zigzag)
 */
export function SectionDivider({ variant = "gradient", className = "" }: SectionDividerProps) {
  if (variant === "wave") {
    return (
      <div className={`relative h-12 overflow-hidden ${className}`}>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M0 24 Q 180 0 360 24 T 720 24 T 1080 24 T 1440 24"
            stroke="url(#wave-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="oklch(0.78 0.16 75)" stopOpacity="0" />
              <stop offset="0.2" stopColor="oklch(0.78 0.16 75)" />
              <stop offset="0.5" stopColor="oklch(0.7 0.14 160)" />
              <stop offset="0.8" stopColor="oklch(0.7 0.18 15)" />
              <stop offset="1" stopColor="oklch(0.7 0.18 15)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full bg-primary/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "spikes") {
    return (
      <div className={`flex items-center justify-center gap-1.5 py-6 ${className}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-primary/0 via-primary/60 to-primary/0"
            style={{ height: `${10 + Math.abs(4 - i) * 8}px` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    )
  }

  // gradient (default)
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`}>
      <motion.div
        className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.span
        className="absolute size-2 rounded-full bg-primary"
        animate={{ boxShadow: ["0 0 0 0 oklch(0.78 0.16 75 / 0.4)", "0 0 0 8px oklch(0.78 0.16 75 / 0)", "0 0 0 0 oklch(0.78 0.16 75 / 0)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  )
}
