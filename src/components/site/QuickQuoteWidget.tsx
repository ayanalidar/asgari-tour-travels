"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, Send, Loader2, Check, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface QuickQuoteWidgetProps {
  context?: string // e.g. "Kashmir Paradise 5N/6D" or "Srinagar"
  phone?: string
  whatsapp?: string
}

/**
 * Floating quick-quote widget - appears on package & destination pages.
 * Collapsed state: a floating pill button. Expanded: a mini form.
 * Auto-collapses after scroll past 40% of page.
 */
export function QuickQuoteWidget({ context, phone, whatsapp }: QuickQuoteWidgetProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState("")
  const [phoneInput, setPhoneInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(false)

  // Show after scrolling 40% of viewport
  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY
      const threshold = window.innerHeight * 0.4
      setVisible(scrolled > threshold)
    }
    handler()
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phoneInput.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneInput.trim(),
          destination: context || "Quick quote request",
          message: `Quick quote request for ${context || "a trip"}`,
          source: "quick-quote-widget",
        }),
      })
      if (res.ok) {
        setDone(true)
        toast.success("Request sent! We'll call you within 24 hours.")
        setTimeout(() => {
          setOpen(false)
          setDone(false)
          setName("")
          setPhoneInput("")
        }, 3000)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (dismissed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 w-72"
        >
          <AnimatePresence mode="wait">
            {!open ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col gap-2"
              >
                <button
                  onClick={() => setOpen(true)}
                  className="group flex items-center gap-2 rounded-full glass-strong px-4 py-3 shadow-lg transition-all hover:scale-105"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-primary/20 text-primary">
                    <MessageCircle className="size-4" />
                  </span>
                  <span className="text-sm font-semibold">Quick Quote</span>
                  <span className="ml-1 rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                    FREE
                  </span>
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="self-end text-[10px] text-muted-foreground/60 hover:text-muted-foreground"
                >
                  Dismiss
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="overflow-hidden rounded-2xl glass-strong shadow-2xl"
              >
                {/* Header */}
                <div className="relative flex items-center justify-between border-b border-border/40 bg-gradient-to-r from-primary/15 to-accent/10 p-3">
                  <div>
                    <h4 className="text-sm font-bold">Get a free quote</h4>
                    {context && (
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        {context}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="grid size-7 place-items-center rounded-full hover:bg-background/60"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4">
                  {!done ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="glass h-9 text-sm"
                        required
                      />
                      <Input
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        type="tel"
                        placeholder="Phone (WhatsApp)"
                        className="glass h-9 text-sm"
                        required
                      />
                      <Button
                        type="submit"
                        disabled={submitting || !name.trim() || !phoneInput.trim()}
                        size="sm"
                        className="btn-glow w-full"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="size-3.5" /> Get callback in 24h
                          </>
                        )}
                      </Button>
                      <p className="text-center text-[10px] text-muted-foreground">
                        No spam. No upfront payment. Just a friendly call.
                      </p>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="grid size-12 place-items-center rounded-full bg-accent/15 text-accent"
                      >
                        <Check className="size-6" />
                      </motion.div>
                      <p className="mt-3 text-sm font-semibold">Request sent!</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        We&apos;ll call you within 24 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer with direct contact */}
                {(phone || whatsapp) && (
                  <div className="flex items-center justify-center gap-2 border-t border-border/40 p-2">
                    {phone && (
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                      >
                        <Phone className="size-3" /> Call
                      </a>
                    )}
                    {whatsapp && (
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-accent"
                      >
                        <MessageCircle className="size-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
