import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage, normalizeImages } from "@/lib/upload";
import { safeArray } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const dest = await db.destination.findUnique({ where: { id } });
  if (!dest) return err("Not found", 404);
  return ok({
    destination: {
      ...dest,
      images: safeArray(dest.images),
      thingsToDo: safeArray(dest.thingsToDo),
    },
  });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.destination.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let slug = existing.slug;
  if (body.slug && body.slug.trim() && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const dup = await db.destination.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== id) return err("Slug already in use", 400);
    slug = newSlug;
  }

  const heroImage = await normalizeImage(body.heroImage ?? existing.heroImage, slug);
  const imagesRaw = Array.isArray(body.images) ? body.images : safeArray(body.images || existing.images);
  const images = await normalizeImages(imagesRaw, slug);

  const updated = await db.destination.update({
    where: { id },
    data: {
      slug,
      name: body.name ?? existing.name,
      region: body.region ?? existing.region,
      category: body.category ?? existing.category,
      tagline: body.tagline ?? existing.tagline,
      shortDescription: body.shortDescription ?? existing.shortDescription,
      description: body.description ?? existing.description,
      heroImage,
      images: JSON.stringify(images),
      bestTimeToVisit: body.bestTimeToVisit ?? existing.bestTimeToVisit,
      duration: body.duration ?? existing.duration,
      altitude: body.altitude ?? existing.altitude,
      distance: body.distance ?? existing.distance,
      howToReach: body.howToReach ?? existing.howToReach,
      thingsToDo: JSON.stringify(Array.isArray(body.thingsToDo) ? body.thingsToDo : safeArray(existing.thingsToDo)),
      latitude:
        body.latitude !== undefined
          ? body.latitude === null || body.latitude === ""
            ? null
            : typeof body.latitude === "number"
              ? body.latitude
              : parseFloat(body.latitude)
          : existing.latitude,
      longitude:
        body.longitude !== undefined
          ? body.longitude === null || body.longitude === ""
            ? null
            : typeof body.longitude === "number"
              ? body.longitude
              : parseFloat(body.longitude)
          : existing.longitude,
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
      metaKeywords: body.metaKeywords ?? existing.metaKeywords,
      featured: body.featured !== undefined ? !!body.featured : existing.featured,
      popular: body.popular !== undefined ? !!body.popular : existing.popular,
      order: body.order !== undefined ? parseInt(body.order) || 0 : existing.order,
      status: body.status ?? existing.status,
    },
  });
  return ok({ destination: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.destination.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
