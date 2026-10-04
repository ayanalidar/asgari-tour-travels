// Map all existing /public/uploads/*.png to matching destinations by slug
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
const db = new PrismaClient()

const UPLOADS = path.join(process.cwd(), 'public', 'uploads')

async function main() {
  const files = fs.readdirSync(UPLOADS).filter(f => f.endsWith('.png'))
  const slugs = files.map(f => f.replace(/\.png$/, ''))
  console.log(`Found ${files.length} images`)

  let updated = 0
  for (const slug of slugs) {
    // skip generic images (hero, houseboat, etc that don't match a destination slug directly)
    const dest = await db.destination.findUnique({ where: { slug } })
    if (dest) {
      const imgPath = `/uploads/${slug}.png`
      if (dest.heroImage !== imgPath) {
        await db.destination.update({ where: { id: dest.id }, data: { heroImage: imgPath } })
        console.log(`  ✓ ${slug}`)
        updated++
      }
    }
  }

  // Also map a few special ones
  const special: Record<string, string> = {
    'srinagar-dal-lake': 'srinagar',
    'mughal-gardens-srinagar': 'mughal-gardens',
    'pahalgam-betaab-valley': 'pahalgam',
    'betaab-valley': 'betaab-valley',
    'leh-ladakh-town': 'leh',
    'pangong-tso-lake': 'pangong-tso',
    'nubra-valley-dunes': 'nubra-valley',
    'khardung-la-pass': 'khardung-la',
    'sonmarg-golden-meadow': 'sonmarg',
    'gulmarg-meadow': 'gulmarg',
    'houseboat-kashmir': 'dal-lake',
  }
  for (const [file, slug] of Object.entries(special)) {
    const dest = await db.destination.findUnique({ where: { slug } })
    if (dest && fs.existsSync(path.join(UPLOADS, `${file}.png`))) {
      const imgPath = `/uploads/${file}.png`
      if (dest.heroImage !== imgPath) {
        await db.destination.update({ where: { id: dest.id }, data: { heroImage: imgPath } })
        console.log(`  ✓ ${slug} (via ${file})`)
      }
    }
  }

  const total = await db.destination.count({ where: { heroImage: { not: null } } })
  console.log(`\nDone. Updated ${updated}. Total destinations with images: ${total}`)
}

main().catch(console.error).finally(() => db.$disconnect())
