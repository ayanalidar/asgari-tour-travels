"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { ImageWithFallback } from "./ImageWithFallback"
import type { TestimonialT } from "@/lib/types"

interface TestimonialCarouselProps {
  testimonials: TestimonialT[]
  autoPlay?: boolean
  interval?: number
}

export function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  interval = 5000,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return
    const t = setInterval(next, interval)
    return () => clearInterval(t)
  }, [autoPlay, paused, count, next, interval])

  if (count === 0) return null
  const current = testimonials[index]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main card */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12">
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 size-40 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative z-10">
          {/* Quote icon */}
          <Quote className="size-10 text-primary/30" />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < current.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="mt-4 font-display text-lg leading-relaxed text-foreground/90 sm:text-xl">
                &ldquo;{current.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-4">
                <div className="size-12 shrink-0 overflow-hidden rounded-full bg-primary/15 ring-2 ring-primary/20">
                  <ImageWithFallback
                    src={current.avatar}
                    alt={current.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{current.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {current.location}
                    {current.source === "google" && (
                      <span className="ml-1 text-[10px] uppercase tracking-wider text-accent">
                        · via Google
                      </span>
                    )}
                  </p>
                </div>
                {current.title && (
                  <span className="ml-auto hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:block">
                    {current.title}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          disabled={count <= 1}
          className="grid size-10 place-items-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary disabled:opacity-30"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={count <= 1}
          className="grid size-10 place-items-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary disabled:opacity-30"
          aria-label="Next testimonial"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  )
}
