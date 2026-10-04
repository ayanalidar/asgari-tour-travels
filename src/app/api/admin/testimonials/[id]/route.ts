import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const t = await db.testimonial.findUnique({ where: { id } });
  if (!t) return err("Not found", 404);
  return ok({ testimonial: t });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  const avatar = await normalizeImage(body.avatar ?? existing.avatar, "avatar");

  const updated = await db.testimonial.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      location: body.location ?? existing.location,
      avatar,
      rating: body.rating !== undefined ? Math.min(5, Math.max(1, parseInt(body.rating) || 5)) : existing.rating,
      title: body.title ?? existing.title,
      text: body.text ?? existing.text,
      packageId: body.packageId !== undefined ? (body.packageId || null) : existing.packageId,
      featured: body.featured !== undefined ? !!body.featured : existing.featured,
      approved: body.approved !== undefined ? !!body.approved : existing.approved,
      source: body.source ?? existing.source,
    },
  });
  return ok({ testimonial: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.testimonial.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
