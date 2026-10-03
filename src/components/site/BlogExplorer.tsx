"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BlogCard } from "./BlogCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BlogPostT } from "@/lib/types"

interface Props {
  posts: BlogPostT[]
}

export function BlogExplorer({ posts }: Props) {
  const [category, setCategory] = useState("all")

  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => set.add(p.category))
    return ["all", ...Array.from(set).sort()]
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((p) => category === "all" || p.category === category)
  }, [posts, category])

  const [featured, ...rest] = filtered

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="flex-wrap h-auto">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} className="capitalize">
              {c === "all" ? "All" : c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
          No posts in this category yet. Check back soon!
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
