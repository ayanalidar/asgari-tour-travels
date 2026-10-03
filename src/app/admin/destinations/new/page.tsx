/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Save, Loader2, ArrowLeft, Sparkles } from "lucide-react";
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
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const REGIONS = ["kashmir", "ladakh", "jammu"];
const CATEGORIES = ["destination", "lake", "garden", "meadow", "peak", "monastery", "pass", "town"];

export default function NewDestinationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    region: "kashmir",
    category: "destination",
    tagline: "",
    shortDescription: "",
    description: "",
    heroImage: null as string | null,
    images: [] as string[],
    bestTimeToVisit: "",
    duration: "",
    altitude: "",
    distance: "",
    howToReach: "",
    thingsToDo: [] as string[],
    latitude: "",
    longitude: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    featured: false,
    popular: false,
    order: 0,
    status: "published",
  });

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!form.slug && form.name) update("slug", slugifyStr(form.name));
     
  }, [form.name]);

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.shortDescription.trim()) {
      toast.error("Short description is required");
      return;
    }
    setSaving(true);
    const res = await adminFetch("/api/admin/destinations", {
      method: "POST",
      json: {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        order: parseInt(form.order) || 0,
      },
    });
    setSaving(false);
    if (res.success) {
      toast.success("Destination created");
      router.push("/admin/destinations");
    } else {
      toast.error(res.error || "Failed to save");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-9">
            <Link href="/admin/destinations">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-xl lg:text-2xl font-bold">New Destination</h1>
            <p className="text-xs text-muted-foreground">Add a new place to explore</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/destinations">Cancel</Link>
          </Button>
          <Button onClick={submit} disabled={saving} className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Destination
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main column */}
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
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Gulmarg" />
                </FormField>
                <FormField label="Slug">
                  <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="auto-from-name" />
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
                <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Meadow of Flowers" />
              </FormField>
              <FormField label="Short Description" required>
                <Textarea rows={2} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="Brief one-line description" />
              </FormField>
              <MarkdownEditor
                label="Description (Markdown)"
                value={form.description}
                onChange={(v) => update("description", v)}
                placeholder="# Welcome to {name}…&#10;&#10;Markdown supported"
                rows={10}
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Travel Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Best Time To Visit">
                  <Input value={form.bestTimeToVisit} onChange={(e) => update("bestTimeToVisit", e.target.value)} placeholder="March–June, Sept–Nov" />
                </FormField>
                <FormField label="Ideal Duration">
                  <Input value={form.duration} onChange={(e) => update("duration", e.target.value)} placeholder="2–3 days" />
                </FormField>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Altitude">
                  <Input value={form.altitude} onChange={(e) => update("altitude", e.target.value)} placeholder="2,650 m" />
                </FormField>
                <FormField label="Distance (from Srinagar/Leh)">
                  <Input value={form.distance} onChange={(e) => update("distance", e.target.value)} placeholder="52 km from Srinagar" />
                </FormField>
              </div>
              <FormField label="How To Reach">
                <Textarea rows={3} value={form.howToReach} onChange={(e) => update("howToReach", e.target.value)} placeholder="By road via Tangmarg…" />
              </FormField>
              <FormField label="Things To Do">
                <TagInput
                  value={form.thingsToDo}
                  onChange={(v) => update("thingsToDo", v)}
                  placeholder="Gondola ride, Skiing, Snowboarding…"
                  suggestions={["Gondola ride", "Skiing", "Snowboarding", "Trekking", "Shikara ride", "Photography"]}
                />
              </FormField>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar column */}
        <div className="space-y-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Publishing</CardTitle>
            </CardHeader>
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
                  <Switch checked={form.featured} onCheckedChange={(v) => update("featured", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Popular</Label>
                  <Switch checked={form.popular} onCheckedChange={(v) => update("popular", v)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Hero Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={form.heroImage}
                onChange={(v) => update("heroImage", v)}
                prefix={`dest-${form.slug || "new"}`}
                aspect="wide"
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiImageUploader
                value={form.images}
                onChange={(v) => update("images", v)}
                prefix={`dest-${form.slug || "new"}`}
              />
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Latitude">
                  <Input value={form.latitude} onChange={(e) => update("latitude", e.target.value)} placeholder="34.0484" />
                </FormField>
                <FormField label="Longitude">
                  <Input value={form.longitude} onChange={(e) => update("longitude", e.target.value)} placeholder="74.3805" />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField label="Meta Title">
                <Input value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} />
              </FormField>
              <FormField label="Meta Description">
                <Textarea rows={2} value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} />
              </FormField>
              <FormField label="Meta Keywords">
                <Input value={form.metaKeywords} onChange={(e) => update("metaKeywords", e.target.value)} placeholder="comma, separated" />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
