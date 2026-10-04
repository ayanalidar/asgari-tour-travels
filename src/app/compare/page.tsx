import type { Metadata } from "next"
import { getAllDestinations } from "@/lib/queries"
import { getSettings } from "@/lib/settings"
import { PublicLayout } from "@/components/site/PublicLayout"
import { SectionHeading } from "@/components/site/SectionHeading"
import { CompareTool } from "@/components/site/CompareTool"
import { CTASection } from "@/components/site/CTASection"
import { GitCompare } from "lucide-react"

export const metadata: Metadata = {
  title: "Compare Destinations - Kashmir & Ladakh Side-by-Side",
  description:
    "Compare Kashmir & Ladakh destinations side by side - altitude, best time to visit, duration, things to do, how to reach. Make an informed choice.",
  keywords: [
    "compare Kashmir destinations",
    "Gulmarg vs Pahalgam",
    "Pangong vs Nubra",
    "Kashmir destination comparison",
    "Ladakh vs Kashmir",
  ],
  openGraph: {
    title: "Compare Kashmir & Ladakh Destinations",
    description:
      "Side-by-side destination comparison - altitude, best time, things to do & more.",
  },
}

export const revalidate = 600

export default async function ComparePage() {
  const [settings, destinations] = await Promise.all([
    getSettings(),
    getAllDestinations(),
  ])

  return (
    <PublicLayout settings={settings}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
        <div className="absolute inset-0 -z-10 aurora-animated opacity-70" />
        <div className="absolute inset-0 -z-10 grid-overlay opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <GitCompare className="size-3.5" /> Destination Comparison
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Compare <span className="gradient-text-saffron glow-saffron">destinations</span> side by side
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Can't decide between Gulmarg & Pahalgam? Or Pangong vs Nubra? Pick up to 3 destinations
              and compare altitude, best time, things to do & more - all in one view.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison tool */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <CompareTool destinations={destinations} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <CTASection phone={settings.phone_primary} />
        </div>
      </section>
    </PublicLayout>
  )
}
