// Seed honeymoon + family/group packages
import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

const packages = [
  // HONEYMOON PACKAGES
  {
    title: "Romantic Kashmir Honeymoon - 5N/6D",
    slug: "romantic-kashmir-honeymoon-5n6d",
    subtitle: "Srinagar * Gulmarg * Pahalgam * Houseboat",
    shortDescription: "A dream honeymoon - heritage houseboat on Dal Lake, candle-lit dinners, Gulmarg gondola & riverside Pahalgam romance.",
    description: "Designed for couples seeking romance and privacy, our signature honeymoon package combines a heritage Dal Lake houseboat, the alpine meadows of Gulmarg, and the riverside tranquillity of Pahalgam. Includes private transfers, candle-lit dinners, a complimentary shikara ride at sunset, and special honeymoon decor.",
    durationDays: 6, durationNights: 5,
    price: 32999, discountPrice: 27999,
    inclusions: ["5 nights (1 houseboat + 4 hotel)", "All breakfasts & dinners", "Private Innova with driver", "Sunset shikara on Dal Lake", "Gulmarg gondola phase 1", "Candle-lit dinner (2 evenings)", "Honeymoon cake & flowers", "Couple photoshoot session"],
    exclusions: ["Airfare", "Lunches", "Pony rides", "Personal expenses", "Travel insurance"],
    highlights: ["Heritage houseboat on Dal Lake", "Private sunset shikara ride", "Candle-lit dinner experience", "Gulmarg gondola to 4,000m", "Riverside Pahalgam & Betaab Valley", "Mughal Gardens of Srinagar", "Couple photoshoot"],
    itinerary: [
      { day: 1, title: "Arrival Srinagar - Houseboat & Shikara", description: "Arrive Srinagar. Transfer to heritage houseboat. Welcome kahwa. Private sunset shikara on Dal Lake past floating gardens. Candle-lit welcome dinner. Overnight houseboat.", meals: "Dinner", stay: "Houseboat, Dal Lake" },
      { day: 2, title: "Srinagar - Mughal Gardens & Romance", description: "Visit Nishat, Shalimar & Chashme Shahi gardens. Sunset at Pari Mahal. Evening couple photoshoot. Overnight Srinagar.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 3, title: "Srinagar to Gulmarg - Gondola Romance", description: "Drive to Gulmarg. Gondola to Apharwat Peak (4,000m). Snow play & photography. Romantic dinner. Overnight Gulmarg.", meals: "Breakfast, Dinner", stay: "Hotel, Gulmarg" },
      { day: 4, title: "Gulmarg to Pahalgam - Betaab Valley", description: "Drive to Pahalgam via pine forests. Visit Betaab Valley. Riverside walk & picnic. Overnight Pahalgam.", meals: "Breakfast, Dinner", stay: "Hotel, Pahalgam" },
      { day: 5, title: "Pahalgam to Srinagar - Farewell", description: "Morning at leisure. Drive back to Srinagar. Final houseboat stay with farewell candle-lit dinner. Overnight.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 6, title: "Departure Srinagar", description: "Morning at leisure. Transfer to Srinagar airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/kashmir-honeymoon-romantic.png",
    rating: 4.9, reviewCount: 68, groupSize: "2", difficulty: "Easy",
    featured: true, popular: true, order: 13,
    destinations: ["srinagar", "gulmarg", "pahalgam", "dal-lake", "mughal-gardens", "betaab-valley"],
    metaTitle: "Kashmir Honeymoon Package 5N/6D - Romantic Houseboat & Gulmarg",
    metaDescription: "Dream Kashmir honeymoon: heritage houseboat, sunset shikara, candle-lit dinner, Gulmarg gondola, Pahalgam. ₹27,999/couple. Book with Asgari Tours.",
  },
  {
    title: "Ladakh Honeymoon - Heights of Romance 6N/7D",
    slug: "ladakh-honeymoon-heights-of-romance-6n7d",
    subtitle: "Leh * Nubra * Pangong * Candle-light",
    shortDescription: "A honeymoon at the top of the world - Pangong sunset, Nubra dunes, monasteries & private camps under the stars.",
    description: "For adventurous couples, a Ladakh honeymoon is unforgettable - the surreal blue of Pangong Lake at sunset, sand dunes of Nubra with Bactrian camels, ancient monasteries, and private tented camps under one of the clearest night skies on Earth. Includes acclimatization, oxygen support, and romantic touches.",
    durationDays: 7, durationNights: 6,
    price: 44999, discountPrice: 38999,
    inclusions: ["6 nights accommodation", "All breakfasts & dinners", "Private Innova with driver", "All permits (ILP)", "Pangong & Nubra private camps", "Candle-lit dinner at Pangong", "Oxygen canisters", "Airport transfers"],
    exclusions: ["Airfare to/from Leh", "Lunches", "Camel rides", "Personal expenses", "Travel insurance"],
    highlights: ["Sunset at Pangong Lake (4,350m)", "Private tented camp at Pangong", "Bactrian camels on Nubra dunes", "Cross Khardung La (5,359m)", "Thiksey & Hemis monasteries", "Stargazing at Pangong"],
    itinerary: [
      { day: 1, title: "Arrive Leh - Acclimatize", description: "Fly into Leh (3,500m). Rest & acclimatize. Evening walk to Shanti Stupa for sunset. Overnight Leh.", meals: "Dinner", stay: "Hotel, Leh" },
      { day: 2, title: "Leh Local Sightseeing", description: "Leh Palace, Shankar Gompa, Magnetic Hill, Gurudwara Pathar Sahib. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 3, title: "Leh to Nubra via Khardung La", description: "Cross Khardung La (5,359m). Diskit Monastery & Maitreya Buddha. Sunset at Hunder dunes. Overnight Nubra.", meals: "Breakfast, Dinner", stay: "Camp, Nubra" },
      { day: 4, title: "Nubra to Pangong - Romance by the Lake", description: "Drive to Pangong via Shyok. Sunset at the lake. Candle-lit dinner at private camp. Overnight Pangong.", meals: "Breakfast, Dinner", stay: "Camp, Pangong" },
      { day: 5, title: "Pangong Sunrise to Leh", description: "Sunrise at Pangong. Drive back to Leh via Chang La. Visit Hemis & Thiksey. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 6, title: "Leh - Sham Valley & Alchi", description: "Visit Alchi Monastery's ancient murals, Lamayuru moonland. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 7, title: "Departure Leh", description: "Transfer to Leh airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/pangong-tso-lake.png",
    rating: 4.9, reviewCount: 41, groupSize: "2", difficulty: "Moderate",
    featured: true, popular: false, order: 14,
    destinations: ["leh", "nubra-valley", "pangong-tso", "khardung-la", "thiksey-monastery", "hemis-monastery", "sham-valley"],
    metaTitle: "Ladakh Honeymoon 6N/7D - Pangong, Nubra, Khardung La",
    metaDescription: "Adventurous Ladakh honeymoon: Pangong sunset, Nubra dunes, Khardung La, private camps, candle-lit dinner. ₹38,999. Book with Asgari Tours.",
  },
  // FAMILY & GROUP PACKAGES
  {
    title: "Kashmir Family Holiday - 6N/7D",
    slug: "kashmir-family-holiday-6n7d-v2",
    subtitle: "Srinagar * Gulmarg * Pahalgam * Yusmarg",
    shortDescription: "A relaxed family circuit with houseboats, gondola rides, pony treks & meadow picnics - paced for kids and elders.",
    description: "Designed for families travelling with children and elderly members, this relaxed-pace circuit balances the must-see highlights of Kashmir with plenty of downtime. The itinerary includes a heritage houseboat stay with shikara rides, the Gulmarg gondola for snow play, gentle pony rides in Pahalgam's Betaab Valley, and the uncrowded meadows of Yusmarg for picnics. All transfers in a private Innova, family-friendly hotels with interconnecting rooms, and kid-friendly meal options.",
    durationDays: 7, durationNights: 6,
    price: 34999, discountPrice: 29999,
    inclusions: ["6 nights (1 houseboat + 5 hotels)", "All breakfasts & dinners", "Private Innova with driver", "Shikara on Dal Lake", "Gulmarg gondola phase 1", "Pony rides in Pahalgam (kids)", "Family photoshoot", "Kid-friendly meals"],
    exclusions: ["Airfare", "Lunches", "Personal expenses", "Travel insurance"],
    highlights: ["Heritage houseboat on Dal Lake", "Gulmarg gondola to 4,000m", "Pony rides in Betaab Valley", "Picnic at Yusmarg meadows", "Mughal Gardens of Srinagar", "Family photoshoot"],
    itinerary: [
      { day: 1, title: "Arrival Srinagar - Houseboat", description: "Arrive Srinagar, transfer to houseboat. Evening shikara on Dal Lake. Welcome dinner. Overnight.", meals: "Dinner", stay: "Houseboat, Dal Lake" },
      { day: 2, title: "Srinagar - Mughal Gardens", description: "Visit Nishat, Shalimar & Chashme Shahi gardens. Pari Mahal sunset. Overnight Srinagar.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 3, title: "Srinagar to Gulmarg - Gondola", description: "Drive to Gulmarg. Gondola to Apharwat Peak. Snow play & photography. Overnight Gulmarg.", meals: "Breakfast, Dinner", stay: "Hotel, Gulmarg" },
      { day: 4, title: "Gulmarg to Pahalgam", description: "Drive to Pahalgam via pine forests. Afternoon at leisure. Overnight Pahalgam.", meals: "Breakfast, Dinner", stay: "Hotel, Pahalgam" },
      { day: 5, title: "Pahalgam - Betaab Valley & Pony Rides", description: "Visit Betaab Valley. Pony rides for kids. Riverside picnic. Overnight Pahalgam.", meals: "Breakfast, Dinner", stay: "Hotel, Pahalgam" },
      { day: 6, title: "Pahalgam to Yusmarg to Srinagar", description: "Drive to Yusmarg meadow. Picnic lunch. Evening return to Srinagar. Overnight.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 7, title: "Departure Srinagar", description: "Morning at leisure. Transfer to airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/sonmarg-golden-meadow.png",
    rating: 4.8, reviewCount: 64, groupSize: "2-12", difficulty: "Easy",
    featured: false, popular: true, order: 15,
    destinations: ["srinagar", "gulmarg", "pahalgam", "yusmarg", "dal-lake", "mughal-gardens", "betaab-valley"],
    metaTitle: "Kashmir Family Holiday 6N/7D - Kid-Friendly Tour Package",
    metaDescription: "Family-friendly Kashmir tour: houseboat, Gulmarg gondola, pony rides, Yusmarg picnic. ₹29,999. Book with Asgari Tours.",
  },
  {
    title: "Ladakh Group Expedition - 7N/8D",
    slug: "ladakh-group-expedition-7n8d",
    subtitle: "Leh * Nubra * Pangong * Hanle - Group Adventure",
    shortDescription: "An epic group adventure across Ladakh - monasteries, high passes, Pangong & Hanle stargazing. Perfect for friends & corporate groups.",
    description: "Built for groups of friends, corporate teams, or travel clubs, this comprehensive Ladakh expedition covers all the iconic landmarks plus the remote Hanle observatory for astrophotography. Group-friendly pricing, shared accommodations, support vehicle, and an experienced road captain. Group discounts available for 6+ travellers.",
    durationDays: 8, durationNights: 7,
    price: 36999, discountPrice: 31999,
    inclusions: ["7 nights accommodation", "All breakfasts & dinners", "Shared Innova/Tempo Traveller", "All permits (ILP)", "Pangong & Nubra camps", "Hanle homestay", "Support vehicle & mechanic", "Group coordinator/guide"],
    exclusions: ["Airfare to/from Leh", "Lunches", "Personal gear", "Alcohol", "Travel insurance"],
    highlights: ["Cross Khardung La (5,359m)", "Pangong Lake overnight camp", "Hanle astrophotography session", "Nubra Bactrian camels", "Thiksey & Hemis monasteries", "Group discounts for 6+"],
    itinerary: [
      { day: 1, title: "Arrive Leh - Acclimatize", description: "Fly into Leh. Rest & acclimatize. Group briefing. Overnight Leh.", meals: "Dinner", stay: "Hotel, Leh" },
      { day: 2, title: "Leh Local Sightseeing", description: "Leh Palace, Shanti Stupa, Magnetic Hill, Gurudwara Pathar Sahib. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 3, title: "Leh to Nubra via Khardung La", description: "Cross Khardung La. Diskit Monastery & Maitreya Buddha. Sunset at Hunder dunes. Overnight Nubra.", meals: "Breakfast, Dinner", stay: "Camp, Nubra" },
      { day: 4, title: "Nubra to Pangong", description: "Drive to Pangong via Shyok. Sunset at the lake. Overnight camp.", meals: "Breakfast, Dinner", stay: "Camp, Pangong" },
      { day: 5, title: "Pangong to Hanle", description: "Sunrise at Pangong. Drive to Hanle via Chushul. Evening astrophotography. Overnight Hanle.", meals: "Breakfast, Dinner", stay: "Homestay, Hanle" },
      { day: 6, title: "Hanle - Milky Way & Observatory", description: "Visit Indian Astronomical Observatory. Night sky photography. Overnight Hanle.", meals: "Breakfast, Dinner", stay: "Homestay, Hanle" },
      { day: 7, title: "Hanle to Leh", description: "Drive back to Leh. Visit Thiksey & Hemis monasteries en route. Final dinner. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 8, title: "Departure Leh", description: "Transfer to Leh airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: "/uploads/hanle.png",
    rating: 4.8, reviewCount: 29, groupSize: "4-16", difficulty: "Moderate",
    featured: false, popular: true, order: 16,
    destinations: ["leh", "nubra-valley", "pangong-tso", "khardung-la", "hanle", "thiksey-monastery", "hemis-monastery"],
    metaTitle: "Ladakh Group Expedition 7N/8D - Hanle Astrophotography Tour",
    metaDescription: "Group Ladakh tour: Khardung La, Pangong, Hanle observatory, Nubra. Group discounts for 6+. ₹31,999. Book with Asgari Tours.",
  },
]

async function main() {
  console.log("Seeding honeymoon + family/group packages...")
  for (const p of packages) {
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
    console.log(`  OK ${pkg.slug}`)
  }
  const count = await db.tourPackage.count()
  console.log(`\nTotal packages: ${count}`)
}

main().catch(console.error).finally(() => db.$disconnect())
