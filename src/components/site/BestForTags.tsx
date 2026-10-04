"use client"

import { motion } from "framer-motion"
import {
  Heart,
  Mountain,
  Users,
  Camera,
  Snowflake,
  Sparkles,
  Leaf,
  Compass,
} from "lucide-react"

interface BestForTagsProps {
  slug: string
  name: string
  category?: string
  region?: string
  altitude?: string | null
  bestTimeToVisit?: string | null
  thingsToDoCount?: number
  size?: "sm" | "md"
}

type TagType =
  | "honeymoon"
  | "adventure"
  | "family"
  | "photography"
  | "skiing"
  | "nature"
  | "spiritual"
  | "cultural"

const TAG_CONFIG: Record<
  TagType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  honeymoon: { label: "Honeymoon", icon: <Heart className="size-3" />, color: "border-rose-400/40 bg-rose-400/10 text-rose-300" },
  adventure: { label: "Adventure", icon: <Mountain className="size-3" />, color: "border-primary/40 bg-primary/10 text-primary" },
  family: { label: "Family", icon: <Users className="size-3" />, color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" },
  photography: { label: "Photography", icon: <Camera className="size-3" />, color: "border-amber-400/40 bg-amber-400/10 text-amber-300" },
  skiing: { label: "Skiing", icon: <Snowflake className="size-3" />, color: "border-sky-400/40 bg-sky-400/10 text-sky-300" },
  nature: { label: "Nature", icon: <Leaf className="size-3" />, color: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" },
  spiritual: { label: "Spiritual", icon: <Sparkles className="size-3" />, color: "border-purple-400/40 bg-purple-400/10 text-purple-300" },
  cultural: { label: "Cultural", icon: <Compass className="size-3" />, color: "border-accent/40 bg-accent/10 text-accent" },
}

// Derive "best for" tags from destination attributes
function deriveTags(props: BestForTagsProps): TagType[] {
  const { slug, name, category, region, altitude, bestTimeToVisit } = props
  const tags = new Set<TagType>()
  const nameLower = name.toLowerCase()
  const timeLower = (bestTimeToVisit || "").toLowerCase()
  const catLower = (category || "").toLowerCase()

  // Honeymoon: specific destinations known for romance
  if (["srinagar", "dal-lake", "gulmarg", "pahalgam", "betaab-valley", "mughal-gardens", "aru-valley", "pari-mahal"].includes(slug)) {
    tags.add("honeymoon")
  }
  if (nameLower.includes("honeymoon") || nameLower.includes("houseboat")) {
    tags.add("honeymoon")
  }

  // Adventure: high altitude, passes, treks
  if (["khardung-la", "zoji-la-pass", "sinthan-top", "bangus-valley", "gangabal-lake", "tarsar-marsar-lakes", "nubra-valley", "pangong-tso"].includes(slug)) {
    tags.add("adventure")
  }
  if (altitude && parseInt(altitude) > 3000) {
    tags.add("adventure")
  }
  if (catLower === "pass" || catLower === "peak") {
    tags.add("adventure")
  }

  // Skiing: Gulmarg + winter
  if (slug === "gulmarg" || (timeLower.includes("dec") || timeLower.includes("jan") || timeLower.includes("feb"))) {
    if (slug === "gulmarg") tags.add("skiing")
  }

  // Photography: lakes, monasteries, scenic
  if (["pangong-tso", "tso-moriri", "tso-kar", "hanle", "nubra-valley", "mughal-gardens", "dal-lake", "ladakh-monastery", "thiksey-monastery"].includes(slug)) {
    tags.add("photography")
  }

  // Family: easy-access destinations
  if (["srinagar", "dal-lake", "mughal-gardens", "gulmarg", "pahalgam", "pahalgam", "sonmarg", "kokernag", "verinag", "leh"].includes(slug)) {
    tags.add("family")
  }

  // Nature: meadows, lakes, gardens
  if (catLower === "meadow" || catLower === "lake" || catLower === "garden") {
    tags.add("nature")
  }
  if (["yusmarg", "doodhpathri", "sonmarg", "daksum", "lolab-valley", "gangabal-lake", "tarsar-marsar-lakes"].includes(slug)) {
    tags.add("nature")
  }

  // Spiritual: shrines, temples, monasteries
  if (["hazratbal-shrine", "shankaracharya-temple", "amarnath", "vaishno-devi"].includes(slug) || catLower === "monastery") {
    tags.add("spiritual")
  }

  // Cultural: towns, old city, gardens
  if (["srinagar", "leh", "mughal-gardens", "pari-mahal", "turtuk", "sham-valley"].includes(slug) || catLower === "garden" || catLower === "town") {
    tags.add("cultural")
  }

  // Ensure at least 2 tags
  const result = Array.from(tags)
  if (result.length < 2) {
    if (!result.includes("nature")) result.push("nature")
    if (!result.includes("adventure")) result.push("adventure")
  }
  return result.slice(0, 4)
}

export function BestForTags(props: BestForTagsProps) {
  const tags = deriveTags(props)
  const { size = "sm" } = props

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t, i) => {
        const config = TAG_CONFIG[t]
        return (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium backdrop-blur-md ${config.color} ${size === "sm" ? "text-[10px]" : "text-xs"}`}
          >
            {config.icon}
            {config.label}
          </motion.span>
        )
      })}
    </div>
  )
}

export { deriveTags as deriveBestForTags }
export type { TagType }
