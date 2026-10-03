"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DestinationImage } from "./DestinationImage"
import type { DestinationT } from "@/lib/types"

interface DestinationCardProps {
  destination: DestinationT
  index?: number
}

export function DestinationCard({ destination, index = 0 }: DestinationCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="lift group relative overflow-hidden rounded-2xl glass"
    >
      <Link
        href={`/destinations/${destination.slug}`}
        className="flex flex-col"
        aria-label={`Explore ${destination.name}`}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <DestinationImage
            slug={destination.slug}
            name={destination.name}
            alt={`${destination.name} — ${destination.tagline ?? "Kashmir/Ladakh destination"}`}
            className="transition-transform duration-700 group-hover:scale-110"
            eager={index < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          {/* Region badge */}
          <div className="absolute left-3 top-3">
            <Badge className={`${regionColor} border backdrop-blur-md`}>
              <MapPin className="size-3" /> {regionLabel}
            </Badge>
          </div>
          {/* Category */}
          <div className="absolute right-3 top-3">
            <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
              {destination.category}
            </span>
          </div>
          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-xl font-bold leading-tight text-white drop-shadow-lg">
              {destination.name}
            </h3>
            {destination.tagline && (
              <p className="mt-1 line-clamp-2 text-xs text-white/75">
                {destination.tagline}
              </p>
            )}
          </div>
        </div>
        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {destination.shortDescription}
          </p>
          <div className="mt-auto flex items-center justify-between">
            {destination.duration && (
              <span className="text-xs text-muted-foreground">
                ⏱ {destination.duration}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
              Explore <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
