// Site settings cache - fetches settings as a flat object
import { db } from '@/lib/db'
import { parseJSON } from '@/lib/types'

let cache: Record<string, any> | null = null
let cacheTime = 0
const TTL = 30_000 // 30s cache

export async function getSettings(force = false): Promise<Record<string, any>> {
  if (!force && cache && Date.now() - cacheTime < TTL) return cache
  const rows = await db.siteSetting.findMany()
  const obj: Record<string, any> = {}
  for (const r of rows) {
    obj[r.key] = parseJSON(r.value, null)
  }
  cache = obj
  cacheTime = Date.now()
  return obj
}

export async function getSetting(key: string): Promise<any> {
  const s = await getSettings()
  return s[key]
}

export async function setSetting(key: string, value: any, category = 'general') {
  const v = typeof value === 'string' ? value : JSON.stringify(value)
  await db.siteSetting.upsert({
    where: { key },
    create: { key, value: v, category },
    update: { value: v, category },
  })
  cache = null // invalidate
}

export function clearSettingsCache() {
  cache = null
  cacheTime = 0
}
