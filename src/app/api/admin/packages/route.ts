import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage, normalizeImages } from "@/lib/upload";
import { safeArray, parseJSON } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { slug: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const pkgs = await db.tourPackage.findMany({
      where,
      include: {
        destinations: { include: { destination: true }, orderBy: { order: "asc" } },
        coupons: { include: { coupon: true } },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const mapped = pkgs.map((p) => ({
      ...p,
      inclusions: safeArray(p.inclusions),
      exclusions: safeArray(p.exclusions),
      highlights: safeArray(p.highlights),
      itinerary: parseJSON(p.itinerary, []),
      images: safeArray(p.images),
      destinations: p.destinations.map((pd) => ({ id: pd.destination.id, name: pd.destination.name, slug: pd.destination.slug, order: pd.order })),
      coupons: p.coupons.map((pc) => ({ id: pc.coupon.id, code: pc.coupon.code })),
    }));
    return ok({ packages: mapped, total: mapped.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.title) return err("Title is required", 400);

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.title);
    let suffix = 0;
    while (await db.tourPackage.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${slugify(body.title)}-${suffix}`;
    }

    const coverImage = await normalizeImage(body.coverImage, slug);
    const images = await normalizeImages(
      Array.isArray(body.images) ? body.images : safeArray(body.images),
      slug
    );

    const pkg = await db.tourPackage.create({
      data: {
        slug,
        title: body.title,
        subtitle: body.subtitle || null,
        shortDescription: body.shortDescription || "",
        description: body.description || "",
        durationDays: parseInt(body.durationDays) || 3,
        durationNights: parseInt(body.durationNights) || 2,
        price: parseFloat(body.price) || 0,
        discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : null,
        currency: body.currency || "INR",
        inclusions: JSON.stringify(Array.isArray(body.inclusions) ? body.inclusions : []),
        exclusions: JSON.stringify(Array.isArray(body.exclusions) ? body.exclusions : []),
        highlights: JSON.stringify(Array.isArray(body.highlights) ? body.highlights : []),
        itinerary: JSON.stringify(Array.isArray(body.itinerary) ? body.itinerary : []),
        images: JSON.stringify(images),
        coverImage,
        rating: parseFloat(body.rating) || 4.5,
        reviewCount: parseInt(body.reviewCount) || 0,
        groupSize: body.groupSize || null,
        difficulty: body.difficulty || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        featured: !!body.featured,
        popular: !!body.popular,
        status: body.status || "published",
        order: body.order ? parseInt(body.order) : 0,
      },
    });

    // Link destinations
    const destIds: string[] = Array.isArray(body.destinationIds) ? body.destinationIds : [];
    for (let i = 0; i < destIds.length; i++) {
      const did = destIds[i];
      const exists = await db.destination.findUnique({ where: { id: did } });
      if (!exists) continue;
      await db.packageDestination.create({
        data: { packageId: pkg.id, destinationId: did, order: i },
      });
    }
    // Link coupons
    const couponIds: string[] = Array.isArray(body.couponIds) ? body.couponIds : [];
    for (const cid of couponIds) {
      const c = await db.coupon.findUnique({ where: { id: cid } });
      if (!c) continue;
      await db.packageCoupon.create({
        data: { packageId: pkg.id, couponId: cid },
      }).catch(() => null);
    }
    return ok({ package: pkg }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
