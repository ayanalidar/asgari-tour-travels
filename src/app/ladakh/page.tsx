import type { Metadata } from "next"
import Link from "next/link"
import { Mountain, Compass, Wind, FileCheck, ArrowRight, MapPin } from "lucide-react"
import { getSettings } from "@/lib/settings"
import {
  getAllDestinations,
  getFeaturedPackages,
} from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Hero } from "@/components/site/Hero"
import { SectionHeading } from "@/components/site/SectionHeading"
import { DestinationCard } from "@/components/site/DestinationCard"
import { PackageCard } from "@/components/site/PackageCard"
import { CTASection } from "@/components/site/CTASection"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { Button } from "@/components/ui/button"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Ladakh Tour Packages — Leh, Pangong, Nubra & Khardung La",
  description:
    "The land of high passes — Leh, Pangong Lake, Nubra Valley, Khardung La & ancient monasteries. Curated Ladakh tour packages with permits, acclimatization & expert guides.",
  alternates: { canonical: "/ladakh" },
  keywords: [
    "Ladakh tour packages", "Leh Ladakh", "Pangong Lake", "Nubra Valley",
    "Khardung La", "Ladakh monasteries", "Ladakh trip",
  ],
}

export default async function LadakhPage() {
  const [settings, destinations, packages] = await Promise.all([
    getSettings(),
    getAllDestinations(),
    getFeaturedPackages(6),
  ])

  const ladakhDestinations = destinations.filter((d) => d.region === "ladakh")
  const ladakhPackages = packages.filter((p) =>
    p.destinations.some((pd) => pd.destination.region === "ladakh"),
  )

  const heroStats = {
    travelers: settings.stats_travelers ?? 15000,
    packages: settings.stats_packages ?? 50,
    years: settings.stats_years ?? 15,
    destinations: ladakhDestinations.length,
  }

  const facts = [
    {
      icon: <Mountain className="size-5" />,
      title: "Altitude matters",
      desc: "Leh sits at 3,500m. Acclimatize day 1-2 before going higher to avoid AMS.",
    },
    {
      icon: <FileCheck className="size-5" />,
      title: "Inner Line Permits",
      desc: "Required for Pangong, Nubra, Tso Moriri. We arrange all permits in your package.",
    },
    {
      icon: <Wind className="size-5" />,
      title: "Best season",
      desc: "Mid-May to mid-October. Roads close in winter — plan around the weather window.",
    },
    {
      icon: <Compass className="size-5" />,
      title: "Two routes in",
      desc: "Fly to Leh (easy) or drive Srinagar-Leh / Manali-Leh highway (epic).",
    },
  ]

  return (
    <PublicLayout settings={settings}>
      <Hero
        stats={heroStats}
        rating={settings.google_rating ?? 4.9}
        reviewCount={settings.google_review_count ?? 347}
      />

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Ladakh" },
          ]}
        />
      </section>

      {/* Intro */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <SectionHeading
          eyebrow="Ladakh — Land of High Passes"
          title={
            <>
              The <span className="gradient-text-saffron">cold desert</span> of the Himalayas
            </>
          }
          subtitle="Ladakh is a high-altitude cold desert perched between the Karakoram and the Himalayas — a surreal moonscape of turquoise lakes, ancient monasteries, snow-capped passes and the world's highest motorable roads."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <div key={i} className="lift rounded-2xl glass p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 mb-3">
                {f.icon}
              </span>
              <h3 className="font-display text-base font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ladakh destinations */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <SectionHeading
            align="left"
            eyebrow="Destinations"
            title={
              <>
                <span className="gradient-text-mix">Ladakh</span> destinations
              </>
            }
            subtitle="From Leh town to the salt flats of Tso Kar — explore every corner of the Land of High Passes."
          />
          <Button asChild variant="outline" size="sm">
            <Link href="/destinations?region=ladakh">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ladakhDestinations.slice(0, 8).map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </div>
      </section>

      {/* Ladakh packages */}
      {ladakhPackages.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <SectionHeading
              align="left"
              eyebrow="Packages"
              title={
                <>
                  Curated <span className="gradient-text-saffron">Ladakh tours</span>
                </>
              }
              subtitle="All-inclusive Ladakh packages with permits, acclimatization days, comfortable stays & expert local guides."
            />
            <Button asChild variant="outline" size="sm">
              <Link href="/packages">
                All packages <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ladakhPackages.map((p, i) => (
              <PackageCard key={p.id} pkg={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Acclimatization tips */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60">
        <SectionHeading
          eyebrow="Safety First"
          title={
            <>
              <span className="gradient-text-mix">Acclimatization</span> & permits
            </>
          }
          subtitle="Ladakh's altitude is no joke. Here's what every traveller should know before flying into Leh."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl glass p-6">
            <h3 className="font-display text-lg font-bold mb-3 text-primary">Altitude & AMS</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-primary shrink-0" /> Leh: 3,500m · Khardung La: 5,359m · Pangong: 4,350m</li>
              <li>Rest on day 1 — no exertion, no stairs, no alcohol</li>
              <li>Hydrate aggressively: 3-4 litres water daily</li>
              <li>Consider Diamox (acetazolamide) — consult your doctor</li>
              <li>Don't attempt Khardung La / Pangong on day 2</li>
              <li>Descend immediately if severe AMS symptoms appear</li>
            </ul>
          </div>
          <div className="rounded-2xl glass p-6">
            <h3 className="font-display text-lg font-bold mb-3 text-accent">Permits & paperwork</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Inner Line Permit (ILP) required for Pangong, Nubra, Tso Moriri, Hanle</li>
              <li>Indian nationals: Aadhaar + photo + nominal fee (we handle this)</li>
              <li>Foreign nationals: Protected Area Permit (PAP) — we arrange group PAPs</li>
              <li>Carry 6+ passport photos &amp; ID copies for permits &amp; checkpoints</li>
              <li>Permit fees &amp; processing included in every Asgari Ladakh package</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <CTASection
          title="Ready for the land of high passes?"
          subtitle="Get a customised Ladakh itinerary within 24 hours — including permits, acclimatization days & expert guides."
          primaryHref="/packages?region=ladakh"
          primaryLabel="View Ladakh Packages"
          secondaryHref="/contact"
          secondaryLabel="Talk to a Ladakh Expert"
          phone={settings.phone_primary}
        />
      </section>
    </PublicLayout>
  )
}
