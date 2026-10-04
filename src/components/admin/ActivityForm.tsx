/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const CATEGORIES = ["adventure", "cultural", "nature", "religious", "leisure"];

export function ActivityForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [dests, setDests] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    category: "adventure",
    shortDescription: "",
    description: "",
    images: [] as string[],
    duration: "",
    difficulty: "Easy",
    bestSeason: "",
    destinationId: "",
    metaTitle: "",
    metaDescription: "",
    featured: false,
    order: 0,
    status: "published",
  });

  useEffect(() => {
    (async () => {
      const dRes = await adminFetch<{ destinations: { id: string; name: string }[] }>("/api/admin/destinations");
      if (dRes.success && dRes.data) setDests(dRes.data.destinations);
      if (id) {
        const res = await adminFetch<{ activity: any }>(`/api/admin/activities/${id}`);
        if (res.success && res.data) {
          const a = res.data.activity;
          setForm({
            ...a,
            destinationId: a.destinationId || "",
            order: a.order ?? 0,
          });
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/activities");
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
      destinationId: form.destinationId || null,
      order: parseInt(form.order) || 0,
    };
    const res = id
      ? await adminFetch(`/api/admin/activities/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/activities", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Activity updated" : "Activity created");
      router.push("/admin/activities");
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Activity deleted");
      router.replace("/admin/activities");
    } else toast.error(res.error || "Failed");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Activity Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Gondola Cable Car Ride" />
              </FormField>
              <FormField label="Slug">
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
              </FormField>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Destination">
                <Select value={form.destinationId || "none"} onValueChange={(v) => update("destinationId", v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="No destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No destination</SelectItem>
                    {dests.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Short Description" required>
              <Textarea rows={2} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
            </FormField>
            <MarkdownEditor label="Description (Markdown)" value={form.description} onChange={(v) => update("description", v)} rows={10} />
            <div className="grid sm:grid-cols-3 gap-3">
              <FormField label="Duration">
                <Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="2-3 hours" />
              </FormField>
              <FormField label="Difficulty">
                <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Best Season">
                <Input value={form.bestSeason || ""} onChange={(e) => update("bestSeason", e.target.value)} placeholder="Nov–Feb" />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Images</CardTitle></CardHeader>
          <CardContent>
            <MultiImageUploader value={form.images} onChange={(v) => update("images", v)} prefix={`act-${form.slug || "new"}`} />
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
            <FormField label="Order">
              <Input type="number" value={form.order} onChange={(e) => update("order", e.target.value)} />
            </FormField>
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Featured</Label>
              <Switch checked={!!form.featured} onCheckedChange={(v) => update("featured", v)} />
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
          </CardContent>
        </Card>

        <div className="flex gap-2">
          {id && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive flex-1">
                  <Trash2 className="size-4" /> Delete
                </Button>
              }
              title="Delete activity?"
              description={`"${form.title}" will be permanently deleted.`}
              onConfirm={handleDelete}
            />
          )}
          <Button asChild variant="outline" className="flex-1">
            <Link href="/admin/activities">Cancel</Link>
          </Button>
          <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {id ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
