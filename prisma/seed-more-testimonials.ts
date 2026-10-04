// Supplementary seed: add more testimonials for social proof
import { PrismaClient } from "@prisma/client"
const db = new PrismaClient()

const moreTestimonials = [
  { name: "Rahul Mehta", location: "Mumbai", rating: 5, title: "Best travel decision", text: "Booked the Ladakh photography expedition and it was incredible. Our guide knew every vantage point for golden hour and helped us set up astrophotography shots at Hanle. Came back with portfolio-worthy images. Worth every rupee.", featured: true, source: "google" },
  { name: "Aisha Patel", location: "London, UK", rating: 5, title: "Solo female traveller — felt safe", text: "As a solo female traveller from London, I was nervous about Kashmir. But Asgari's team was incredibly professional and made me feel safe throughout. The houseboat was magical, the food was amazing, and my guide Riyaz was like a protective older brother. Cannot recommend enough.", featured: true, source: "google" },
  { name: "Captain Rajeev Kumar (retd.)", location: "Chandigarh", rating: 5, title: "Veteran's Amarnath Yatra", text: "At 68 with a knee replacement, I thought Amarnath Yatra was impossible. Asgari arranged the helicopter package and made it effortless. The team's respect and care for elderly pilgrims is commendable. Jai Baba Barfani!", featured: false, source: "direct" },
  { name: "Nikhil & Aishwarya", location: "Bengaluru", rating: 5, title: "Dream honeymoon", text: "The Kashmir honeymoon package was beyond our dreams. Houseboat with candle-lit dinner, private shikara at sunset, snow at Gulmarg — every moment was magical. Asgari thought of details we didn't even know we wanted. Thank you for the perfect start to our life together!", featured: true, source: "google" },
  { name: "Dr. Sanjay Agarwal", location: "Kolkata", rating: 4, title: "Well organised family trip", text: "Travelled with wife, 2 kids (8 & 12) and my parents. The pace was perfect for all ages. Kids loved the pony rides, parents enjoyed the gardens. Only minor hiccup was a delayed gondola in Gulmarg due to weather, but the team adjusted instantly. Will travel with Asgari again.", featured: false, source: "direct" },
  { name: "Lena Schmidt", location: "Berlin, Germany", rating: 5, title: "Authentic cultural experience", text: "The Kashmir Cultural & Craft Trail was exactly what I wanted — not the typical tourist circuit. Watching artisans make paper-mâché, the saffron harvest, the Wazwan cooking class — these are experiences you can't get elsewhere. Asgari understands 'slow travel'.", featured: true, source: "direct" },
]

async function main() {
  console.log("⭐ Seeding 6 more testimonials...")
  for (const t of moreTestimonials) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name, text: t.text.slice(0, 50) } })
    if (existing) { console.log(`  skip ${t.name}`); continue }
    await db.testimonial.create({ data: { ...t, avatar: null, packageId: null, approved: true } as any })
    console.log(`  ✓ ${t.name}`)
  }
  const count = await db.testimonial.count()
  const featured = await db.testimonial.count({ where: { featured: true } })
  console.log(`\nTotal testimonials: ${count} (${featured} featured)`)
}

main().catch(console.error).finally(() => db.$disconnect())
