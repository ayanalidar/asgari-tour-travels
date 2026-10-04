"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X, HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Faq {
  q: string
  a: string
  category?: string
}

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")

  const categories = useMemo(() => {
    const set = new Set<string>()
    faqs.forEach((f) => f.category && set.add(f.category))
    return ["all", ...Array.from(set).sort()]
  }, [faqs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs.filter((f) => {
      const matchesCategory = category === "all" || f.category === category
      const matchesQuery =
        !q ||
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        (f.category || "").toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [faqs, query, category])

  return (
    <div className="rounded-2xl glass p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="size-5 text-primary" />
        <h2 className="font-display text-xl font-bold">
          Most asked questions
        </h2>
        <Badge variant="outline" className="ml-auto">
          {filtered.length} of {faqs.length}
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions... (e.g. 'best time', 'permit', 'altitude')"
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

      {/* Category chips */}
      {categories.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all ${
                category === c
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <Search className="mx-auto size-8 opacity-40" />
          <p className="mt-3 text-sm">No questions match &ldquo;{query}&rdquo;.</p>
          <button
            onClick={() => { setQuery(""); setCategory("all") }}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((f, i) => (
              <motion.div
                key={`${f.q.slice(0, 20)}-${i}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="rounded-xl border border-border/60 bg-background/30 px-4 data-[state=open]:bg-background/60"
                >
                  <AccordionTrigger className="hover:no-underline text-left">
                    <span className="font-medium text-foreground">{f.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </Accordion>
      )}
    </div>
  )
}
