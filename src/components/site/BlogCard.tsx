"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImageWithFallback } from "./ImageWithFallback"
import type { BlogPostT } from "@/lib/types"

interface BlogCardProps {
  post: BlogPostT
  index?: number
  featured?: boolean
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`lift group relative overflow-hidden rounded-2xl glass ${featured ? "sm:col-span-2 sm:row-span-2" : ""}`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col"
        aria-label={`Read ${post.title}`}
      >
        <div className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
          <ImageWithFallback
            src={post.coverImage}
            alt={post.title}
            className="transition-transform duration-700 group-hover:scale-110"
            fallbackLabel={post.category}
            eager={featured || index < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute left-3 top-3">
            <Badge className="border-primary/40 bg-primary/20 text-primary backdrop-blur-md">
              {post.category}
            </Badge>
          </div>
          {featured && (
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-display text-2xl font-bold leading-tight text-white drop-shadow-lg line-clamp-2">
                {post.title}
              </h3>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          {!featured && (
            <h3 className="font-display text-lg font-bold leading-tight line-clamp-2">
              {post.title}
            </h3>
          )}
          <p className={`text-sm text-muted-foreground ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
            {post.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {post.readTime} min read
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
            Read article <ArrowRight className="size-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
