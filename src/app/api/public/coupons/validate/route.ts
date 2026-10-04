import { NextRequest } from "next/server"
import { getValidCoupon } from "@/lib/queries"
import { ok, err, readBody } from "@/lib/api"
import { applyCoupon } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const body = await readBody<any>(req)
  const code = (body.code ?? "").toString().trim().toUpperCase()
  const packageId = body.packageId ?? null
  const orderValue = Number(body.orderValue) || 0

  if (!code) return err("Please provide a coupon code", 422)

  const coupon = await getValidCoupon(code)
  if (!coupon) {
    return err("Invalid or expired coupon code", 404)
  }

  // If package-specific, validate association
  if (packageId) {
    const link = await (await import("@/lib/db")).db.packageCoupon.findUnique({
      where: {
        packageId_couponId: { packageId, couponId: coupon.id },
      },
    })
    // Allow if no packageCoupon associations exist (coupon applies to all),
    // or if this package is explicitly linked
    const anyAssoc = await (await import("@/lib/db")).db.packageCoupon.findFirst({
      where: { couponId: coupon.id },
    })
    if (anyAssoc && !link) {
      return err("This coupon is not valid for the selected package", 422)
    }
  }

  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    return err(
      `Minimum order value for this coupon is ₹${coupon.minOrderValue.toLocaleString("en-IN")}`,
      422,
    )
  }

  const { finalPrice, discount } = applyCoupon(orderValue, coupon)

  return ok({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    finalPrice,
    description: coupon.description,
  })
}
