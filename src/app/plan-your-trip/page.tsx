import type { Metadata } from "next"
import { getAllDestinations } from "@/lib/queries"
import { getSettings } from "@/lib/settings"
import { PublicLayout } from "@/components/site/PublicLayout"
import { SectionHeading } from "@/components/site/SectionHeading"
import { BudgetCalculator } from "@/components/site/BudgetCalculator"
import { TripWizard } from "@/components/site/TripWizard"
import { CTASection } from "@/components/site/CTASection"
import { Wallet, Sparkles, ShieldCheck, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Plan Your Custom Trip - Kashmir & Ladakh Itinerary Builder",
  description:
    "Build your perfect Kashmir or Ladakh trip. Use our budget calculator and 4-step trip wizard to get a custom itinerary in 24 hours. No upfront payment.",
  keywords: [
    "plan Kashmir trip",
    "Ladakh itinerary builder",
    "custom Kashmir tour",
    "Kashmir trip calculator",
    "Himalayan trip planner",
  ],
  openGraph: {
    title: "Plan Your Custom Kashmir & Ladakh Trip",
    description:
      "Build a custom itinerary with our budget calculator and trip wizard. Get a personalised quote in 24 hours.",
  },
}

export const dynamic = "force-dynamic"

export default async function PlanYourTripPage() {
  const [settings, destinations] = await Promise.all([
    getSettings(),
    getAllDestinations(),
  ])

  const destData = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    region: d.region,
  }))

  return (
    <PublicLayout settings={settings}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="absolute inset-0 -z-10 aurora-animated opacity-70" />
        <div className="absolute inset-0 -z-10 grid-overlay opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> Custom Trip Planner
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build your{" "}
              <span className="gradient-text-saffron glow-saffron">dream Himalayan</span> journey
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Pick destinations, dates & budget - our concierge crafts a fully customised itinerary
              in 24 hours. No templates, no upfront payment.
            </p>
          </div>
        </div>
      </section>

      {/* Quick stats band */}
      <section className="border-y border-border/40 bg-background/40 py-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: <Clock className="size-4" />, label: "24-hour turnaround", value: "Fast" },
              { icon: <Wallet className="size-4" />, label: "No upfront payment", value: "Free" },
              { icon: <ShieldCheck className="size-4" />, label: "Govt-registered", value: "Trusted" },
              { icon: <Sparkles className="size-4" />, label: "100% custom", value: "Bespoke" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  {s.icon}
                </span>
                <div>
                  <span className="block text-sm font-bold text-foreground">{s.value}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Calculator */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Budget Estimator"
            title={
              <>
                Know your <span className="gradient-text-saffron">rough cost</span> instantly
              </>
            }
            subtitle="Slide to estimate per-person and total cost. Get a precise quote after consultation."
          />
          <div className="mt-10">
            <BudgetCalculator />
          </div>
        </div>
      </section>

      {/* Trip Wizard */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Trip Wizard"
            title={
              <>
                Build a <span className="gradient-text-mix">custom itinerary</span> in 4 steps
              </>
            }
            subtitle="Tell us where, when, who & how - we handle the rest."
          />
          <div className="mt-10">
            <TripWizard destinations={destData} />
          </div>
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
