import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const featured = url.searchParams.get("featured");

    const where: any = {};
    if (search) {
      where.OR = [{ title: { contains: search } }, { alt: { contains: search } }, { description: { contains: search } }];
    }
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const imgs = await db.galleryImage.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { destination: { select: { id: true, name: true } } },
    });
    return ok({ images: imgs, total: imgs.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.url) return err("Image URL is required", 400);
    const url = await normalizeImage(body.url, "gallery");

    const img = await db.galleryImage.create({
      data: {
        title: body.title || null,
        description: body.description || null,
        url: url!,
        alt: body.alt || null,
        category: body.category || "destination",
        destinationId: body.destinationId || null,
        featured: !!body.featured,
      },
    });
    return ok({ image: img }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
