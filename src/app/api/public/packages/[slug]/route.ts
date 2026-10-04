import { NextRequest } from "next/server"
import { getPackageBySlug } from "@/lib/queries"
import { ok, err } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getPackageBySlug(slug)
  if (!data) return err("Package not found", 404)
  return ok(data)
}
