/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState, useCallback } from "react"
import { Gift, Plus, Trash2, Power, Copy, Check, Clock, Loader2, Pencil, X } from "lucide-react"
import { adminFetch } from "@/lib/admin-fetch"
import { AdminPageHeader } from "@/components/admin/AdminPageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Offer {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  couponCode: string
  discountText?: string | null
  ctaText: string
  ctaHref: string
  image?: string | null
  expiryDate?: string | null
  isActive: boolean
  showDelay: number
  createdAt: string
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await adminFetch<Offer[]>("/api/admin/offers")
    if (res.success && res.data) {
      setOffers(Array.isArray(res.data) ? res.data : [])
    } else {
      toast.error(res.error || "Failed to load offers")
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleActive = async (offer: Offer) => {
    const res = await adminFetch(`/api/admin/offers/${offer.id}`, {
      method: "PUT",
      json: { isActive: !offer.isActive },
    })
    if (res.success) {
      toast.success(`Offer ${!offer.isActive ? "activated" : "deactivated"}`)
      load()
    } else {
      toast.error(res.error || "Failed to update")
    }
  }

  const deleteOffer = async (offer: Offer) => {
    if (!confirm(`Delete offer "${offer.title}"?`)) return
    const res = await adminFetch(`/api/admin/offers/${offer.id}`, { method: "DELETE" })
    if (res.success) {
      toast.success("Offer deleted")
      load()
    } else {
      toast.error(res.error || "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Popup Offers"
        description="Manage offer popups shown to website visitors"
        icon={Gift}
        actions={
          <Button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="btn-glow"
            size="sm"
          >
            <Plus className="size-4" /> New Offer
          </Button>
        }
      />

      {/* Info banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">
          <Gift className="inline size-4 mr-1 text-primary" />
          Offers appear as a popup <strong>8 seconds</strong> after a visitor lands on the site.
          Only the most recent <strong>active</strong> offer is shown. Each visitor sees it once per 24 hours.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : offers.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="py-12 text-center">
            <Gift className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No offers yet.</p>
            <Button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-glow mt-4">
              <Plus className="size-4" /> Create your first offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id} className={cn("glass border-white/10", !offer.isActive && "opacity-60")}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {offer.discountText && (
                      <span className="font-display text-2xl font-extrabold gradient-text-saffron">
                        {offer.discountText}
                      </span>
                    )}
                    <CardTitle className="text-base font-bold mt-1">{offer.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {offer.isActive ? (
                      <Badge className="border-emerald-400/40 bg-emerald-400/10 text-emerald-300">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {offer.subtitle && (
                  <p className="text-xs text-muted-foreground">{offer.subtitle}</p>
                )}
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2">
                  <span className="font-mono text-sm font-bold tracking-wider text-primary">
                    {offer.couponCode}
                  </span>
                </div>
                {offer.expiryDate && (
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" />
                    Expires: {new Date(offer.expiryDate).toLocaleDateString("en-IN")}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Shows after {offer.showDelay}s delay
                </p>
                <div className="flex items-center gap-1 pt-2">
                  <Button
                    onClick={() => toggleActive(offer)}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    <Power className="size-3" /> {offer.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    onClick={() => { setEditing(offer); setShowForm(true) }}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    <Pencil className="size-3" /> Edit
                  </Button>
                  <Button
                    onClick={() => deleteOffer(offer)}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form dialog */}
      {showForm && (
        <OfferForm
          offer={editing}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSaved={() => { setShowForm(false); setEditing(null); load() }}
        />
      )}
    </div>
  )
}

function OfferForm({ offer, onClose, onSaved }: { offer: Offer | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: offer?.title || "",
    subtitle: offer?.subtitle || "",
    description: offer?.description || "",
    couponCode: offer?.couponCode || "",
    discountText: offer?.discountText || "",
    ctaText: offer?.ctaText || "Claim Offer Now",
    ctaHref: offer?.ctaHref || "/packages",
    expiryDate: offer?.expiryDate ? offer.expiryDate.slice(0, 10) : "",
    isActive: offer?.isActive ?? true,
    showDelay: offer?.showDelay ?? 8,
  })

  const update = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title.trim() || !form.couponCode.trim()) {
      toast.error("Title and coupon code are required")
      return
    }
    setSaving(true)
    const url = offer ? `/api/admin/offers/${offer.id}` : "/api/admin/offers"
    const method = offer ? "PUT" : "POST"
    const res = await adminFetch(url, { method, json: form })
    setSaving(false)
    if (res.success) {
      toast.success(offer ? "Offer updated" : "Offer created")
      onSaved()
    } else {
      toast.error(res.error || "Failed to save")
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glass-strong border-white/10 max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit Offer" : "New Offer"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Discount Text *</label>
            <Input
              value={form.discountText}
              onChange={(e) => update("discountText", e.target.value)}
              placeholder="₹3,000 OFF"
              className="glass"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Title *</label>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="₹3,000 OFF your first trip"
              className="glass"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Subtitle</label>
            <Input
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Use code WELCOME3000 at checkout"
              className="glass"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Coupon Code *</label>
            <Input
              value={form.couponCode}
              onChange={(e) => update("couponCode", e.target.value.toUpperCase())}
              placeholder="WELCOME3000"
              className="glass font-mono uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">CTA Text</label>
              <Input
                value={form.ctaText}
                onChange={(e) => update("ctaText", e.target.value)}
                placeholder="Claim Offer Now"
                className="glass"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">CTA Link</label>
              <Input
                value={form.ctaHref}
                onChange={(e) => update("ctaHref", e.target.value)}
                placeholder="/packages"
                className="glass"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry Date</label>
              <Input
                type="date"
                value={form.expiryDate}
                onChange={(e) => update("expiryDate", e.target.value)}
                className="glass"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Show Delay (seconds)</label>
              <Input
                type="number"
                min={1}
                max={60}
                value={form.showDelay}
                onChange={(e) => update("showDelay", parseInt(e.target.value) || 8)}
                className="glass"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => update("isActive", v)}
            />
            <span className="text-sm">Active (show to visitors)</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="btn-glow">
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {offer ? "Update" : "Create"} Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
