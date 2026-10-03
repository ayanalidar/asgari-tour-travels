import type { MetadataRoute } from "next"
import {
  getAllDestinations,
  getAllPackages,
  getAllBlogPosts,
  getAllSeoPages,
} from "@/lib/queries"

const BASE = "https://asgaritravels.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, packages, posts, seoPages] = await Promise.all([
    getAllDestinations(),
    getAllPackages(),
    getAllBlogPosts(),
    getAllSeoPages(),
  ])

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE}/destinations`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/packages`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/ladakh`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/things-to-do`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/about`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/contact`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/faq`, priority: 0.5, changeFrequency: "monthly" },
  ]

  const destEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE}/destinations/${d.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: new Date(),
  }))

  const pkgEntries: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${BASE}/packages/${p.slug}`,
    priority: 0.85,
    changeFrequency: "weekly",
    lastModified: new Date(),
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: new Date(b.publishedAt),
  }))

  const seoEntries: MetadataRoute.Sitemap = seoPages.map((s) => ({
    url: `${BASE}/${s.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: new Date(),
  }))

  return [...staticEntries, ...destEntries, ...pkgEntries, ...blogEntries, ...seoEntries]
}
