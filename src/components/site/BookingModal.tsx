"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Calendar,
  Users,
  Ticket,
  Loader2,
  Check,
  PartyPopper,
  Sparkles,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formatPrice, applyCoupon, type CouponT } from "@/lib/types"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkg: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice?: number | null
    durationDays: number
    durationNights: number
    currency?: string
  }
}

export function BookingModal({ open, onOpenChange, pkg }: BookingModalProps) {
  const [step, setStep] = useState(0) // 0: details, 1: contact, 2: done
  const [submitting, setSubmitting] = useState(false)

  const [travelDate, setTravelDate] = useState("")
  const [groupSize, setGroupSize] = useState(2)
  const [couponCode, setCouponCode] = useState("")
  const [coupon, setCoupon] = useState<CouponT | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const basePrice = pkg.discountPrice ?? pkg.price
  const currency = pkg.currency || "INR"

  const pricing = useMemo(() => {
    const subtotal = basePrice * groupSize
    if (coupon) {
      const { finalPrice: perPerson, discount } = applyCoupon(basePrice, coupon)
      return {
        perPerson,
        subtotal: perPerson * groupSize,
        discount: discount * groupSize,
        savings: (basePrice - perPerson) * groupSize,
      }
    }
    return { perPerson: basePrice, subtotal, discount: 0, savings: 0 }
  }, [basePrice, groupSize, coupon])

  const applyCouponCode = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const res = await fetch("/api/public/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), orderValue: basePrice }),
      })
      const data = await res.json()
      if (data.success && data.data?.coupon) {
        setCoupon(data.data.coupon as CouponT)
        toast.success(`Coupon applied! You save ${formatPrice(data.data.discount, currency)}`)
      } else {
        toast.error(data.error || "Invalid coupon code")
        setCoupon(null)
      }
    } catch {
      toast.error("Failed to validate coupon")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          packageId: pkg.id,
          travelDate,
          groupSize,
          budget: `${formatPrice(pricing.subtotal, currency)} total (${formatPrice(pricing.perPerson, currency)}/person)${coupon ? ` [coupon: ${coupon.code}]` : ""}`,
          message: message || `Booking request: ${pkg.title} — ${pkg.durationNights}N/${pkg.durationDays}D, ${groupSize} travellers, depart ${travelDate || "flexible"}`,
          source: "booking-modal",
          destination: pkg.title,
        }),
      })
      if (res.ok) {
        setStep(2)
        toast.success("Booking request submitted!")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep(0)
    setTravelDate("")
    setGroupSize(2)
    setCouponCode("")
    setCoupon(null)
    setName("")
    setEmail("")
    setPhone("")
    setMessage("")
  }

  const close = () => {
    onOpenChange(false)
    setTimeout(reset, 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-strong shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-start justify-between border-b border-border/40 p-5">
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-wider text-primary">
                  Book Now
                </span>
                <h3 className="font-display text-lg font-bold leading-tight">
                  {pkg.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {pkg.durationNights}N / {pkg.durationDays}D · {formatPrice(basePrice, currency)}/person
                </p>
              </div>
              <button
                onClick={close}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-background/60 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Stepper */}
            {step < 2 && (
              <div className="flex items-center gap-1 border-b border-border/40 px-5 py-3">
                {["Trip Details", "Contact"].map((label, i) => (
                  <div key={label} className="flex flex-1 items-center">
                    <div className={`grid size-7 place-items-center rounded-full text-[11px] font-bold transition-all ${
                      i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i < step ? <Check className="size-3.5" /> : i + 1}
                    </div>
                    <span className={`ml-2 text-xs font-medium ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                    {i === 0 && <div className={`mx-3 h-0.5 flex-1 rounded ${i < step ? "bg-primary" : "bg-border"}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Travel date */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Calendar className="size-4 text-primary" /> Preferred start date
                    </label>
                    <Input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="glass"
                    />
                  </div>

                  {/* Group size */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-sm font-medium">
                        <Users className="size-4 text-primary" /> Travellers
                      </label>
                      <span className="font-display font-bold text-primary">{groupSize}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      value={groupSize}
                      onChange={(e) => setGroupSize(+e.target.value)}
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Coupon */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                      <Ticket className="size-4 text-primary" /> Coupon code (optional)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="EARLYBIRD10"
                        className="glass flex-1 uppercase"
                      />
                      <Button
                        onClick={applyCouponCode}
                        disabled={couponLoading || !couponCode.trim()}
                        variant="outline"
                        size="sm"
                      >
                        {couponLoading ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                    {coupon && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <Check className="size-3" /> {coupon.code} applied — save {formatPrice(pricing.savings, currency)}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Try: EARLYBIRD10, HONEYMOON15, LADAKH2024, GROUP5000
                    </p>
                  </div>

                  {/* Price summary */}
                  <div className="rounded-xl border border-border/40 bg-background/40 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{formatPrice(pricing.perPerson, currency)} × {groupSize}</span>
                      <span className="font-medium">{formatPrice(pricing.subtotal, currency)}</span>
                    </div>
                    {pricing.discount > 0 && (
                      <div className="mt-1 flex items-center justify-between text-sm text-accent">
                        <span>Coupon discount</span>
                        <span>-{formatPrice(pricing.discount, currency)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-display text-xl font-bold gradient-text-saffron">
                        {formatPrice(pricing.subtotal, currency)}
                      </span>
                    </div>
                    {pricing.savings > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-accent">
                        <Sparkles className="size-3" /> You save {formatPrice(pricing.savings, currency)}!
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Full name *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="glass"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="glass"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Phone (WhatsApp) *</label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9XXXX XXXXX"
                        className="glass"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Special requests (optional)</label>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Honeymoon, dietary needs, extra nights..."
                      className="glass"
                    />
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                    <Wallet className="inline size-3.5 mr-1 text-primary" />
                    No upfront payment. Our team confirms availability & final pricing within 24 hours.
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent"
                  >
                    <PartyPopper className="size-8" />
                  </motion.div>
                  <h3 className="mt-4 font-display text-xl font-bold gradient-text-saffron">
                    Booking request sent!
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Thank you{name ? `, ${name.split(" ")[0]}` : ""}! We&apos;ll confirm availability for{" "}
                    <span className="font-semibold text-foreground">{pkg.title}</span> and reach out
                    within 24 hours.
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Total estimate: <span className="font-semibold text-primary">{formatPrice(pricing.subtotal, currency)}</span> for {groupSize} {groupSize === 1 ? "person" : "people"}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step < 2 && (
              <div className="flex items-center justify-between border-t border-border/40 p-4">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Step {step + 1} of 2</span>
                )}
                {step === 0 ? (
                  <Button onClick={() => setStep(1)} className="btn-glow">
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !phone.trim() || submitting}
                    className="btn-glow"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>Confirm booking request</>
                    )}
                  </Button>
                )}
              </div>
            )}
            {step === 2 && (
              <div className="flex justify-center border-t border-border/40 p-4">
                <Button onClick={close} className="btn-glow">
                  Done
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
