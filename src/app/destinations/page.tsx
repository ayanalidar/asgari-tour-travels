import type { Metadata } from "next"
import Link from "next/link"
import { GitCompare, ArrowRight } from "lucide-react"
import { getSettings } from "@/lib/settings"
import { getAllDestinations } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { DestinationsExplorer } from "@/components/site/DestinationsExplorer"
import { DestinationMap } from "@/components/site/DestinationMap"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Destinations - Kashmir & Ladakh Travel Guide",
  description:
    "Explore all destinations across Kashmir, Ladakh & Jammu. From Srinagar's Dal Lake to Pangong Tso & Khardung La - discover the crown jewels of the Himalayas with detailed travel guides.",
  alternates: { canonical: "/destinations" },
}

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; category?: string; q?: string }>
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams])
  const initialRegion = params.region ?? "all"
  const initialCategory = params.category ?? "all"
  const initialQuery = params.q ?? ""

  const destinations = await getAllDestinations()

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="Destinations"
        title={
          <>
            <span className="gradient-text-saffron">Explore</span> the Himalayas
          </>
        }
        subtitle="From the floating gardens of Dal Lake to the world's highest motorable road - 40+ destinations across Kashmir, Ladakh & Jammu."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Destinations" },
          ]}
        />

        <DestinationsExplorer
          destinations={destinations}
          initialRegion={initialRegion}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
        />

        {/* Interactive Map */}
        <div className="mt-12">
          <DestinationMap destinations={destinations} />
        </div>

        {/* Compare CTA */}
        <div className="mt-12 relative overflow-hidden rounded-2xl glass-strong p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                <GitCompare className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">
                  Can't decide between destinations?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Compare up to 3 destinations side by side - altitude, best time, things to do & more.
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="btn-glow shrink-0">
              <Link href="/compare">
                Compare now <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
