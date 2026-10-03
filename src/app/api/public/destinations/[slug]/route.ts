import { NextRequest, NextResponse } from "next/server"
import { getDestinationBySlug } from "@/lib/queries"
import { ok, err } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getDestinationBySlug(slug)
  if (!data) return err("Destination not found", 404)
  return ok(data)
}

export function generateStaticParams() {
  return []
}
