import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.galleryImage.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  let url = existing.url;
  if (body.url && body.url !== existing.url) {
    url = (await normalizeImage(body.url, "gallery")) || existing.url;
  }

  const updated = await db.galleryImage.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      url,
      alt: body.alt ?? existing.alt,
      category: body.category ?? existing.category,
      destinationId: body.destinationId !== undefined ? (body.destinationId || null) : existing.destinationId,
      featured: body.featured !== undefined ? !!body.featured : existing.featured,
    },
  });
  return ok({ image: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.galleryImage.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
