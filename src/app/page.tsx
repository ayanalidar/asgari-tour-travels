import { getSettings } from "@/lib/settings"
import {
  getFeaturedDestinations,
  getFeaturedPackages,
  getPopularPackages,
  getFeaturedTestimonials,
  getAllBlogPosts,
} from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Hero } from "@/components/site/Hero"
import { SectionHeading } from "@/components/site/SectionHeading"
import { DestinationCard } from "@/components/site/DestinationCard"
import { PackageCard } from "@/components/site/PackageCard"
import { BlogCard } from "@/components/site/BlogCard"
import { TestimonialCard } from "@/components/site/TestimonialCard"
import { CTASection } from "@/components/site/CTASection"
import { StatsCounter } from "@/components/site/StatsCounter"
import { RatingBadge } from "@/components/site/RatingBadge"
import { RatingBadgesRow } from "@/components/site/RatingBadgesRow"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Award,
  Headset,
  Wallet,
  MapPinned,
  Sparkles,
  ArrowRight,
  Compass,
  Plane,
  Mountain,
  Snowflake,
  Palmtree,
  Camera,
  Star,
} from "lucide-react"
import Link from "next/link"

export const revalidate = 600

export default async function HomePage() {
  const [settings, destinations, popular, featuredPackages, testimonials, posts] =
    await Promise.all([
      getSettings(),
      getFeaturedDestinations(8),
      getPopularPackages(4),
      getFeaturedPackages(6),
      getFeaturedTestimonials(6),
      getAllBlogPosts(),
    ])

  const heroStats = {
    travelers: settings.stats_travelers ?? 15000,
    packages: settings.stats_packages ?? 50,
    years: settings.stats_years ?? 15,
    destinations: settings.stats_destinations ?? 40,
  }
  const rating = settings.google_rating ?? 4.9
  const reviewCount = settings.google_review_count ?? 347
  const blogTeaser = posts.slice(0, 3)

  return (
    <PublicLayout settings={settings}>
      {/* JSON-LD: Organization / TravelAgency */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: settings.brand_name ?? "Asgari Tour & Travels",
            description: settings.brand_description ?? "",
            telephone: settings.phone_primary,
            email: settings.email_primary,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
              addressCountry: "IN",
            },
            url: "https://asgaritravels.com",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: rating,
              reviewCount,
              bestRating: 5,
            },
            sameAs: [
              settings.social_facebook,
              settings.social_instagram,
              settings.social_youtube,
            ].filter(Boolean),
          }),
        }}
      />

      <Hero stats={heroStats} rating={rating} reviewCount={reviewCount} />

      {/* Trust badges / awards */}
      <RatingBadgesRow rating={rating} reviewCount={reviewCount} />

      {/* Featured destinations */}
      <Section id="destinations" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Explore Destinations"
          title={
            <>
              <span className="gradient-text-saffron">Handpicked</span> destinations
            </>
          }
          subtitle="From the floating gardens of Dal Lake to the highest motorable road on Earth — discover the crown jewels of Kashmir & Ladakh."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.slice(0, 8).map((d, i) => (
            <DestinationCard key={d.id} destination={d} index={i} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/destinations">
              View all destinations <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Popular packages */}
      <Section id="packages" className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent">
        <SectionHeading
          eyebrow="Tour Packages"
          title={
            <>
              Most <span className="gradient-text-mix">loved journeys</span>
            </>
          }
          subtitle="Curated, all-inclusive tour packages crafted with deep local expertise — covering stays, transfers, permits, guides & 24/7 support."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popular.slice(0, 4).map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="btn-glow">
            <Link href="/packages">
              Browse all packages <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Why choose us */}
      <WhyChooseSection />

      {/* Featured packages full grid */}
      <Section id="featured-packages" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Featured Tours"
          title={
            <>
              Curated <span className="gradient-text-saffron">escapes</span> for every traveller
            </>
          }
          subtitle="Honeymooners, adventurers, families, pilgrims — we have a perfect itinerary for everyone."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPackages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
      </Section>

      {/* Experience strip */}
      <ExperienceStrip />

      {/* Testimonials */}
      <Section id="testimonials" className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-accent/[0.04] to-transparent">
        <SectionHeading
          eyebrow="Traveller Stories"
          title={
            <>
              Loved by <span className="gradient-text-mix">15,000+</span> travellers
            </>
          }
          subtitle="Real reviews from real travellers who trusted Asgari Tour & Travels with their Himalayan journey."
        />
        <div className="mt-8 flex justify-center">
          <RatingBadge rating={rating} reviewCount={reviewCount} />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </Section>

      {/* Blog teaser */}
      <Section id="blog" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="Travel Journal"
          title={
            <>
              Stories, tips & <span className="gradient-text-saffron">inspiration</span>
            </>
          }
          subtitle="Expert travel guides, itineraries and stories from the heart of the Himalayas."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogTeaser.map((p, i) => (
            <BlogCard key={p.id} post={p} index={i} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">
              Read the journal <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 sm:py-24">
        <CTASection phone={settings.phone_primary} />
      </Section>
    </PublicLayout>
  )
}

