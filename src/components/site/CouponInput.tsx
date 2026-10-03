"use client"

import { useState } from "react"
import { Ticket, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/types"

interface CouponInputProps {
  packageId: string
  basePrice: number
  onApplied?: (discount: number, finalPrice: number, code: string) => void
}

export function CouponInput({
  packageId,
  basePrice,
  onApplied,
}: CouponInputProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    ok: boolean
    discount: number
    finalPrice: number
    code: string
    message: string
  } | null>(null)

  async function apply(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      toast.error("Please enter a coupon code")
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/public/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), packageId }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data?.error ?? "Invalid coupon")
      }
      const { discount, finalPrice } = data.data
      setResult({
        ok: true,
        discount,
        finalPrice,
        code: code.trim().toUpperCase(),
        message: `Coupon applied! You saved ${formatPrice(discount)}.`,
      })
      onApplied?.(discount, finalPrice, code.trim().toUpperCase())
      toast.success(`Coupon applied — you saved ${formatPrice(discount)}!`)
    } catch (e: any) {
      setResult({
        ok: false,
        discount: 0,
        finalPrice: basePrice,
        code: code.trim().toUpperCase(),
        message: e.message ?? "Invalid coupon",
      })
      toast.error(e.message ?? "Invalid coupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("rounded-2xl glass p-4 sm:p-5")}>
      <div className="mb-3 flex items-center gap-2">
        <Ticket className="size-5 text-primary" />
        <h4 className="font-display text-sm font-bold uppercase tracking-wider">
          Have a coupon code?
        </h4>
      </div>
      <form onSubmit={apply} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. EARLYBIRD10"
          className="bg-background/60 uppercase font-mono"
          disabled={loading || result?.ok}
        />
        <Button
          type="submit"
          disabled={loading || result?.ok}
          className="btn-glow shrink-0"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : result?.ok ? (
            <>
              <CheckCircle2 className="size-4" /> Applied
            </>
          ) : (
            "Apply"
          )}
        </Button>
      </form>
      {result && (
        <div
          className={cn(
            "mt-3 flex items-start gap-2 rounded-lg p-3 text-sm",
            result.ok
              ? "bg-accent/10 text-accent-foreground"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {result.ok ? (
            <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-accent" />
          ) : (
            <XCircle className="size-4 mt-0.5 shrink-0 text-destructive" />
          )}
          <div className="flex flex-col">
            <span className="font-semibold">{result.message}</span>
            {result.ok && (
              <span className="text-xs text-muted-foreground">
                Final price:{" "}
                <span className="font-bold text-primary">
                  {formatPrice(result.finalPrice)}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
