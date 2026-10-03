"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PackageCard } from "./PackageCard"
import { formatPrice, type TourPackageT } from "@/lib/types"

interface Props {
  packages: TourPackageT[]
}

type Region = "all" | "kashmir" | "ladakh"
type SortKey = "popular" | "price-low" | "price-high" | "duration"

export function PackagesExplorer({ packages }: Props) {
  const [region, setRegion] = useState<Region>("all")
  const [duration, setDuration] = useState("all")
  const [sort, setSort] = useState<SortKey>("popular")

  const filtered = useMemo(() => {
    let list = packages.slice()
    if (region !== "all") {
      list = list.filter((p) =>
        p.destinations.some((d) => d.destination.region === region),
      )
    }
    if (duration !== "all") {
      const [min, max] = duration.split("-").map(Number)
      list = list.filter((p) => {
        const days = p.durationDays
        return days >= min && (Number.isNaN(max) || days <= max)
      })
    }
    switch (sort) {
      case "price-low":
        list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price))
        break
      case "price-high":
        list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price))
        break
      case "duration":
        list.sort((a, b) => b.durationDays - a.durationDays)
        break
      default:
        list.sort((a, b) => Number(b.popular) - Number(a.popular) || a.order - b.order)
    }
    return list
  }, [packages, region, duration, sort])

  const priceRange = useMemo(() => {
    if (filtered.length === 0) return ""
    const prices = filtered.map((p) => p.discountPrice ?? p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return `${formatPrice(min)} – ${formatPrice(max)}`
  }, [filtered])

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="rounded-2xl glass-strong p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Region
              </label>
              <Tabs value={region} onValueChange={(v) => setRegion(v as Region)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="kashmir">Kashmir</TabsTrigger>
                  <TabsTrigger value="ladakh">Ladakh</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Duration
                </label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-[160px] bg-background/60">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any duration</SelectItem>
                    <SelectItem value="1-4">1-4 days</SelectItem>
                    <SelectItem value="5-7">5-7 days</SelectItem>
                    <SelectItem value="8-99">8+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Sort by
                </label>
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="w-[160px] bg-background/60">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="duration">Longest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted-foreground">
          <span className="font-bold text-foreground">{filtered.length}</span> packages
          {priceRange && (
            <>
              {" "}· Price range{" "}
              <span className="font-semibold text-primary">{priceRange}</span>
            </>
          )}
        </p>
        {(region !== "all" || duration !== "all" || sort !== "popular") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRegion("all")
              setDuration("all")
              setSort("popular")
            }}
          >
            <X className="size-3.5" /> Reset
          </Button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center">
          <SlidersHorizontal className="mx-auto size-8 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            No packages match your filters. Try widening your selection.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
              >
                <PackageCard pkg={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
