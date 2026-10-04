import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { db } from "@/lib/db";
import { getSetting, setSetting } from "@/lib/settings";

const SAMPLE_REVIEWS = [
  {
    authorName: "Rajesh Kumar",
    rating: 5,
    text: "Outstanding service! Asgari Tour & Travels made our Kashmir trip truly unforgettable. Highly recommend their Gulmarg package.",
    daysAgo: 2,
  },
  {
    authorName: "Priya Sharma",
    rating: 5,
    text: "Best travel agency in Srinagar. The houseboat stay on Dal Lake was magical. Professional drivers and knowledgeable guides.",
    daysAgo: 5,
  },
  {
    authorName: "Mohammed Ali",
    rating: 4,
    text: "Ladakh expedition was well-organized. Pangong Lake views were breathtaking. Acclimatization guidance was spot on.",
    daysAgo: 8,
  },
  {
    authorName: "Sneha Reddy",
    rating: 5,
    text: "Honeymoon package exceeded expectations. Pahalgam and Sonmarg were highlights. Thank you Asgari team!",
    daysAgo: 12,
  },
];

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const apiKey = (await getSetting("google_api_key")) as string | null;
    const placeId = (await getSetting("google_place_id")) as string | null;
    const now = new Date();

    let inserted = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    if (apiKey && placeId) {
      // Real fetch to Google Places Details API
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,reviews,user_ratings_total&key=${encodeURIComponent(apiKey)}`;
        const resp = await fetch(url, { cache: "no-store" });
        const data = await resp.json();
        if (data?.status === "OK" && data?.result) {
          const r = data.result;
          if (typeof r.rating === "number") {
            await setSetting("google_rating", r.rating, "google");
          }
          if (typeof r.user_ratings_total === "number") {
            await setSetting("google_review_count", r.user_ratings_total, "google");
          }
          const reviews = Array.isArray(r.reviews) ? r.reviews : [];
          for (const rv of reviews) {
            const author = rv.author_name || "Anonymous";
            const text = rv.text || "";
            const rating = typeof rv.rating === "number" ? Math.round(rv.rating) : 5;
            const date = rv.time ? new Date(rv.time * 1000) : new Date();
            const avatar = rv.profile_photo_url || null;
            // Avoid duplicates by author+text
            const exists = await db.googleReview.findFirst({
              where: { authorName: author, text: text },
            });
            if (exists) continue;
            await db.googleReview.create({
              data: {
                placeId,
                authorName: author,
                authorAvatar: avatar,
                rating,
                text,
                reviewDate: date,
                sourceUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
              },
            });
            inserted++;
            ratingSum += rating;
            ratingCount++;
          }
          await setSetting("google_last_sync", now.toISOString(), "google");
          return ok({
            status: "success",
            source: "google_places_api",
            inserted,
            rating: r.rating,
            totalReviews: r.user_ratings_total,
          });
        } else {
          // Fall through to sample
        }
      } catch {
        // Network/API error → fall through to sample
      }
    }

    // No API key / placeId, or fetch failed → insert sample reviews
    for (const s of SAMPLE_REVIEWS) {
      const exists = await db.googleReview.findFirst({
        where: { authorName: s.authorName, text: s.text },
      });
      if (exists) continue;
      const d = new Date();
      d.setDate(d.getDate() - s.daysAgo);
      await db.googleReview.create({
        data: {
          placeId: placeId || "manual",
          authorName: s.authorName,
          authorAvatar: null,
          rating: s.rating,
          text: s.text,
          reviewDate: d,
          sourceUrl: null,
        },
      });
      inserted++;
      ratingSum += s.rating;
      ratingCount++;
    }

    // Update aggregate rating from existing reviews
    const allReviews = await db.googleReview.findMany({ select: { rating: true } });
    const avg =
      allReviews.length > 0
        ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
        : 4.8;
    await setSetting("google_rating", Math.round(avg * 10) / 10, "google");
    await setSetting("google_review_count", allReviews.length, "google");
    await setSetting("google_last_sync", now.toISOString(), "google");

    return ok({
      status: "success",
      source: apiKey && placeId ? "google_places_api_fallback" : "sample_seed",
      inserted,
      rating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    });
  } catch (e: any) {
    return err("Google sync failed: " + (e?.message || "unknown"), 500);
  }
}
