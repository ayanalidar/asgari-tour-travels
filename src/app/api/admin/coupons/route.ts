import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const active = url.searchParams.get("active");
    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (active === "true") where.isActive = true;
    if (active === "false") where.isActive = false;

    const coupons = await db.coupon.findMany({
      where,
      include: { packages: { include: { package: true } } },
      orderBy: [{ createdAt: "desc" }],
    });
    const mapped = coupons.map((c) => ({
      ...c,
      packages: c.packages.map((pc) => ({ id: pc.package.id, title: pc.package.title, slug: pc.package.slug })),
    }));
    return ok({ coupons: mapped, total: mapped.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.code) return err("Coupon code is required", 400);
    const code = String(body.code).toUpperCase().trim();
    const existing = await db.coupon.findUnique({ where: { code } });
    if (existing) return err("Coupon code already exists", 400);

    const coupon = await db.coupon.create({
      data: {
        code,
        description: body.description || null,
        discountType: body.discountType === "fixed" ? "fixed" : "percentage",
        discountValue: parseFloat(body.discountValue) || 0,
        maxUses: parseInt(body.maxUses) || 100,
        usedCount: 0,
        minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : null,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        isActive: body.isActive !== undefined ? !!body.isActive : true,
      },
    });

    // Link packages
    const packageIds: string[] = Array.isArray(body.packageIds) ? body.packageIds : [];
    for (const pid of packageIds) {
      const p = await db.tourPackage.findUnique({ where: { id: pid } });
      if (!p) continue;
      await db.packageCoupon.create({ data: { packageId: pid, couponId: coupon.id } }).catch(() => null);
    }
    return ok({ coupon }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
