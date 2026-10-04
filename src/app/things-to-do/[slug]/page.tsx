import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Clock,
  Mountain,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Compass,
} from "lucide-react"
import { getActivityBySlug, getRelatedActivities } from "@/lib/queries"
import { getSettings } from "@/lib/settings"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { SectionHeading } from "@/components/site/SectionHeading"
import { CTASection } from "@/components/site/CTASection"
import { EnquiryForm } from "@/components/site/EnquiryForm"
import { Markdown } from "@/components/site/Markdown"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { destinationImage } from "@/lib/image-map"
import { ImageWithFallback } from "@/components/site/ImageWithFallback"
import { safeArray } from "@/lib/types"

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = await getActivityBySlug(slug)
  if (!a) return { title: "Activity not found" }
  return {
    title: a.metaTitle ?? `${a.title} — Kashmir & Ladakh Activity`,
    description: a.metaDescription ?? a.shortDescription,
    alternates: { canonical: `/things-to-do/${a.slug}` },
    openGraph: {
      title: a.metaTitle ?? a.title,
      description: a.metaDescription ?? a.shortDescription,
      type: "article",
    },
  }
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params
  const [a, settings, related] = await Promise.all([
    getActivityBySlug(slug),
    getSettings(),
    getRelatedActivities(slug, "", 3),
  ])
  if (!a) notFound()

  const images = safeArray(a.images)
  const heroImage = images[0] || (a.destination ? destinationImage(a.destination.slug) : null) || a.destination?.heroImage

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: a.title,
    description: a.shortDescription,
    image: heroImage,
    url: `https://asgaritravels.com/things-to-do/${a.slug}`,
    category: a.category,
    location: a.destination
      ? {
          "@type": "Place",
          name: a.destination.name,
          address: {
            "@type": "PostalAddress",
            addressRegion: a.destination.region,
            addressCountry: "IN",
          },
        }
      : undefined,
  }

  const difficultyColor =
    a.difficulty === "Advanced"
      ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
      : a.difficulty === "Moderate"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"

  const categoryColor =
    a.category === "adventure"
      ? "border-primary/40 bg-primary/10 text-primary"
      : a.category === "cultural"
      ? "border-accent/40 bg-accent/10 text-accent"
      : a.category === "nature"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      : "border-rose-400/40 bg-rose-400/10 text-rose-300"

  return (
    <PublicLayout settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="absolute inset-0 -z-10">
          {heroImage && (
            <ImageWithFallback
              src={heroImage}
              alt={a.title}
              className="h-full w-full object-cover opacity-40"
              eager
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Things To Do", href: "/things-to-do" },
              { label: a.title },
            ]}
          />
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={`${categoryColor} border`}>
                <Sparkles className="size-3" /> {a.category}
              </Badge>
              {a.difficulty && (
                <Badge className={`${difficultyColor} border`}>
                  <Mountain className="size-3" /> {a.difficulty}
                </Badge>
              )}
              {a.destination && (
                <Badge variant="outline" className="border-border/60">
                  <MapPin className="size-3" /> {a.destination.name}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {a.title}
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              {a.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: description */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Info chips */}
            <div className="flex flex-wrap gap-3">
              {a.duration && (
                <InfoChip icon={<Clock className="size-4" />} label="Duration">
                  {a.duration}
                </InfoChip>
              )}
              {a.difficulty && (
                <InfoChip icon={<Mountain className="size-4" />} label="Difficulty">
                  {a.difficulty}
                </InfoChip>
              )}
              {a.bestSeason && (
                <InfoChip icon={<Calendar className="size-4" />} label="Best Season">
                  {a.bestSeason}
                </InfoChip>
              )}
            </div>

            {/* Description */}
            <div className="rounded-2xl glass p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                About this experience
              </h2>
              <Markdown content={a.description} />
            </div>

            {/* Destination link */}
            {a.destination && (
              <div className="relative overflow-hidden rounded-2xl glass-strong p-6">
                <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary/15 blur-3xl" />
                <div className="relative z-10 flex items-center gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
                    <MapPin className="size-6" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Located in
                    </span>
                    <h3 className="font-display text-lg font-bold">
                      {a.destination.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {a.destination.tagline || a.destination.shortDescription}
                    </p>
                  </div>
                  <Button asChild size="sm" className="btn-glow ml-auto shrink-0">
                    <Link href={`/destinations/${a.destination.slug}`}>
                      Explore <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {/* Enquiry */}
            <div className="rounded-2xl glass-strong p-5">
              <h3 className="font-display text-lg font-bold mb-1">
                Book this experience
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add this to your custom itinerary — free quote in 24 hours.
              </p>
              <EnquiryForm
                destination={a.destination?.name}
                compact
              />
            </div>

            {/* Need help */}
            <div className="rounded-2xl glass p-5">
              <h4 className="font-semibold mb-2">Need help deciding?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Chat with our Himalayan expert on WhatsApp — instant replies, no bots.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full"
              >
                <a
                  href={settings.social_whatsapp ?? "https://wa.me/919419000123"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Compass className="size-4" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>

        {/* Related activities */}
        {related.length > 0 && (
          <div className="mt-16">
            <SectionHeading
              eyebrow="More Experiences"
              title={
                <>
                  Related <span className="gradient-text-saffron">things to do</span>
                </>
              }
              subtitle="More unforgettable experiences across Kashmir & Ladakh."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  href={`/things-to-do/${r.slug}`}
                  className="group lift relative overflow-hidden rounded-2xl glass"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <ImageWithFallback
                      src={r.destination ? destinationImage(r.destination.slug) : null}
                      alt={r.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <Badge className="absolute left-3 top-3 border-primary/40 bg-primary/10 text-primary border backdrop-blur-md">
                      {r.category}
                    </Badge>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h4 className="font-display text-lg font-bold text-white">
                        {r.title}
                      </h4>
                      <p className="text-xs text-white/70 line-clamp-1">
                        {r.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <span className="text-xs text-muted-foreground">
                      {r.duration || "Half day"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                      Explore <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 flex justify-center">
          <Button asChild variant="ghost">
            <Link href="/things-to-do">
              <ArrowLeft className="size-4" /> All things to do
            </Link>
          </Button>
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
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
      <span className="text-primary">{icon}</span>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-medium">{children}</span>
      </div>
    </div>
  )
}
