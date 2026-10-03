"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, MapPin, Package, FileText, ArrowRight, Loader2, CornerDownLeft } from "lucide-react"
import Link from "next/link"
import { ImageWithFallback } from "./ImageWithFallback"
import { destinationImage } from "@/lib/image-map"

interface SearchItem {
  id: string
  slug: string
  name?: string
  title?: string
  region?: string
  category?: string
  tagline?: string
  subtitle?: string
  shortDescription?: string
  excerpt?: string
  heroImage?: string | null
  coverImage?: string | null
  durationDays?: number
  durationNights?: number
  price?: number
  discountPrice?: number | null
  rating?: number
  readTime?: number
}

interface SearchResult {
  destinations: SearchItem[]
  packages: SearchItem[]
  blog: SearchItem[]
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Toggle with Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
      setResults(null)
      setActiveIndex(0)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults(null)
      return
    }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        if (!cancelled) {
          setResults(data.data || { destinations: [], packages: [], blog: [] })
          setActiveIndex(0)
        }
      } catch {
        if (!cancelled) setResults({ destinations: [], packages: [], blog: [] })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [query])

  // Flatten results for keyboard nav
  const flatResults = useCallback(() => {
    if (!results) return []
    return [
      ...results.destinations.map((d) => ({ type: "destination" as const, item: d, href: `/destinations/${d.slug}` })),
      ...results.packages.map((p) => ({ type: "package" as const, item: p, href: `/packages/${p.slug}` })),
      ...results.blog.map((b) => ({ type: "blog" as const, item: b, href: `/blog/${b.slug}` })),
    ]
  }, [results])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const flat = flatResults()
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && flat[activeIndex]) {
      e.preventDefault()
      router.push(flat[activeIndex].href)
      setOpen(false)
    }
  }

  const totalResults = results
    ? results.destinations.length + results.packages.length + results.blog.length
    : 0

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        aria-label="Search"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm sm:pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl glass-strong shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border/40 p-4">
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search destinations, packages, blog..."
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-background/60 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!query.trim() || query.trim().length < 2 ? (
                  <div className="px-4 py-10 text-center">
                    <Search className="mx-auto size-8 text-muted-foreground/50" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Start typing to search across 36 destinations, 6+ packages & 10 blog posts
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {["Srinagar", "Gulmarg", "Pangong", "Honeymoon", "Skiing", "Ladakh"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : results && totalResults === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      Try a different keyword or browse all destinations
                    </p>
                  </div>
                ) : (
                  results && (
                    <div className="space-y-1">
                      {/* Destinations */}
                      {results.destinations.length > 0 && (
                        <ResultGroup label="Destinations" icon={<MapPin className="size-3.5" />}>
                          {results.destinations.map((d, i) => {
                            const flatIdx = flatResults().findIndex((f) => f.item.id === d.id && f.type === "destination")
                            return (
                              <ResultRow
                                key={d.id}
                                href={`/destinations/${d.slug}`}
                                image={destinationImage(d.slug) || d.heroImage}
                                title={d.name!}
                                subtitle={d.tagline || d.region}
                                badge={d.region}
                                active={activeIndex === flatIdx}
                                onHover={() => setActiveIndex(flatIdx)}
                                onClose={() => setOpen(false)}
                              />
                            )
                          })}
                        </ResultGroup>
                      )}

                      {/* Packages */}
                      {results.packages.length > 0 && (
                        <ResultGroup label="Packages" icon={<Package className="size-3.5" />}>
                          {results.packages.map((p, i) => {
                            const flatIdx = flatResults().findIndex((f) => f.item.id === p.id && f.type === "package")
                            return (
                              <ResultRow
                                key={p.id}
                                href={`/packages/${p.slug}`}
                                image={p.coverImage}
                                title={p.title!}
                                subtitle={`${p.durationNights}N / ${p.durationDays}D · ₹${(p.discountPrice || p.price || 0).toLocaleString("en-IN")}`}
                                badge={p.rating ? `★ ${p.rating}` : undefined}
                                active={activeIndex === flatIdx}
                                onHover={() => setActiveIndex(flatIdx)}
                                onClose={() => setOpen(false)}
                              />
                            )
                          })}
                        </ResultGroup>
                      )}

                      {/* Blog */}
                      {results.blog.length > 0 && (
                        <ResultGroup label="Blog" icon={<FileText className="size-3.5" />}>
                          {results.blog.map((b, i) => {
                            const flatIdx = flatResults().findIndex((f) => f.item.id === b.id && f.type === "blog")
                            return (
                              <ResultRow
                                key={b.id}
                                href={`/blog/${b.slug}`}
                                image={b.coverImage}
                                title={b.title!}
                                subtitle={`${b.category} · ${b.readTime} min read`}
                                active={activeIndex === flatIdx}
                                onHover={() => setActiveIndex(flatIdx)}
                                onClose={() => setOpen(false)}
                              />
                            )
                          })}
                        </ResultGroup>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/40 px-4 py-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/60 bg-background/60 px-1">↑</kbd>
                    <kbd className="rounded border border-border/60 bg-background/60 px-1">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/60 bg-background/60 px-1">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border/60 bg-background/60 px-1">esc</kbd>
                    close
                  </span>
                </div>
                {results && totalResults > 0 && (
                  <span>{totalResults} result{totalResults !== 1 ? "s" : ""}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ResultGroup({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      {children}
    </div>
  )
}

function ResultRow({
  href,
  image,
  title,
  subtitle,
  badge,
  active,
  onHover,
  onClose,
}: {
  href: string
  image?: string | null
  title: string
  subtitle?: string
  badge?: string
  active: boolean
  onHover: () => void
  onClose: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      onMouseEnter={onHover}
      className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
        active ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-background/60"
      }`}
    >
      <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-background/40">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${active ? "text-primary" : ""}`}>
          {title}
        </p>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
      <ArrowRight className={`size-4 shrink-0 transition-opacity ${active ? "text-primary opacity-100" : "opacity-0"}`} />
    </Link>
  )
}
