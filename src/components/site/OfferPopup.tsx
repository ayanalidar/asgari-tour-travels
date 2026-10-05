"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift, Copy, Check, Clock, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Offer {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  couponCode: string
  discountText?: string | null
  ctaText: string
  ctaHref: string
  image?: string | null
  expiryDate?: string | null
  showDelay: number
}

const DISMISS_KEY = "asgari_offer_dismissed"
const SESSION_KEY = "asgari_offer_shown"

export function OfferPopup() {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null)

  // Fetch active offer on mount
  useEffect(() => {
    // Check if already shown this session or dismissed recently (24h)
    if (sessionStorage.getItem(SESSION_KEY)) return
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      const hoursSince = (Date.now() - dismissedTime) / (1000 * 60 * 60)
      if (hoursSince < 24) return // Don't show again for 24h
    }

    fetch("/api/public/offers")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setOffer(data.data)
        }
      })
      .catch(() => {})
  }, [])

  // Show popup after delay
  useEffect(() => {
    if (!offer) return
    const delay = (offer.showDelay || 8) * 1000
    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1")
      setOpen(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [offer])

  // Countdown timer
  useEffect(() => {
    if (!offer?.expiryDate) return
    const calc = () => {
      const diff = new Date(offer.expiryDate!).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, mins, secs })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [offer])

  const close = useCallback(() => {
    setOpen(false)
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
  }, [])

  const copyCode = useCallback(() => {
    if (!offer) return
    navigator.clipboard.writeText(offer.couponCode)
    setCopied(true)
    toast.success(`Code "${offer.couponCode}" copied!`)
    setTimeout(() => setCopied(false), 2500)
  }, [offer])

  if (!offer) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/75 p-4 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl glass-strong shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
              aria-label="Close offer"
            >
              <X className="size-4" />
            </button>

            {/* Decorative header */}
            <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-rose-500/20">
              <div className="absolute inset-0 aurora-animated opacity-50" />
              <div className="absolute inset-0 grid-overlay opacity-30" />
              {/* Floating gift icon */}
              <div className="absolute inset-0 grid place-items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="grid size-16 place-items-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/30"
                >
                  <Gift className="size-8 text-white" />
                </motion.div>
              </div>
              {/* Pulsing badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute left-3 top-3"
              >
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                  <Sparkles className="size-2.5 animate-pulse" /> Limited Time
                </span>
              </motion.div>
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              {/* Discount text */}
              {offer.discountText && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-4xl font-extrabold gradient-text-saffron glow-saffron"
                >
                  {offer.discountText}
                </motion.p>
              )}

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 font-display text-lg font-bold leading-tight"
              >
                {offer.title}
              </motion.h3>

              {/* Subtitle */}
              {offer.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {offer.subtitle}
                </motion.p>
              )}

              {/* Coupon code */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Your discount code
                </p>
                <button
                  onClick={copyCode}
                  className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3 transition-all hover:border-primary hover:bg-primary/10"
                >
                  <span className="font-mono text-lg font-bold tracking-widest text-primary">
                    {offer.couponCode}
                  </span>
                  {copied ? (
                    <Check className="size-4 text-accent" />
                  ) : (
                    <Copy className="size-4 text-muted-foreground" />
                  )}
                </button>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Click to copy
                </p>
              </motion.div>

              {/* Countdown timer */}
              {timeLeft && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                >
                  <Clock className="size-3.5 text-rose-300" />
                  <span>Expires in:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                    {timeLeft.days > 0 && <span>{String(timeLeft.days).padStart(2, "0")}d</span>}
                    {timeLeft.days > 0 && <span className="text-muted-foreground">:</span>}
                    <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                    <span className="text-muted-foreground">:</span>
                    <span>{String(timeLeft.mins).padStart(2, "0")}m</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-rose-300">{String(timeLeft.secs).padStart(2, "0")}s</span>
                  </div>
                </motion.div>
              )}

              {/* CTA button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button asChild size="lg" className="btn-glow mt-5 w-full">
                  <Link href={offer.ctaHref} onClick={close}>
                    {offer.ctaText} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>

              {/* Dismiss */}
              <button
                onClick={close}
                className="mt-3 text-xs text-muted-foreground/60 underline-offset-2 hover:text-muted-foreground hover:underline"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
