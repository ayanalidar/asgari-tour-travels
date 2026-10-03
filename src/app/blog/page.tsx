import type { Metadata } from "next"
import { getSettings } from "@/lib/settings"
import { getAllBlogPosts } from "@/lib/queries"
import { PublicLayout } from "@/components/site/PublicLayout"
import { PageHeader } from "@/components/site/PageHeader"
import { BlogExplorer } from "@/components/site/BlogExplorer"
import { Breadcrumbs } from "@/components/site/Breadcrumbs"

export const revalidate = 600

export const metadata: Metadata = {
  title: "Travel Blog — Kashmir & Ladakh Stories, Tips & Guides",
  description:
    "Expert travel guides, itineraries, photo stories and tips for Kashmir & Ladakh — from the best time to visit to altitude sickness, food, hidden gems and more.",
  alternates: { canonical: "/blog" },
}

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSettings(), getAllBlogPosts()])

  return (
    <PublicLayout settings={settings}>
      <PageHeader
        eyebrow="Travel Journal"
        title={
          <>
            Stories from the <span className="gradient-text-saffron">Himalayas</span>
          </>
        }
        subtitle="Expert travel guides, photo essays, food trails, hidden gems and real traveller stories — from our 15+ years in Kashmir & Ladakh."
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <BlogExplorer posts={posts} />
      </div>
    </PublicLayout>
  )
}
