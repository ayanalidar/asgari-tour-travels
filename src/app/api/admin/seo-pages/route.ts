import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage } from "@/lib/upload";
import { parseJSON } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const where: any = {};
    if (search) {
      where.OR = [{ title: { contains: search } }, { slug: { contains: search } }];
    }
    if (status) where.status = status;
    const pages = await db.seoPage.findMany({
      where,
      orderBy: [{ title: "asc" }],
    });
    const mapped = pages.map((p) => ({ ...p, sections: parseJSON(p.sections, []) }));
    return ok({ pages: mapped, total: mapped.length });
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
    while (await db.seoPage.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${slugify(body.title)}-${suffix}`;
    }
    const heroImage = await normalizeImage(body.heroImage, slug);

    const page = await db.seoPage.create({
      data: {
        slug,
        title: body.title,
        content: body.content || "",
        heroImage,
        sections: JSON.stringify(Array.isArray(body.sections) ? body.sections : []),
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        metaKeywords: body.metaKeywords || null,
        status: body.status || "published",
      },
    });
    return ok({ page }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}
