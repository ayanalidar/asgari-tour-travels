// Shared types for Asgari Tour & Travels

export type Region = "kashmir" | "ladakh" | "jammu"

export interface DestinationT {
  id: string
  slug: string
  name: string
  region: Region
  category: string
  tagline: string | null
  shortDescription: string
  description: string
  heroImage: string | null
  images: string[]
  bestTimeToVisit: string | null
  duration: string | null
  altitude: string | null
  distance: string | null
  howToReach: string | null
  thingsToDo: string[]
  latitude: number | null
  longitude: number | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  featured: boolean
  popular: boolean
  order: number
  status: string
}

export interface TourPackageT {
  id: string
  slug: string
  title: string
  subtitle: string | null
  shortDescription: string
  description: string
  durationDays: number
  durationNights: number
  price: number
  discountPrice: number | null
  currency: string
  inclusions: string[]
  exclusions: string[]
  highlights: string[]
  itinerary: ItineraryDay[]
  images: string[]
  coverImage: string | null
  rating: number
  reviewCount: number
  groupSize: string | null
  difficulty: string | null
  destinations: { destination: DestinationT; order: number }[]
  metaTitle: string | null
  metaDescription: string | null
  featured: boolean
  popular: boolean
  status: string
  order: number
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  meals?: string
  stay?: string
}

export interface CouponT {
  id: string
  code: string
  description: string | null
  discountType: "percentage" | "fixed"
  discountValue: number
  maxUses: number
  usedCount: number
  minOrderValue: number | null
  validFrom: string | null
  validUntil: string | null
  isActive: boolean
}

export interface BlogPostT {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  category: string
  tags: string[]
  author: string
  readTime: number
  metaTitle: string | null
  metaDescription: string | null
  status: string
  publishedAt: string
}

export interface LeadT {
  id: string
  name: string
  email: string | null
  phone: string | null
  destination: string | null
  packageId: string | null
  travelDate: string | null
  groupSize: number | null
  budget: string | null
  message: string | null
  status: string
  source: string
  priority: string
  notes: LeadNote[]
  createdAt: string
}

export interface LeadNote {
  at: string
  text: string
  author: string
}

export interface TestimonialT {
  id: string
  name: string
  location: string | null
  avatar: string | null
  rating: number
  title: string | null
  text: string
  packageId: string | null
  featured: boolean
  approved: boolean
  source: string
}

export interface GoogleReviewT {
  id: string
  placeId: string | null
  authorName: string
  authorAvatar: string | null
  rating: number
  text: string
  reviewDate: string
  sourceUrl: string | null
}

export interface GalleryImageT {
  id: string
  title: string | null
  description: string | null
  url: string
  alt: string | null
  category: string
  destinationId: string | null
  featured: boolean
}

export interface SeoPageT {
  id: string
  slug: string
  title: string
  content: string
  heroImage: string | null
  sections: any[]
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  status: string
}

export interface SiteSettingsT {
  [key: string]: any
}

// Helper to parse JSON fields safely
export function parseJSON<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback
  try {
    return JSON.parse(val) as T
  } catch {
    return fallback
  }
}

export function safeArray(val: string | null | undefined): string[] {
  return parseJSON<string[]>(val, [])
}

// Format price in INR
export function formatPrice(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    return "₹" + amount.toLocaleString("en-IN")
  }
  return amount.toLocaleString("en-US", { style: "currency", currency })
}

// Calculate discounted price with coupon
export function applyCoupon(price: number, coupon: CouponT): { finalPrice: number; discount: number } {
  let discount = 0
  if (coupon.discountType === "percentage") {
    discount = (price * coupon.discountValue) / 100
  } else {
    discount = coupon.discountValue
  }
  if (coupon.minOrderValue && price < coupon.minOrderValue) {
    return { finalPrice: price, discount: 0 }
  }
  return { finalPrice: Math.max(0, price - discount), discount }
}
