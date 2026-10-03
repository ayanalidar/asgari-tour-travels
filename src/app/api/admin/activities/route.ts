import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImages } from "@/lib/upload";
import { safeArray } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const category = url.searchParams.get("category") || "";

    const where: any = {};
    if (search) {
      where.OR = [{ title: { contains: search } }, { shortDescription: { contains: search } }, { slug: { contains: search } }];
    }
    if (status) where.status = status;
    if (category) where.category = category;

    const acts = await db.activity.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: { destination: { select: { id: true, name: true, slug: true } } },
    });
    const mapped = acts.map((a) => ({ ...a, images: safeArray(a.images) }));
    return ok({ activities: mapped, total: mapped.length });
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
    while (await db.activity.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${slugify(body.title)}-${suffix}`;
    }

    const images = await normalizeImages(
      Array.isArray(body.images) ? body.images : safeArray(body.images),
      slug
    );

    const a = await db.activity.create({
      data: {
        slug,
        title: body.title,
        category: body.category || "adventure",
        shortDescription: body.shortDescription || "",
        description: body.description || "",
        images: JSON.stringify(images),
        duration: body.duration || null,
        difficulty: body.difficulty || null,
        bestSeason: body.bestSeason || null,
        destinationId: body.destinationId || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        featured: !!body.featured,
        order: body.order ? parseInt(body.order) : 0,
        status: body.status || "published",
      },
    });
    return ok({ activity: a }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
