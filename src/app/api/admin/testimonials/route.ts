import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const approved = url.searchParams.get("approved");
    const featured = url.searchParams.get("featured");
    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search } }, { text: { contains: search } }, { title: { contains: search } }];
    }
    if (approved === "true") where.approved = true;
    if (approved === "false") where.approved = false;
    if (featured === "true") where.featured = true;

    const testimonials = await db.testimonial.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      include: { package: { select: { id: true, title: true, slug: true } } },
    });
    return ok({ testimonials, total: testimonials.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.name || !body.text) return err("Name and text are required", 400);

    const avatar = await normalizeImage(body.avatar, "avatar");

    const t = await db.testimonial.create({
      data: {
        name: body.name,
        location: body.location || null,
        avatar,
        rating: Math.min(5, Math.max(1, parseInt(body.rating) || 5)),
        title: body.title || null,
        text: body.text,
        packageId: body.packageId || null,
        featured: !!body.featured,
        approved: body.approved !== undefined ? !!body.approved : true,
        source: body.source || "direct",
      },
    });
    return ok({ testimonial: t }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
