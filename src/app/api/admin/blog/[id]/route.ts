import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";
import { safeArray } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const p = await db.blogPost.findUnique({ where: { id } });
  if (!p) return err("Not found", 404);
  return ok({ post: { ...p, tags: safeArray(p.tags) } });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let slug = existing.slug;
  if (body.slug && body.slug.trim() && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const dup = await db.blogPost.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== id) return err("Slug already in use", 400);
    slug = newSlug;
  }

  const coverImage = await normalizeImage(body.coverImage ?? existing.coverImage, slug);

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      excerpt: body.excerpt ?? existing.excerpt,
      content: body.content ?? existing.content,
      coverImage,
      category: body.category ?? existing.category,
      tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : safeArray(existing.tags)),
      author: body.author ?? existing.author,
      readTime: body.readTime !== undefined ? parseInt(body.readTime) || 5 : existing.readTime,
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
      status: body.status ?? existing.status,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : existing.publishedAt,
    },
  });
  return ok({ post: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.blogPost.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
