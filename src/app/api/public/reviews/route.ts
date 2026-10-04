import { NextRequest } from "next/server"
import { getGoogleReviews } from "@/lib/queries"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10")
  const data = await getGoogleReviews(limit)
  return ok(data)
}
