"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import type { DestinationT, TestimonialT } from "@/lib/types"

// Lazy-load heavy interactive components to reduce initial bundle weight
// and avoid OOM during landing page compilation in memory-constrained environments.

const SeasonExplorerLazy = dynamic(
  () => import("./SeasonExplorer").then((m) => m.SeasonExplorer),
  {
    loading: () => (
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-2xl bg-muted/30"
          />
        ))}
      </div>
    ),
    ssr: true,
  }
)

const TestimonialCarouselLazy = dynamic(
  () => import("./TestimonialCarousel").then((m) => m.TestimonialCarousel),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-3xl bg-muted/30" />
    ),
    ssr: true,
  }
)

const SectionDividerLazy = dynamic(
  () => import("./SectionDivider").then((m) => m.SectionDivider),
  {
    loading: () => <div className="h-12" />,
    ssr: true,
  }
)

const InstagramFeedLazy = dynamic(
  () => import("./InstagramFeed").then((m) => m.InstagramFeed),
  {
    loading: () => <div className="h-80 animate-pulse rounded-3xl bg-muted/30" />,
    ssr: false,
  }
)

const DepartureCalendarLazy = dynamic(
  () => import("./DepartureCalendar").then((m) => m.DepartureCalendar),
  {
    loading: () => <div className="h-96 animate-pulse rounded-3xl bg-muted/30" />,
    ssr: false,
  }
)

export function LazySeasonExplorer({ destinations }: { destinations: DestinationT[] }) {
  return (
    <Suspense>
      <SeasonExplorerLazy destinations={destinations} />
    </Suspense>
  )
}

export function LazyTestimonialCarousel({ testimonials }: { testimonials: TestimonialT[] }) {
  return (
    <Suspense>
      <TestimonialCarouselLazy testimonials={testimonials} />
    </Suspense>
  )
}

export function LazySectionDivider({ variant = "gradient", className = "" }: {
  variant?: "wave" | "gradient" | "dots" | "spikes"
  className?: string
}) {
  return (
    <Suspense>
      <SectionDividerLazy variant={variant} className={className} />
    </Suspense>
  )
}

export function LazyInstagramFeed({ handle }: { handle: string }) {
  return (
    <Suspense>
      <InstagramFeedLazy handle={handle} />
    </Suspense>
  )
}

export function LazyDepartureCalendar({ departures }: { departures: any[] }) {
  return (
    <Suspense>
      <DepartureCalendarLazy departures={departures} />
    </Suspense>
  )
}
