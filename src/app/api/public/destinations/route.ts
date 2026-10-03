import { NextRequest } from "next/server"
import { getAllDestinations } from "@/lib/queries"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const region = req.nextUrl.searchParams.get("region") || undefined
  const data = await getAllDestinations(region)
  return ok(data)
}
