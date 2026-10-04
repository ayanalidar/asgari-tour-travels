import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage, normalizeImages } from "@/lib/upload";
import { safeArray, parseJSON } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const p = await db.tourPackage.findUnique({
    where: { id },
    include: {
      destinations: { include: { destination: true }, orderBy: { order: "asc" } },
      coupons: { include: { coupon: true } },
    },
  });
  if (!p) return err("Not found", 404);
  return ok({
    package: {
      ...p,
      inclusions: safeArray(p.inclusions),
      exclusions: safeArray(p.exclusions),
      highlights: safeArray(p.highlights),
      itinerary: parseJSON(p.itinerary, []),
      images: safeArray(p.images),
      destinations: p.destinations.map((pd) => ({ id: pd.destination.id, name: pd.destination.name, slug: pd.destination.slug, order: pd.order })),
      coupons: p.coupons.map((pc) => ({ id: pc.coupon.id, code: pc.coupon.code })),
    },
  });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.tourPackage.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let slug = existing.slug;
  if (body.slug && body.slug.trim() && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const dup = await db.tourPackage.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== id) return err("Slug already in use", 400);
    slug = newSlug;
  }

  const coverImage = await normalizeImage(body.coverImage ?? existing.coverImage, slug);
  const imagesRaw = Array.isArray(body.images) ? body.images : safeArray(body.images || existing.images);
  const images = await normalizeImages(imagesRaw, slug);

  const updated = await db.tourPackage.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      subtitle: body.subtitle ?? existing.subtitle,
      shortDescription: body.shortDescription ?? existing.shortDescription,
      description: body.description ?? existing.description,
      durationDays: body.durationDays !== undefined ? parseInt(body.durationDays) || 0 : existing.durationDays,
      durationNights: body.durationNights !== undefined ? parseInt(body.durationNights) || 0 : existing.durationNights,
      price: body.price !== undefined ? parseFloat(body.price) || 0 : existing.price,
      discountPrice: body.discountPrice !== undefined ? (body.discountPrice ? parseFloat(body.discountPrice) : null) : existing.discountPrice,
      currency: body.currency ?? existing.currency,
      inclusions: JSON.stringify(Array.isArray(body.inclusions) ? body.inclusions : safeArray(existing.inclusions)),
      exclusions: JSON.stringify(Array.isArray(body.exclusions) ? body.exclusions : safeArray(existing.exclusions)),
      highlights: JSON.stringify(Array.isArray(body.highlights) ? body.highlights : safeArray(existing.highlights)),
      itinerary: JSON.stringify(Array.isArray(body.itinerary) ? body.itinerary : parseJSON(existing.itinerary, [])),
      images: JSON.stringify(images),
      coverImage,
      rating: body.rating !== undefined ? parseFloat(body.rating) || 0 : existing.rating,
      reviewCount: body.reviewCount !== undefined ? parseInt(body.reviewCount) || 0 : existing.reviewCount,
      groupSize: body.groupSize ?? existing.groupSize,
      difficulty: body.difficulty ?? existing.difficulty,
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
      featured: body.featured !== undefined ? !!body.featured : existing.featured,
      popular: body.popular !== undefined ? !!body.popular : existing.popular,
      status: body.status ?? existing.status,
      order: body.order !== undefined ? parseInt(body.order) || 0 : existing.order,
    },
  });

  // Sync destinations
  if (Array.isArray(body.destinationIds)) {
    await db.packageDestination.deleteMany({ where: { packageId: id } });
    for (let i = 0; i < body.destinationIds.length; i++) {
      const did = body.destinationIds[i];
      const exists = await db.destination.findUnique({ where: { id: did } });
      if (!exists) continue;
      await db.packageDestination.create({
        data: { packageId: id, destinationId: did, order: i },
      }).catch(() => null);
    }
  }
  // Sync coupons
  if (Array.isArray(body.couponIds)) {
    await db.packageCoupon.deleteMany({ where: { packageId: id } });
    for (const cid of body.couponIds) {
      const c = await db.coupon.findUnique({ where: { id: cid } });
      if (!c) continue;
      await db.packageCoupon.create({ data: { packageId: id, couponId: cid } }).catch(() => null);
    }
  }
  return ok({ package: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.tourPackage.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
