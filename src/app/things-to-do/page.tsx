import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSettings } from "@/lib/settings"
import { getAllActivities, getAllDestinations } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { SectionHeading } from "@/components/site/SectionHeading"
import { CTASection } from "@/components/site/CTASection"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ActivityGrid } from "@/components/site/ActivityGrid"
import { safeArray } from "@/lib/types"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Things To Do - Kashmir & Ladakh Activities & Experiences",
  description:
    "Skiing in Gulmarg, shikara rides on Dal Lake, trekking in Ladakh, monastery tours, gondola rides & more. Discover the best activities in Kashmir & Ladakh.",
  alternates: { canonical: "/things-to-do" },
}

// Curated fallback activities if the database is empty
const FALLBACK_ACTIVITIES = [
  {
    slug: "gondola-ride-gulmarg",
    title: "Gulmarg Gondola Ride",
    category: "adventure",
    shortDescription:
      "Ride the world's highest cable car to 4,000m Apharwat Peak for jaw-dropping Himalayan views & snow play.",
    description:
      "The Gulmarg Gondola is one of the world's highest cable cars, climbing in two phases from 2,600m to Apharwat Peak at 4,000m. Phase 1 (3,100m) offers panoramic views; Phase 2 (4,000m) reaches snow-clad Apharwat with views of Nanga Parbat and the Line of Control. Open year-round - for snow play in winter, alpine meadows in summer.",
    duration: "1-2 hours",
    difficulty: "Easy",
    bestSeason: "Year-round (snow Dec-April)",
    destinationSlug: "gulmarg",
  },
  {
    slug: "shikara-dal-lake",
    title: "Shikara Ride on Dal Lake",
    category: "leisure",
    shortDescription:
      "Glide across the iconic Dal Lake in a traditional wooden shikara - sunset, floating gardens & floating market.",
    description:
      "The shikara ride on Dal Lake is the quintessential Kashmir experience. Glide past floating vegetable gardens, the floating flower market, and the iconic Char Chinar island. Sunrise rides catch the mist rising off the water; sunset rides turn the lake to molten gold against the Pir Panjal silhouette.",
    duration: "1-2 hours",
    difficulty: "Easy",
    bestSeason: "April-October",
    destinationSlug: "dal-lake",
  },
  {
    slug: "gulmarg-skiing",
    title: "Powder Skiing in Gulmarg",
    category: "adventure",
    shortDescription:
      "World-class powder skiing accessed via the highest gondola on Earth - 1,500m vertical descents off Apharwat Peak.",
    description:
      "Gulmarg is among the world's premier powder destinations - deep, dry Himalayan snow accessed via the Gulmarg Gondola to 4,000m on Apharwat Peak. Open bowl descents of up to 1,500m vertical, tree skiing in the pine forests below, and legendary off-piste terrain. Best for intermediate to expert skiers.",
    duration: "Full day (multi-day options)",
    difficulty: "Intermediate-Advanced",
    bestSeason: "January-March",
    destinationSlug: "gulmarg",
  },
  {
    slug: "pahalgam-pony-trek",
    title: "Pony Trek to Baisaran",
    category: "adventure",
    shortDescription:
      "Ride a Kashmiri pony through pine forests to the 'mini Switzerland' meadow of Baisaran above Pahalgam.",
    description:
      "From Pahalgam town, take a pony ride (or walk) through towering pine forests to Baisaran - a grassy meadow at 2,400m known as 'mini Switzerland' for its rolling green hills. Continue up to Tulian Lake for a longer trek. Perfect family-friendly adventure.",
    duration: "Half day",
    difficulty: "Easy",
    bestSeason: "April-October",
    destinationSlug: "pahalgam",
  },
  {
    slug: "ladakh-monastery-tour",
    title: "Monastery Tour (Hemis, Thiksey, Diskit)",
    category: "cultural",
    shortDescription:
      "Visit the great Tibetan Buddhist monasteries of Ladakh - Thiksey's 15m Maitreya Buddha, Hemis's hidden murals, Diskit's 32m Buddha.",
    description:
      "Ladakh's monasteries (gompas) are repositories of Tibetan Buddhism's living heritage. Thiksey, cascading down a hillside like a mini Potala Palace, houses a 15m Maitreya Buddha. Hemis, hidden in a gorge, hosts the famous masked Hemis Festival each June. Diskit Monastery in Nubra has a towering 32m Maitreya Buddha facing the Shyok river.",
    duration: "Half day to full day",
    difficulty: "Easy",
    bestSeason: "May-September",
    destinationSlug: "thiksey-monastery",
  },
  {
    slug: "pangong-lake-overnight",
    title: "Pangong Lake Overnight Camp",
    category: "nature",
    shortDescription:
      "Sleep beside the surreal blue of Pangong Tso at 4,350m - sunrise over the changing colours of the lake is unforgettable.",
    description:
      "The iconic Pangong Tso stretches 134 km across the Indo-China border at 4,350m - its impossible shades of blue shift with the light. Spend a night in a tented camp at Spangmik village on the lake shore, witness the sunrise over the lake (a different colour every hour), and stargaze under one of the darkest skies on Earth.",
    duration: "1 night (in itinerary)",
    difficulty: "Moderate (altitude)",
    bestSeason: "May-September",
    destinationSlug: "pangong-tso",
  },
  {
    slug: "nubra-camel-ride",
    title: "Bactrian Camel Ride in Nubra",
    category: "adventure",
    shortDescription:
      "Ride a double-humped Bactrian camel across the sand dunes of Hunder in Nubra Valley - a surreal cold-desert experience.",
    description:
      "In Hunder, Nubra Valley, the cold desert reveals itself as rolling sand dunes against snow-capped peaks - and the only population of double-humped Bactrian camels in India. A 30-minute camel ride across the dunes at sunset is a quintessential Ladakh experience.",
    duration: "30 min - 1 hour",
    difficulty: "Easy",
    bestSeason: "May-September",
    destinationSlug: "nubra-valley",
  },
  {
    slug: "khardung-la-pass",
    title: "Cross Khardung La Pass",
    category: "adventure",
    shortDescription:
      "Stand atop one of the world's highest motorable roads at 5,359m - the gateway from Leh to Nubra Valley.",
    description:
      "Khardung La (5,359m) is one of the highest motorable roads on Earth, crossing the Ladakh Range between Leh and the Nubra Valley. The pass is snow-dusted most of the year, with prayer flags fluttering at the summit. Stop for photos, chai at the summit canteen, and the surreal view back over the Indus Valley.",
    duration: "Transit (half day)",
    difficulty: "Easy (acclimatize first)",
    bestSeason: "May-October",
    destinationSlug: "khardung-la",
  },
  {
    slug: "wazwan-feast",
    title: "Traditional Wazwan Feast",
    category: "cultural",
    shortDescription:
      "Sit around a trammi and eat a 36-course Kashmiri feast prepared by a waza - Rogan Josh, Gushtaba, Rista & more.",
    description:
      "Wazwan is the ceremonial 36-course feast of Kashmir - prepared overnight by a master waza and served on a large platter (trammi) shared by four diners. Includes Rogan Josh, Gushtaba, Rista, Tabak Maaz, and finishes with kahwa tea. A must-do cultural experience in Srinagar.",
    duration: "1-2 hours (evening)",
    difficulty: "Easy",
    bestSeason: "Year-round",
    destinationSlug: "srinagar",
  },
  {
    slug: "houseboat-stay-dal",
    title: "Heritage Houseboat Stay on Dal Lake",
    category: "leisure",
    shortDescription:
      "Sleep on a Victorian-era carved wooden houseboat moored on Dal Lake - a Kashmir experience found nowhere else on Earth.",
    description:
      "The houseboats of Dal Lake are a unique Kashmiri tradition - hand-carved cedarwood floating palaces with intricately panelled interiors, many dating back to the British Raj era. Wake to floating-garden views, sip kahwa on the deck, take a dawn shikara to the floating market - there's no other experience quite like it.",
    duration: "1-2 nights",
    difficulty: "Easy",
    bestSeason: "April-October",
    destinationSlug: "dal-lake",
  },
  {
    slug: "sonmarg-trek-thajiwas",
    title: "Trek to Thajiwas Glacier",
    category: "adventure",
    shortDescription:
      "Pony or walk to the Thajiwas Glacier above Sonmarg - a stunning ice formation accessible from the Meadow of Gold.",
    description:
      "From Sonmarg (2,800m), a 3-4 km pony trek or hike leads up to the Thajiwas Glacier, a year-round ice formation set amid lush meadows. Along the way, pass through alpine wildflowers, shepherds' camps, and dramatic Pir Panjal views. Snow activities available year-round at the glacier.",
    duration: "Half day",
    difficulty: "Easy-Moderate",
    bestSeason: "May-September",
    destinationSlug: "sonmarg",
  },
  {
    slug: "indus-river-rafting",
    title: "Indus River Rafting",
    category: "adventure",
    shortDescription:
      "White-water rafting on the Indus between Spituk and Nimmo - Grade II-III rapids with stunning Ladakh scenery.",
    description:
      "Raft the legendary Indus River through the dramatic landscapes of Ladakh. The popular Spituk to Nimmo stretch offers Grade II-III rapids suitable for beginners and families, with views of monasteries and snow-capped peaks. Longer stretches (Phey to Nimmo, Alchi to Khaltsey) for the more adventurous.",
    duration: "Half day",
    difficulty: "Easy-Moderate",
    bestSeason: "June-September",
    destinationSlug: "leh",
  },
]

export default async function ThingsToDoPage() {
  const [settings, dbActivities, destinations] = await Promise.all([
    getSettings(),
    getAllActivities(),
    getAllDestinations(),
  ])

  const activities =
    dbActivities.length > 0
      ? dbActivities.map((a: any) => ({
          ...a,
          images: safeArray(a.images),
          category: a.category ?? "adventure",
          destinationSlug: destinations.find((d) => d.id === a.destinationId)?.slug,
        }))
      : FALLBACK_ACTIVITIES

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="Things To Do"
        title={
          <>
            Experiences that <span className="gradient-text-saffron">linger</span>
          </>
        }
        subtitle="Ski the world's highest gondola, sleep on a houseboat, cross Khardung La, ride a Bactrian camel - Kashmir & Ladakh offer bucket-list experiences you'll remember forever."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Things To Do" },
          ]}
        />

        <ActivityGrid activities={activities} destinations={destinations} />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="btn-glow">
            <Link href="/packages">
              Find packages with these activities <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <CTASection phone={settings.phone_primary} />
      </section>
    </PublicLayout>
  )
}
