"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  className?: string
  gradientClass?: string
  fallbackLabel?: string
  fallbackIcon?: React.ReactNode
  eager?: boolean
}

/**
 * Image with graceful gradient fallback if src is missing or fails to load.
 * Uses plain <img> tag (works with /uploads/ paths without next/image domain config).
 *
 * State pattern: track the last src that errored. When the incoming src differs,
 * we know it's a fresh attempt — no effect needed (avoids cascading renders).
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  gradientClass = "from-amber-500/30 via-rose-500/20 to-emerald-500/30",
  fallbackLabel,
  fallbackIcon,
  eager = false,
}: ImageWithFallbackProps) {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null)
  const showFallback = !src || src === erroredSrc

  if (showFallback) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br overflow-hidden",
          gradientClass,
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute inset-0 aurora-bg opacity-40" />
        <div className="relative z-10 flex flex-col items-center gap-2 text-foreground/80">
          {fallbackIcon ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-12 opacity-70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 3.75h16.5a2.25 2.25 0 0 1 2.25 2.25v11.25a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25V6a2.25 2.25 0 0 1 2.25-2.25Z"
              />
            </svg>
          )}
          {fallbackLabel && (
            <span className="text-xs uppercase tracking-widest font-semibold opacity-70">
              {fallbackLabel}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <img
      src={src as string}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setErroredSrc(src as string)}
      className={className}
    />
  )
}
