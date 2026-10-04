"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Mail, Gift, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const STORAGE_KEY = "asgari_newsletter_dismissed"
const SESSION_KEY = "asgari_newsletter_shown"

export function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const shouldShow = useCallback(() => {
    if (typeof window === "undefined") return false
    // Don't show if already dismissed (permanent) or shown this session
    if (localStorage.getItem(STORAGE_KEY)) return false
    if (sessionStorage.getItem(SESSION_KEY)) return false
    return true
  }, [])

  const trigger = useCallback(() => {
    if (!shouldShow()) return
    sessionStorage.setItem(SESSION_KEY, "1")
    setOpen(true)
  }, [shouldShow])

  useEffect(() => {
    if (!shouldShow()) return

    let shown = false

    // Exit-intent: mouse leaves through the top of the viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (shown) return
      if (e.clientY <= 0) {
        shown = true
        trigger()
      }
    }

    // Time-based fallback: show after 25 seconds if exit-intent hasn't fired
    const timer = setTimeout(() => {
      if (!shown) {
        shown = true
        trigger()
      }
    }, 25000)

    document.addEventListener("mouseleave", handleMouseLeave)
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      clearTimeout(timer)
    }
  }, [shouldShow, trigger])

  const close = useCallback(() => {
    setOpen(false)
    localStorage.setItem(STORAGE_KEY, "1")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setDone(true)
        localStorage.setItem(STORAGE_KEY, "1")
        toast.success("Welcome aboard! Check your inbox for exclusive deals.")
        setTimeout(() => setOpen(false), 3000)
      } else {
        toast.error("Something went wrong. Please try again later.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl glass-strong shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-black/30 text-white/80 backdrop-blur-md transition-colors hover:bg-black/50 hover:text-white"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            {/* Decorative header */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-rose-500/20">
              <div className="absolute inset-0 aurora-animated opacity-50" />
              <div className="absolute inset-0 grid-overlay opacity-30" />
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
            </div>

            {/* Body */}
            <div className="p-6 text-center">
              {!done ? (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="size-3" /> Exclusive Offer
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold leading-tight">
                    Get <span className="gradient-text-saffron">₹3,000 OFF</span>
                    <br />
                    your first trip
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Join 5,000+ travellers receiving exclusive deals, seasonal guides & early-bird
                    discounts. No spam - unsubscribe anytime.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="glass pl-10"
                        required
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting || !email.trim()}
                      className="btn-glow w-full"
                    >
                      {submitting ? "Subscribing..." : "Claim my ₹3,000 coupon"}
                    </Button>
                  </form>
                  <button
                    onClick={close}
                    className="mt-3 text-xs text-muted-foreground/70 underline-offset-2 hover:text-muted-foreground hover:underline"
                  >
                    No thanks, I'll pay full price
                  </button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent"
                  >
                    <Check className="size-8" />
                  </motion.div>
                  <h3 className="mt-4 font-display text-xl font-bold gradient-text-saffron">
                    You're in! 🎉
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your <span className="font-semibold text-foreground">₹3,000 coupon</span> is on
                    its way. Check your inbox for the code &amp; exclusive deals.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
