// Add 2 more tour packages for variety
import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

const morePackages = [
  {
    title: "Kashmir Winter Wonderland — 4N/5D",
    slug: "kashmir-winter-wonderland-4n5d",
    subtitle: "Srinagar • Gulmarg • Snow Paradise",
    shortDescription: "A magical winter escape — snow-dusted Srinagar, Gulmarg gondola to 4,000m, powder snow play & cozy houseboat kangri warmth.",
    description: "Kashmir in winter is a snow-globe paradise. This 4-night circuit captures the magic: a heritage houseboat stay warmed by kangri (traditional fire-pot), the Gulmarg gondola climbing to 4,000m on Apharwat Peak for snow play and photography, and the quiet beauty of snow-draped chinar trees in Srinagar's Mughal Gardens. Perfect for those who love cold, silence, and the romance of winter.",
    durationDays: 5, durationNights: 4,
    price: 19999, discountPrice: 16999,
    inclusions: ["4 nights (1 houseboat + 3 hotel)", "All breakfasts & dinners", "Private Innova with driver", "Gulmarg gondola phase 1 ticket", "Shikara ride on Dal Lake", "Snow boots & jacket rental (Gulmarg)", "Welcome kahwa"],
    exclusions: ["Airfare", "Lunches", "Skiing equipment rental", "Personal expenses"],
    highlights: ["Heritage houseboat with kangri warmth", "Gulmarg gondola to 4,000m", "Snow play & photography", "Shikara on frozen-edge Dal Lake", "Snow-draped Mughal Gardens", "Kashmiri Wazwan winter feast"],
    itinerary: [
      { day: 1, title: "Arrival Srinagar — Houseboat & Shikara", description: "Arrive Srinagar. Transfer to heritage houseboat. Welcome kahwa. Sunset shikara on Dal Lake (edges may be frozen). Dinner & overnight houseboat.", meals: "Dinner", stay: "Houseboat, Dal Lake" },
      { day: 2, title: "Srinagar — Snow Gardens & Old City", description: "Visit snow-draped Mughal Gardens (Nishat, Shalimar). Walk the old city. Shankaracharya Temple viewpoint. Overnight Srinagar.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 3, title: "Srinagar to Gulmarg — Gondola to 4,000m", description: "Drive to Gulmarg. Ride the gondola to Apharwat Peak (4,000m). Snow play, photography, sledge rides. Overnight Gulmarg.", meals: "Breakfast, Dinner", stay: "Hotel, Gulmarg" },
      { day: 4, title: "Gulmarg to Srinagar", description: "Morning at leisure in Gulmarg. Afternoon drive back to Srinagar. Final houseboat/hotel stay. Farewell Wazwan dinner.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 5, title: "Departure Srinagar", description: "Morning at leisure. Transfer to Srinagar airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/gulmarg-meadow.png",
    rating: 4.7, reviewCount: 45, groupSize: "2-10", difficulty: "Easy",
    featured: false, popular: true, order: 11,
    destinations: ["srinagar", "gulmarg", "dal-lake", "mughal-gardens"],
    metaTitle: "Kashmir Winter Wonderland 4N/5D — Snow, Houseboat & Gulmarg",
    metaDescription: "Winter Kashmir tour: houseboat with kangri, Gulmarg gondola to 4,000m, snow play, Mughal Gardens in snow. ₹16,999. Book with Asgari Tours.",
  },
  {
    title: "Ladakh Adventure Bike Trip — 6N/7D",
    slug: "ladakh-adventure-bike-trip-6n7d",
    subtitle: "Leh • Khardung La • Pangong • Nubra",
    shortDescription: "Ride the world's highest motorable roads on a Royal Enfield — Khardung La, Pangong Lake & Nubra Valley sand dunes.",
    description: "The ultimate Ladakh motorcycle adventure. Ride a Royal Enfield Himalayan across the legendary Khardung La (5,359m) — one of the highest motorable roads on Earth — down into the sand dunes of Nubra Valley, and onward to the surreal blue of Pangong Tso at 4,350m. Includes bikes, fuel, accommodation, support vehicle, and an experienced road captain. For experienced riders only.",
    durationDays: 7, durationNights: 6,
    price: 44999, discountPrice: 38999,
    inclusions: ["6 nights accommodation", "Royal Enfield Himalayan rental", "Fuel for entire trip", "Support vehicle with mechanic", "Road captain/guide", "All permits (ILP)", "Pangong & Nubra camp stays", "Helmets & basic gear"],
    exclusions: ["Airfare to/from Leh", "Meals", "Personal riding gear (jacket/gloves)", "Damage deposit (refundable)", "Travel insurance"],
    highlights: ["Ride Khardung La — 5,359m", "Royal Enfield Himalayan bike", "Pangong Lake overnight camp", "Nubra sand dunes & Bactrian camels", "Support vehicle + mechanic", "Experienced road captain"],
    itinerary: [
      { day: 1, title: "Arrive Leh — Acclimatize & Bike Briefing", description: "Fly into Leh. Rest & acclimatize. Evening bike briefing & gear check. Overnight Leh.", meals: "Dinner", stay: "Hotel, Leh" },
      { day: 2, title: "Leh Local Ride — Acclimatization", description: "Short ride to Magnetic Hill, Shanti Stupa, Leh Palace. Get comfortable with the bike at altitude. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 3, title: "Leh to Nubra via Khardung La", description: "Ride over Khardung La (5,359m). Descend to Nubra Valley. Diskit Monastery & Maitreya Buddha. Sunset at Hunder dunes. Overnight Nubra.", meals: "Breakfast, Dinner", stay: "Camp, Nubra" },
      { day: 4, title: "Nubra to Pangong via Shyok", description: "Morning Bactrian camel ride (optional). Ride to Pangong via scenic Shyok route. Arrive Pangong for sunset. Overnight camp.", meals: "Breakfast, Dinner", stay: "Camp, Pangong" },
      { day: 5, title: "Pangong Sunrise to Leh via Chang La", description: "Sunrise at Pangong. Ride back to Leh crossing 5,366m Chang La. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 6, title: "Leh — Free Day / Rest", description: "Rest day. Explore Leh bazaar, shop for souvenirs, optional cafe hopping. Final dinner & ride stories. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 7, title: "Departure Leh", description: "Return bike. Transfer to Leh airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/khardung-la-pass.png",
    rating: 4.9, reviewCount: 33, groupSize: "4-12", difficulty: "Advanced",
    featured: false, popular: true, order: 12,
    destinations: ["leh", "nubra-valley", "pangong-tso", "khardung-la"],
    metaTitle: "Ladakh Bike Trip 6N/7D — Khardung La, Pangong, Nubra",
    metaDescription: "Royal Enfield Ladakh bike trip: ride Khardung La (5,359m), Pangong Lake, Nubra dunes. Bike, fuel, support, guide. ₹38,999. Book with Asgari Tours.",
  },
]

async function main() {
  console.log("📦 Seeding 2 more tour packages...")
  for (const p of morePackages) {
    const { destinations: destSlugs, ...pkg } = p
    const exists = await db.tourPackage.findUnique({ where: { slug: pkg.slug } })
    if (exists) { console.log(`  skip ${pkg.slug}`); continue }
    const created = await db.tourPackage.create({
      data: {
        ...pkg,
        images: "[]",
        inclusions: JSON.stringify(pkg.inclusions),
        exclusions: JSON.stringify(pkg.exclusions),
        highlights: JSON.stringify(pkg.highlights),
        itinerary: JSON.stringify(pkg.itinerary),
        status: "published",
      } as any,
    })
    for (let i = 0; i < destSlugs.length; i++) {
      const dest = await db.destination.findUnique({ where: { slug: destSlugs[i] } })
      if (dest) {
        await db.packageDestination.create({
          data: { packageId: created.id, destinationId: dest.id, order: i },
        })
      }
    }
    console.log(`  ✓ ${pkg.slug}`)
  }
  const count = await db.tourPackage.count()
  console.log(`\nTotal packages: ${count}`)
}

main().catch(console.error).finally(() => db.$disconnect())
