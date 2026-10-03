"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CTASectionProps {
  title?: string
  subtitle?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  phone?: string
  className?: string
}

export function CTASection({
  title = "Ready to discover paradise?",
  subtitle = "Get a free customised itinerary within 24 hours. No spam, no obligation — just expert local advice from people who know the Himalayas.",
  primaryHref = "/packages",
  primaryLabel = "Browse Tour Packages",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to an Expert",
  phone,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 lg:p-16",
        className,
      )}
    >
      <div className="absolute inset-0 aurora-animated opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          <span className="gradient-text-mix">{title}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="btn-glow">
            <Link href={primaryHref}>
              {primaryLabel} <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        </motion.div>
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="size-4" />
            Or call us: <span className="font-semibold text-foreground">{phone}</span>
          </a>
        )}
      </div>
    </section>
  )
}
