"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid2x2 } from "lucide-react"
import { ImageWithFallback } from "./ImageWithFallback"

interface GalleryLightboxProps {
  images: string[]
  alt: string
}

export function GalleryLightbox({ images, alt }: GalleryLightboxProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, close, next, prev])

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {images.slice(0, 6).map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i)
              setOpen(true)
            }}
            className="group relative aspect-square overflow-hidden rounded-xl glass"
          >
            <ImageWithFallback
              src={src}
              alt={`${alt} — photo ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/30">
              <ZoomIn className="size-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {i === 5 && images.length > 6 && (
              <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm font-bold text-white">
                +{images.length - 6} more
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Full lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/90 backdrop-blur-md"
            onClick={close}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X className="size-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              {index + 1} / {images.length}
            </div>

            {/* Previous */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={images[index]}
                alt={`${alt} — photo ${index + 1}`}
                className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
              />
            </motion.div>

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="flex gap-2 rounded-2xl bg-white/5 p-2 backdrop-blur-md">
                  {images.slice(0, 8).map((src, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        setIndex(i)
                      }}
                      className={`size-12 overflow-hidden rounded-lg transition-all ${
                        i === index ? "ring-2 ring-primary" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <ImageWithFallback
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
