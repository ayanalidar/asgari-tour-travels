// Supplementary seed: add more blog posts & activities for richer SEO content
import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

const moreBlogPosts = [
  {
    title: "Top 15 Things to Do in Srinagar — The Complete Guide",
    slug: "things-to-do-in-srinagar",
    excerpt: "From dawn shikara rides to Mughal gardens and Wazwan feasts — 15 unmissable experiences in Srinagar.",
    content: `# Top 15 Things to Do in Srinagar

Srinagar, the summer capital of Jammu & Kashmir, is a city that unfolds like a Persian miniature — each corner revealing a new delight. Here are the 15 experiences no traveller should miss.

## 1. Dawn Shikara Ride on Dal Lake
Start before sunrise. The floating vegetable market, the mist on the water, and the sun rising over the Pir Panjal create one of Asia's most photographed scenes.

## 2. Stay on a Heritage Houseboat
Spend at least one night on a traditional carved-wood houseboat — an experience found nowhere else on Earth. The best ones date to the 19th century.

## 3. Walk the Mughal Gardens
Nishat Bagh, Shalimar Bagh, Chashme Shahi & Pari Mahal — four 17th-century Persian 'chahar bagh' masterpieces along the eastern shore of Dal Lake.

## 4. Floating Flower Market
At dawn, shikaras laden with lotus flowers and marigolds gather near Dal Gate — a moving mosaic of colour.

## 5. Hazratbal Shrine
The white marble shrine on the lake's edge houses a sacred relic and offers one of Srinagar's most serene views.

## 6. Shankaracharya Temple
Climb the 240 steps to this ancient Shiva temple atop a 1,000ft hill for panoramic views of the entire city.

## 7. Old City Bazaar Walk
Wind through the wooden-latticework houses, spice stalls, and copper workshops of the old quarter near Maharaj Ganj.

## 8. Pashmina Shopping
Srinagar is the world's capital of genuine pashmina — seek out certified Grade-A shawls, not the machine-made imitations.

## 9. Wazwan Feast
Order the traditional 36-course feast at Ahdoos or Mughal Darbar — Rogan Josh, Gushtaba, Rista and more, served on a trammi platter.

## 10. Pampore Saffron Fields
A 15-min drive to the saffron fields — visit in October-November during the harvest and buy the world's most expensive spice at source.

## 11. Tulip Garden (April)
Asia's largest tulip garden blooms in April — 1.3 million bulbs on a terraced hillside overlooking Dal Lake.

## 12. Nishat Bagh at Sunset
The 12-terrace 'Garden of Joy' turns magical as the chinar shadows lengthen and the fountains glow.

## 13. Indus & Jhelum Boat Cruise
Take a sunset cruise on the Jhelum — the old city's wooden bridges and houses glide past like a faded postcard.

## 14. Paper-Mâché Workshop Visit
Watch artisans turn papier-mâché into intricately painted boxes, vases and Christmas ornaments — a 500-year-old craft.

## 15. Kahwa at a Local Khandar
End the day with a cup of saffron kahwa (green tea) at a riverside tea stall, watching the sun set behind Hari Parbat.`,
    coverImage: null,
    category: "Travel Guide",
    tags: ["srinagar", "things-to-do", "dal-lake"],
    author: "Asgari Team",
    readTime: 8,
    metaTitle: "Top 15 Things to Do in Srinagar — Complete Guide 2024",
    metaDescription: "15 unmissable things to do in Srinagar: dawn shikara, houseboat stay, Mughal gardens, Wazwan feast, Hazratbal, Shankaracharya & more. Plan with Asgari Tours.",
  },
  {
    title: "Pangong Lake: The Ultimate Travel Guide",
    slug: "pangong-lake-travel-guide",
    excerpt: "Everything you need to know about visiting Pangong Tso — permits, best time, the Chang La crossing, tent stays & photography tips.",
    content: `# Pangong Lake — The Ultimate Travel Guide

Pangong Tso (Tso = lake in Ladakhi) is among the most spectacular high-altitude lakes on Earth — a 134-km ribbon of shifting blue at 4,350m, straddling India and Tibet.

## Why Go?
The lake's colour shifts from deep sapphire to turquoise to emerald through the day, framed by ochre and rust mountains. Made famous by 3 Idiots, it remains otherworldly.

## How to Reach
- **From Leh**: 225 km, 5-6 hours via the 5,366m Chang La pass
- **Permit**: Inner Line Permit (free for Indians, ~₹650 for foreigners) — arrange in Leh
- **Best route**: Leh → Karu → Chang La → Durbuk → Tangste → Pangong (Spangmik)

## Best Time to Visit
**May to September**. The lake freezes solid from November to March. July-August is peak; June & September are quieter.

## Where to Stay
Tented camps at Spangmik or Man offer beds, blankets and basic meals. Book ahead in peak season. No WiFi — embrace the off-grid silence.

## Photography Tips
- **Sunrise**: 5:30-6:30am — the colour shift is most dramatic
- **Filters**: A polarizer cuts the glare and deepens the blue
- **Stars**: The Milky Way is visible naked-eye — bring a tripod for 30s exposures
- **Foreground**: Use the prayer flags or a shikara-style boat for scale

## Acclimatize First!
Pangong sits at 4,350m. Spend **at least 2 nights in Leh (3,500m)** before attempting the trip. Carry oxygen canisters (₹400 in Leh). Symptoms of AMS: headache, nausea, breathlessness — descend immediately if severe.

## What to Pack
- **Layers**: It drops below 0°C at night even in July
- **Sun protection**: SPF 50+, hat, sunglasses — UV at 4,350m is brutal
- **Power bank**: No electricity at camps after 10pm
- **Cash**: No ATMs beyond Leh

## The 3 Idiots Spot
The iconic filming location is near Spangmik — most camps can point you to the exact boulder. Ask for "Rancho's spot".

A night at Pangong, under a sky dense with stars, is among the most transcendent experiences travel can offer.`,
    coverImage: null,
    category: "Travel Guide",
    tags: ["ladakh", "pangong", "lakes"],
    author: "Asgari Team",
    readTime: 7,
    metaTitle: "Pangong Lake Travel Guide — Permits, Best Time, Photography",
    metaDescription: "Complete Pangong Tso guide: Chang La crossing, permits, best time, tent stays, photography tips, acclimatization. Book Pangong packages with Asgari Tours.",
  },
  {
    title: "Kashmir in Winter: A Snow-Globe Paradise",
    slug: "kashmir-in-winter-guide",
    excerpt: "Snow-dusted Srinagar, frozen Dal Lake, Gulmarg powder skiing & houseboat kangri warmth — winter in Kashmir is magical.",
    content: `# Kashmir in Winter: A Snow-Globe Paradise

Winter (December-February) transforms Kashmir into a snow-globe — frozen lakes, powder-covered meadows and a deep, contemplative silence. For the right traveller, it's the most magical season.

## What Winter Looks Like
- **Srinagar**: Dal Lake partially freezes, the chinar trees bare against snow, houseboats warmed by kangri (fire-pot) under blankets
- **Gulmarg**: One of the world's great powder ski destinations, the gondola running to 4,000m
- **Pahalgam**: Silent, snow-draped pine forests and frozen Lidder
- **Sonmarg**: Snowed in — accessible only by special vehicles to Baltal

## Gulmarg Powder Skiing
Gulmarg in winter hosts some of the planet's finest powder — 14m+ annual snowfall, the world's highest gondola, and 1,500m vertical descents. Best for intermediate-to-expert skiers.

## Houseboat Magic
A houseboat in winter is a cocoon — carved wood interiors, a kangri glowing under your pheran (cloak), and kahwa with saffron. Rates drop 40-60% off-season.

## The Frozen Dal
In January, the lake's edges freeze enough to walk on. The famous shikara ride becomes a sled ride in places. Photographers adore the monochrome minimalism.

## Winter Wazwan
The traditional feast is richer in winter — the slow-cooked meat dishes warmed by wood fires taste deeper, the yogurt sauces creamier.

## Practical Tips
- **Pack**: Down jacket, thermal layers, waterproof boots, gloves, wool cap
- **Drive carefully**: Roads to Gulmarg close briefly after heavy snowfall
- **Daylight**: Short — 10am-4pm is the core window
- **Rates**: 40-60% cheaper than summer

## Winter Festival
The Gulmarg Snow Festival (January) features skiing competitions, snowboarding, and snow-sculpture.

Winter Kashmir isn't for everyone — but for those who embrace cold and silence, it's the season of the soul.`,
    coverImage: null,
    category: "Seasonal",
    tags: ["kashmir", "winter", "skiing", "gulmarg"],
    author: "Asgari Team",
    readTime: 6,
    metaTitle: "Kashmir in Winter — Snow, Skiing & Frozen Dal Lake Guide",
    metaDescription: "Kashmir winter travel guide: Gulmarg powder skiing, frozen Dal Lake, houseboat stays, winter Wazwan, what to pack. Book winter Kashmir tours with Asgari Tours.",
  },
  {
    title: "Ladakh Monasteries: A Guide to Hemis, Thiksey, Diskit & Alchi",
    slug: "ladakh-monasteries-guide",
    excerpt: "Discover Ladakh's great gompas — from the Potala-like Thiksey to the cliff-carved Phugtal — history, art & festival dates.",
    content: `# Ladakh Monasteries: A Complete Guide

Ladakh's monasteries (gompas) are living repositories of Tibetan Buddhist art, philosophy and ritual — many dating back a millennium.

## Thiksey Monastery
The most visually arresting gompa — 12 tiers of white-and-ochre buildings cascading down a hillside in uncanny resemblance to Lhasa's Potala Palace. Home to a 15m Maitreya Buddha. **Don't miss**: 7am morning prayers.

## Hemis Monastery
Ladakh's largest and wealthiest gompa, hidden in a gorge 45km from Leh. Famous for the **Hemis Festival** (June-July) — 2 days of masked cham dances and the unveiling of a giant Padmasambhava thangka, shown only every 12 years.

## Diskit Monastery (Nubra)
The 32m Maitreya Buddha statue overlooking the Nubra sand dunes is among Ladakh's most striking sights. The gompa itself is the oldest in Nubra (14th century).

## Alchi Monastery
The artistic crown jewel of Ladakh — 11th-century murals that融合 Kashmiri, Tibetan and Central Asian styles, unlike any other gompa. Not on a hilltop but in a valley, making it accessible and unique.

## Hemis Festival Guide
- **Dates**: 11th-12th day of the 5th Tibetan month (usually late June / early July)
- **Highlight**: Masked cham dances by lamas in elaborate costumes
- **Tip**: Arrive by 9am for the best viewing spots

## Photography Etiquette
- Ask before photographing monks, rituals or inner shrines
- Some gompas prohibit flash inside prayer halls
- A small donation (₹50-100) is appreciated for special access

## Monastery Circuit
A perfect day trip from Leh: **Thiksey → Shey Palace → Hemis** (45km one way). Allow a full day. For Alchi & Lamayuru, plan an overnight in Sham Valley.

## Festival Calendar
- **Hemis Festival**: June-July
- **Thiksey Gustor**: Oct-Nov
- **Diskit Gustor**: February
- **Losar (Tibetan New Year)**: December

These gompas are not museums — they are living spiritual centres. Visit with respect, and they will reward you with timeless wisdom.`,
    coverImage: null,
    category: "Culture",
    tags: ["ladakh", "monasteries", "buddhism", "culture"],
    author: "Asgari Team",
    readTime: 7,
    metaTitle: "Ladakh Monasteries Guide — Hemis, Thiksey, Diskit, Alchi",
    metaDescription: "Complete guide to Ladakh's monasteries: Thiksey, Hemis, Diskit, Alchi. History, art, festival dates, photography tips. Book monastery tours with Asgari Tours.",
  },
]

async function main() {
  console.log("📝 Seeding 4 additional blog posts...")
  for (const b of moreBlogPosts) {
    const exists = await db.blogPost.findUnique({ where: { slug: b.slug } })
    if (exists) {
      console.log(`  skip ${b.slug} (exists)`)
      continue
    }
    await db.blogPost.create({
      data: {
        ...b,
        tags: JSON.stringify(b.tags),
        coverImage: null,
        status: "published",
        publishedAt: new Date(),
      } as any,
    })
    console.log(`  ✓ ${b.slug}`)
  }
  const count = await db.blogPost.count()
  console.log(`\nTotal blog posts: ${count}`)
}

main().catch(console.error).finally(() => db.$disconnect())
