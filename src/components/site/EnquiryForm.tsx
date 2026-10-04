"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(7, "Please enter a valid phone number"),
  travelDate: z.string().optional(),
  groupSize: z.string().optional(),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface EnquiryFormProps {
  destination?: string
  packageId?: string
  packageName?: string
  className?: string
  compact?: boolean
}

export function EnquiryForm({
  destination,
  packageId,
  packageName,
  className,
  compact = false,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: destination ?? "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const body = {
        name: values.name,
        email: values.email || null,
        phone: values.phone,
        destination: destination ?? null,
        packageId: packageId ?? null,
        packageName: packageName ?? null,
        travelDate: values.travelDate || null,
        groupSize: values.groupSize ? Number(values.groupSize) : null,
        message: values.message || null,
        source: "website",
      }
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error ?? "Failed to submit")
      }
      setSubmitted(true)
      toast.success("Enquiry received! Our team will reach out within 24 hours.")
      reset()
    } catch (e: any) {
      toast.error(e.message || "Something went wrong. Please try again.")
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl glass-strong p-8 text-center",
          className,
        )}
      >
        <CheckCircle2 className="size-12 text-accent" />
        <h3 className="font-display text-xl font-bold">Thank you!</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Your enquiry has been received. Our Kashmir-based travel expert will reach out
          within 24 hours with a customised itinerary.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Submit another enquiry
        </Button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-4", className)}
      aria-label="Enquiry form"
    >
      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Field label="Full Name" required error={errors.name?.message}>
          <Input
            {...register("name")}
            placeholder="e.g. Rohit Sharma"
            autoComplete="name"
            className="bg-background/60"
          />
        </Field>
        <Field label="Phone" required error={errors.phone?.message}>
          <Input
            {...register("phone")}
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className="bg-background/60"
          />
        </Field>
        {!compact && (
          <Field label="Email" error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
              className="bg-background/60"
            />
          </Field>
        )}
        {!compact && (
          <Field label="Travel Date">
            <Input
              {...register("travelDate")}
              type="date"
              className="bg-background/60"
            />
          </Field>
        )}
        {!compact && (
          <Field label="Group Size">
            <Input
              {...register("groupSize")}
              type="number"
              min={1}
              placeholder="2"
              className="bg-background/60"
            />
          </Field>
        )}
        {destination && (
          <Field label="Destination">
            <Input
              value={destination}
              readOnly
              className="bg-background/40 text-muted-foreground"
            />
          </Field>
        )}
        {packageName && !destination && (
          <Field label="Package">
            <Input
              value={packageName}
              readOnly
              className="bg-background/40 text-muted-foreground"
            />
          </Field>
        )}
      </div>
      {!compact && (
        <Field label="Message">
          <Textarea
            {...register("message")}
            placeholder="Tell us about your dream Kashmir/Ladakh trip - dates, interests, budget, special needs…"
            rows={3}
            className="bg-background/60 resize-none"
          />
        </Field>
      )}
      <Button type="submit" disabled={isSubmitting} className="btn-glow w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="size-4" /> Submit Enquiry
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting you agree to be contacted by Asgari Tour & Travels. We never share
        your details.
      </p>
    </form>
  )
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
