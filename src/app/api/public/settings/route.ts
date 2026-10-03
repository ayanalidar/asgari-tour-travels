import { getSettings } from "@/lib/settings"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

// Keys that should never be exposed publicly
const SENSITIVE_KEY_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /token/i,
  /endpoint/i,
  /hostinger/i,
  /google[_-]?place/i,
  /google[_-]?last/i,
  /google[_-]?api/i,
]

export async function GET() {
  const all = await getSettings()
  const safe: Record<string, any> = {}
  for (const [k, v] of Object.entries(all)) {
    if (SENSITIVE_KEY_PATTERNS.some((p) => p.test(k))) continue
    safe[k] = v
  }
  return ok(safe)
}
