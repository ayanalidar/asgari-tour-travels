"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DestinationCard } from "./DestinationCard"
import { deriveBestForTags, type TagType } from "./BestForTags"
import type { DestinationT } from "@/lib/types"

interface Props {
  destinations: DestinationT[]
  initialRegion?: string
  initialCategory?: string
  initialQuery?: string
}

const BEST_FOR_OPTIONS: { id: TagType; label: string; emoji: string }[] = [
  { id: "honeymoon", label: "Honeymoon", emoji: "❤️" },
  { id: "adventure", label: "Adventure", emoji: "🏔️" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "photography", label: "Photography", emoji: "📷" },
  { id: "skiing", label: "Skiing", emoji: "⛷️" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "spiritual", label: "Spiritual", emoji: "✨" },
  { id: "cultural", label: "Cultural", emoji: "🧭" },
]

export function DestinationsExplorer({
  destinations,
  initialRegion = "all",
  initialCategory = "all",
  initialQuery = "",
}: Props) {
  const [region, setRegion] = useState(initialRegion)
  const [category, setCategory] = useState(initialCategory)
  const [query, setQuery] = useState(initialQuery)
  const [bestFor, setBestFor] = useState<TagType | "all">("all")

  const categories = useMemo(() => {
    const set = new Set<string>()
    destinations.forEach((d) => set.add(d.category))
    return Array.from(set).sort()
  }, [destinations])

  // Pre-compute best-for tags for each destination
  const destTags = useMemo(() => {
    const map = new Map<string, TagType[]>()
    destinations.forEach((d) => {
      map.set(
        d.id,
        deriveBestForTags({
          slug: d.slug,
          name: d.name,
          category: d.category,
          region: d.region,
          altitude: d.altitude,
          bestTimeToVisit: d.bestTimeToVisit,
        })
      )
    })
    return map
  }, [destinations])

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      if (region !== "all" && d.region !== region) return false
      if (category !== "all" && d.category !== category) return false
      if (bestFor !== "all") {
        const tags = destTags.get(d.id) || []
        if (!tags.includes(bestFor)) return false
      }
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const hay = `${d.name} ${d.tagline ?? ""} ${d.shortDescription} ${d.category} ${d.region}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [destinations, region, category, query, bestFor, destTags])

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="rounded-2xl glass-strong p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, e.g. 'Dal Lake', 'monastery', 'Pangong'…"
              className="pl-10 bg-background/60"
              aria-label="Search destinations"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Region tabs */}
          <Tabs value={region} onValueChange={setRegion}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="kashmir">
                <MapPin className="size-3 mr-1 text-primary" /> Kashmir
              </TabsTrigger>
              <TabsTrigger value="ladakh">
                <MapPin className="size-3 mr-1 text-accent" /> Ladakh
              </TabsTrigger>
              <TabsTrigger value="jammu">
                <MapPin className="size-3 mr-1 text-rose-400" /> Jammu
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category dropdown */}
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="size-3.5" /> Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-56 bg-background/60">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Best-for filter chips */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Best For
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setBestFor("all")}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  bestFor === "all"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {BEST_FOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBestFor(opt.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    bestFor === opt.id
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-1">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          <span className="font-bold text-foreground">{filtered.length}</span>{" "}
          destination{filtered.length === 1 ? "" : "s"} found
        </p>
        {(region !== "all" || category !== "all" || query) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRegion("all")
              setCategory("all")
              setQuery("")
            }}
          >
            <X className="size-3.5" /> Clear filters
          </Button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <p className="text-muted-foreground">
            No destinations match your filters. Try clearing them.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((d, i) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <DestinationCard destination={d} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
