import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldCheck,
  Award,
  Users,
  Globe2,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  Mountain,
  Compass,
} from "lucide-react"
import { getSettings } from "@/lib/settings"
import { getApprovedTestimonials } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { SectionHeading } from "@/components/site/SectionHeading"
import { StatsCounter } from "@/components/site/StatsCounter"
import { TestimonialCard } from "@/components/site/TestimonialCard"
import { CTASection } from "@/components/site/CTASection"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "About Us - Asgari Tour & Travels",
  description:
    "Asgari Tour & Travels is a Srinagar-based boutique travel company specialising in curated luxury tours across Kashmir and Ladakh. 15+ years of local expertise.",
  alternates: { canonical: "/about" },
}

export default async function AboutPage() {
  const [settings, testimonials] = await Promise.all([
    getSettings(),
    getApprovedTestimonials(3),
  ])

  const stats = {
    travelers: settings.stats_travelers ?? 15000,
    packages: settings.stats_packages ?? 50,
    years: settings.stats_years ?? 15,
    destinations: settings.stats_destinations ?? 40,
  }

  const values = [
    {
      icon: <Heart className="size-5" />,
      title: "Local-first",
      desc: "Born in Srinagar. Every guide, driver, hotelier & partner is a local we know personally.",
    },
    {
      icon: <ShieldCheck className="size-5" />,
      title: "Trust",
      desc: "Government-registered, IATA-certified, fully insured tours. Transparent pricing, no hidden charges.",
    },
    {
      icon: <Sparkles className="size-5" />,
      title: "Craftsmanship",
      desc: "Every itinerary is hand-crafted around you. No two Asgari trips are alike.",
    },
    {
      icon: <Compass className="size-5" />,
      title: "Stewardship",
      desc: "We give back to the mountains - employing locals, supporting eco-stays, leaving no trace.",
    },
  ]

  const team = [
    { name: "Imtiaz Asgari", role: "Founder & Lead Guide", bio: "Born in Srinagar. 20+ years guiding trekkers across Kashmir & Ladakh. Speaks Kashmiri, Urdu, Hindi, English." },
    { name: "Tashi Norboo", role: "Ladakh Operations Head", bio: "Leh-born. Expert on monasteries, high-altitude logistics & Inner Line Permits. Mountaineer." },
    { name: "Priya Kaul", role: "Head of Itineraries", bio: "Srinagar-based travel designer. Crafts each bespoke itinerary with a hospitality-first lens." },
    { name: "Riyaz Ahmad", role: "Senior Driver & Logistics", bio: "15 years driving the Srinagar-Leh highway. Knows every tea stall, viewpoint & shortcut." },
  ]

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="About Asgari"
        title={
          <>
            We are <span className="gradient-text-saffron">Himalayan storytellers</span>
          </>
        }
        subtitle={
          settings.brand_description ??
          "Asgari Tour & Travels is a Srinagar-based boutique travel company specialising in curated luxury tours across Kashmir and Ladakh. With 15+ years of local expertise, we craft authentic, hassle-free Himalayan journeys."
        }
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />

        {/* Story */}
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Story
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">
              From a Srinagar houseboat to <span className="gradient-text-mix">15,000+ travellers</span>
            </h2>
            <div className="mt-4 space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Asgari Tour & Travels began in 2009 with a single houseboat on Dal Lake and a
                simple belief: that the truest way to experience Kashmir & Ladakh is through
                the people who call these mountains home.
              </p>
              <p>
                Fifteen years on, we've grown into a 30-person team of Srinagar and Leh-based
                travel designers, drivers, guides, and hospitality partners - but the spirit
                hasn't changed. Every itinerary is still hand-crafted around the traveller, and
                every guest is still welcomed like family.
              </p>
              <p>
                We've guided over 15,000 travellers across the Pir Panjal, Zanskar and Karakoram
                ranges - and earned a 4.9★ rating on Google for keeping our promises: fair
                prices, honest advice, and journeys that linger in memory long after the trip
                ends.
              </p>
            </div>
          </div>

          {/* Stats card */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard value={<StatsCounter value={stats.travelers} suffix="+" />} label="Happy travellers" />
            <StatCard value={<StatsCounter value={stats.years} suffix=" yrs" />} label="Local expertise" />
            <StatCard value={<StatsCounter value={stats.destinations} suffix="+" />} label="Destinations covered" />
            <StatCard value={<StatsCounter value={stats.packages} suffix="+" />} label="Curated packages" />
          </div>
        </div>

        {/* Mission */}
        <div className="mt-20 rounded-3xl glass-strong p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 aurora-animated opacity-50 pointer-events-none" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-primary">
                <Target className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Our Mission
                </span>
              </span>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-snug">
                To open the Himalayas to travellers in a way that{" "}
                <span className="gradient-text-saffron">respects</span> the land, the culture,
                and the people who call it home.
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <div key={i} className="rounded-2xl bg-background/40 p-4 backdrop-blur-md">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 mb-2">
                    {v.icon}
                  </span>
                  <h4 className="font-display text-sm font-bold mb-1">{v.title}</h4>
                  <p className="text-xs text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <SectionHeading
            eyebrow="Certifications & Memberships"
            title={
              <>
                <span className="gradient-text-mix">Recognised</span> by the best
              </>
            }
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "IATA", desc: "International Air Transport Association" },
              { name: "TAAI", desc: "Travel Agents Association of India" },
              { name: "ADTOI", desc: "Association of Domestic Tour Operators" },
              { name: "J&K Tourism", desc: "Registered with J&K Tourism Dept." },
            ].map((c) => (
              <div key={c.name} className="rounded-2xl glass p-5 text-center">
                <Award className="mx-auto size-8 text-primary mb-2" />
                <h4 className="font-display text-base font-bold">{c.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="The Team"
            title={
              <>
                <span className="gradient-text-saffron">Local experts</span> who know these mountains
              </>
            }
            subtitle="Our team is our family. Every one of them is from Kashmir or Ladakh - and every one of them is personally invested in your journey."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <div
                key={i}
                className="lift rounded-2xl glass p-5 text-center"
              >
                <div className="mx-auto grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 mb-3">
                  <span className="font-display text-2xl font-bold text-primary">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold">{m.name}</h4>
                <p className="text-xs uppercase tracking-wider text-primary mb-2">{m.role}</p>
                <p className="text-xs text-muted-foreground">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="mt-20">
            <SectionHeading
              eyebrow="Traveller Love"
              title={
                <>
                  Don't just take <span className="gradient-text-mix">our word</span> for it
                </>
              }
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.id} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16">
          <CTASection
            title="Let's plan your Himalayan story"
            subtitle="Whether it's a honeymoon on Dal Lake or a Khardung La expedition, we'd love to craft it with you."
            phone={settings.phone_primary}
          />
        </div>
      </div>
    </PublicLayout>
  )
}

function StatCard({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl glass p-6 text-center">
      <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
