"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TestimonialT } from "@/lib/types"

interface TestimonialCardProps {
  testimonial: TestimonialT
  index?: number
  className?: string
}

export function TestimonialCard({ testimonial, index = 0, className }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join("")
    .toUpperCase()

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-2xl glass p-6",
        className,
      )}
    >
      <Quote className="absolute right-5 top-5 size-10 text-primary/15" />
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < testimonial.rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        ))}
        {testimonial.source === "google" && (
          <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
            Google
          </span>
        )}
      </div>
      {testimonial.title && (
        <h4 className="font-display text-base font-bold text-foreground">
          “{testimonial.title}”
        </h4>
      )}
      <blockquote className="flex-1 text-sm leading-relaxed text-foreground/85">
        {testimonial.text}
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-border/50 pt-4">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 font-display text-sm font-bold text-primary">
            {initials || "A"}
          </span>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {testimonial.name}
          </span>
          {testimonial.location && (
            <span className="text-xs text-muted-foreground">
              {testimonial.location}
            </span>
          )}
        </div>
      </figcaption>
    </motion.figure>
  )
}
