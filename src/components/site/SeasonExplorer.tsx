"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Snowflake, Sun, Leaf, Trees, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { DestinationT } from "@/lib/types"
import { destinationImage } from "@/lib/image-map"
import { ImageWithFallback } from "./ImageWithFallback"

type Season = "spring" | "summer" | "autumn" | "winter"

interface SeasonExplorerProps {
  destinations: DestinationT[]
}

const SEASONS: {
  id: Season
  label: string
  months: string
  icon: React.ReactNode
  accent: string
  glow: string
  description: string
}[] = [
  {
    id: "spring",
    label: "Spring",
    months: "Mar – May",
    icon: <Leaf className="size-4" />,
    accent: "text-emerald-400",
    glow: "from-emerald-500/30",
    description: "Tulip blooms, green meadows & pleasant 20-25°C days. Perfect for gardens & houseboats.",
  },
  {
    id: "summer",
    label: "Summer",
    months: "Jun – Aug",
    icon: <Sun className="size-4" />,
    accent: "text-amber-400",
    glow: "from-amber-500/30",
    description: "Peak season — meadows in full bloom, snow-fed rivers, ideal for high-altitude Ladakh trips.",
  },
  {
    id: "autumn",
    label: "Autumn",
    months: "Sep – Nov",
    icon: <Trees className="size-4" />,
    accent: "text-orange-400",
    glow: "from-orange-500/30",
    description: "Chinar trees turn crimson & gold. Romantic, crowd-free, and the saffron harvest in Pampore.",
  },
  {
    id: "winter",
    label: "Winter",
    months: "Dec – Feb",
    icon: <Snowflake className="size-4" />,
    accent: "text-sky-300",
    glow: "from-sky-400/30",
    description: "Snow-globe Kashmir. Gulmarg powder skiing, frozen Dal Lake, houseboat kangri warmth.",
  },
]

// Map destinations to seasons based on their bestTimeToVisit text
function destSeasons(d: DestinationT): Season[] {
  const t = (d.bestTimeToVisit || "").toLowerCase()
  const seasons: Season[] = []
  if (/(march|apr|may|spring)/.test(t)) seasons.push("spring")
  if (/(june|jul|aug|summer)/.test(t)) seasons.push("summer")
  if (/(sept|sep|oct|nov|autumn)/.test(t)) seasons.push("autumn")
  if (/(dec|jan|feb|winter)/.test(t)) seasons.push("winter")
  // Default: if region is ladakh, summer; if kashmir, spring+summer+autumn
  if (seasons.length === 0) {
    if (d.region === "ladakh") seasons.push("summer")
    else seasons.push("spring", "summer", "autumn")
  }
  return seasons
}

export function SeasonExplorer({ destinations }: SeasonExplorerProps) {
  const [active, setActive] = useState<Season>("spring")
  const activeSeason = SEASONS.find((s) => s.id === active)!

  const filtered = destinations.filter((d) => destSeasons(d).includes(active)).slice(0, 6)

  return (
    <div className="mt-10">
      {/* Season tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {SEASONS.map((s) => {
          const isActive = s.id === active
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`group relative flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-5 ${
                isActive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <span className={isActive ? s.accent : ""}>{s.icon}</span>
              <span>{s.label}</span>
              <span className="hidden text-[10px] font-normal opacity-60 sm:inline">
                {s.months}
              </span>
              {isActive && (
                <motion.span
                  layoutId="season-active"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/5"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Active season description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-center"
        >
          <p className={`text-sm leading-relaxed text-muted-foreground`}>
            <span className={`mr-1 font-semibold ${activeSeason.accent}`}>
              {activeSeason.label}:
            </span>
            {activeSeason.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Destination cards grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {filtered.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/destinations/${d.slug}`}
                className="group block relative overflow-hidden rounded-2xl glass lift"
              >
                <div className={`absolute -right-6 -top-6 size-20 rounded-full bg-gradient-to-br ${activeSeason.glow} to-transparent blur-xl opacity-70`} />
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                  <ImageWithFallback
                    src={destinationImage(d.slug) || d.heroImage}
                    alt={d.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className={`text-[10px] uppercase tracking-wider ${activeSeason.accent}`}>
                      {d.region}
                    </span>
                    <h4 className="font-display text-sm font-bold text-white leading-tight">
                      {d.name}
                    </h4>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[10px] text-muted-foreground">
                    {d.duration || "2-3 days"}
                  </span>
                  <ArrowRight className="size-3 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
