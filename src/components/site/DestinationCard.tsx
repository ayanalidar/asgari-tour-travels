"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  MapPin,
  Clock,
  Mountain,
  Calendar,
  Sparkles,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DestinationImage } from "./DestinationImage"
import { BestForTags } from "./BestForTags"
import type { DestinationT } from "@/lib/types"

interface DestinationCardProps {
  destination: DestinationT
  index?: number
  compact?: boolean
}

// Derive a short season label from bestTimeToVisit text
function seasonLabel(text: string | null): { label: string; emoji: string } | null {
  if (!text) return null
  const t = text.toLowerCase()
  if (/(dec|jan|feb)/.test(t)) return { label: "Winter", emoji: "❄️" }
  if (/(mar|apr|may)/.test(t)) return { label: "Spring", emoji: "🌷" }
  if (/(jun|jul|aug)/.test(t)) return { label: "Summer", emoji: "☀️" }
  if (/(sep|oct|nov)/.test(t)) return { label: "Autumn", emoji: "🍂" }
  return { label: "Year-round", emoji: "🌟" }
}

export function DestinationCard({
  destination,
  index = 0,
  compact = false,
}: DestinationCardProps) {
  const regionLabel =
    destination.region === "ladakh"
      ? "Ladakh"
      : destination.region === "jammu"
        ? "Jammu"
        : "Kashmir"

  const regionColor =
    destination.region === "ladakh"
      ? "border-accent/40 bg-accent/10 text-accent"
      : destination.region === "jammu"
        ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
        : "border-primary/40 bg-primary/10 text-primary"

  const season = seasonLabel(destination.bestTimeToVisit)
  const isFeatured = destination.featured
  const isPopular = destination.popular

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="lift group relative"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 opacity-0 blur-sm transition-all duration-500 group-hover:from-primary/40 group-hover:via-primary/20 group-hover:to-accent/40 group-hover:opacity-100" />

      <Link
        href={`/destinations/${destination.slug}`}
        className="relative flex flex-col overflow-hidden rounded-2xl glass"
        aria-label={`Explore ${destination.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <DestinationImage
            slug={destination.slug}
            name={destination.name}
            alt={`${destination.name} - ${destination.tagline ?? "Kashmir/Ladakh destination"}`}
            className="transition-transform duration-700 group-hover:scale-110"
            eager={index < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

          {/* Top row: region + featured */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <Badge className={`${regionColor} border backdrop-blur-md`}>
              <MapPin className="size-3" /> {regionLabel}
            </Badge>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                <Sparkles className="size-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Category chip */}
          <div className="absolute right-3 top-3">
            <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
              {destination.category}
            </span>
          </div>

          {/* Hover overlay quick facts - appears at top, doesn't overlap title */}
          <div className="absolute inset-x-3 top-12 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex flex-wrap gap-1.5">
              {season && (
                <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
                  <Calendar className="size-2.5 text-primary" /> {season.emoji} {season.label}
                </span>
              )}
              {destination.altitude && (
                <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
                  <Mountain className="size-2.5 text-accent" /> {destination.altitude}
                </span>
              )}
              {destination.distance && (
                <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
                  <MapPin className="size-2.5 text-rose-300" />
                  {destination.distance.replace(/^From\s.*/, "").trim() || destination.distance}
                </span>
              )}
            </div>
          </div>

          {/* Title overlay (always visible at bottom) */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="font-display text-xl font-bold leading-tight text-white drop-shadow-lg">
              {destination.name}
            </h3>
            {!compact && destination.tagline && (
              <p className="mt-1 line-clamp-1 text-xs text-white/75">
                {destination.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {!compact && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {destination.shortDescription}
            </p>
          )}
          {/* Best-for tags */}
          {!compact && (
            <BestForTags
              slug={destination.slug}
              name={destination.name}
              category={destination.category}
              region={destination.region}
              altitude={destination.altitude}
              bestTimeToVisit={destination.bestTimeToVisit}
              thingsToDoCount={destination.thingsToDo?.length}
            />
          )}
          {/* Quick stats row */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {destination.duration && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" /> {destination.duration}
              </span>
            )}
            {season && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" /> {season.label}
              </span>
            )}
            {isPopular && (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="size-3 fill-current" /> Popular
              </span>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              {destination.thingsToDo?.length ?? 0} things to do
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
              Explore <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
