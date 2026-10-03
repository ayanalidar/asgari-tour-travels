"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  Loader2,
  PartyPopper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface TripWizardProps {
  destinations: { slug: string; name: string; region: string }[]
}

const STEPS = ["Destination", "Dates", "Group", "Details", "Done"] as const

export function TripWizard({ destinations }: TripWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const [selectedDest, setSelectedDest] = useState<string[]>([])
  const [travelDate, setTravelDate] = useState("")
  const [flexible, setFlexible] = useState(false)
  const [nights, setNights] = useState(5)
  const [groupSize, setGroupSize] = useState(2)
  const [budget, setBudget] = useState("₹25,000 - ₹50,000/person")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const toggleDest = (slug: string) => {
    setSelectedDest((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const canProceed = () => {
    if (step === 0) return selectedDest.length > 0
    if (step === 1) return travelDate || flexible
    if (step === 2) return groupSize > 0 && nights > 0
    if (step === 3) return name.trim() && (email.trim() || phone.trim())
    return true
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
          destination: selectedDest
            .map((slug) => destinations.find((d) => d.slug === slug)?.name)
            .filter(Boolean)
            .join(", "),
          travelDate: flexible ? `Flexible, ~${nights} nights` : travelDate,
          groupSize,
          budget,
          message: message || `Custom trip: ${nights} nights, ${groupSize} pax, budget ${budget}`,
          source: "trip-wizard",
        }),
      })
      if (res.ok) {
        setDone(true)
        setStep(4)
        toast.success("Trip request submitted! Our team will reach out within 24 hours.")
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
    setDone(false)
    setStep(0)
    setSelectedDest([])
    setTravelDate("")
    setName("")
    setEmail("")
    setPhone("")
    setMessage("")
  }

  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-6 sm:p-10">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative z-10">
        {/* Progress steps */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`grid size-9 place-items-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    i < step
                      ? "border-primary bg-primary text-primary-foreground"
                      : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="size-4" /> : i + 1}
                </div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    i === step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-all duration-500 ${
                    i < step ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!done && step === 0 && (
            <Step key="dest">
              <StepHeader
                icon={<MapPin className="size-5" />}
                title="Where do you want to go?"
                subtitle="Pick one or more destinations — we'll craft a seamless journey."
              />
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destinations.slice(0, 12).map((d) => {
                  const sel = selectedDest.includes(d.slug)
                  return (
                    <button
                      key={d.slug}
                      onClick={() => toggleDest(d.slug)}
                      className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 ${
                        sel
                          ? "border-primary bg-primary/10"
                          : "border-border/60 bg-background/40 hover:border-primary/40"
                      }`}
                    >
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                        {d.region}
                      </span>
                      <span className={`block text-sm font-bold ${sel ? "text-primary" : ""}`}>
                        {d.name}
                      </span>
                      {sel && (
                        <Check className="absolute right-2 top-2 size-4 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </Step>
          )}

          {!done && step === 1 && (
            <Step key="dates">
              <StepHeader
                icon={<Calendar className="size-5" />}
                title="When are you travelling?"
                subtitle="Choose a date or tell us you're flexible."
              />
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Preferred start date</label>
                  <Input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="glass"
                  />
                </div>
                <button
                  onClick={() => setFlexible(!flexible)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                    flexible
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-background/40"
                  }`}
                >
                  <div
                    className={`grid size-6 place-items-center rounded-full border-2 ${
                      flexible ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {flexible && <Check className="size-4 text-primary-foreground" />}
                  </div>
                  <div>
                    <span className="block text-sm font-semibold">I'm flexible with dates</span>
                    <span className="block text-xs text-muted-foreground">
                      Recommend the best time based on destinations
                    </span>
                  </div>
                </button>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Duration (nights)</label>
                    <span className="font-display font-bold text-primary">{nights}N</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={14}
                    value={nights}
                    onChange={(e) => setNights(+e.target.value)}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </Step>
          )}

          {!done && step === 2 && (
            <Step key="group">
              <StepHeader
                icon={<Users className="size-5" />}
                title="Who's travelling?"
                subtitle="Group size & budget help us tailor your experience."
              />
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Number of travellers</label>
                    <span className="font-display text-lg font-bold text-primary">
                      {groupSize}
                    </span>
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
                <div>
                  <label className="mb-2 block text-sm font-medium">Budget per person</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      "Under ₹25,000",
                      "₹25,000 - ₹50,000",
                      "₹50,000 - ₹1,00,000",
                      "₹1,00,000+",
                    ].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudget(b + "/person")}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                          budget === b + "/person"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Step>
          )}

          {!done && step === 3 && (
            <Step key="details">
              <StepHeader
                icon={<Sparkles className="size-5" />}
                title="Almost there!"
                subtitle="Share your contact details — we'll craft your custom itinerary in 24 hours."
              />
              <div className="mt-6 space-y-4">
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
                    <label className="mb-1.5 block text-sm font-medium">Phone (WhatsApp)</label>
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
                  <label className="mb-1.5 block text-sm font-medium">
                    Anything special? (optional)
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Honeymoon, anniversary, dietary needs, mobility, adventure level..."
                    className="glass min-h-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Provide either email or phone. We never share your data.
                </p>
              </div>
            </Step>
          )}

          {done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="grid size-20 place-items-center rounded-full bg-accent/15 text-accent"
              >
                <PartyPopper className="size-10" />
              </motion.div>
              <h3 className="mt-6 font-display text-2xl font-bold gradient-text-saffron">
                Trip request received!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Thank you, {name.split(" ")[0]}! Our Himalayan travel concierge will craft a custom
                itinerary for{" "}
                <span className="font-semibold text-foreground">
                  {selectedDest
                    .map((s) => destinations.find((d) => d.slug === s)?.name)
                    .filter(Boolean)
                    .join(", ")}
                </span>{" "}
                and reach out within 24 hours.
              </p>
              <div className="mt-6 flex gap-3">
                <Button onClick={reset} variant="outline">
                  Plan another trip
                </Button>
                <Button onClick={() => router.push("/packages")} className="btn-glow">
                  Browse packages
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!done && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="size-4" /> Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="btn-glow"
              >
                Continue <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || submitting}
                className="btn-glow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit request <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function StepHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-xl font-bold sm:text-2xl">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
