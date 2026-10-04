"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Plane,
  Mountain,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "./ImageWithFallback"
import { StatsCounter } from "./StatsCounter"
import { RatingBadge } from "./RatingBadge"
import { HERO_IMAGE } from "@/lib/image-map"

interface HeroProps {
  stats?: {
    travelers?: number
    packages?: number
    years?: number
    destinations?: number
  }
  rating?: number
  reviewCount?: number
}

export function Hero({
  stats = { travelers: 15000, packages: 50, years: 15, destinations: 40 },
  rating = 4.9,
  reviewCount = 347,
}: HeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24"
      aria-label="Hero"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 aurora-animated opacity-80" />
      <div className="absolute inset-0 -z-10 grid-overlay opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 size-96 rounded-full bg-primary/20 blur-3xl float-slow" />
      <div
        className="pointer-events-none absolute -right-32 top-40 -z-10 size-96 rounded-full bg-accent/20 blur-3xl float-slow"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-rose-500/15 blur-3xl float-slow"
        style={{ animationDelay: "-4s" }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:justify-start"
            >
              <RatingBadge rating={rating} reviewCount={reviewCount} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Discover{" "}
              <span className="gradient-text-saffron glow-saffron">Paradise</span>
              <br />
              <span className="text-foreground">Kashmir & Ladakh</span>
              <br />
              <span className="gradient-text-mix">Specialists</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              Curated luxury journeys across the Himalayas - from houseboats on Dal Lake to
              the world's highest motorable roads in Ladakh. 15+ years of local expertise.
              Customised itineraries in 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="btn-glow">
                <Link href="/packages">
                  <Compass className="size-4" /> Explore Packages
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/destinations">
                  <MapPin className="size-4" /> Browse Destinations
                </Link>
              </Button>
            </motion.div>

            {/* Quick features */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-xl"
            >
              <Feature icon={<Sparkles className="size-3.5" />} text="Custom itineraries" />
              <Feature icon={<Calendar className="size-3.5" />} text="24h turnaround" />
              <Feature
                icon={<Star className="size-3.5" />}
                text="Local experts"
              />
            </motion.ul>
          </div>

          {/* Right: Hero image card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass-strong shadow-2xl">
              <ImageWithFallback
                src={HERO_IMAGE}
                alt="Panoramic view of the Kashmir valley at golden hour with snow-capped Himalayan peaks"
                className="h-full w-full object-cover"
                eager
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Top badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
                <span className="size-2 animate-pulse rounded-full bg-accent" />
                <span className="text-xs font-medium text-white/90">
                  Live: Gulmarg meadows in bloom
                </span>
              </div>

              {/* Bottom card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/50 p-3 backdrop-blur-xl"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                  <Plane className="size-5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-white/60">
                    Featured Tour
                  </span>
                  <span className="text-sm font-bold text-white">
                    Kashmir Paradise 5N/6D
                  </span>
                </div>
                <Link
                  href="/packages/kashmir-paradise-delight-5n6d"
                  className="ml-auto inline-flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View <ArrowRight className="size-3" />
                </Link>
              </motion.div>
            </div>

            {/* Floating stat chip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -right-4 top-12 hidden rounded-2xl glass-strong p-3 sm:block"
            >
              <div className="flex items-center gap-2">
                <Mountain className="size-5 text-accent" />
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg font-bold text-foreground">
                    <StatsCounter value={4350} suffix="m" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    PANGONG LAKE
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 sm:grid-cols-4"
        >
          <Stat
            value={<StatsCounter value={stats.travelers ?? 15000} suffix="+" />}
            label="Happy Travellers"
          />
          <Stat
            value={<StatsCounter value={stats.packages ?? 50} suffix="+" />}
            label="Curated Packages"
          />
          <Stat
            value={<StatsCounter value={stats.years ?? 15} suffix=" yrs" />}
            label="Local Expertise"
          />
          <Stat
            value={<StatsCounter value={stats.destinations ?? 40} suffix="+" />}
            label="Destinations Covered"
          />
        </motion.dl>
      </div>
    </section>
  )
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
      <span className="text-primary">{icon}</span>
      <span className="font-medium">{text}</span>
    </li>
  )
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl glass p-4 text-center">
      <dt className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        {value}
      </dt>
      <dd className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dd>
    </div>
  )
}
