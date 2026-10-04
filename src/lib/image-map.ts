// Server-side helper to map destination & package slugs to generated hero images
// Falls back to null when no specific image is available (UI then shows a gradient placeholder).

const DESTINATION_IMAGES: Record<string, string> = {
  srinagar: "/uploads/srinagar-dal-lake.png",
  "dal-lake": "/uploads/houseboat-kashmir.png",
  "mughal-gardens": "/uploads/mughal-gardens-srinagar.png",
  gulmarg: "/uploads/gulmarg-meadow.png",
  pahalgam: "/uploads/pahalgam-betaab-valley.png",
  "betaab-valley": "/uploads/pahalgam-betaab-valley.png",
  "aru-valley": "/uploads/pahalgam-betaab-valley.png",
  sonmarg: "/uploads/sonmarg-golden-meadow.png",
  leh: "/uploads/leh-ladakh-town.png",
  "pangong-tso": "/uploads/pangong-tso-lake.png",
  "nubra-valley": "/uploads/nubra-valley-dunes.png",
  "khardung-la": "/uploads/khardung-la-pass.png",
  yusmarg: "/uploads/yusmarg.png",
  doodhpathri: "/uploads/doodhpathri.png",
  kokernag: "/uploads/kokernag.png",
  verinag: "/uploads/verinag.png",
  aharbal: "/uploads/aharbal.png",
  daksum: "/uploads/daksum.png",
  "sinthan-top": "/uploads/sinthan-top.png",
  "lolab-valley": "/uploads/lolab-valley.png",
  "bangus-valley": "/uploads/bangus-valley.png",
  "gangabal-lake": "/uploads/gangabal-lake.png",
  "tarsar-marsar-lakes": "/uploads/tarsar-marsar-lakes.png",
  "magnetic-hill": "/uploads/magnetic-hill.png",
  "zanskar-valley": "/uploads/zanskar-valley.png",
  "tso-moriri": "/uploads/tso-moriri.png",
  "tso-kar": "/uploads/tso-kar.png",
  turtuk: "/uploads/turtuk.png",
  hanle: "/uploads/hanle.png",
  "thiksey-monastery": "/uploads/ladakh-monastery.png",
  "hemis-monastery": "/uploads/ladakh-monastery.png",
  "diskit-monastery": "/uploads/ladakh-monastery.png",
  "sham-valley": "/uploads/ladakh-monastery.png",
  alchi: "/uploads/ladakh-monastery.png",
  lamayuru: "/uploads/ladakh-monastery.png",
  "shankaracharya-temple": "/uploads/leh-ladakh-town.png",
  "hazratbal-shrine": "/uploads/srinagar-dal-lake.png",
  "pari-mahal": "/uploads/mughal-gardens-srinagar.png",
  "zoji-la-pass": "/uploads/khardung-la-pass.png",
}

const PACKAGE_IMAGES: Record<string, string> = {
  "kashmir-paradise-delight-5n6d": "/uploads/hero-kashmir-valley.png",
  "ladakh-adventure-expedition-7n8d": "/uploads/pangong-tso-lake.png",
  "kashmir-honeymoon-escape-4n5d": "/uploads/kashmir-honeymoon-romantic.png",
  "srinagar-leh-highway-expedition-9n10d": "/uploads/leh-ladakh-town.png",
  "gulmarg-ski-snowboard-week-6n7d": "/uploads/gulmarg-meadow.png",
  "amarnath-yatra-helicopter-2n3d": "/uploads/pahalgam-betaab-valley.png",
}

export const HERO_IMAGE = "/uploads/hero-kashmir-valley.png"

export function destinationImage(slug: string): string | null {
  return DESTINATION_IMAGES[slug] ?? null
}

export function packageImage(slug: string): string | null {
  return PACKAGE_IMAGES[slug] ?? null
}

// Deterministic gradient fallback for unknown destinations (returns CSS classes)
const GRADIENTS = [
  "from-amber-500/30 via-rose-500/20 to-emerald-500/30",
  "from-emerald-500/30 via-amber-500/20 to-rose-500/30",
  "from-rose-500/30 via-emerald-500/20 to-amber-500/30",
  "from-amber-500/30 via-emerald-500/30 to-rose-500/20",
  "from-emerald-500/30 via-rose-500/20 to-amber-500/30",
  "from-rose-500/30 via-amber-500/30 to-emerald-500/20",
]

export function gradientForSlug(slug: string): string {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

export function initialForName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
