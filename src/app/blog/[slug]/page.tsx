import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Tag } from "lucide-react"
import { getSettings } from "@/lib/settings"
import { getBlogBySlug, getAllBlogPosts } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"
import { ImageWithFallback } from "@/components/site/ImageWithFallback"
import { Markdown } from "@/components/site/Markdown"
import { CTASection } from "@/components/site/CTASection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) return { title: "Article not found" }
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
    },
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings, allPosts] = await Promise.all([
    getBlogBySlug(slug),
    getSettings(),
    getAllBlogPosts(),
  ])
  if (!post) notFound()

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: settings.brand_name ?? "Asgari Tour & Travels",
      logo: {
        "@type": "ImageObject",
        url: "https://asgaritravels.com/logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://asgaritravels.com/blog/${post.slug}`,
    },
    keywords: post.tags,
  }

  return (
    <PublicLayout settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <article className="flex flex-col">
        <header className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
          <div className="absolute inset-0 -z-10">
            <ImageWithFallback
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover opacity-40"
              eager
              fallbackLabel={post.category}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
            <div className="absolute inset-0 grid-overlay opacity-20" />
          </div>

          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <Badge className="mb-3 border-primary/40 bg-primary/15 text-primary">
              {post.category}
            </Badge>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <User className="size-4 text-primary" /> {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                {post.readTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 pb-16">
          <Markdown content={post.content} />

          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-border/50 pt-6">
              <Tag className="size-4 text-muted-foreground" />
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ArrowLeft className="size-4" /> All articles
              </Link>
            </Button>
            <Button asChild size="sm" className="btn-glow">
              <Link href="/packages">
                Plan your trip <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 border-t border-border/60">
          <h2 className="font-display text-2xl font-bold mb-6 heading-underline">
            More in {post.category}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <BlogCardLink key={p.id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <CTASection phone={settings.phone_primary} />
      </section>
    </PublicLayout>
  )
}

// Avoid pulling BlogCard (motion) into this server component bundle complexity
function BlogCardLink({ post, index }: { post: any; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="lift group relative flex flex-col overflow-hidden rounded-2xl glass"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageWithFallback
          src={post.coverImage}
          alt={post.title}
          className="transition-transform duration-700 group-hover:scale-110"
          fallbackLabel={post.category}
          eager={index < 2}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge className="border-primary/40 bg-primary/20 text-primary backdrop-blur-md">
            {post.category}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-base font-bold leading-tight text-white line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Read article <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  )
}
