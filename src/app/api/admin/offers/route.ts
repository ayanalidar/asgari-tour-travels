import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, requireAdmin, readBody, slugify } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401)
  const offers = await db.offer.findMany({ orderBy: { createdAt: "desc" } })
  return ok(offers)
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401)
  const body = await readBody(req)
  const { title, subtitle, description, couponCode, discountText, ctaText, ctaHref, image, bgColor, expiryDate, isActive, showDelay } = body
  if (!title || !couponCode) return err("title and couponCode are required", 400)
  try {
    const offer = await db.offer.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        couponCode: couponCode.toUpperCase(),
        discountText: discountText || null,
        ctaText: ctaText || "Claim Offer Now",
        ctaHref: ctaHref || "/packages",
        image: image || null,
        bgColor: bgColor || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isActive: isActive ?? true,
        showDelay: showDelay ?? 8,
      },
    })
    return ok(offer, 201)
  } catch (e: any) {
    if (e?.code === "P2002") return err("Coupon code already exists", 409)
    return err("Failed to create offer: " + (e?.message || "unknown"), 500)
  }
}
