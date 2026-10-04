import { NextResponse } from "next/server"
import { getActivityBySlug } from "@/lib/queries"
import { ok, err } from "@/lib/api"
import { safeArray } from "@/lib/types"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const activity = await getActivityBySlug(slug)
  if (!activity) {
    return err("Activity not found", 404)
  }
  return ok({
    ...activity,
    images: safeArray(activity.images),
  })
}

export const dynamic = "force-dynamic";
