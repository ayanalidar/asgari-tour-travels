import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { ok, err, requireAdmin, readBody } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return err("Unauthorized", 401)
  const { id } = await params
  const offer = await db.offer.findUnique({ where: { id } })
  if (!offer) return err("Offer not found", 404)
  return ok(offer)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return err("Unauthorized", 401)
  const { id } = await params
  const body = await readBody(req)
  const { title, subtitle, description, couponCode, discountText, ctaText, ctaHref, image, bgColor, expiryDate, isActive, showDelay } = body
  try {
    const offer = await db.offer.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle: subtitle || null }),
        ...(description !== undefined && { description: description || null }),
        ...(couponCode !== undefined && { couponCode: couponCode.toUpperCase() }),
        ...(discountText !== undefined && { discountText: discountText || null }),
        ...(ctaText !== undefined && { ctaText }),
        ...(ctaHref !== undefined && { ctaHref }),
        ...(image !== undefined && { image: image || null }),
        ...(bgColor !== undefined && { bgColor: bgColor || null }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(showDelay !== undefined && { showDelay }),
      },
    })
    return ok(offer)
  } catch (e: any) {
    return err("Failed to update offer: " + (e?.message || "unknown"), 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return err("Unauthorized", 401)
  const { id } = await params
  try {
    await db.offer.delete({ where: { id } })
    return ok({ deleted: true })
  } catch {
    return err("Offer not found", 404)
  }
}
