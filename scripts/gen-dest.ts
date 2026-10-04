// Generate a single destination image — slug passed as CLI arg
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const OUT = path.join(process.cwd(), 'public', 'uploads')

const prompts: Record<string, string> = {
  'yusmarg': 'Yusmarg Kashmir alpine meadow, vast green grassland ringed by dense pine forest, grazing ponies, Doodh Ganga river, snow-capped Pir Panjal peaks, golden hour, professional landscape photography, ultra-detailed',
  'doodhpathri': 'Doodhpathri Valley of Milk Kashmir, vast emerald green grassland with milky white Shaling river tumbling over limestone rocks, pine-covered ridges, sheep grazing, blue sky, professional landscape photography, ultra-detailed',
  'kokernag': 'Kokernag Kashmir botanical garden with rose beds and spring-fed stream, terraced lawns, trout hatchery, dense pine forest backdrop, South Kashmir, professional travel photography, ultra-detailed',
  'verinag': 'Verinag Mughal octagonal stone spring, source of Jhelum river, deep blue-green water, royal garden pavilion, pine-covered slopes, South Kashmir, professional travel photography, ultra-detailed',
  'aharbal': 'Aharbal Veshav waterfall in Kashmir, thundering waterfall plunging down pine-forested gorge, basalt rocks, mist, South Kashmir, professional landscape photography, ultra-detailed',
  'daksum': 'Daksum Kashmir pine forest retreat, towering deodar trees along Bringi river, trout fishing, misty glade, alpine meadow, professional travel photography, ultra-detailed',
  'sinthan-top': 'Sinthan Top high altitude mountain pass at 3800m, snow patches in summer, prayer flags, panoramic Himalayan views, dramatic peaks, blue sky, professional landscape photography, ultra-detailed',
  'lolab-valley': 'Lolab Valley north Kashmir, apple and walnut orchards, rice paddies, pine slopes, glen of green, autumn harvest, professional landscape photography, ultra-detailed',
  'bangus-valley': 'Bangus Valley Kashmir twin-basin alpine meadow, vast rolling green grassland, pine forests, Shamshabari snow peaks, wildflowers, nomadic camps, professional landscape photography, ultra-detailed',
  'gangabal-lake': 'Gangabal Lake high altitude sacred lake at base of Mount Harmukh, crystal blue water, snow-capped pyramid peak reflection, alpine meadow, Kashmir Himalayas, professional landscape photography, ultra-detailed',
  'tarsar-marsar-lakes': 'Tarsar Marsar twin alpine lakes Kashmir, cobalt blue lake ringed by meadows and snow peaks, wildflowers, shepherd camps, pristine high country, professional landscape photography, ultra-detailed',
  'magnetic-hill': 'Magnetic Hill Ladakh barren landscape with road, optical illusion, ochre and rust mountains, blue sky, Himalayan cold desert, professional travel photography, ultra-detailed',
  'zanskar-valley': 'Zanskar Valley Ladakh vast isolated high-altitude valley, dramatic gorges, ancient monastery on cliff, barren mountains, blue sky, professional landscape photography, ultra-detailed',
  'tso-moriri': 'Tso Moriri lake Ladakh at 4522m, pristine blue high-altitude lake, 6000m snow peaks including Lungser Kangri, Changpa nomad camps, professional landscape photography, ultra-detailed',
  'tso-kar': 'Tso Kar salt lake Ladakh, brilliant white salt flats surrounding saline lake, barren ochre mountains, blue sky, Changthang plateau, professional landscape photography, ultra-detailed',
  'turtuk': 'Turtuk village Nubra Ladakh, lush green Balti village with apricot orchards, stone and mud houses, Shyok river gorge, professional travel photography, ultra-detailed',
  'hanle': 'Hanle Ladakh night sky with Milky Way over Indian Astronomical Observatory, dark sky stargazing, stars over Himalayan desert, monastery silhouette, professional astrophotography, ultra-detailed',
}

const name = process.argv[2]
if (!name || !prompts[name]) {
  console.error('Usage: bun run scripts/gen-dest.ts <slug>')
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
