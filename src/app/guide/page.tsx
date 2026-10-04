import type { Metadata } from "next"
import Link from "next/link"
import { getSettings } from "@/lib/settings"
import { getAllDestinations } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { SectionHeading } from "@/components/site/SectionHeading"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Sun,
  Trees,
  Snowflake,
  Package,
  ShoppingCart,
  Gem,
  Sparkles,
  Camera,
  Utensils,
  MapPin,
  ArrowRight,
  Compass,
  Calendar,
  Mountain,
  BookOpen,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Kashmir & Ladakh Travel Guide - Complete Resource",
  description:
    "Complete travel guide for Kashmir & Ladakh: best time to visit by season, famous Kashmiri goods (saffron, pashmina, shawls, carpets), travel tips, destination guides & more.",
  keywords: [
    "Kashmir travel guide",
    "Ladakh travel guide",
    "Kashmir saffron",
    "pashmina shawl",
    "Kashmiri carpets",
    "best time to visit Kashmir",
    "Kashmir shopping",
    "Ladakh guide",
  ],
  alternates: { canonical: "/guide" },
}

export const dynamic = "force-dynamic"

// Famous Kashmir goods/products
const KASHMIR_GOODS = [
  {
    slug: "kashmir-saffron",
    name: "Kashmir Saffron (Kong)",
    emoji: "🌸",
    category: "Spice",
    fame: "World's most expensive spice",
    description: "Kashmir produces the finest saffron in the world, grown in Pampore. Three grades: Mongra (highest), Lachha, and Zarda. October-November is harvest season. Buy directly from Pampore farms for authentic Grade-A at source prices.",
    bestBuy: "Pampore, Srinagar markets",
    priceRange: "₹200-500/gram",
    tips: "Look for deep red stigmas with no yellow. Real saffron smells sweet & earthy. Avoid cheap imitations.",
  },
  {
    slug: "pashmina-shawl",
    name: "Pashmina Shawl",
    emoji: "🧣",
    category: "Textile",
    fame: "The 'soft gold' of Kashmir",
    description: "Genuine pashmina is woven from the undercoat of the Changthangi goat, found above 4,000m in Ladakh's Changthang plateau. A real pashmina shawl passes through a finger ring. Hand-embroidered Jamavar patterns are the most prized.",
    bestBuy: "Srinagar old city, certified emporiums",
    priceRange: "₹3,000-50,000",
    tips: "Genuine pashmina has a GI tag. Ask for certification. Machine-made 'pashmina' is often synthetic - check the ring test.",
  },
  {
    slug: "kashmir-carpet",
    name: "Kashmiri Hand-Knotted Carpet",
    emoji: "🧶",
    category: "Handicraft",
    fame: "Persian-style masterpieces",
    description: "Kashmir carpets are hand-knotted with silk or wool on cotton/silk foundations. A single carpet can take 6-18 months to make. Designs include Persian (Isfahan, Tabriz), Mughal, and contemporary. Knot count (kpsi) determines quality & price.",
    bestBuy: "Srinagar carpet workshops, emporiums",
    priceRange: "₹10,000-5,00,000",
    tips: "Count knots per square inch - 200+ is fine quality. Turn over to check the knot density. Buy from registered dealers only.",
  },
  {
    slug: "paper-mache",
    name: "Paper-Mache Crafts",
    emoji: "🎨",
    category: "Handicraft",
    fame: "500-year-old art form",
    description: "Paper-mache (papier-mache) arrived in Kashmir from Persia in the 15th century. Artisans turn paper pulp into boxes, vases, ornaments & Christmas decorations, then hand-paint them with intricate floral & geometric patterns. Each piece is unique.",
    bestBuy: "Srinagar old city workshops",
    priceRange: "₹200-10,000",
    tips: "Look for smooth finish and fine brushwork. Signed pieces by master artisans hold value.",
  },
  {
    slug: "walnut-wood",
    name: "Walnut Wood Carving",
    emoji: "🪵",
    category: "Handicraft",
    fame: "Intricate hand-carved furniture",
    description: "Kashmir is India's only walnut-wood carving region. Artisans create furniture, bowls, trays & decorative items with intricate floral & chinar-leaf patterns. The dark, fine-grained wood (Kashmir 'Doon') is prized for its beauty.",
    bestBuy: "Srinagar workshops",
    priceRange: "₹1,000-2,00,000",
    tips: "Check for fine, deep carving (not surface etching). Pure walnut darkens with age.",
  },
  {
    slug: "kashmir-willowow",
    name: "Kashmir Willow Bats",
    emoji: "🏏",
    category: "Sports",
    fame: "Used by international cricketers",
    description: "Kashmir willow cricket bats are famous worldwide, used by many international cricketers. Grown in Kashmir's valleys, these bats are lighter and more affordable than English willow, yet high-performing. Ideal for gifting to cricket lovers.",
    bestBuy: "Anantnag, Srinagar sports shops",
    priceRange: "₹1,500-15,000",
    tips: "Look for straight grains, good balance, and a knock-in ready surface.",
  },
  {
    slug: "kashmir-honey",
    name: "Acacia & Wildflower Honey",
    emoji: "🍯",
    category: "Food",
    fame: "Pure Himalayan honey",
    description: "Kashmir's high-altitude meadows produce pure, organic honey from wildflowers and acacia. Acacia honey is light and clear; wildflower honey is darker and richer. Collected by local beekeepers in Yusmarg, Sonmarg and Lolab.",
    bestBuy: "Srinagar markets, farm stalls",
    priceRange: "₹400-1,200/kg",
    tips: "Real honey crystallizes in winter. Liquid-clear honey year-round may be processed.",
  },
  {
    slug: "kashmiri-tea",
    name: "Kahwa & Noon Chai",
    emoji: "🍵",
    category: "Beverage",
    fame: "Traditional Kashmiri teas",
    description: "Kahwa is a saffron-green tea with almonds & cardamom, served welcomingly. Noon Chai (pink tea) is a salty, pink-colored tea made with baking soda & milk. Both are cultural icons - try them at a local khandar (tea stall).",
    bestBuy: "Srinagar old city, spice markets",
    priceRange: "₹200-800/kg",
    tips: "Buy kahwa leaves in sealed packets. Noon Chai requires special preparation - ask a local.",
  },
  {
    slug: "dry-fruits",
    name: "Walnuts, Almonds & Apricots",
    emoji: "🌰",
    category: "Food",
    fame: "Ladakh & Kashmir dry fruits",
    description: "Kashmir produces premium walnuts (Kaghan variety) and almonds. Ladakh's Nubra and Sham valleys are famous for sweet apricots. These are organic, sun-dried and packed with nutrients - perfect gifts and healthy snacks.",
    bestBuy: "Srinagar markets, Leh bazaar",
    priceRange: "₹400-1,500/kg",
    tips: "Check for uniform color and no mold. Apricots from Turtuk & Sham Valley are the sweetest.",
  },
  {
    slug: "kanger-fire-pot",
    name: "Kangri (Fire Pot)",
    emoji: "🔥",
    category: "Handicraft",
    fame: "Traditional winter warmer",
    description: "The kangri is a traditional earthen fire pot encased in woven willow wicker, carried under the pheran (cloak) to stay warm in winter. A unique Kashmiri cultural artifact - now also sold as decorative pieces and souvenirs.",
    bestBuy: "Srinagar old city markets",
    priceRange: "₹200-2,000",
    tips: "Decorative kangris make unique gifts. Do not use actual fire in souvenir versions.",
  },
]

