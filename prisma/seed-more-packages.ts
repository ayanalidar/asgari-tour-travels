// Supplementary seed: add 4 more tour packages for variety
import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

const morePackages = [
  {
    title: "Kashmir Family Holiday — 6N/7D",
    slug: "kashmir-family-holiday-6n7d",
    subtitle: "Srinagar • Gulmarg • Pahalgam • Yusmarg",
    shortDescription: "A relaxed family-friendly circuit with houseboats, gondola rides, pony treks & meadow picnics — paced for kids and elders.",
    description: "Designed for families travelling with children and elderly members, this relaxed-pace circuit balances the must-see highlights of Kashmir with plenty of downtime. The itinerary includes a heritage houseboat stay with shikara rides, the Gulmarg gondola for snow play, gentle pony rides in Pahalgam's Betaab Valley, and the uncrowded meadows of Yusmarg for picnics. All transfers in a private Innova, family-friendly hotels with interconnecting rooms, and kid-friendly meal options.",
    durationDays: 7, durationNights: 6,
    price: 34999, discountPrice: 29999,
    inclusions: ["6 nights accommodation (1 houseboat + 5 hotels)", "All breakfasts & dinners", "Private Innova with driver", "Shikara ride on Dal Lake", "Gulmarg gondola phase 1 ticket", "Pony rides in Pahalgam (for kids)", "Family photoshoot session", "Kid-friendly meal options"],
    exclusions: ["Airfare", "Lunches", "Personal expenses", "Travel insurance"],
    highlights: ["Heritage houseboat on Dal Lake", "Gulmarg gondola to 4,000m", "Pony rides in Betaab Valley", "Picnic at Yusmarg meadows", "Mughal Gardens of Srinagar", "Family photoshoot"],
    itinerary: [
      { day: 1, title: "Arrival Srinagar — Houseboat", description: "Arrive Srinagar, transfer to houseboat. Evening shikara on Dal Lake. Welcome dinner.", meals: "Dinner", stay: "Houseboat, Dal Lake" },
      { day: 2, title: "Srinagar — Mughal Gardens", description: "Visit Nishat, Shalimar & Chashme Shahi gardens. Pari Mahal sunset. Overnight Srinagar.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 3, title: "Srinagar to Gulmarg — Gondola", description: "Drive to Gulmarg. Gondola to Apharwat Peak. Snow play & photography. Overnight Gulmarg.", meals: "Breakfast, Dinner", stay: "Hotel, Gulmarg" },
      { day: 4, title: "Gulmarg to Pahalgam", description: "Drive to Pahalgam via pine forests. Afternoon at leisure. Overnight Pahalgam.", meals: "Breakfast, Dinner", stay: "Hotel, Pahalgam" },
      { day: 5, title: "Pahalgam — Betaab Valley & Pony Rides", description: "Visit Betaab Valley. Pony rides for kids. Riverside picnic. Overnight Pahalgam.", meals: "Breakfast, Dinner", stay: "Hotel, Pahalgam" },
      { day: 6, title: "Pahalgam to Yusmarg to Srinagar", description: "Drive to Yusmarg meadow. Picnic lunch. Evening return to Srinagar. Overnight.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 7, title: "Departure Srinagar", description: "Morning at leisure. Transfer to airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: null,
    rating: 4.8, reviewCount: 64, groupSize: "2-12", difficulty: "Easy",
    featured: false, popular: true, order: 7,
    destinations: ["srinagar", "gulmarg", "pahalgam", "yusmarg", "dal-lake", "mughal-gardens", "betaab-valley"],
    metaTitle: "Kashmir Family Holiday Package 6N/7D — Kid-Friendly Tour",
    metaDescription: "Family-friendly Kashmir tour: houseboat, Gulmarg gondola, pony rides in Pahalgam, Yusmarg picnic. ₹29,999. Book with Asgari Tour & Travels.",
  },
  {
    title: "Ladakh Photography Expedition — 8N/9D",
    slug: "ladakh-photography-expedition-8n9d",
    subtitle: "Leh • Pangong • Nubra • Hanle • Tso Moriri",
    shortDescription: "An expert-led photography journey to Ladakh's most photogenic landscapes — monasteries, lakes, passes & night skies.",
    description: "Crafted for photography enthusiasts, this expedition is timed for the best light and led by a local photographer-guide who knows every vantage point. From the golden hour at Pangong Tso to the star-trails of Hanle (one of the world's best dark-sky sites), from the morning prayers at Thiksey to the dunes of Nubra — every location is timed for optimal conditions. Includes critique sessions and post-processing guidance in the evenings.",
    durationDays: 9, durationNights: 8,
    price: 59999, discountPrice: 52999,
    inclusions: ["8 nights accommodation", "All breakfasts & dinners", "Private 4x4 vehicle", "Photographer-guide throughout", "All permits", "Pangong & Hanle camp stays", "Tripod & basic gear rental", "Post-processing sessions"],
    exclusions: ["Airfare", "Lunches", "Personal camera gear", "Travel insurance"],
    highlights: ["Golden hour at Pangong Tso", "Milky Way astrophotography at Hanle", "Thiksey morning prayers", "Nubra sand dunes at sunset", "Tso Moriri panoramas", "Changpa nomad portraits"],
    itinerary: [
      { day: 1, title: "Arrive Leh — Acclimatize", description: "Fly into Leh. Rest & acclimatize. Evening walk to Shanti Stupa for sunset. Overnight Leh.", meals: "Dinner", stay: "Hotel, Leh" },
      { day: 2, title: "Leh Local + Thiksey", description: "Morning prayers at Thiksey Monastery. Leh Palace, Hall of Fame. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 3, title: "Leh to Nubra via Khardung La", description: "Cross Khardung La. Diskit Monastery & Maitreya Buddha. Sunset at Hunder dunes. Overnight Nubra.", meals: "Breakfast, Dinner", stay: "Camp, Nubra" },
      { day: 4, title: "Nubra to Pangong", description: "Drive to Pangong via Shyok. Afternoon & sunset photography at the lake. Overnight camp.", meals: "Breakfast, Dinner", stay: "Camp, Pangong" },
      { day: 5, title: "Pangong Sunrise to Hanle", description: "Sunrise at Pangong. Long drive to Hanle via Chushul. Evening astrophotography. Overnight Hanle.", meals: "Breakfast, Dinner", stay: "Homestay, Hanle" },
      { day: 6, title: "Hanle — Milky Way & Observatory", description: "Full day at Hanle. Night sky photography at the observatory. Overnight Hanle.", meals: "Breakfast, Dinner", stay: "Homestay, Hanle" },
      { day: 7, title: "Hanle to Tso Moriri", description: "Drive to Tso Moriri via Nyoma. Afternoon at the lake. Overnight Korzok.", meals: "Breakfast, Dinner", stay: "Camp, Korzok" },
      { day: 8, title: "Tso Moriri to Leh", description: "Sunrise at Tso Moriri. Drive back to Leh via Upshi. Final dinner & image review. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 9, title: "Departure Leh", description: "Transfer to airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: null,
    rating: 4.9, reviewCount: 31, groupSize: "2-8", difficulty: "Moderate",
    featured: false, popular: false, order: 8,
    destinations: ["leh", "pangong-tso", "nubra-valley", "khardung-la", "hanle", "tso-moriri", "thiksey-monastery"],
    metaTitle: "Ladakh Photography Expedition 8N/9D — Astrophotography & Lakes",
    metaDescription: "Photography tour of Ladakh: Pangong golden hour, Hanle Milky Way, Tso Moriri, monasteries. Expert guide. ₹52,999. Book with Asgari Tours.",
  },
  {
    title: "Kashmir Cultural & Craft Trail — 4N/5D",
    slug: "kashmir-cultural-craft-trail-4n5d",
    subtitle: "Srinagar • Pampore • Bandipore • Old City",
    shortDescription: "An immersive cultural journey — saffron harvest, paper-mâché workshops, pashmina weaving, Wazwan feast & old city bazaars.",
    description: "For travellers who want to go beyond the postcard, this cultural immersion trail takes you into the living traditions of Kashmir. Visit saffron fields in Pampore during the October harvest, watch master artisans create paper-mâché masterpieces, learn how pashmina shawls are woven from the undercoat of Changthangi goats, and join a Wazwan cooking class with a traditional waza (master chef). Walks through the old city's spice bazaars and wooden-latticework lanes round out this authentic cultural experience.",
    durationDays: 5, durationNights: 4,
    price: 22999, discountPrice: 19999,
    inclusions: ["4 nights hotel + 1 houseboat night", "All breakfasts & 2 special dinners", "Private vehicle", "Wazwan cooking class", "Craft workshop visits", "Old city guided walk", "Saffron field visit"],
    exclusions: ["Airfare", "Most lunches", "Shopping purchases", "Travel insurance"],
    highlights: ["Saffron harvest in Pampore (Oct)", "Paper-mâché workshop visit", "Pashmina weaving demonstration", "Wazwan cooking class", "Old city bazaar walk", "Houseboat stay"],
    itinerary: [
      { day: 1, title: "Arrival Srinagar — Houseboat & Shikara", description: "Arrive Srinagar. Houseboat check-in. Sunset shikara. Welcome Wazwan dinner. Overnight houseboat.", meals: "Dinner", stay: "Houseboat, Dal Lake" },
      { day: 2, title: "Old City Bazaar Walk & Crafts", description: "Guided walk through Maharaj Ganj bazaars. Visit paper-mâché workshop & copper smithy. Overnight hotel.", meals: "Breakfast", stay: "Hotel, Srinagar" },
      { day: 3, title: "Pampore Saffron & Pashmina", description: "Drive to Pampore saffron fields. Visit pashmina weaving centre. Afternoon at Mughal gardens. Overnight.", meals: "Breakfast, Dinner", stay: "Hotel, Srinagar" },
      { day: 4, title: "Wazwan Cooking Class", description: "Hands-on Wazwan cooking class with a master waza. Learn Rogan Josh, Gushtaba, Rista. Feast on your creations. Overnight.", meals: "Breakfast, Lunch", stay: "Hotel, Srinagar" },
      { day: 5, title: "Departure", description: "Morning shopping for crafts. Transfer to airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: null,
    rating: 4.7, reviewCount: 28, groupSize: "2-10", difficulty: "Easy",
    featured: false, popular: false, order: 9,
    destinations: ["srinagar", "dal-lake", "mughal-gardens", "hazratbal-shrine", "pari-mahal"],
    metaTitle: "Kashmir Cultural & Craft Trail 4N/5D — Saffron, Pashmina & Wazwan",
    metaDescription: "Cultural Kashmir tour: saffron fields, paper-mâché, pashmina weaving, Wazwan cooking class, old city bazaars. ₹19,999. Book with Asgari Tours.",
  },
  {
    title: "Ladakh Monastery Circuit — 5N/6D",
    slug: "ladakh-monastery-circuit-5n6d",
    subtitle: "Leh • Thiksey • Hemis • Alchi • Lamayuru",
    shortDescription: "A spiritual journey through Ladakh's great Buddhist gompas — morning prayers, masked dances, ancient murals & cliff-carved caves.",
    description: "This monastery-focused circuit takes you deep into the spiritual heart of Ladakh, visiting the region's most significant gompas with a Buddhist scholar-guide. Witness the hypnotic dawn prayers at Thiksey, explore the 11th-century murals of Alchi (Ladakh's artistic crown jewel), meditate at the cliff-carved Phugtal-like caves, and learn about the Drukpa lineage at Hemis. The pace is contemplative — designed for those seeking cultural and spiritual depth rather than tick-box sightseeing.",
    durationDays: 6, durationNights: 5,
    price: 29999, discountPrice: 25999,
    inclusions: ["5 nights accommodation", "All breakfasts & dinners", "Private vehicle with scholar-guide", "All monastery entrance fees", "Permits", "Morning prayer access at Thiksey"],
    exclusions: ["Airfare", "Lunches", "Donations to monasteries", "Travel insurance"],
    highlights: ["Dawn prayers at Thiksey", "Alchi's 11th-century murals", "Hemis Museum & festival lore", "Lamayuru moonland", "Likir & Rizong gompas", "Buddhist scholar-guide"],
    itinerary: [
      { day: 1, title: "Arrive Leh — Acclimatize", description: "Fly into Leh. Rest & acclimatize. Evening at Shanti Stupa. Overnight Leh.", meals: "Dinner", stay: "Hotel, Leh" },
      { day: 2, title: "Thiksey & Hemis", description: "Dawn prayers at Thiksey. Visit Hemis Monastery & museum. Afternoon at Shey Palace. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 3, title: "Leh to Sham Valley — Alchi", description: "Drive to Sham Valley. Visit Alchi Monastery's ancient murals. Likir Gompa. Overnight Sham.", meals: "Breakfast, Dinner", stay: "Hotel, Sham Valley" },
      { day: 4, title: "Lamayuru & Rizong", description: "Visit Lamayuru 'Moonland' Monastery. Trek/visit to Rizong Gompa. Overnight Sham.", meals: "Breakfast, Dinner", stay: "Hotel, Sham Valley" },
      { day: 5, title: "Sham to Leh via Spituk", description: "Return to Leh via Spituk Monastery. Afternoon free for reflection. Final dinner. Overnight Leh.", meals: "Breakfast, Dinner", stay: "Hotel, Leh" },
      { day: 6, title: "Departure", description: "Transfer to Leh airport.", meals: "Breakfast", stay: "" },
    ],
    images: [], coverImage: null,
    rating: 4.8, reviewCount: 22, groupSize: "2-10", difficulty: "Easy",
    featured: false, popular: false, order: 10,
    destinations: ["leh", "thiksey-monastery", "hemis-monastery", "sham-valley"],
    metaTitle: "Ladakh Monastery Circuit 5N/6D — Thiksey, Hemis, Alchi, Lamayuru",
    metaDescription: "Spiritual Ladakh monastery tour: dawn prayers at Thiksey, Alchi murals, Hemis museum, Lamayuru moonland. Scholar-guide. ₹25,999. Book with Asgari Tours.",
  },
]

async function main() {
  console.log("📦 Seeding 4 additional tour packages...")
  for (const p of morePackages) {
    const { destinations: destSlugs, ...pkg } = p
    const exists = await db.tourPackage.findUnique({ where: { slug: pkg.slug } })
    if (exists) {
      console.log(`  skip ${pkg.slug} (exists)`)
      continue
    }
    const created = await db.tourPackage.create({
      data: {
        ...pkg,
        images: "[]",
        coverImage: null,
        inclusions: JSON.stringify(pkg.inclusions),
        exclusions: JSON.stringify(pkg.exclusions),
        highlights: JSON.stringify(pkg.highlights),
        itinerary: JSON.stringify(pkg.itinerary),
        status: "published",
      } as any,
    })
    // Link destinations
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
