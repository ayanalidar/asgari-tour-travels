import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { db } from "@/lib/db";
import { parseJSON, safeArray } from "@/lib/types";
import { getSettings } from "@/lib/settings";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const [destinations, packages, blog, leads, testimonials, reviews, coupons] =
      await Promise.all([
        db.destination.count(),
        db.tourPackage.count(),
        db.blogPost.count(),
        db.lead.count(),
        db.testimonial.count(),
        db.googleReview.count(),
        db.coupon.count(),
      ]);

    // Recent leads (latest 6)
    const recentLeads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    // Recent bookings (leads with status converted, latest 5)
    const convertedLeads = await db.lead.findMany({
      where: { status: "converted" },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Leads grouped by source
    const leadsBySourceRaw = await db.lead.groupBy({
      by: ["source"],
      _count: { _all: true },
    });
    const leadsBySource = leadsBySourceRaw.map((r) => ({
      source: r.source,
      count: r._count._all,
    }));

    // Leads grouped by status
    const leadsByStatusRaw = await db.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    const leadsByStatus = leadsByStatusRaw.map((r) => ({
      status: r.status,
      count: r._count._all,
    }));

    // Leads over last 7 days
    const now = new Date();
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const end = new Date(d);
      end.setDate(end.getDate() + 1);
      const count = await db.lead.count({
        where: { createdAt: { gte: d, lt: end } },
      });
      days.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        count,
      });
    }

    // Popular packages (by reviewCount + rating, top 5)
    const popularPackages = await db.tourPackage.findMany({
      where: { status: "published" },
      orderBy: [{ reviewCount: "desc" }, { rating: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        rating: true,
        reviewCount: true,
        price: true,
      },
    });

    // Revenue estimate: sum of convertedLeads budget (if numeric) else use package prices
    const allConverted = await db.lead.findMany({
      where: { status: "converted" },
      select: { budget: true, packageId: true },
    });
    let revenue = 0;
    for (const l of allConverted) {
      if (l.budget) {
        const m = l.budget.replace(/[^\d.]/g, "");
        const v = parseFloat(m);
        if (!isNaN(v) && v > 0) revenue += v;
      }
    }
    if (revenue === 0) {
      // fallback: 30% of packages' price × reviewCount
      const pkgs = await db.tourPackage.findMany({
        select: { price: true, reviewCount: true },
      });
      revenue = pkgs.reduce((s, p) => s + p.price * Math.max(1, p.reviewCount) * 0.1, 0);
    }

    // Recent testimonials (latest 4)
    const recentTestimonials = await db.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        name: true,
        location: true,
        rating: true,
        title: true,
        text: true,
        featured: true,
        approved: true,
        source: true,
        createdAt: true,
      },
    });

    const settings = await getSettings();
    const googleRating = settings?.google_rating ?? 4.8;
    const googleReviewCount = settings?.google_review_count ?? 1247;

    return ok({
      counts: {
        destinations,
        packages,
        blog,
        leads,
        testimonials,
        reviews,
        coupons,
      },
      revenue,
      googleRating,
      googleReviewCount,
      recentLeads,
      convertedLeads,
      recentTestimonials,
      leadsBySource,
      leadsByStatus,
      leadsByDay: days,
      popularPackages,
    });
  } catch (e: any) {
    return err("Stats failed: " + (e?.message || "unknown"), 500);
  }
}
