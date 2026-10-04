"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, ArrowLeft, Trash2, Sparkles } from "lucide-react";
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
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const REGIONS = ["kashmir", "ladakh", "jammu"];
const CATEGORIES = ["destination", "lake", "garden", "meadow", "peak", "monastery", "pass", "town"];

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(p.id);
      const res = await adminFetch<{ destination: any }>(`/api/admin/destinations/${p.id}`);
      if (res.success && res.data) {
        const d = res.data.destination;
        setForm({
          ...d,
          latitude: d.latitude ?? "",
          longitude: d.longitude ?? "",
          order: d.order ?? 0,
        });
      } else {
        toast.error(res.error || "Not found");
        router.replace("/admin/destinations");
      }
      setLoading(false);
    })();
     
  }, []);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.shortDescription?.trim()) return toast.error("Short description is required");
    setSaving(true);
    const res = await adminFetch(`/api/admin/destinations/${id}`, {
      method: "PUT",
      json: {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        order: parseInt(form.order) || 0,
      },
    });
    setSaving(false);
    if (res.success) {
      toast.success("Destination updated");
      router.push("/admin/destinations");
    } else {
      toast.error(res.error || "Failed to save");
    }
  };

  const handleDelete = async () => {
    const res = await adminFetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Destination deleted");
      router.replace("/admin/destinations");
    } else toast.error(res.error || "Failed");
  };

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-9">
            <Link href="/admin/destinations"><ArrowLeft className="size-4" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-xl lg:text-2xl font-bold">Edit Destination</h1>
            <p className="text-xs text-muted-foreground">{form.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" /> Delete
              </Button>
            }
            title="Delete destination?"
            description={`This will permanently delete "${form.name}".`}
            onConfirm={handleDelete}
          />
          <Button onClick={submit} disabled={saving} className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-saffron" /> Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Name" required>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
                </FormField>
                <FormField label="Slug">
                  <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Region">
                  <Select value={form.region} onValueChange={(v) => update("region", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Category">
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <FormField label="Tagline">
                <Input value={form.tagline || ""} onChange={(e) => update("tagline", e.target.value)} />
              </FormField>
              <FormField label="Short Description" required>
                <Textarea rows={2} value={form.shortDescription || ""} onChange={(e) => update("shortDescription", e.target.value)} />
              </FormField>
              <MarkdownEditor
                label="Description (Markdown)"
                value={form.description || ""}
                onChange={(v) => update("description", v)}
                rows={10}
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader><CardTitle className="text-base">Travel Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Best Time To Visit">
                  <Input value={form.bestTimeToVisit || ""} onChange={(e) => update("bestTimeToVisit", e.target.value)} />
                </FormField>
                <FormField label="Ideal Duration">
                  <Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Altitude">
                  <Input value={form.altitude || ""} onChange={(e) => update("altitude", e.target.value)} />
                </FormField>
                <FormField label="Distance">
                  <Input value={form.distance || ""} onChange={(e) => update("distance", e.target.value)} />
                </FormField>
              </div>
              <FormField label="How To Reach">
                <Textarea rows={3} value={form.howToReach || ""} onChange={(e) => update("howToReach", e.target.value)} />
              </FormField>
              <FormField label="Things To Do">
                <TagInput
                  value={form.thingsToDo || []}
                  onChange={(v) => update("thingsToDo", v)}
                  placeholder="Add activity…"
                  suggestions={["Gondola ride", "Skiing", "Snowboarding", "Trekking", "Shikara ride", "Photography"]}
                />
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
              <FormField label="Display Order">
                <Input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} />
              </FormField>
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
            <CardHeader><CardTitle className="text-base">Hero Image</CardTitle></CardHeader>
            <CardContent>
              <ImageUploader
                value={form.heroImage}
                onChange={(v) => update("heroImage", v)}
                prefix={`dest-${form.slug || id}`}
                aspect="wide"
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader><CardTitle className="text-base">Image Gallery</CardTitle></CardHeader>
            <CardContent>
              <MultiImageUploader
                value={form.images || []}
                onChange={(v) => update("images", v)}
                prefix={`dest-${form.slug || id}`}
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Latitude">
                  <Input value={form.latitude ?? ""} onChange={(e) => update("latitude", e.target.value)} />
                </FormField>
                <FormField label="Longitude">
                  <Input value={form.longitude ?? ""} onChange={(e) => update("longitude", e.target.value)} />
                </FormField>
              </div>
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
              <FormField label="Meta Keywords">
                <Input value={form.metaKeywords || ""} onChange={(e) => update("metaKeywords", e.target.value)} />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
