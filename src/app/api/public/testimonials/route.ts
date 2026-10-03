import { NextRequest } from "next/server"
import { getApprovedTestimonials } from "@/lib/queries"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "12")
  const data = await getApprovedTestimonials(limit)
  return ok(data)
}
