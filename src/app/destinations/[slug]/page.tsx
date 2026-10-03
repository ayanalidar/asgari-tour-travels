import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Mountain,
  MapPin,
  Compass,
  Camera,
  Route,
  ArrowRight,
  Star,
  Check,
} from "lucide-react"
import { getSettings } from "@/lib/settings"
import {
  getDestinationBySlug,
  getAllPackages,
  getAllDestinations,
} from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { DestinationImage } from "@/components/site/DestinationImage"
import { PackageCard } from "@/components/site/PackageCard"
import { CTASection } from "@/components/site/CTASection"
import { EnquiryForm } from "@/components/site/EnquiryForm"
import { GalleryLightbox } from "@/components/site/GalleryLightbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const d = await getDestinationBySlug(slug)
  if (!d) return { title: "Destination not found" }
  return {
    title: d.metaTitle ?? `${d.name} — Travel Guide & Things To Do`,
    description:
      d.metaDescription ?? d.shortDescription,
    keywords: d.metaKeywords?.split(",").map((k) => k.trim()),
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: {
      title: d.metaTitle ?? d.name,
      description: d.metaDescription ?? d.shortDescription,
      type: "article",
      images: d.heroImage ? [{ url: d.heroImage }] : undefined,
    },
  }
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params
  const [d, settings, allPackages, allDestinations] = await Promise.all([
    getDestinationBySlug(slug),
    getSettings(),
    getAllPackages(),
    getAllDestinations(),
  ])
  if (!d) notFound()

  const relatedPackages = allPackages
    .filter((p) => p.destinations.some((pd) => pd.destination.slug === d.slug))
    .slice(0, 3)

  const relatedDestinations = allDestinations
    .filter((x) => x.region === d.region && x.slug !== d.slug)
    .slice(0, 4)

  const thingsToDo = d.thingsToDo ?? []

  // Build gallery images: hero image + any stored images
  const galleryImages = [
    ...(d.heroImage ? [d.heroImage] : []),
    ...(d.images ?? []),
  ].filter(Boolean)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.shortDescription,
    image: d.heroImage,
    url: `https://asgaritravels.com/destinations/${d.slug}`,
    geo: d.latitude && d.longitude
      ? {
          "@type": "GeoCoordinates",
          latitude: d.latitude,
          longitude: d.longitude,
        }
      : undefined,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: d.region === "ladakh" ? "Ladakh" : d.region === "jammu" ? "Jammu" : "Kashmir",
    },
    aggregateRating: relatedPackages[0]
      ? {
          "@type": "AggregateRating",
          ratingValue: relatedPackages[0].rating,
          reviewCount: relatedPackages[0].reviewCount,
        }
      : undefined,
    keywords: d.metaKeywords,
  }

  return (
    <PublicLayout settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="absolute inset-0 -z-10">
          <DestinationImage
            slug={d.slug}
            name={d.name}
            alt={d.name}
            className="h-full w-full object-cover opacity-50"
            eager
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/destinations" },
                { label: d.name },
              ]}
            />

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-primary/40 bg-primary/15 text-primary">
                {d.region === "ladakh" ? "Ladakh" : d.region === "jammu" ? "Jammu" : "Kashmir"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {d.category}
              </Badge>
              {d.popular && (
                <Badge className="border-amber-400/40 bg-amber-500/15 text-amber-300">
                  <Star className="size-3 mr-1 fill-amber-400" /> Popular
                </Badge>
              )}
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text-saffron">{d.name}</span>
            </h1>
            {d.tagline && (
              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                {d.tagline}
              </p>
            )}

            {/* Quick info chips */}
            <div className="mt-2 flex flex-wrap gap-3">
              {d.bestTimeToVisit && (
                <InfoChip icon={<Calendar className="size-4" />} label="Best Time">
                  {d.bestTimeToVisit}
                </InfoChip>
              )}
              {d.duration && (
                <InfoChip icon={<Clock className="size-4" />} label="Ideal Duration">
                  {d.duration}
                </InfoChip>
              )}
              {d.altitude && (
                <InfoChip icon={<Mountain className="size-4" />} label="Altitude">
                  {d.altitude}
                </InfoChip>
              )}
              {d.distance && (
                <InfoChip icon={<Route className="size-4" />} label="Distance">
                  {d.distance}
                </InfoChip>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: description */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="rounded-2xl glass p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                About {d.name}
              </h2>
              <div className="text-base leading-relaxed text-foreground/85 whitespace-pre-line">
                {d.description}
              </div>
            </div>

            {/* Photo Gallery */}
            {galleryImages.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <Camera className="inline size-6 mr-2 text-primary" />
                  Photo Gallery
                </h2>
                <GalleryLightbox images={galleryImages} alt={d.name} />
              </div>
            )}

            {/* Things to do */}
            {thingsToDo.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  Things To Do
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {thingsToDo.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-background/40 p-3 text-sm"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent/15 text-accent">
                        <Check className="size-3.5" />
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* How to reach */}
            {d.howToReach && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <Compass className="inline size-6 mr-2 text-primary" />
                  How To Reach
                </h2>
                <p className="text-base leading-relaxed text-foreground/85 whitespace-pre-line">
                  {d.howToReach}
                </p>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl glass-strong p-5 sticky top-24">
              <h3 className="font-display text-lg font-bold mb-3">Plan Your Trip</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get a customised itinerary for {d.name} within 24 hours.
              </p>
              <EnquiryForm destination={d.name} compact />
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/packages">
                    Browse tours <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related packages */}
      {relatedPackages.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Camera className="size-3" /> Tours
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold">
                Packages covering <span className="gradient-text-saffron">{d.name}</span>
              </h2>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPackages.map((p, i) => (
              <PackageCard key={p.id} pkg={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Related destinations */}
      {relatedDestinations.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl font-bold">
              More in <span className="gradient-text-mix">{d.region}</span>
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href={`/destinations?region=${d.region}`}>
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedDestinations.map((rd, i) => (
              <Link
                key={rd.id}
                href={`/destinations/${rd.slug}`}
                className="group lift relative overflow-hidden rounded-xl glass p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                    <DestinationImage
                      slug={rd.slug}
                      name={rd.name}
                      alt={rd.name}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold truncate group-hover:text-primary transition-colors">
                      {rd.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {rd.tagline ?? rd.category}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <CTASection phone={settings.phone_primary} />
      </section>
    </PublicLayout>
  )
}

function InfoChip({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl glass px-4 py-2.5">
      <span className="text-primary">{icon}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground">{children}</span>
      </div>
    </div>
  )
}
