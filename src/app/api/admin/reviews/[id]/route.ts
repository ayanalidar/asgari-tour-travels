import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.googleReview.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  const updated = await db.googleReview.update({
    where: { id },
    data: {
      authorName: body.authorName ?? existing.authorName,
      authorAvatar: body.authorAvatar ?? existing.authorAvatar,
      rating: body.rating !== undefined ? Math.min(5, Math.max(1, parseInt(body.rating) || 5)) : existing.rating,
      text: body.text ?? existing.text,
      reviewDate: body.reviewDate ? new Date(body.reviewDate) : existing.reviewDate,
      sourceUrl: body.sourceUrl ?? existing.sourceUrl,
    },
  });
  return ok({ review: updated });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.googleReview.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
