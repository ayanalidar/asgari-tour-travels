import type { Metadata } from "next"
import { getSettings } from "@/lib/settings"
import { getAllDestinations } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { DestinationsExplorer } from "@/components/site/DestinationsExplorer"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Destinations — Kashmir & Ladakh Travel Guide",
  description:
    "Explore all destinations across Kashmir, Ladakh & Jammu. From Srinagar's Dal Lake to Pangong Tso & Khardung La — discover the crown jewels of the Himalayas with detailed travel guides.",
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
        subtitle="From the floating gardens of Dal Lake to the world's highest motorable road — 40+ destinations across Kashmir, Ladakh & Jammu."
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
      </div>
    </PublicLayout>
  )
}
