import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const minRating = url.searchParams.get("minRating");
    const where: any = {};
    if (search) where.text = { contains: search };
    if (minRating) where.rating = { gte: parseInt(minRating) };
    const reviews = await db.googleReview.findMany({
      where,
      orderBy: [{ reviewDate: "desc" }],
    });
    return ok({ reviews, total: reviews.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.authorName || !body.text) return err("Author name and text are required", 400);
    const review = await db.googleReview.create({
      data: {
        placeId: body.placeId || null,
        authorName: body.authorName,
        authorAvatar: body.authorAvatar || null,
        rating: Math.min(5, Math.max(1, parseInt(body.rating) || 5)),
        text: body.text,
        reviewDate: body.reviewDate ? new Date(body.reviewDate) : new Date(),
        sourceUrl: body.sourceUrl || null,
      },
    });
    return ok({ review }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
