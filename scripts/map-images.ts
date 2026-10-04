// Map generated images to destinations and update the database
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const imageMap: Record<string, string> = {
  'srinagar': '/uploads/srinagar-dal-lake.png',
  'dal-lake': '/uploads/srinagar-dal-lake.png',
  'mughal-gardens': '/uploads/mughal-gardens-srinagar.png',
  'gulmarg': '/uploads/gulmarg-meadow.png',
  'pahalgam': '/uploads/pahalgam-betaab-valley.png',
  'betaab-valley': '/uploads/pahalgam-betaab-valley.png',
  'sonmarg': '/uploads/sonmarg-golden-meadow.png',
  'leh': '/uploads/leh-ladakh-town.png',
  'pangong-tso': '/uploads/pangong-tso-lake.png',
  'nubra-valley': '/uploads/nubra-valley-dunes.png',
  'khardung-la': '/uploads/khardung-la-pass.png',
  'shankaracharya-temple': '/uploads/leh-ladakh-town.png',
  'hazratbal-shrine': '/uploads/srinagar-dal-lake.png',
  'pari-mahal': '/uploads/mughal-gardens-srinagar.png',
  'thiksey-monastery': '/uploads/ladakh-monastery.png',
  'hemis-monastery': '/uploads/ladakh-monastery.png',
  'sham-valley': '/uploads/leh-ladakh-town.png',
  'zoji-la-pass': '/uploads/khardung-la-pass.png',
  'aru-valley': '/uploads/pahalgam-betaab-valley.png',
}

async function main() {
  console.log('🖼️  Mapping images to destinations...')
  let updated = 0
  for (const [slug, img] of Object.entries(imageMap)) {
    const r = await db.destination.updateMany({ where: { slug }, data: { heroImage: img } })
    if (r.count > 0) { console.log(`  ✓ ${slug} -> ${img}`); updated++ }
  }
  // Also set coverImage on packages
  console.log('📦 Mapping images to packages...')
  const pkgUpdates: Record<string, string> = {
    'kashmir-paradise-delight-5n6d': '/uploads/hero-kashmir-valley.png',
    'ladakh-adventure-expedition-7n8d': '/uploads/pangong-tso-lake.png',
    'kashmir-honeymoon-escape-4n5d': '/uploads/kashmir-honeymoon-romantic.png',
    'srinagar-leh-highway-expedition-9n10d': '/uploads/khardung-la-pass.png',
    'gulmarg-ski-snowboard-week-6n7d': '/uploads/gulmarg-meadow.png',
    'amarnath-yatra-helicopter-2n3d': '/uploads/sonmarg-golden-meadow.png',
  }
  for (const [slug, img] of Object.entries(pkgUpdates)) {
    const r = await db.tourPackage.updateMany({ where: { slug }, data: { coverImage: img } })
    if (r.count > 0) { console.log(`  ✓ ${slug} -> ${img}`); }
  }
  console.log(`\nDone. Updated ${updated} destinations.`)
}

main().catch(console.error).finally(() => db.$disconnect())
