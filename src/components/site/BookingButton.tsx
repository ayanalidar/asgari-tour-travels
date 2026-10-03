"use client"

import { useState } from "react"
import { CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "./BookingModal"

interface BookingButtonProps {
  pkg: {
    id: string
    title: string
    slug: string
    price: number
    discountPrice?: number | null
    durationDays: number
    durationNights: number
    currency?: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  fullWidth?: boolean
  label?: string
}

export function BookingButton({
  pkg,
  variant = "default",
  size = "default",
  className = "",
  fullWidth = false,
  label = "Book Now",
}: BookingButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant}
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${variant === "default" ? "btn-glow" : ""} ${className}`}
      >
        <CalendarCheck className="size-4" /> {label}
      </Button>
      <BookingModal open={open} onOpenChange={setOpen} pkg={pkg} />
    </>
  )
}
