"use client"

import { useState } from "react"
import { Send, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Failed")
      setDone(true)
      toast.success("Subscribed! Welcome aboard.")
      setEmail("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2"
      aria-label="Newsletter signup"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="bg-background/60 border-primary/20"
        aria-label="Email address"
        disabled={done}
      />
      <Button
        type="submit"
        disabled={loading || done}
        className="btn-glow shrink-0"
        aria-label="Subscribe"
      >
        {done ? <Check className="size-4" /> : <Send className="size-4" />}
        <span className="hidden sm:inline">{done ? "Done" : "Subscribe"}</span>
      </Button>
    </form>
  )
}
