import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ok } from "@/lib/api";
import { safeArray } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  if (!q || q.length < 2) return ok({ destinations: [], packages: [], blog: [] });

  const [destinations, packages, blog] = await Promise.all([
    db.destination.findMany({
      where: {
        status: "published",
        OR: [
          { name: { contains: q } },
          { tagline: { contains: q } },
          { shortDescription: { contains: q } },
          { region: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 6,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
      select: { id: true, slug: true, name: true, region: true, category: true, tagline: true, heroImage: true, shortDescription: true },
    }),
    db.tourPackage.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
          { shortDescription: { contains: q } },
        ],
      },
      take: 5,
      orderBy: [{ featured: "desc" }, { title: "asc" }],
      select: { id: true, slug: true, title: true, subtitle: true, durationDays: true, durationNights: true, price: true, discountPrice: true, coverImage: true, rating: true, shortDescription: true },
    }),
    db.blogPost.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 4,
      orderBy: [{ publishedAt: "desc" }],
      select: { id: true, slug: true, title: true, excerpt: true, category: true, coverImage: true, readTime: true },
    }),
  ]);

  return ok({ destinations, packages, blog });
}

export const dynamic = "force-dynamic";
