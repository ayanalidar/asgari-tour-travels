"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Users, Mountain, Star, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "./ImageWithFallback"
import { formatPrice, type TourPackageT } from "@/lib/types"
import { packageImage } from "@/lib/image-map"

interface PackageCardProps {
  pkg: TourPackageT
  index?: number
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
  const displayPrice = pkg.discountPrice ?? pkg.price
  const hasDiscount = pkg.discountPrice != null && pkg.discountPrice < pkg.price
  const discountPct = hasDiscount
    ? Math.round(((pkg.price - (pkg.discountPrice as number)) / pkg.price) * 100)
    : 0

  const image = pkg.coverImage ?? packageImage(pkg.slug) ?? pkg.images?.[0] ?? null

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="lift group relative flex flex-col overflow-hidden rounded-2xl glass"
    >
      <Link href={`/packages/${pkg.slug}`} className="flex flex-col h-full" aria-label={`View ${pkg.title}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={pkg.title}
            className="transition-transform duration-700 group-hover:scale-110"
            fallbackLabel={pkg.title}
            eager={index < 3}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute left-3 top-3">
              <Badge className="border border-rose-400/50 bg-rose-500/20 text-rose-200 backdrop-blur-md">
                <Tag className="size-3" /> {discountPct}% OFF
              </Badge>
            </div>
          )}
          {pkg.popular && (
            <div className="absolute right-3 top-3">
              <Badge className="border border-primary/40 bg-primary/20 text-primary backdrop-blur-md">
                Popular
              </Badge>
            </div>
          )}
          {/* Title + duration */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mb-1 flex items-center gap-2 text-xs text-amber-200/90">
              <Clock className="size-3.5" />
              <span>
                {pkg.durationNights}N / {pkg.durationDays}D
              </span>
              {pkg.difficulty && (
                <>
                  <span className="text-white/30">·</span>
                  <Mountain className="size-3.5" />
                  <span>{pkg.difficulty}</span>
                </>
              )}
            </div>
            <h3 className="font-display text-lg font-bold leading-tight text-white drop-shadow-lg line-clamp-2">
              {pkg.title}
            </h3>
            {pkg.subtitle && (
              <p className="mt-0.5 text-xs text-white/70 line-clamp-1">{pkg.subtitle}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Rating + save badge */}
          <div className="flex items-center justify-between">
            {pkg.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3 ${i < Math.round(pkg.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-foreground">{pkg.rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">({pkg.reviewCount})</span>
              </div>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                Save {formatPrice((pkg.price - (pkg.discountPrice as number)), pkg.currency)}
              </span>
            )}
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {pkg.shortDescription}
          </p>

          {/* Highlights */}
          {pkg.highlights?.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {pkg.highlights.slice(0, 3).map((h, i) => (
                <li
                  key={i}
                  className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] text-primary/80"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-end justify-between border-t border-border/50 pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                From
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-bold text-primary">
                  {formatPrice(displayPrice, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(pkg.price, pkg.currency)}
                  </span>
                )}
              </div>
              {pkg.groupSize && (
                <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="size-3" /> {pkg.groupSize} pax
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              View <ArrowRight className="size-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function PackageRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({count})</span>
    </div>
  )
}