function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={className}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  )
}

function WhyChooseSection() {
  const features = [
    {
      icon: <ShieldCheck className="size-6" />,
      title: "Trusted & Reliable",
      desc: "15+ years of safe, transparent operations. Government-registered, fully insured tours.",
      glow: "from-amber-500/20",
    },
    {
      icon: <MapPinned className="size-6" />,
      title: "Local Experts",
      desc: "Born-and-raised Kashmiri & Ladakhi guides who know every shortcut, story & secret.",
      glow: "from-emerald-500/20",
    },
    {
      icon: <Wallet className="size-6" />,
      title: "Best Price Promise",
      desc: "No middlemen, no hidden charges. Direct operator pricing with price-match guarantee.",
      glow: "from-rose-500/20",
    },
    {
      icon: <Headset className="size-6" />,
      title: "24/7 On-Trip Support",
      desc: "Dedicated WhatsApp support throughout your journey — we're one message away, always.",
      glow: "from-amber-500/20",
    },
    {
      icon: <Award className="size-6" />,
      title: "Award-Winning",
      desc: "IATA-certified, 4.9★ on Google from 347+ travellers. Recognised by J&K Tourism Dept.",
      glow: "from-emerald-500/20",
    },
    {
      icon: <Sparkles className="size-6" />,
      title: "Custom Itineraries",
      desc: "Every trip is crafted around you — your pace, your interests, your budget. Tailor-made.",
      glow: "from-rose-500/20",
    },
  ]
  return (
    <Section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-overlay opacity-20 pointer-events-none" />
      <SectionHeading
        eyebrow="Why Asgari"
        title={
          <>
            The Asgari <span className="gradient-text-mix">difference</span>
          </>
        }
        subtitle="We're not just a travel agency — we're your Himalayan concierge, crafting journeys that linger in memory long after you return home."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} index={i} />
        ))}
      </div>
    </Section>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
  glow,
  index,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  glow: string
  index: number
}) {
  return (
    <div
      className="lift group relative overflow-hidden rounded-2xl glass p-6"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br ${glow} to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-100`}
      />
      <div className="relative z-10 flex flex-col gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          {icon}
        </span>
        <h3 className="font-display text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ExperienceStrip() {
  const items = [
    { icon: <Plane className="size-5" />, label: "Houseboat Stays" },
    { icon: <Mountain className="size-5" />, label: "High Altitude Passes" },
    { icon: <Snowflake className="size-5" />, label: "Gulmarg Powder Skiing" },
    { icon: <Palmtree className="size-5" />, label: "Mughal Gardens" },
    { icon: <Camera className="size-5" />, label: "Pangong Photography" },
    { icon: <Compass className="size-5" />, label: "Monasteries & Culture" },
    { icon: <Star className="size-5" />, label: "Honeymoon Escapes" },
  ]
  return (
    <section className="border-y border-border/60 bg-background/40 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal-mask overflow-hidden">
          <ul className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {items.map((it, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <span className="text-primary">{it.icon}</span>
                {it.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
