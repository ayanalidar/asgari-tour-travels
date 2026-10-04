"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Clock,
  Mountain,
  Calendar,
  MapPin,
  ArrowRight,
  Search,
  X,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { destinationImage, gradientForSlug } from "@/lib/image-map"
import { ImageWithFallback } from "./ImageWithFallback"
import type { DestinationT } from "@/lib/types"

interface ActivityItem {
  id?: string
  slug: string
  title: string
  category: string
  shortDescription: string
  description?: string
  duration?: string | null
  difficulty?: string | null
  bestSeason?: string | null
  destinationSlug?: string
  destinationId?: string | null
  images?: string[]
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "nature", label: "Nature" },
  { value: "leisure", label: "Leisure" },
  { value: "religious", label: "Religious" },
]

const CATEGORY_COLOR: Record<string, string> = {
  adventure: "border-primary/40 bg-primary/10 text-primary",
  cultural: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  nature: "border-accent/40 bg-accent/10 text-accent",
  leisure: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  religious: "border-purple-400/40 bg-purple-400/10 text-purple-300",
}

export function ActivityGrid({
  activities,
  destinations,
}: {
  activities: ActivityItem[]
  destinations: DestinationT[]
}) {
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (category !== "all" && a.category !== category) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const hay = `${a.title} ${a.shortDescription} ${a.category}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [activities, category, query])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl glass-strong p-4 sm:p-5 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities, e.g. 'gondola', 'rafting', 'monastery'…"
            className="pl-10 bg-background/60"
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
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex-wrap h-auto">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{filtered.length}</span> activities
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
          No activities match your filters.
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const dest = destinations.find(
                (d) => d.slug === a.destinationSlug || d.id === a.destinationId,
              )
              const destSlug = dest?.slug ?? a.destinationSlug ?? ""
              const image = a.images?.[0] ?? destinationImage(destSlug)
              const destName = dest?.name
              return (
                <motion.article
                  layout
                  key={a.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="lift group relative overflow-hidden rounded-2xl glass"
                >
                  {a.slug ? (
                    <Link href={`/things-to-do/${a.slug}`} className="flex flex-col">
                      <ActivityContent
                        a={a}
                        image={image}
                        destName={destName}
                        gradientSlug={destSlug || a.slug}
                      />
                    </Link>
                  ) : destSlug ? (
                    <Link href={`/destinations/${destSlug}`} className="flex flex-col">
                      <ActivityContent
                        a={a}
                        image={image}
                        destName={destName}
                        gradientSlug={destSlug}
                      />
                    </Link>
                  ) : (
                    <div className="flex flex-col">
                      <ActivityContent
                        a={a}
                        image={image}
                        destName={destName}
                        gradientSlug={a.slug}
                      />
                    </div>
                  )}
                </motion.article>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function ActivityContent({
  a,
  image,
  destName,
  gradientSlug,
}: {
  a: ActivityItem
  image: string | null | undefined
  destName?: string
  gradientSlug: string
}) {
  return (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={a.title}
          className="transition-transform duration-700 group-hover:scale-110"
          gradientClass={gradientForSlug(gradientSlug)}
          fallbackLabel={a.title}
          eager={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge
            className={`${CATEGORY_COLOR[a.category] ?? "border-border bg-background/60 text-foreground"} backdrop-blur-md capitalize`}
          >
            {a.category}
          </Badge>
        </div>
        {destName && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md">
              <MapPin className="size-3" /> {destName}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow-lg">
            {a.title}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {a.shortDescription}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {a.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> {a.duration}
            </span>
          )}
          {a.difficulty && (
            <span className="inline-flex items-center gap-1">
              <Mountain className="size-3.5" /> {a.difficulty}
            </span>
          )}
          {a.bestSeason && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" /> {a.bestSeason}
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
          Explore <ArrowRight className="size-4" />
        </span>
      </div>
    </>
  )
}
