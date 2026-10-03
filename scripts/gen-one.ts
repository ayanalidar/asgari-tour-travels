// Generate a single image — name passed as CLI arg
// Usage: bun run scripts/gen-one.ts <name>
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'public', 'uploads')

const prompts: Record<string, string> = {
  'sonmarg-golden-meadow': 'Sonmarg meadow of gold in Kashmir, golden sunlight on alpine meadow grazing horses, Sind river, Thajiwas glacier in distance, Pir Panjal peaks, professional landscape photography, warm golden hour, ultra-detailed',
  'leh-ladakh-town': 'Leh Ladakh old town with traditional mud-brick houses and 17th century Leh Palace on hilltop, barren high-altitude desert, prayer flags, snow mountains, blue sky, professional travel photography, ultra-detailed',
  'pangong-tso-lake': 'Pangong Tso lake Ladakh at sunrise, surreal brilliant blue high-altitude lake, reflections of barren ochre mountains, prayer flags on shore, crystal clear, Himalayan cold desert, professional landscape photography, ultra-detailed, cinematic',
  'nubra-valley-dunes': 'Nubra Valley Ladakh sand dunes at Hunder, double-humped Bactrian camels on desert dunes, snow-capped mountains, blue sky, cold desert, professional travel photography, ultra-detailed',
  'khardung-la-pass': 'Khardung La pass Ladakh at 5359 meters, snow-covered mountain pass with Buddhist prayer flags fluttering, cairn of stones, barren Himalayan peaks, blue sky, professional landscape photography, ultra-detailed',
  'mughal-gardens-srinagar': 'Nishat Bagh Mughal Gardens Srinagar Kashmir, terraced Persian chahar bagh garden with fountains and water channels, chinar trees, flower beds, Dal Lake and Pir Panjal mountains, spring bloom, professional photography, ultra-detailed',
  'houseboat-kashmir': 'Traditional carved wooden Kashmiri houseboat on Dal Lake at sunset, ornate Victorian woodwork, shikara moored alongside, golden hour reflection on still water, mountains silhouette, romantic, professional travel photography, ultra-detailed',
  'ladakh-monastery': 'Thiksey Monastery Ladakh, white and ochre Tibetan Buddhist monastery buildings cascading down hillside like Potala Palace, prayer flags, Himalayan desert, golden hour, professional travel photography, ultra-detailed',
  'kashmir-honeymoon-romantic': 'Romantic Kashmir honeymoon scene, couple silhouette on shikara boat at sunset on Dal Lake, houseboat in distance, golden sky, mountains silhouette, dreamy atmosphere, professional photography, ultra-detailed',
  'shikara-floating-market': 'Floating vegetable market on Dal Lake Srinagar at dawn, shikara boats with lotus flowers, vendors trading, mist on water, golden sunrise, traditional Kashmir, professional travel photography, ultra-detailed',
}

const name = process.argv[2]
if (!name || !prompts[name]) {
  console.error('Usage: bun run scripts/gen-one.ts <name>')
  console.error('Available:', Object.keys(prompts).join(', '))
  process.exit(1)
}

const outPath = path.join(OUT, `${name}.png`)
if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
  console.log(`skip ${name} (exists)`)
  process.exit(0)
}

async function main() {
  console.log(`generating ${name}...`)
  const zai = await ZAI.create()
  const res = await zai.images.generations.create({ prompt: prompts[name], size: '1344x768' as any })
  const b64 = res.data[0].base64
  if (!b64) throw new Error('no base64')
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
  console.log(`✅ ${name} saved (${Math.round(fs.statSync(outPath).size/1024)}KB)`)
  process.exit(0)
}

main().catch(e => { console.error(`❌ ${name}: ${e.message}`); process.exit(1) })
