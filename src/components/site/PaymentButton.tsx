"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, X, ShieldCheck, Loader2, Check, Smartphone, Wallet, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formatPrice } from "@/lib/types"

interface PaymentButtonProps {
  pkg: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice?: number | null
    currency?: string
  }
  amount: number
  label?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  fullWidth?: boolean
}

export function PaymentButton({
  pkg,
  amount,
  label = "Pay Advance & Book",
  variant = "default",
  size = "default",
  fullWidth = false,
}: PaymentButtonProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"form" | "methods" | "processing" | "success">("form")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [method, setMethod] = useState<"upi" | "card" | "netbanking" | null>(null)
  const [session, setSession] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [copied, setCopied] = useState(false)

  const advanceAmount = Math.round(amount * 0.25) // 25% advance

  const initPayment = async () => {
    setProcessing(true)
    try {
      const res = await fetch("/api/public/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          packageName: pkg.title,
          amount: advanceAmount,
          name, email, phone,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSession(data.data)
        setStep("methods")
      } else {
        toast.error(data.error || "Payment init failed")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setProcessing(false)
    }
  }

  const confirmPayment = async () => {
    setStep("processing")
    // Simulate payment processing
    setTimeout(() => {
      setStep("success")
      toast.success("Payment successful! Booking confirmed.")
    }, 2500)
  }

  const close = () => {
    setOpen(false)
    setTimeout(() => {
      setStep("form")
      setName("")
      setEmail("")
      setPhone("")
      setMethod(null)
      setSession(null)
    }, 300)
  }

  const copyUpi = () => {
    navigator.clipboard.writeText("asgaritourandtravel@okhdfcbank")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant}
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${variant === "default" ? "btn-glow" : ""}`}
      >
        <CreditCard className="size-4" /> {label}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-md"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl glass-strong shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative border-b border-border/40 p-5">
                <div className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/15 blur-3xl" />
                <button
                  onClick={close}
                  className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-background/60 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-wider text-primary">Secure Payment</span>
                  <h3 className="font-display text-lg font-bold leading-tight">{pkg.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold gradient-text-saffron">
                      {formatPrice(advanceAmount, pkg.currency || "INR")}
                    </span>
                    <span className="text-xs text-muted-foreground">25% advance of {formatPrice(amount, pkg.currency || "INR")}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-[60vh] overflow-y-auto p-5">
                {step === "form" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium">Full name *</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="glass" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium">Email</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="glass" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium">Phone *</label>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." className="glass" />
                      </div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                      <ShieldCheck className="inline size-3.5 mr-1 text-primary" />
                      Pay 25% now to confirm. Balance due 7 days before departure. Free cancellation up to 15 days.
                    </div>
                    <Button
                      onClick={initPayment}
                      disabled={!name.trim() || !phone.trim() || processing}
                      className="btn-glow w-full"
                    >
                      {processing ? (
                        <><Loader2 className="size-4 animate-spin" /> Initializing...</>
                      ) : (
                        <>Continue to payment</>
                      )}
                    </Button>
                  </motion.div>
                )}

                {step === "methods" && session && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                    <h4 className="text-sm font-bold">Choose payment method</h4>
                    {/* UPI */}
                    <button
                      onClick={() => setMethod("upi")}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${method === "upi" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"}`}
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-accent/15 text-accent">
                        <Smartphone className="size-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">UPI / QR Code</p>
                        <p className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</p>
                      </div>
                      {method === "upi" && <Check className="size-4 text-primary" />}
                    </button>

                    {method === "upi" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border/40 bg-background/30 p-3">
                        <p className="text-xs text-muted-foreground">Pay to UPI ID:</p>
                        <div className="mt-1 flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
                          <code className="text-sm font-mono font-bold text-primary">{session.upiId}</code>
                          <button onClick={copyUpi} className="text-xs text-muted-foreground hover:text-primary">
                            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>
                        <p className="mt-2 text-[10px] text-muted-foreground">Or scan the QR code at checkout. Amount: {formatPrice(advanceAmount, session.currency)}</p>
                      </motion.div>
                    )}

                    {/* Card */}
                    <button
                      onClick={() => setMethod("card")}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${method === "card" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"}`}
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                        <CreditCard className="size-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Credit / Debit Card</p>
                        <p className="text-[10px] text-muted-foreground">Visa, Mastercard, RuPay</p>
                      </div>
                      {method === "card" && <Check className="size-4 text-primary" />}
                    </button>

                    {/* Net Banking */}
                    <button
                      onClick={() => setMethod("netbanking")}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${method === "netbanking" ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"}`}
                    >
                      <span className="grid size-9 place-items-center rounded-lg bg-amber-400/15 text-amber-300">
                        <Wallet className="size-4" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Net Banking</p>
                        <p className="text-[10px] text-muted-foreground">All major banks</p>
                      </div>
                      {method === "netbanking" && <Check className="size-4 text-primary" />}
                    </button>

                    {method && (
                      <Button onClick={confirmPayment} className="btn-glow w-full">
                        Pay {formatPrice(advanceAmount, session.currency)}
                      </Button>
                    )}
                  </motion.div>
                )}

                {step === "processing" && (
                  <div className="flex flex-col items-center py-10">
                    <Loader2 className="size-10 animate-spin text-primary" />
                    <p className="mt-4 text-sm font-medium">Processing payment...</p>
                    <p className="mt-1 text-xs text-muted-foreground">Please do not close this window</p>
                  </div>
                )}

                {step === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="grid size-16 place-items-center rounded-full bg-emerald-400/15 text-emerald-400"
                    >
                      <Check className="size-8" />
                    </motion.div>
                    <h3 className="mt-4 font-display text-xl font-bold gradient-text-saffron">Payment Successful!</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      Your booking for <span className="font-semibold text-foreground">{pkg.title}</span> is confirmed.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Advance paid: {formatPrice(advanceAmount, pkg.currency || "INR")}
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground/70">
                      We'll send confirmation details to {phone}
                    </p>
                    <Button onClick={close} className="btn-glow mt-4 w-full">Done</Button>
                  </motion.div>
                )}
              </div>

              {/* Footer trust */}
              {step !== "success" && (
                <div className="border-t border-border/40 px-5 py-3">
                  <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                    <ShieldCheck className="size-3 text-emerald-400" />
                    256-bit encrypted · PCI DSS compliant · Razorpay powered
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
