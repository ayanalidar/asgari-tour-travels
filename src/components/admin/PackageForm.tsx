/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { TagInput } from "@/components/admin/TagInput";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { MultiSelect } from "@/components/admin/MultiSelect";
import { Repeater } from "@/components/admin/Repeater";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

interface DestOpt { id: string; name: string; slug: string; }
interface CouponOpt { id: string; code: string; }

interface PackageFormProps {
  id?: string;
}

export function PackageForm({ id }: PackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [destOptions, setDestOptions] = useState<DestOpt[]>([]);
  const [couponOptions, setCouponOptions] = useState<CouponOpt[]>([]);
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    subtitle: "",
    shortDescription: "",
    description: "",
    durationDays: 3,
    durationNights: 2,
    price: 0,
    discountPrice: "",
    currency: "INR",
    inclusions: [] as string[],
    exclusions: [] as string[],
    highlights: [] as string[],
    itinerary: [] as any[],
    images: [] as string[],
    coverImage: null as string | null,
    rating: 4.5,
    reviewCount: 0,
    groupSize: "",
    difficulty: "Easy",
    metaTitle: "",
    metaDescription: "",
    featured: false,
    popular: false,
    status: "published",
    order: 0,
    destinationIds: [] as string[],
    couponIds: [] as string[],
  });

  useEffect(() => {
    (async () => {
      // Load destination & coupon options
      const [dRes, cRes] = await Promise.all([
        adminFetch<{ destinations: DestOpt[] }>("/api/admin/destinations"),
        adminFetch<{ coupons: CouponOpt[] }>("/api/admin/coupons"),
      ]);
      if (dRes.success && dRes.data) setDestOptions(dRes.data.destinations);
      if (cRes.success && cRes.data) setCouponOptions(cRes.data.coupons);

      if (id) {
        const res = await adminFetch<{ package: any }>(`/api/admin/packages/${id}`);
        if (res.success && res.data) {
          const p = res.data.package;
          setForm({
            ...p,
            discountPrice: p.discountPrice ?? "",
            groupSize: p.groupSize ?? "",
            rating: p.rating ?? 4.5,
            reviewCount: p.reviewCount ?? 0,
            order: p.order ?? 0,
            durationDays: p.durationDays ?? 3,
            durationNights: p.durationNights ?? 2,
            destinationIds: (p.destinations || []).map((d: any) => d.id),
            couponIds: (p.coupons || []).map((c: any) => c.id),
          });
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/packages");
        }
      }
      setLoading(false);
    })();
     
  }, [id]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!form.slug && form.title) update("slug", slugifyStr(form.title));
     
  }, [form.title]);

  const submit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.shortDescription?.trim()) return toast.error("Short description is required");
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
      rating: parseFloat(form.rating) || 0,
      reviewCount: parseInt(form.reviewCount) || 0,
      durationDays: parseInt(form.durationDays) || 0,
      durationNights: parseInt(form.durationNights) || 0,
      order: parseInt(form.order) || 0,
    };
    const res = id
      ? await adminFetch(`/api/admin/packages/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/packages", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Package updated" : "Package created");
      router.push("/admin/packages");
    } else {
      toast.error(res.error || "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Package deleted");
      router.replace("/admin/packages");
    } else toast.error(res.error || "Failed");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Package Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Kashmir Paradise Delight 5N/6D" />
              </FormField>
              <FormField label="Slug">
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
              </FormField>
            </div>
            <FormField label="Subtitle">
              <Input value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} placeholder="A Romantic Himalayan Getaway" />
            </FormField>
            <FormField label="Short Description" required>
              <Textarea rows={2} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
            </FormField>
            <MarkdownEditor
              label="Description (Markdown)"
              value={form.description}
              onChange={(v) => update("description", v)}
              rows={10}
            />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Pricing & Duration</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3">
            <FormField label="Duration (Nights)">
              <Input type="number" value={form.durationNights} onChange={(e) => update("durationNights", e.target.value)} />
            </FormField>
            <FormField label="Duration (Days)">
              <Input type="number" value={form.durationDays} onChange={(e) => update("durationDays", e.target.value)} />
            </FormField>
            <FormField label="Currency">
              <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR ₹</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="EUR">EUR €</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Price" required>
              <Input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </FormField>
            <FormField label="Discount Price">
              <Input type="number" value={form.discountPrice} onChange={(e) => update("discountPrice", e.target.value)} />
            </FormField>
            <FormField label="Difficulty">
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Challenging">Challenging</SelectItem>
                  <SelectItem value="Strenuous">Strenuous</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Itinerary</CardTitle></CardHeader>
          <CardContent>
            <Repeater
              items={form.itinerary}
              onChange={(v) => update("itinerary", v)}
              newItem={() => ({ day: form.itinerary.length + 1, title: "", description: "", meals: "", stay: "" })}
              itemLabel={(_, i) => `Day ${i}`}
              addLabel="Add Day"
              renderItem={(item, idx, update) => (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-2">
                    <FormField label="Day #">
                      <Input type="number" value={item.day} onChange={(e) => update({ ...item, day: parseInt(e.target.value) || idx })} />
                    </FormField>
                    <FormField label="Title">
                      <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Arrival in Srinagar" />
                    </FormField>
                  </div>
                  <FormField label="Description">
                    <Textarea rows={3} value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField label="Meals">
                      <Input value={item.meals || ""} onChange={(e) => update({ ...item, meals: e.target.value })} placeholder="Breakfast, Dinner" />
                    </FormField>
                    <FormField label="Stay">
                      <Input value={item.stay || ""} onChange={(e) => update({ ...item, stay: e.target.value })} placeholder="Houseboat on Dal Lake" />
                    </FormField>
                  </div>
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Highlights, Inclusions & Exclusions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Highlights">
              <TagInput value={form.highlights} onChange={(v) => update("highlights", v)} placeholder="Shikara ride on Dal Lake…" suggestions={["Houseboat stay", "Gondola ride", "Mughal Gardens", "Pahalgam valleys", "Sonmarg glaciers"]} />
            </FormField>
            <FormField label="Inclusions">
              <TagInput value={form.inclusions} onChange={(v) => update("inclusions", v)} placeholder="All meals, hotel stay…" suggestions={["All meals", "Hotel stay", "Airport transfer", "Sightseeing", "Permits"]} />
            </FormField>
            <FormField label="Exclusions">
              <TagInput value={form.exclusions} onChange={(v) => update("exclusions", v)} placeholder="Airfare, personal expenses…" suggestions={["Airfare", "Personal expenses", "Travel insurance", "Tips", "Adventure activities"]} />
            </FormField>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Status">
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Order">
                <Input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} />
              </FormField>
              <FormField label="Group Size">
                <Input value={form.groupSize} onChange={(e) => update("groupSize", e.target.value)} placeholder="2-10" />
              </FormField>
            </div>
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Featured</Label>
                <Switch checked={!!form.featured} onCheckedChange={(v) => update("featured", v)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Popular</Label>
                <Switch checked={!!form.popular} onCheckedChange={(v) => update("popular", v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Ratings & Reviews</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <FormField label="Rating">
              <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => update("rating", e.target.value)} />
            </FormField>
            <FormField label="Review Count">
              <Input type="number" value={form.reviewCount} onChange={(e) => update("reviewCount", e.target.value)} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader>
          <CardContent>
            <ImageUploader value={form.coverImage} onChange={(v) => update("coverImage", v)} prefix={`pkg-${form.slug || "new"}`} aspect="wide" />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Image Gallery</CardTitle></CardHeader>
          <CardContent>
            <MultiImageUploader value={form.images} onChange={(v) => update("images", v)} prefix={`pkg-${form.slug || "new"}`} />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Link Destinations</CardTitle></CardHeader>
          <CardContent>
            <MultiSelect
              options={destOptions.map((d) => ({ value: d.id, label: d.name }))}
              value={form.destinationIds}
              onChange={(v) => update("destinationIds", v)}
              placeholder="Select destinations covered…"
              searchPlaceholder="Search destinations…"
            />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Coupons</CardTitle></CardHeader>
          <CardContent>
            <MultiSelect
              options={couponOptions.map((c) => ({ value: c.id, label: c.code }))}
              value={form.couponIds}
              onChange={(v) => update("couponIds", v)}
              placeholder="Select coupons…"
              searchPlaceholder="Search coupons…"
            />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <FormField label="Meta Title">
              <Input value={form.metaTitle || ""} onChange={(e) => update("metaTitle", e.target.value)} />
            </FormField>
            <FormField label="Meta Description">
              <Textarea rows={2} value={form.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex gap-2 sticky bottom-4 z-10">
          {id && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive flex-1">
                  <Trash2 className="size-4" /> Delete
                </Button>
              }
              title="Delete package?"
              description={`This will permanently delete "${form.title}".`}
              onConfirm={handleDelete}
            />
          )}
          <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {id ? "Save Changes" : "Create Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}
