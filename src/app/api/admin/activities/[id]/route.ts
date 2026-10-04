import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImages } from "@/lib/upload";
import { safeArray } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const a = await db.activity.findUnique({ where: { id } });
  if (!a) return err("Not found", 404);
  return ok({ activity: { ...a, images: safeArray(a.images) } });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.activity.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let slug = existing.slug;
  if (body.slug && body.slug.trim() && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const dup = await db.activity.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== id) return err("Slug already in use", 400);
    slug = newSlug;
  }

  const imagesRaw = Array.isArray(body.images) ? body.images : safeArray(body.images || existing.images);
  const images = await normalizeImages(imagesRaw, slug);

  const updated = await db.activity.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      category: body.category ?? existing.category,
      shortDescription: body.shortDescription ?? existing.shortDescription,
      description: body.description ?? existing.description,
      images: JSON.stringify(images),
      duration: body.duration ?? existing.duration,
      difficulty: body.difficulty ?? existing.difficulty,
      bestSeason: body.bestSeason ?? existing.bestSeason,
      destinationId: body.destinationId !== undefined ? (body.destinationId || null) : existing.destinationId,
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
      featured: body.featured !== undefined ? !!body.featured : existing.featured,
      order: body.order !== undefined ? parseInt(body.order) || 0 : existing.order,
      status: body.status ?? existing.status,
    },
  });
  return ok({ activity: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.activity.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
