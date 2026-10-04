"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: "left" | "center"
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  children,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-32 pb-12 sm:pt-36 sm:pb-16",
        className,
      )}
      aria-label="Page header"
    >
      <div className="absolute inset-0 -z-10 aurora-bg opacity-50 pointer-events-none" />
      <div className="absolute inset-0 -z-10 grid-overlay opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div
        className={cn(
          "container mx-auto max-w-7xl px-4 sm:px-6",
          align === "center" ? "text-center" : "text-left",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3",
            align === "center" ? "items-center" : "items-start",
          )}
        >
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              {eyebrow}
            </motion.span>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "max-w-2xl text-base text-muted-foreground sm:text-lg",
                align === "center" ? "mx-auto" : "",
              )}
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
