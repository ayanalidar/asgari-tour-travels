import type { Metadata } from "next"
import { getSettings } from "@/lib/settings"
import { getAllPackages } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { PackagesExplorer } from "@/components/site/PackagesExplorer"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tour Packages - Kashmir & Ladakh Holiday Deals",
  description:
    "Browse all Kashmir & Ladakh tour packages - honeymoon, adventure, family, pilgrimage. Houseboats, Gulmarg, Pahalgam, Leh, Pangong & more. Customisable itineraries from Asgari Tour & Travels.",
  alternates: { canonical: "/packages" },
}

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; duration?: string; price?: string }>
}) {
  const [settings, params] = await Promise.all([getSettings(), searchParams])
  const packages = await getAllPackages()

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="Tour Packages"
        title={
          <>
            Curated <span className="gradient-text-saffron">Himalayan journeys</span>
          </>
        }
        subtitle="All-inclusive, fully customisable tour packages across Kashmir & Ladakh. Stays, transfers, permits, guides & 24/7 support - all handled by us."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Packages" },
          ]}
        />

        <PackagesExplorer packages={packages} />
      </div>
    </PublicLayout>
  )
}
