import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";
import { parseJSON } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const p = await db.seoPage.findUnique({ where: { id } });
  if (!p) return err("Not found", 404);
  return ok({ page: { ...p, sections: parseJSON(p.sections, []) } });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.seoPage.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let slug = existing.slug;
  if (body.slug && body.slug.trim() && slugify(body.slug) !== existing.slug) {
    const newSlug = slugify(body.slug);
    const dup = await db.seoPage.findUnique({ where: { slug: newSlug } });
    if (dup && dup.id !== id) return err("Slug already in use", 400);
    slug = newSlug;
  }

  const heroImage = await normalizeImage(body.heroImage ?? existing.heroImage, slug);

  const updated = await db.seoPage.update({
    where: { id },
    data: {
      slug,
      title: body.title ?? existing.title,
      content: body.content ?? existing.content,
      heroImage,
      sections: JSON.stringify(Array.isArray(body.sections) ? body.sections : parseJSON(existing.sections, [])),
      metaTitle: body.metaTitle ?? existing.metaTitle,
      metaDescription: body.metaDescription ?? existing.metaDescription,
      metaKeywords: body.metaKeywords ?? existing.metaKeywords,
      status: body.status ?? existing.status,
    },
  });
  return ok({ page: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.seoPage.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
