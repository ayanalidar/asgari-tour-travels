"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Mountain, Navigation } from "lucide-react"
import Link from "next/link"
import { ImageWithFallback } from "./ImageWithFallback"
import { destinationImage } from "@/lib/image-map"
import type { DestinationT } from "@/lib/types"

interface DestinationMapProps {
  destinations: DestinationT[]
}

// Approximate lat/lng bounding box for Kashmir + Ladakh region
// Kashmir: ~33.5-34.6 N, 74.3-75.5 E
// Ladakh: ~32.8-35.5 N, 76.5-79.5 E
// Map to SVG viewBox 0-400 x 0-300

function project(lat: number, lng: number): { x: number; y: number } {
  // Region bounds
  const minLat = 32.5, maxLat = 35.8
  const minLng = 73.8, maxLng = 80.0
  const width = 400, height = 300
  const x = ((lng - minLng) / (maxLng - minLng)) * width
  // y is inverted (higher lat = lower y)
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height
  return { x: Math.max(10, Math.min(width - 10, x)), y: Math.max(10, Math.min(height - 10, y)) }
}

export function DestinationMap({ destinations }: DestinationMapProps) {
  const [selected, setSelected] = useState<DestinationT | null>(null)
  const [filter, setFilter] = useState<"all" | "kashmir" | "ladakh">("all")

  const filtered = destinations.filter(
    (d) => d.latitude && d.longitude && (filter === "all" || d.region === filter)
  )

  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-4 sm:p-6">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
              <Navigation className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold leading-tight">Interactive Map</h3>
              <p className="text-[10px] text-muted-foreground">
                {filtered.length} destinations across Kashmir & Ladakh
              </p>
            </div>
          </div>
          {/* Region filter */}
          <div className="flex gap-1 rounded-lg bg-background/40 p-1">
            {(["all", "kashmir", "ladakh"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Map SVG */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background/60 to-background/20">
          {/* Grid background */}
          <svg
            viewBox="0 0 400 300"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Topographic-style grid lines */}
            <defs>
              <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-border/40" />
              </pattern>
              <radialGradient id="terrain-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="300" fill="url(#map-grid)" />

            {/* Terrain glow zones */}
            <circle cx="120" cy="150" r="80" fill="url(#terrain-glow)" />
            <circle cx="280" cy="130" r="90" fill="url(#terrain-glow)" />

            {/* Region labels */}
            <text x="100" y="170" className="fill-muted-foreground/30 font-display" fontSize="14" fontWeight="bold" letterSpacing="2">
              KASHMIR
            </text>
            <text x="270" y="140" className="fill-muted-foreground/30 font-display" fontSize="14" fontWeight="bold" letterSpacing="2">
              LADAKH
            </text>

            {/* Connecting route lines between featured destinations */}
            {filtered.length > 1 && (
              <g className="stroke-primary/20" strokeWidth="1" fill="none" strokeDasharray="3,3">
                {filtered.slice(0, 8).map((d, i) => {
                  if (i === 0 || !d.latitude || !d.longitude) return null
                  const prev = filtered[i - 1]
                  if (!prev.latitude || !prev.longitude) return null
                  const p1 = project(prev.latitude, prev.longitude)
                  const p2 = project(d.latitude, d.longitude)
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
                })}
              </g>
            )}

            {/* Destination pins */}
            {filtered.map((d, i) => {
              if (!d.latitude || !d.longitude) return null
              const pos = project(d.latitude, d.longitude)
              const isKashmir = d.region === "kashmir"
              const isSelected = selected?.id === d.id
              return (
                <g key={d.id}>
                  {/* Pulse ring for featured */}
                  {d.featured && (
                    <circle cx={pos.x} cy={pos.y} r="8" fill="none" stroke={isKashmir ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.14 160)"} strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="6;12;6" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Pin */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 6 : 4}
                    fill={isKashmir ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.14 160)"}
                    stroke="white"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelected(d)}
                  />
                  {/* Label on hover/selected */}
                  {(isSelected || d.featured) && (
                    <text
                      x={pos.x}
                      y={pos.y - 8}
                      textAnchor="middle"
                      className="fill-foreground pointer-events-none font-medium"
                      fontSize="8"
                    >
                      {d.name.length > 12 ? d.name.slice(0, 11) + "..." : d.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Selected destination popup */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-64"
              >
                <div className="overflow-hidden rounded-2xl glass-strong shadow-2xl">
                  <div className="relative aspect-video">
                    <ImageWithFallback
                      src={destinationImage(selected.slug) || selected.heroImage}
                      alt={selected.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md"
                    >
                      <X className="size-3.5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <span className="text-[9px] uppercase tracking-wider text-primary">
                        {selected.region}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white">{selected.name}</h4>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-[11px] text-muted-foreground">
                      {selected.tagline || selected.shortDescription}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                      {selected.altitude && (
                        <span className="flex items-center gap-0.5">
                          <Mountain className="size-2.5 text-accent" /> {selected.altitude}
                        </span>
                      )}
                      {selected.duration && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-2.5 text-primary" /> {selected.duration}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/destinations/${selected.slug}`}
                      className="mt-2 block rounded-lg bg-primary/10 py-1.5 text-center text-[11px] font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Explore destination
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[oklch(0.78_0.16_75)]" />
            Kashmir
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[oklch(0.7_0.14_160)]" />
            Ladakh
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-primary animate-pulse" />
            Featured
          </span>
        </div>
      </div>
    </div>
  )
}
