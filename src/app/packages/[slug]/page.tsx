import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Clock,
  Mountain,
  Users,
  Star,
  Check,
  X,
  Calendar,
  MapPin,
  Route,
  Tag,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { getSettings } from "@/lib/settings"
import { getPackageBySlug, getApprovedTestimonials } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { ImageWithFallback } from "@/components/site/ImageWithFallback"
import { DestinationImage } from "@/components/site/DestinationImage"
import { CouponInput } from "@/components/site/CouponInput"
import { EnquiryForm } from "@/components/site/EnquiryForm"
import { CTASection } from "@/components/site/CTASection"
import { TestimonialCard } from "@/components/site/TestimonialCard"
import { BookingButton } from "@/components/site/BookingButton"
import { QuickQuoteWidget } from "@/components/site/QuickQuoteWidget"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { formatPrice, type TourPackageT } from "@/lib/types"
import { packageImage } from "@/lib/image-map"

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getPackageBySlug(slug)
  if (!p) return { title: "Package not found" }
  return {
    title: p.metaTitle ?? `${p.title} — Tour Package`,
    description: p.metaDescription ?? p.shortDescription,
    alternates: { canonical: `/packages/${p.slug}` },
    openGraph: {
      title: p.metaTitle ?? p.title,
      description: p.metaDescription ?? p.shortDescription,
      type: "article",
      images: p.coverImage ? [{ url: p.coverImage }] : undefined,
    },
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const [p, settings, testimonials] = await Promise.all([
    getPackageBySlug(slug),
    getSettings(),
    getApprovedTestimonials(3),
  ])
  if (!p) notFound()

  const basePrice = p.discountPrice ?? p.price
  const hasDiscount = p.discountPrice != null && p.discountPrice < p.price
  const savings = hasDiscount ? p.price - (p.discountPrice as number) : 0
  const heroImage = p.coverImage ?? packageImage(p.slug) ?? p.images?.[0] ?? null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: p.title,
    description: p.shortDescription,
    image: heroImage,
    url: `https://asgaritravels.com/packages/${p.slug}`,
    offers: {
      "@type": "Offer",
      price: basePrice,
      priceCurrency: p.currency,
      availability: "https://schema.org/InStock",
    },
    itinerary: p.itinerary.map((d: any) => ({
      "@type": "ItemList",
      name: `Day ${d.day}: ${d.title}`,
      description: d.description,
    })),
    provider: {
      "@type": "TravelAgency",
      name: settings.brand_name ?? "Asgari Tour & Travels",
      telephone: settings.phone_primary,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
    },
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
          <ImageWithFallback
            src={heroImage}
            alt={p.title}
            className="h-full w-full object-cover opacity-50"
            eager
            fallbackLabel={p.title}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Packages", href: "/packages" },
              { label: p.title },
            ]}
          />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {p.popular && (
              <Badge className="border-primary/40 bg-primary/15 text-primary">
                <Sparkles className="size-3 mr-1" /> Popular
              </Badge>
            )}
            {hasDiscount && (
              <Badge className="border-rose-400/50 bg-rose-500/15 text-rose-300">
                <Tag className="size-3 mr-1" /> Save {formatPrice(savings)}
              </Badge>
            )}
            {p.difficulty && (
              <Badge variant="outline" className="capitalize">
                {p.difficulty}
              </Badge>
            )}
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl max-w-4xl">
            {p.title}
          </h1>
          {p.subtitle && (
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              {p.subtitle}
            </p>
          )}

          {/* Quick stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            <InfoChip icon={<Clock className="size-4" />} label="Duration">
              {p.durationNights}N / {p.durationDays}D
            </InfoChip>
            <InfoChip icon={<Star className="size-4" />} label="Rating">
              {p.rating.toFixed(1)} ({p.reviewCount})
            </InfoChip>
            {p.groupSize && (
              <InfoChip icon={<Users className="size-4" />} label="Group Size">
                {p.groupSize} pax
              </InfoChip>
            )}
            {p.difficulty && (
              <InfoChip icon={<Mountain className="size-4" />} label="Difficulty">
                {p.difficulty}
              </InfoChip>
            )}
          </div>

          {/* Price + CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl glass-strong p-5 max-w-3xl">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                From
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-primary">
                  {formatPrice(basePrice, p.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(p.price, p.currency)}
                  </span>
                )}
              </div>
              {p.groupSize && (
                <span className="text-xs text-muted-foreground">
                  per person · {p.groupSize} pax
                </span>
              )}
            </div>
            <div className="ml-auto flex flex-col gap-2">
              <BookingButton
                pkg={{
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  price: p.price,
                  discountPrice: p.discountPrice,
                  durationDays: p.durationDays,
                  durationNights: p.durationNights,
                  currency: p.currency,
                }}
                size="lg"
                fullWidth
              />
              <span className="text-xs text-center text-muted-foreground">
                Free cancellation up to 15 days
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left: details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Overview */}
            <div className="rounded-2xl glass p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                Overview
              </h2>
              <p className="text-base leading-relaxed text-foreground/85 whitespace-pre-line">
                {p.description}
              </p>
            </div>

            {/* Highlights */}
            {p.highlights?.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <Sparkles className="inline size-6 mr-2 text-primary" />
                  Highlights
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {p.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-background/40 p-3 text-sm"
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {p.itinerary?.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <Calendar className="inline size-6 mr-2 text-primary" />
                  Day-by-day itinerary
                </h2>
                <Accordion type="single" collapsible defaultValue="day-1" className="flex flex-col gap-2">
                  {p.itinerary.map((d: any, i: number) => (
                    <AccordionItem
                      key={i}
                      value={`day-${d.day}`}
                      className="rounded-xl border border-border/60 bg-background/30 px-4 data-[state=open]:bg-background/60"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 font-display font-bold text-primary">
                            {d.day}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {d.title}
                            </span>
                            {(d.meals || d.stay) && (
                              <span className="text-xs text-muted-foreground">
                                {d.meals && `🍽 ${d.meals}`}
                                {d.meals && d.stay && " · "}
                                {d.stay && `🛏 ${d.stay}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {d.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid gap-5 md:grid-cols-2">
              {p.inclusions?.length > 0 && (
                <div className="rounded-2xl glass p-6">
                  <h3 className="font-display text-lg font-bold mb-3 text-accent">
                    <Check className="inline size-5 mr-2" />
                    Inclusions
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {p.inclusions.map((x, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {p.exclusions?.length > 0 && (
                <div className="rounded-2xl glass p-6">
                  <h3 className="font-display text-lg font-bold mb-3 text-destructive">
                    <X className="inline size-5 mr-2" />
                    Exclusions
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {p.exclusions.map((x, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Destinations covered */}
            {p.destinations?.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <MapPin className="inline size-6 mr-2 text-primary" />
                  Destinations covered
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {p.destinations.map((pd) => (
                    <Link
                      key={pd.destination.id}
                      href={`/destinations/${pd.destination.slug}`}
                      className="group lift overflow-hidden rounded-xl glass"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <DestinationImage
                          slug={pd.destination.slug}
                          name={pd.destination.name}
                          alt={pd.destination.name}
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <span className="font-display text-sm font-bold text-white">
                            {pd.destination.name}
                          </span>
                          <span className="block text-[10px] uppercase tracking-wider text-white/70">
                            Day {pd.order + 1}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="rounded-2xl glass p-6 sm:p-8">
                <h2 className="font-display text-2xl font-bold mb-4 heading-underline">
                  <Star className="inline size-6 mr-2 text-amber-400" />
                  What travellers say
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {testimonials.map((t, i) => (
                    <TestimonialCard key={t.id} testimonial={t} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {/* Coupon */}
            <CouponInput packageId={p.id} basePrice={basePrice} />

            {/* Enquiry */}
            <div id="enquiry" className="rounded-2xl glass-strong p-5">
              <h3 className="font-display text-lg font-bold mb-1">
                Plan this trip
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customise {p.title} — get a free quote in 24 hours.
              </p>
              <EnquiryForm packageId={p.id} packageName={p.title} compact />
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
                  href={
                    settings.social_whatsapp ?? "https://wa.me/919419000123"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <CTASection phone={settings.phone_primary} whatsapp={settings.social_whatsapp} />
      </section>

      <QuickQuoteWidget
        context={p.title}
        phone={settings.phone_primary}
        whatsapp={settings.social_whatsapp}
      />
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
