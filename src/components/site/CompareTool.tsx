"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Plus,
  GitCompare,
  Mountain,
  Calendar,
  Clock,
  MapPin,
  ListChecks,
  Navigation,
  Check,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DestinationT } from "@/lib/types"
import { destinationImage } from "@/lib/image-map"
import { ImageWithFallback } from "./ImageWithFallback"

interface CompareToolProps {
  destinations: DestinationT[]
}

export function CompareTool({ destinations }: CompareToolProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)

  const selectedDests = useMemo(
    () =>
      selected
        .map((slug) => destinations.find((d) => d.slug === slug))
        .filter(Boolean) as DestinationT[],
    [selected, destinations]
  )

  const toggleDest = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 3
        ? prev
        : [...prev, slug]
    )
  }

  const availableDests = destinations.filter((d) => !selected.includes(d.slug))

  const comparisonRows = [
    { icon: <Mountain className="size-4" />, label: "Altitude", key: "altitude" },
    { icon: <Calendar className="size-4" />, label: "Best Time", key: "bestTimeToVisit" },
    { icon: <Clock className="size-4" />, label: "Duration", key: "duration" },
    { icon: <MapPin className="size-4" />, label: "Distance", key: "distance" },
    { icon: <Navigation className="size-4" />, label: "How to Reach", key: "howToReach" },
    { icon: <ListChecks className="size-4" />, label: "Things to Do", key: "thingsToDo" },
  ]

  if (selected.length === 0) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-3xl glass-strong p-10"
        >
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary">
            <GitCompare className="size-8" />
          </span>
          <h3 className="mt-6 font-display text-xl font-bold">Compare destinations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select up to 3 destinations to see a side-by-side comparison of altitude, best time,
            things to do & more.
          </p>
          <Button
            onClick={() => setPickerOpen(true)}
            className="btn-glow mt-6"
            size="lg"
          >
            <Plus className="size-4" /> Add destinations
          </Button>
        </motion.div>
        {pickerOpen && (
          <DestPicker
            destinations={availableDests}
            onPick={(slug) => {
              toggleDest(slug)
              if (selected.length >= 2) setPickerOpen(false)
            }}
            onClose={() => setPickerOpen(false)}
            selectedCount={selected.length}
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {selectedDests.map((d) => (
            <Badge
              key={d.slug}
              variant="outline"
              className="gap-1.5 border-primary/40 bg-primary/10 py-1.5 pl-3 pr-2 text-sm"
            >
              {d.name}
              <button
                onClick={() => toggleDest(d.slug)}
                className="grid size-5 place-items-center rounded-full hover:bg-primary/20"
                aria-label={`Remove ${d.name}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPickerOpen(true)}
          disabled={selected.length >= 3}
        >
          <Plus className="size-4" /> Add ({selected.length}/3)
        </Button>
      </div>

      {/* Comparison grid */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `200px repeat(${selectedDests.length}, minmax(260px, 1fr))`,
          }}
        >
          {/* Header row: images + names */}
          <div className="flex items-end pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Destination
          </div>
          {selectedDests.map((d) => (
            <div key={d.id} className="relative overflow-hidden rounded-2xl glass">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src={destinationImage(d.slug) || d.heroImage}
                  alt={d.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-[10px] uppercase tracking-wider text-primary">
                    {d.region}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white">{d.name}</h3>
                </div>
              </div>
              <div className="p-2">
                <Button asChild size="sm" variant="ghost" className="w-full">
                  <Link href={`/destinations/${d.slug}`}>
                    View <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {/* Tagline row */}
          <CompareRow label="Tagline" icon={<MapPin className="size-4" />} />
          {selectedDests.map((d) => (
            <CompareCell key={d.id}>
              <p className="text-sm italic text-muted-foreground">{d.tagline || "-"}</p>
            </CompareCell>
          ))}

          {/* Category row */}
          <CompareRow label="Category" />
          {selectedDests.map((d) => (
            <CompareCell key={d.id}>
              <Badge variant="outline" className="capitalize">
                {d.category}
              </Badge>
            </CompareCell>
          ))}

          {/* Data rows */}
          {comparisonRows.map((row) => (
            <FragmentRow key={row.key} label={row.label} icon={row.icon}>
              {selectedDests.map((d) => {
                const val = (d as any)[row.key]
                return (
                  <CompareCell key={d.id}>
                    {row.key === "thingsToDo" ? (
                      <ul className="space-y-1.5">
                        {(val || []).slice(0, 5).map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Check className="mt-0.5 size-3 shrink-0 text-accent" />
                            {item}
                          </li>
                        ))}
                        {(val || []).length > 5 && (
                          <li className="text-xs text-primary">
                            +{(val || []).length - 5} more
                          </li>
                        )}
                      </ul>
                    ) : row.key === "howToReach" ? (
                      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">
                        {val || "-"}
                      </p>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{val || "-"}</span>
                    )}
                  </CompareCell>
                )
              })}
            </FragmentRow>
          ))}

          {/* Short description */}
          <CompareRow label="Overview" />
          {selectedDests.map((d) => (
            <CompareCell key={d.id}>
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">
                {d.shortDescription}
              </p>
            </CompareCell>
          ))}
        </div>
      </div>

      {pickerOpen && (
        <DestPicker
          destinations={availableDests}
          onPick={(slug) => {
            toggleDest(slug)
            if (selected.length >= 2) setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
          selectedCount={selected.length}
        />
      )}
    </div>
  )
}

function FragmentRow({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <CompareRow label={label} icon={icon} />
      {children}
    </>
  )
}

function CompareRow({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-t border-border/30 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {icon && <span className="text-primary">{icon}</span>}
      {label}
    </div>
  )
}

function CompareCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border/30 py-3 px-1">
      {children}
    </div>
  )
}

function DestPicker({
  destinations,
  onPick,
  onClose,
  selectedCount,
}: {
  destinations: DestinationT[]
  onPick: (slug: string) => void
  onClose: () => void
  selectedCount: number
}) {
  const [search, setSearch] = useState("")
  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-strong"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/40 p-4">
          <h3 className="font-display text-lg font-bold">
            Add destination <span className="text-sm font-normal text-muted-foreground">({selectedCount}/3)</span>
          </h3>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg hover:bg-background/60">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full rounded-xl border border-border/60 bg-background/40 px-4 py-2.5 text-sm outline-none focus:border-primary/40"
            autoFocus
          />
        </div>
        <ScrollArea className="max-h-80">
          <div className="grid grid-cols-2 gap-2 p-4 pt-0">
            {filtered.map((d) => (
              <button
                key={d.id}
                onClick={() => onPick(d.slug)}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-2 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="size-12 shrink-0 overflow-hidden rounded-lg">
                  <ImageWithFallback
                    src={destinationImage(d.slug) || d.heroImage}
                    alt={d.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{d.name}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {d.region}
                  </span>
                </div>
                <Plus className="ml-auto size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                No destinations found.
              </p>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}
