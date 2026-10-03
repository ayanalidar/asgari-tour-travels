"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Award, Users, Globe2 } from "lucide-react"
import { RatingBadge } from "./RatingBadge"

export function RatingBadgesRow({
  rating,
  reviewCount,
}: {
  rating: number
  reviewCount: number
}) {
  const items = [
    { icon: <ShieldCheck className="size-4" />, label: "IATA Certified" },
    { icon: <Award className="size-4" />, label: "4.9★ Google Rating" },
    { icon: <Users className="size-4" />, label: "15,000+ Happy Travellers" },
    { icon: <Globe2 className="size-4" />, label: "J&K Tourism Registered" },
  ]
  return (
    <section className="border-y border-border/60 bg-background/40 py-4">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm"
        >
          {items.map((it, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 text-muted-foreground"
            >
              <span className="text-accent">{it.icon}</span>
              {it.label}
            </li>
          ))}
          <li className="hidden sm:flex items-center gap-2 ml-2">
            <RatingBadge rating={rating} reviewCount={reviewCount} compact />
          </li>
        </motion.ul>
      </div>
    </section>
  )
}
