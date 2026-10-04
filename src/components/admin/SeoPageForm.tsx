"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, Trash2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export function SeoPageForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    slug: "",
    title: "",
    content: "",
    heroImage: null,
    sections: [] as any[],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: "published",
  });

  useEffect(() => {
    (async () => {
      if (id) {
        const res = await adminFetch<{ page: any }>(`/api/admin/seo-pages/${id}`);
        if (res.success && res.data) {
          setForm(res.data.page);
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/seo-pages");
        }
      }
      setLoading(false);
    })();
     
  }, [id]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.slug.trim()) update("slug", slugifyStr(form.title));
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugifyStr(form.title) };
    const res = id
      ? await adminFetch(`/api/admin/seo-pages/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/seo-pages", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Page updated" : "Page created");
      router.push("/admin/seo-pages");
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/seo-pages/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Page deleted");
      router.replace("/admin/seo-pages");
    } else toast.error(res.error || "Failed");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Page Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormField label="Title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="About Asgari Travels" />
              </FormField>
              <FormField label="Slug">
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="about-asgari" />
              </FormField>
            </div>
            <MarkdownEditor label="Content (Markdown)" value={form.content} onChange={(v) => update("content", v)} rows={16} placeholder="# Page Heading\n\nContent…" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Sections (JSON blocks)</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => update("sections", [...(form.sections || []), { type: "cta", title: "", content: "" }])}>
                  <Plus className="size-3.5" /> Add Section
                </Button>
              </div>
              <div className="space-y-2">
                {(form.sections || []).map((s: any, i: number) => (
                  <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={s.type || ""}
                        onChange={(e) => update("sections", form.sections.map((x: any, idx: number) => idx === i ? { ...x, type: e.target.value } : x))}
                        placeholder="section type (cta, faq, gallery…)"
                        className="text-xs font-mono bg-white/5"
                      />
                      <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => update("sections", form.sections.filter((_: any, idx: number) => idx !== i))}>
                        <X className="size-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={s.title || ""}
                      onChange={(e) => update("sections", form.sections.map((x: any, idx: number) => idx === i ? { ...x, title: e.target.value } : x))}
                      placeholder="Section title"
                      className="text-xs bg-white/5"
                    />
                    <Textarea
                      rows={3}
                      value={typeof s.content === "string" ? s.content : JSON.stringify(s.content || {}, null, 2)}
                      onChange={(e) => update("sections", form.sections.map((x: any, idx: number) => idx === i ? { ...x, content: e.target.value } : x))}
                      placeholder="Section content (markdown or JSON)"
                      className="text-xs font-mono bg-white/5"
                    />
                  </div>
                ))}
                {(form.sections || []).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No custom sections added.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
          <CardContent>
            <FormField label="Status">
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Hero Image</CardTitle></CardHeader>
          <CardContent>
            <ImageUploader value={form.heroImage} onChange={(v) => update("heroImage", v)} prefix={`seo-${form.slug || "new"}`} aspect="wide" />
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

        <div className="flex gap-2">
          {id && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive flex-1">
                  <Trash2 className="size-4" /> Delete
                </Button>
              }
              title="Delete page?"
              description={`"${form.title}" will be permanently deleted.`}
              onConfirm={handleDelete}
            />
          )}
          <Button asChild variant="outline" className="flex-1">
            <Link href="/admin/seo-pages">Cancel</Link>
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
