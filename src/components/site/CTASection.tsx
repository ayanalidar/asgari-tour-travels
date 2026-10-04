"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Phone, Sparkles, Clock, ShieldCheck, MessageCircle } from "lucide-react"
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
  whatsapp?: string
  className?: string
}

export function CTASection({
  title = "Ready to discover paradise?",
  subtitle = "Get a free customised itinerary within 24 hours. No spam, no obligation - just expert local advice from people who know the Himalayas.",
  primaryHref = "/packages",
  primaryLabel = "Browse Tour Packages",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to an Expert",
  phone,
  whatsapp,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12 lg:p-16",
        className,
      )}
    >
      {/* Animated background layers */}
      <div className="absolute inset-0 aurora-animated opacity-60 pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 top-8 size-56 rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-16 bottom-8 size-64 rounded-full bg-accent/20 blur-3xl pointer-events-none"
      />

      {/* Decorative top badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-6 flex justify-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-md">
          <Sparkles className="size-3.5 animate-pulse" />
          Limited Season Slots - Book Early
        </span>
      </motion.div>

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

        {/* Trust indicators row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" /> 24-hour turnaround
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-accent" /> No upfront payment
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-rose-300" /> 100% customisable
          </span>
        </motion.div>

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

        {/* Contact row */}
        {(phone || whatsapp) && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary">
                  <Phone className="size-3.5" />
                </span>
                <span>
                  Or call: <span className="font-semibold text-foreground">{phone}</span>
                </span>
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <span className="grid size-7 place-items-center rounded-full bg-accent/10 text-accent">
                  <MessageCircle className="size-3.5" />
                </span>
                <span>WhatsApp us</span>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
