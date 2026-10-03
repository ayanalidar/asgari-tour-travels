// Robust sequential image generation — one at a time, skip existing
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'public', 'uploads')
fs.mkdirSync(OUT, { recursive: true })

const images: { name: string; prompt: string }[] = [
  { name: 'hero-kashmir-valley', prompt: 'Breathtaking panoramic view of Kashmir valley at golden hour, snow-capped Pir Panjal Himalayan mountains, lush green meadows, Dal Lake reflecting sunset colors, shikara boats, cinematic wide landscape, ultra-detailed, professional travel photography, warm golden light, atmospheric' },
  { name: 'srinagar-dal-lake', prompt: 'Iconic Dal Lake Srinagar Kashmir at dawn, traditional wooden houseboat on still water, shikara boat with flower vendor, distant snow mountains Pir Panjal, mist on water, golden sunrise reflection, professional travel photography, ultra-detailed, serene' },
  { name: 'gulmarg-meadow', prompt: 'Gulmarg meadow of flowers in summer, lush green alpine grassland, snow-capped Apharwat peak in background, wildflowers, cable car gondola in distance, pine forest, blue sky with dramatic clouds, professional landscape photography, ultra-detailed' },
  { name: 'pahalgam-betaab-valley', prompt: 'Betaab Valley Pahalgam Kashmir, crystal clear turquoise Lidder river flowing through green meadow, pine forest on slopes, snow-capped Himalayan mountains, dramatic clouds, professional travel photography, ultra-detailed, vibrant colors' },
  { name: 'sonmarg-golden-meadow', prompt: 'Sonmarg meadow of gold in Kashmir, golden sunlight on alpine meadow grazing horses, Sind river, Thajiwas glacier in distance, dramatic Pir Panjal peaks, professional landscape photography, warm golden hour, ultra-detailed' },
  { name: 'leh-ladakh-town', prompt: 'Leh Ladakh old town with traditional mud-brick houses and 17th century Leh Palace on hilltop, barren high-altitude desert landscape, prayer flags, snow mountains in distance, blue sky, professional travel photography, ultra-detailed' },
  { name: 'pangong-tso-lake', prompt: 'Pangong Tso lake Ladakh at sunrise, surreal brilliant blue high-altitude lake, reflections of barren ochre mountains, prayer flags on shore, crystal clear, Himalayan cold desert, professional landscape photography, ultra-detailed, cinematic' },
  { name: 'nubra-valley-dunes', prompt: 'Nubra Valley Ladakh sand dunes at Hunder, double-humped Bactrian camels on desert dunes, snow-capped mountains in background, dramatic blue sky, cold desert landscape, professional travel photography, ultra-detailed' },
  { name: 'khardung-la-pass', prompt: 'Khardung La pass Ladakh at 5359 meters, snow-covered mountain pass with Buddhist prayer flags fluttering, cairn of stones, barren Himalayan peaks, dramatic clouds, blue sky, professional landscape photography, ultra-detailed' },
  { name: 'mughal-gardens-srinagar', prompt: 'Nishat Bagh Mughal Gardens Srinagar Kashmir, terraced Persian chahar bagh garden with fountains and water channels, chinar trees, flower beds, Dal Lake and Pir Panjal mountains in background, spring bloom, professional photography, ultra-detailed' },
  { name: 'houseboat-kashmir', prompt: 'Traditional carved wooden Kashmiri houseboat on Dal Lake at sunset, ornate Victorian woodwork, shikara moored alongside, golden hour reflection on still water, mountains silhouette, romantic atmosphere, professional travel photography, ultra-detailed' },
  { name: 'ladakh-monastery', prompt: 'Thiksey Monastery Ladakh, white and ochre Tibetan Buddhist monastery buildings cascading down hillside like Potala Palace, prayer flags, Himalayan desert landscape, golden hour light, professional travel photography, ultra-detailed' },
  { name: 'kashmir-honeymoon-romantic', prompt: 'Romantic Kashmir honeymoon scene, couple silhouette on shikara boat at sunset on Dal Lake, houseboat in distance, golden sky, mountains silhouette, candle-lit ambience, dreamy atmosphere, professional photography, ultra-detailed' },
  { name: 'shikara-floating-market', prompt: 'Floating vegetable market on Dal Lake Srinagar at dawn, shikara boats with lotus flowers and vegetables, vendors trading, mist on water, golden sunrise, traditional Kashmir scene, professional travel photography, ultra-detailed' },
]

async function main() {
  console.log(`🎨 Starting image generation for ${images.length} images...`)
  const zai = await ZAI.create()
  let ok = 0, skip = 0, fail = 0
  for (const img of images) {
    const outPath = path.join(OUT, `${img.name}.png`)
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`⏭️  skip ${img.name} (exists, ${Math.round(fs.statSync(outPath).size/1024)}KB)`)
      skip++
      continue
    }
    console.log(`🎨 Generating ${img.name}...`)
    try {
      const res = await zai.images.generations.create({ prompt: img.prompt, size: '1344x768' as any })
      const b64 = res.data[0].base64
      if (!b64) throw new Error('no base64 in response')
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
      console.log(`✅ ${img.name} saved (${Math.round(fs.statSync(outPath).size/1024)}KB)`)
      ok++
    } catch (e: any) {
      console.error(`❌ ${img.name}: ${e.message}`)
      fail++
    }
  }
  console.log(`\nDone. Generated=${ok} Skipped=${skip} Failed=${fail}`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