// Seasonal guides
const SEASONS = [
  {
    id: "spring",
    name: "Spring",
    months: "March - May",
    emoji: "🌷",
    icon: <Leaf className="size-5" />,
    color: "text-emerald-400",
    accent: "from-emerald-500/20",
    description: "Tulip bloom, almond blossoms, green meadows. Pleasant 15-25°C. Best for gardens, houseboats & photography.",
    highlights: ["Asia's largest Tulip Garden (April)", "Almond & cherry blossoms", "Mughal Gardens in full bloom", "Pleasant weather for sightseeing"],
    bestFor: ["Srinagar", "Mughal Gardens", "Dal Lake", "Pahalgam", "Yusmarg"],
  },
  {
    id: "summer",
    name: "Summer",
    months: "June - August",
    emoji: "☀️",
    icon: <Sun className="size-5" />,
    color: "text-amber-400",
    accent: "from-amber-500/20",
    description: "Peak season. Meadows in full bloom, snow-fed rivers, all Ladakh passes open. 20-30°C in Kashmir, cooler at altitude.",
    highlights: ["Gulmarg gondola & meadows", "All Ladakh roads open", "Amarnath Yatra (July)", "Best for Pangong & Nubra"],
    bestFor: ["Gulmarg", "Sonmarg", "Leh", "Pangong Tso", "Nubra Valley", "Pahalgam"],
  },
  {
    id: "autumn",
    name: "Autumn",
    months: "September - November",
    emoji: "🍂",
    icon: <Trees className="size-5" />,
    color: "text-orange-400",
    accent: "from-orange-500/20",
    description: "Chinar trees turn crimson & gold. Saffron harvest in Pampore. Romantic, crowd-free, and cool. 10-20°C.",
    highlights: ["Chinar trees turn gold & red", "Saffron harvest (Oct-Nov)", "Crowd-free & cheaper", "Best photography light"],
    bestFor: ["Srinagar", "Mughal Gardens", "Pampore", "Pahalgam", "Dal Lake"],
  },
  {
    id: "winter",
    name: "Winter",
    months: "December - February",
    emoji: "❄️",
    icon: <Snowflake className="size-5" />,
    color: "text-sky-300",
    accent: "from-sky-500/20",
    description: "Snow-globe Kashmir. Gulmarg powder skiing, frozen Dal Lake, houseboat kangri warmth. -5 to 10°C. Ladakh roads closed.",
    highlights: ["Gulmarg powder skiing (14m snow!)", "Frozen Dal Lake edges", "Houseboat with kangri warmth", "Gulmarg Snow Festival"],
    bestFor: ["Gulmarg", "Srinagar (snow)", "Houseboat stays", "Skiing & snowboarding"],
  },
]

