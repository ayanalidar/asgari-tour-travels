// Server-side data fetching helpers for Asgari Tour & Travels
import { db } from '@/lib/db'
import { parseJSON, safeArray } from '@/lib/types'
import type { DestinationT, TourPackageT, BlogPostT, TestimonialT, CouponT } from '@/lib/types'

// ============ DESTINATIONS ============
export async function getAllDestinations(region?: string) {
  const dests = await db.destination.findMany({
    where: {
      status: 'published',
      ...(region ? { region } : {}),
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return dests.map(mapDestination)
}

export async function getFeaturedDestinations(limit = 8) {
  const dests = await db.destination.findMany({
    where: { status: 'published', featured: true },
    orderBy: [{ order: 'asc' }],
    take: limit,
  })
  return dests.map(mapDestination)
}

export async function getDestinationBySlug(slug: string) {
  const d = await db.destination.findUnique({ where: { slug } })
  return d ? mapDestination(d) : null
}

function mapDestination(d: any): DestinationT {
  return {
    ...d,
    images: safeArray(d.images),
    thingsToDo: safeArray(d.thingsToDo),
  }
}

// ============ PACKAGES ============
export async function getAllPackages() {
  const pkgs = await db.tourPackage.findMany({
    where: { status: 'published' },
    include: { destinations: { include: { destination: true } } },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  return pkgs.map(mapPackage)
}

export async function getFeaturedPackages(limit = 6) {
  const pkgs = await db.tourPackage.findMany({
    where: { status: 'published', featured: true },
    include: { destinations: { include: { destination: true } } },
    orderBy: [{ order: 'asc' }],
    take: limit,
  })
  return pkgs.map(mapPackage)
}

export async function getPopularPackages(limit = 4) {
  const pkgs = await db.tourPackage.findMany({
    where: { status: 'published', popular: true },
    include: { destinations: { include: { destination: true } } },
    orderBy: [{ order: 'asc' }],
    take: limit,
  })
  return pkgs.map(mapPackage)
}

export async function getPackageBySlug(slug: string) {
  const p = await db.tourPackage.findUnique({
    where: { slug },
    include: {
      destinations: { include: { destination: true }, orderBy: { order: 'asc' } },
    },
  })
  return p ? mapPackage(p) : null
}

function mapPackage(p: any): TourPackageT {
  return {
    ...p,
    inclusions: safeArray(p.inclusions),
    exclusions: safeArray(p.exclusions),
    highlights: safeArray(p.highlights),
    itinerary: parseJSON(p.itinerary, []),
    images: safeArray(p.images),
    coverImage: p.coverImage,
    destinations: (p.destinations || []).map((pd: any) => ({
      destination: mapDestination(pd.destination),
      order: pd.order,
    })),
  }
}

// ============ BLOG ============
export async function getAllBlogPosts() {
  const posts = await db.blogPost.findMany({
    where: { status: 'published' },
    orderBy: [{ publishedAt: 'desc' }],
  })
  return posts.map(mapBlog)
}

export async function getBlogBySlug(slug: string) {
  const b = await db.blogPost.findUnique({ where: { slug } })
  return b ? mapBlog(b) : null
}

function mapBlog(b: any): BlogPostT {
  return { ...b, tags: safeArray(b.tags) }
}

// ============ TESTIMONIALS ============
export async function getApprovedTestimonials(limit = 12) {
  const ts = await db.testimonial.findMany({
    where: { approved: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  })
  return ts as TestimonialT[]
}

export async function getFeaturedTestimonials(limit = 6) {
  const ts = await db.testimonial.findMany({
    where: { approved: true, featured: true },
    orderBy: [{ createdAt: 'desc' }],
    take: limit,
  })
  return ts as TestimonialT[]
}

// ============ GOOGLE REVIEWS ============
export async function getGoogleReviews(limit = 10) {
  return db.googleReview.findMany({ orderBy: [{ reviewDate: 'desc' }], take: limit })
}

// ============ COUPONS ============
export async function getValidCoupon(code: string): Promise<CouponT | null> {
  const c = await db.coupon.findUnique({ where: { code } })
  if (!c || !c.isActive) return null
  const now = new Date()
  if (c.validFrom && now < c.validFrom) return null
  if (c.validUntil && now > c.validUntil) return null
  if (c.usedCount >= c.maxUses) return null
  return c as CouponT
}

// ============ SEO PAGES ============
export async function getSeoPage(slug: string) {
  const p = await db.seoPage.findUnique({ where: { slug } })
  if (!p) return null
  return { ...p, sections: parseJSON(p.sections, []) }
}

export async function getAllSeoPages() {
  return db.seoPage.findMany({ where: { status: 'published' }, orderBy: [{ title: 'asc' }] })
}

// ============ GALLERY ============
export async function getGalleryImages(category?: string, limit = 24) {
  return db.galleryImage.findMany({
    where: category ? { category } : {},
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  })
}

// ============ ACTIVITIES ============
export async function getAllActivities() {
  return db.activity.findMany({
    where: { status: 'published' },
    orderBy: [{ order: 'asc' }],
  })
}

export async function getActivityBySlug(slug: string) {
  const a = await db.activity.findUnique({
    where: { slug },
    include: { destination: true },
  })
  return a
}

export async function getRelatedActivities(slug: string, category: string, limit = 4) {
  const related = await db.activity.findMany({
    where: {
      status: 'published',
      slug: { not: slug },
      category,
    },
    take: limit,
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  })
  // Fallback to any other activities if not enough in the same category
  if (related.length < limit) {
    const more = await db.activity.findMany({
      where: {
        status: 'published',
        slug: { not: slug, notIn: related.map((a) => a.slug) },
      },
      take: limit - related.length,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    })
    return [...related, ...more]
  }
  return related
}
