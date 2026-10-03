"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Users, CalendarDays, Mountain, Wallet, Sparkles, ArrowRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Region = "kashmir" | "ladakh" | "both"
type Tier = "standard" | "premium" | "luxury"

const TIERS: { id: Tier; label: string; multiplier: number; desc: string }[] = [
  { id: "standard", label: "Standard", multiplier: 1, desc: "3★ hotels, shared transfers, group tours" },
  { id: "premium", label: "Premium", multiplier: 1.5, desc: "4★ + houseboat, private vehicle, guided" },
  { id: "luxury", label: "Luxury", multiplier: 2.2, desc: "5★ resorts, luxury SUV, private guide" },
]

const REGIONS: { id: Region; label: string; basePrice: number }[] = [
  { id: "kashmir", label: "Kashmir", basePrice: 4999 },
  { id: "ladakh", label: "Ladakh", basePrice: 6499 },
  { id: "both", label: "Kashmir + Ladakh", basePrice: 7999 },
]

export function BudgetCalculator() {
  const [groupSize, setGroupSize] = useState([2])
  const [nights, setNights] = useState([5])
  const [region, setRegion] = useState<Region>("kashmir")
  const [tier, setTier] = useState<Tier>("premium")

  const { perPerson, total, savings } = useMemo(() => {
    const r = REGIONS.find((x) => x.id === region)!
    const t = TIERS.find((x) => x.id === tier)!
    const people = groupSize[0]
    const n = nights[0]
    // base per-person per-night, with group discount for larger parties
    const groupDiscount = people >= 6 ? 0.15 : people >= 4 ? 0.08 : 0
    const perNight = r.basePrice * t.multiplier * (1 - groupDiscount)
    const perPerson = Math.round((perNight * n) / 100) * 100
    const total = perPerson * people
    const savings = Math.round(perPerson * 0.12 * people / 100) * 100
    return { perPerson, total, savings }
  }, [groupSize, nights, region, tier])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Controls */}
      <div className="flex flex-col gap-6">
        {/* Group size */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Users className="size-4 text-primary" /> Travellers
            </label>
            <span className="font-display text-lg font-bold text-primary">
              {groupSize[0]}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {groupSize[0] === 1 ? "person" : "people"}
              </span>
            </span>
          </div>
          <Slider
            value={groupSize}
            onValueChange={setGroupSize}
            min={1}
            max={12}
            step={1}
            className="[&_[role=slider]]:bg-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Solo</span>
            <span>2-3</span>
            <span>4-5</span>
            <span>6+</span>
            <span>12</span>
          </div>
        </div>

        {/* Nights */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="size-4 text-primary" /> Duration
            </label>
            <span className="font-display text-lg font-bold text-primary">
              {nights[0]}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {nights[0] === 1 ? "night" : "nights"}
              </span>
            </span>
          </div>
          <Slider
            value={nights}
            onValueChange={setNights}
            min={2}
            max={14}
            step={1}
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>2N</span><span>5N</span><span>8N</span><span>11N</span><span>14N</span>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Mountain className="size-4 text-primary" /> Region
          </label>
          <div className="grid grid-cols-3 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setRegion(r.id)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                  region === r.id
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tier */}
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-primary" /> Package Tier
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  tier === t.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-border/60 bg-background/40 hover:border-primary/30"
                }`}
              >
                <span className={`block text-sm font-bold ${tier === t.id ? "text-primary" : ""}`}>
                  {t.label}
                </span>
                <span className="mt-1 block text-[10px] leading-tight text-muted-foreground">
                  {t.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price summary */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl glass-strong p-6 sm:p-8"
      >
        <div className="absolute -right-12 -top-12 size-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Estimated Price
          </span>

          <div className="mt-2 flex items-end gap-2">
            <motion.span
              key={perPerson}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-extrabold gradient-text-saffron sm:text-5xl"
            >
              ₹{perPerson.toLocaleString("en-IN")}
            </motion.span>
            <span className="pb-1 text-sm text-muted-foreground">/ person</span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-4 py-3">
            <Wallet className="size-4 text-accent" />
            <span className="text-sm text-muted-foreground">Total for {groupSize[0]}:</span>
            <motion.span
              key={total}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto font-display text-lg font-bold text-foreground"
            >
              ₹{total.toLocaleString("en-IN")}
            </motion.span>
          </div>

          {savings > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
              <Sparkles className="size-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                You save approx{" "}
                <span className="font-bold text-accent">₹{savings.toLocaleString("en-IN")}</span>{" "}
                with group discounts
              </span>
            </div>
          )}

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> All stays, transfers & permits
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Daily breakfast & dinner
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Local guide & 24/7 support
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Customisable itinerary
            </li>
          </ul>

          <div className="mt-auto pt-6">
            <Button asChild size="lg" className="btn-glow w-full">
              <Link href="/plan-your-trip">
                Plan my trip <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Estimate only — final quote crafted after consultation. No upfront payment.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