// Travel tips
const TRAVEL_TIPS = [
  { icon: <Calendar className="size-5" />, title: "Best Time to Visit", text: "Spring (Mar-May) & Autumn (Sep-Nov) are ideal. Summer for Ladakh. Winter for Gulmarg skiing." },
  { icon: <Mountain className="size-5" />, title: "Altitude Safety", text: "Acclimatize in Leh 2 nights before high passes. Carry Diamox, drink 4L water, avoid alcohol first 48h." },
  { icon: <MapPin className="size-5" />, title: "Permits", text: "Inner Line Permit needed for Pangong, Nubra, Tso Moriri in Ladakh. We arrange all permits." },
  { icon: <ShoppingCart className="size-5" />, title: "Bargaining", text: "Bargain in local markets (Lal Chowk) but not in government emporiums where prices are fixed." },
  { icon: <Utensils className="size-5" />, title: "Food", text: "Try Wazwan feast, Kahwa tea. Vegetarian options widely available. Tell us dietary needs." },
  { icon: <Camera className="size-5" />, title: "Photography", text: "Ask before photographing people or inside shrines. Pangong sunrise & Hanle night sky are must-shoots." },
]

export default async function GuidePage() {
  const [settings, destinations] = await Promise.all([
    getSettings(),
    getAllDestinations(),
  ])

  const kashmirDests = destinations.filter((d) => d.region === "kashmir")
  const ladakhDests = destinations.filter((d) => d.region === "ladakh")

  return (
    <PublicLayout settings={settings}>
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
        <div className="absolute inset-0 -z-10 aurora-animated opacity-70" />
        <div className="absolute inset-0 -z-10 grid-overlay opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <BookOpen className="size-3.5" /> Complete Travel Guide
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Kashmir & Ladakh
              <br />
              <span className="gradient-text-saffron glow-saffron">Travel Guide</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Everything you need to plan the perfect Himalayan journey - seasons, famous Kashmiri goods,
              travel tips, destination guides & more. Curated by 15+ years of local expertise.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guide" },
          ]}
        />

        {/* Seasons Guide */}
        <section className="mt-10">
          <SectionHeading
            eyebrow="When to Visit"
            title={<>Travel by <span className="gradient-text-saffron">Season</span></>}
            subtitle="Kashmir & Ladakh transform dramatically across four distinct seasons. Each offers unique experiences."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SEASONS.map((s, i) => (
              <div
                key={s.id}
                className="group relative overflow-hidden rounded-2xl glass p-5 lift"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br ${s.accent} to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-100`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className={`grid size-10 place-items-center rounded-xl bg-background/60 ring-1 ring-border/40 ${s.color}`}>
                      {s.icon}
                    </span>
                    <span className="text-3xl">{s.emoji}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold">{s.name}</h3>
                  <p className={`text-xs font-medium ${s.color}`}>{s.months}</p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  <ul className="mt-3 space-y-1">
                    {s.highlights.slice(0, 3).map((h, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <span className={`mt-0.5 ${s.color}`}>•</span> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {s.bestFor.slice(0, 3).map((d) => (
                      <Badge key={d} variant="outline" className="text-[9px] py-0">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Famous Kashmir Goods */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Shop Like a Local"
            title={<>Famous <span className="gradient-text-mix">Kashmiri Goods</span></>}
            subtitle="World-renowned products from Kashmir - what to buy, where, and how to spot the real thing."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {KASHMIR_GOODS.map((g, i) => (
              <div
                key={g.slug}
                className="group relative overflow-hidden rounded-2xl glass p-5 lift"
              >
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{g.emoji}</span>
                    <Badge variant="outline" className="text-[9px]">{g.category}</Badge>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold leading-tight">{g.name}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{g.fame}</p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-4">{g.description}</p>
                  <div className="mt-3 space-y-1 border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <MapPin className="size-3 text-primary" />
                      <span className="text-muted-foreground">{g.bestBuy}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Gem className="size-3 text-accent" />
                      <span className="text-muted-foreground">{g.priceRange}</span>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg bg-primary/5 p-2 text-[10px] text-muted-foreground">
                    <Sparkles className="inline size-3 mr-1 text-primary" />
                    {g.tips}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Expert Tips"
            title={<>Travel <span className="gradient-text-saffron">Tips</span></>}
            subtitle="Practical advice from 15+ years of operating in the Himalayas."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRAVEL_TIPS.map((t, i) => (
              <div key={i} className="flex gap-3 rounded-2xl glass p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                  {t.icon}
                </span>
                <div>
                  <h4 className="text-sm font-bold">{t.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Destinations Index */}
        <section className="mt-16">
          <SectionHeading
            eyebrow="Destinations"
            title={<>All <span className="gradient-text-mix">Destinations</span></>}
            subtitle="Complete index of all destinations we cover across Kashmir & Ladakh."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Kashmir */}
            <div className="rounded-2xl glass p-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                Kashmir ({kashmirDests.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {kashmirDests.map((d) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.slug}`}
                    className="group flex items-center gap-2 rounded-lg border border-border/40 bg-background/30 px-3 py-2 text-xs transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Compass className="size-3 text-primary shrink-0" />
                    <span className="truncate font-medium group-hover:text-primary">{d.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            {/* Ladakh */}
            <div className="rounded-2xl glass p-6">
              <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <Mountain className="size-5 text-accent" />
                Ladakh ({ladakhDests.length})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ladakhDests.map((d) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.slug}`}
                    className="group flex items-center gap-2 rounded-lg border border-border/40 bg-background/30 px-3 py-2 text-xs transition-all hover:border-accent/40 hover:bg-accent/5"
                  >
                    <Mountain className="size-3 text-accent shrink-0" />
                    <span className="truncate font-medium group-hover:text-accent">{d.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 text-center">
          <div className="rounded-3xl glass-strong p-8 sm:p-12">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to plan your <span className="gradient-text-saffron">journey?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Browse our curated tour packages or let us craft a custom itinerary for you in 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="btn-glow">
                <Link href="/packages">
                  <Package className="size-4" /> Browse Packages
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/plan-your-trip">
                  <Compass className="size-4" /> Plan My Trip
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
