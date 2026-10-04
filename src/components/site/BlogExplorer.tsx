"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { BlogCard } from "./BlogCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { BlogPostT } from "@/lib/types"

interface Props {
  posts: BlogPostT[]
}

export function BlogExplorer({ posts }: Props) {
  const [category, setCategory] = useState("all")
  const [query, setQuery] = useState("")

  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => set.add(p.category))
    return ["all", ...Array.from(set).sort()]
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = category === "all" || p.category === category
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [posts, category, query])

  const [featured, ...rest] = filtered

  return (
    <div className="flex flex-col gap-6">
      {/* Search + category tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="flex-wrap h-auto">
            {categories.map((c) => (
              <TabsTrigger key={c} value={c} className="capitalize">
                {c === "all" ? "All" : c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="glass pl-10 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {query && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""} matching &ldquo;{query}&rdquo;
          {category !== "all" && <> in {category}</>}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
          {query ? (
            <>
              <Search className="mx-auto size-8 opacity-40" />
              <p className="mt-3">No articles found for &ldquo;{query}&rdquo;.</p>
              <button
                onClick={() => { setQuery(""); setCategory("all") }}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </>
          ) : (
            "No posts in this category yet. Check back soon!"
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {featured && (
              <motion.div
                layout
                key={`featured-${featured.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="sm:col-span-2 lg:row-span-2"
              >
                <BlogCard post={featured} index={0} featured />
              </motion.div>
            )}
            {rest.map((p, i) => (
              <motion.div
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: (i + 1) * 0.04 }}
              >
                <BlogCard post={p} index={i + 1} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
