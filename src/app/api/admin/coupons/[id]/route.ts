import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const c = await db.coupon.findUnique({
    where: { id },
    include: { packages: { include: { package: true } } },
  });
  if (!c) return err("Not found", 404);
  return ok({
    coupon: {
      ...c,
      packages: c.packages.map((pc) => ({ id: pc.package.id, title: pc.package.title, slug: pc.package.slug })),
    },
  });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.coupon.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  // Code uniqueness if changing
  let code = existing.code;
  if (body.code && body.code.trim() && body.code.toUpperCase().trim() !== existing.code) {
    const newCode = body.code.toUpperCase().trim();
    const dup = await db.coupon.findUnique({ where: { code: newCode } });
    if (dup && dup.id !== id) return err("Coupon code already in use", 400);
    code = newCode;
  }

  const updated = await db.coupon.update({
    where: { id },
    data: {
      code,
      description: body.description ?? existing.description,
      discountType: body.discountType ?? existing.discountType,
      discountValue: body.discountValue !== undefined ? parseFloat(body.discountValue) || 0 : existing.discountValue,
      maxUses: body.maxUses !== undefined ? parseInt(body.maxUses) || 100 : existing.maxUses,
      minOrderValue: body.minOrderValue !== undefined ? (body.minOrderValue ? parseFloat(body.minOrderValue) : null) : existing.minOrderValue,
      validFrom: body.validFrom !== undefined ? (body.validFrom ? new Date(body.validFrom) : null) : existing.validFrom,
      validUntil: body.validUntil !== undefined ? (body.validUntil ? new Date(body.validUntil) : null) : existing.validUntil,
      isActive: body.isActive !== undefined ? !!body.isActive : existing.isActive,
    },
  });

  if (Array.isArray(body.packageIds)) {
    await db.packageCoupon.deleteMany({ where: { couponId: id } });
    for (const pid of body.packageIds) {
      const p = await db.tourPackage.findUnique({ where: { id: pid } });
      if (!p) continue;
      await db.packageCoupon.create({ data: { packageId: pid, couponId: id } }).catch(() => null);
    }
  }
  return ok({ coupon: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.coupon.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
