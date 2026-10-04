import { NextRequest } from "next/server";
import { ok, err, requireAdmin, slugify, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { normalizeImage, normalizeImages } from "@/lib/upload";
import { safeArray } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const region = url.searchParams.get("region") || "";
    const status = url.searchParams.get("status") || "";
    const featured = url.searchParams.get("featured");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { slug: { contains: search } },
      ];
    }
    if (region) where.region = region;
    if (status) where.status = status;
    if (featured === "true") where.featured = true;
    if (featured === "false") where.featured = false;

    const dests = await db.destination.findMany({
      where,
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
    const mapped = dests.map((d) => ({
      ...d,
      images: safeArray(d.images),
      thingsToDo: safeArray(d.thingsToDo),
    }));
    return ok({ destinations: mapped, total: mapped.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.name) return err("Name is required", 400);

    let slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);
    // ensure unique
    let suffix = 0;
    while (await db.destination.findUnique({ where: { slug } })) {
      suffix++;
      slug = `${slugify(body.name)}-${suffix}`;
    }

    const heroImage = await normalizeImage(body.heroImage, slug);
    const images = await normalizeImages(Array.isArray(body.images) ? body.images : safeArray(body.images), slug);

    const dest = await db.destination.create({
      data: {
        slug,
        name: body.name,
        region: body.region || "kashmir",
        category: body.category || "destination",
        tagline: body.tagline || null,
        shortDescription: body.shortDescription || "",
        description: body.description || "",
        heroImage,
        images: JSON.stringify(images),
        bestTimeToVisit: body.bestTimeToVisit || null,
        duration: body.duration || null,
        altitude: body.altitude || null,
        distance: body.distance || null,
        howToReach: body.howToReach || null,
        thingsToDo: JSON.stringify(Array.isArray(body.thingsToDo) ? body.thingsToDo : []),
        latitude: typeof body.latitude === "number" ? body.latitude : body.latitude ? parseFloat(body.latitude) : null,
        longitude: typeof body.longitude === "number" ? body.longitude : body.longitude ? parseFloat(body.longitude) : null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        metaKeywords: body.metaKeywords || null,
        featured: !!body.featured,
        popular: !!body.popular,
        order: body.order ? parseInt(body.order) : 0,
        status: body.status || "published",
      },
    });
    return ok({ destination: dest }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
