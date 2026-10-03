import { getAllPackages } from "@/lib/queries"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await getAllPackages()
  return ok(data)
}
