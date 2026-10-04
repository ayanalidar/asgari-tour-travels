"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Mountain,
  MapPin,
  Star,
  ListChecks,
} from "lucide-react"

interface DestinationStatsBarProps {
  bestTimeToVisit?: string | null
  duration?: string | null
  altitude?: string | null
  distance?: string | null
  thingsToDoCount?: number
  region?: string
  category?: string
}

export function DestinationStatsBar({
  bestTimeToVisit,
  duration,
  altitude,
  distance,
  thingsToDoCount = 0,
  region,
  category,
}: DestinationStatsBarProps) {
  const stats = [
    { icon: <Calendar className="size-4" />, label: "Best Time", value: bestTimeToVisit },
    { icon: <Clock className="size-4" />, label: "Duration", value: duration },
    { icon: <Mountain className="size-4" />, label: "Altitude", value: altitude },
    { icon: <MapPin className="size-4" />, label: "Distance", value: distance },
    { icon: <ListChecks className="size-4" />, label: "Things to Do", value: thingsToDoCount ? `${thingsToDoCount} activities` : null },
    { icon: <Star className="size-4" />, label: "Region", value: region ? `${region}${category ? ` · ${category}` : ""}` : category },
  ].filter((s) => s.value)

  if (stats.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="group relative overflow-hidden rounded-xl glass p-3"
        >
          <div className="absolute -right-4 -top-4 size-12 rounded-full bg-primary/10 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative z-10 flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
              {s.icon}
            </span>
            <div className="min-w-0">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
              <span className="block truncate text-xs font-semibold text-foreground">
                {s.value}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
