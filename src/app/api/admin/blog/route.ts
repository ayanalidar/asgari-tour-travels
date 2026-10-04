import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";
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
      where.OR = [{ title: { contains: search } }, { excerpt: { contains: search } }, { slug: { contains: search } }];
    }
    if (status) where.status = status;
    if (category) where.category = category;

    const posts = await db.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    const mapped = posts.map((p) => ({
      ...p,
      tags: safeArray(p.tags),
    }));
    return ok({ posts: mapped, total: mapped.length });
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
    while (await db.blogPost.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${slugify(body.title)}-${suffix}`;
    }

    const coverImage = await normalizeImage(body.coverImage, slug);

    const post = await db.blogPost.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt || "",
        content: body.content || "",
        coverImage,
        category: body.category || "Travel Guide",
        tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
        author: body.author || "Asgari Tour & Travels",
        readTime: parseInt(body.readTime) || 5,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        status: body.status || "published",
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });
    return ok({ post }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
