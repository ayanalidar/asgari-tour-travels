"use client"

import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  href?: string
}

export function WhatsAppButton({ href = "https://wa.me/919419000123" }: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] p-4 shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)]"
    >
      <MessageCircle className="size-6 text-white" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:block">
        Chat with us
      </span>
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
    </a>
  )
}
