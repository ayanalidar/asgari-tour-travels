"use client"

import { motion } from "framer-motion"
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react"
import { ImageWithFallback } from "./ImageWithFallback"

interface InstagramFeedProps {
  handle?: string
  posts?: { id: string; image: string; caption: string; likes?: number; comments?: number }[]
}

// Fallback curated posts if no real Instagram data
const FALLBACK_POSTS = [
  { id: "1", image: "/uploads/srinagar-dal-lake.png", caption: "Sunrise shikara on Dal Lake. The floating market at dawn is pure magic.", likes: 1247, comments: 38 },
  { id: "2", image: "/uploads/gulmarg-meadow.png", caption: "Gulmarg meadows in full summer bloom. The gondola to 4,000m awaits.", likes: 2103, comments: 52 },
  { id: "3", image: "/uploads/pangong-tso-lake.png", caption: "Pangong Tso at 4,350m. The colour shifts every hour. No filter needed.", likes: 3421, comments: 89 },
  { id: "4", image: "/uploads/khardung-la-pass.png", caption: "Top of the world - Khardung La at 5,359m. Prayer flags in the wind.", likes: 1876, comments: 41 },
  { id: "5", image: "/uploads/mughal-gardens-srinagar.png", caption: "Nishat Bagh - 12 terraces of Mughal paradise. Srinagar's living heritage.", likes: 1456, comments: 33 },
  { id: "6", image: "/uploads/houseboat-kashmir.png", caption: "Heritage houseboat on Dal Lake. There is no experience like this on Earth.", likes: 2678, comments: 67 },
  { id: "7", image: "/uploads/nubra-valley-dunes.png", caption: "Bactrian camels on Nubra dunes. Silk Route caravans still walk here.", likes: 1987, comments: 45 },
  { id: "8", image: "/uploads/pahalgam-betaab-valley.png", caption: "Betaab Valley, Pahalgam. Where Bollywood comes to film paradise.", likes: 1654, comments: 39 },
]

export function InstagramFeed({ handle = "@asgaritourandtravel", posts }: InstagramFeedProps) {
  const feed = posts && posts.length > 0 ? posts : FALLBACK_POSTS

  return (
    <div className="relative overflow-hidden rounded-3xl glass p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-amber-500/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white">
              <Instagram className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold leading-tight">{handle}</h3>
              <p className="text-xs text-muted-foreground">Follow our Himalayan adventures</p>
            </div>
          </div>
          <a
            href={`https://instagram.com/${handle.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ExternalLink className="size-3" /> Follow
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {feed.map((post, i) => (
            <motion.a
              key={post.id}
              href={`https://instagram.com/${handle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <ImageWithFallback
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {/* Caption */}
              <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="line-clamp-2 text-[10px] font-medium text-white leading-tight">
                  {post.caption}
                </p>
                {post.likes !== undefined && (
                  <div className="mt-1 flex items-center gap-2 text-[9px] text-white/80">
                    <span className="flex items-center gap-0.5">
                      <Heart className="size-2.5 fill-white" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="size-2.5" /> {post.comments}
                    </span>
                  </div>
                )}
              </div>
              {/* Instagram icon corner */}
              <div className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-black/40 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <Instagram className="size-3 text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Mobile follow button */}
        <a
          href={`https://instagram.com/${handle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:hidden"
        >
          <ExternalLink className="size-3" /> Follow {handle}
        </a>
      </div>
    </div>
  )
}
