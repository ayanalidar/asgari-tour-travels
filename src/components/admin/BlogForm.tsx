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
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TagInput } from "@/components/admin/TagInput";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

function slugifyStr(text: string): string {
  return text.toString().toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

const CATEGORIES = ["Travel Guide", "Kashmir", "Ladakh", "Adventure", "Culture", "Food", "Tips", "Honeymoon", "Photography"];

export function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: null,
    category: "Travel Guide",
    tags: [] as string[],
    author: "Asgari Tour & Travels",
    readTime: 5,
    metaTitle: "",
    metaDescription: "",
    status: "published",
    publishedAt: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    (async () => {
      if (id) {
        const res = await adminFetch<{ post: any }>(`/api/admin/blog/${id}`);
        if (res.success && res.data) {
          const p = res.data.post;
          setForm({
            ...p,
            publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 10) : "",
            tags: p.tags || [],
          });
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/blog");
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
    if (!form.excerpt.trim()) return toast.error("Excerpt is required");
    setSaving(true);
    const payload = {
      ...form,
      readTime: parseInt(form.readTime) || 5,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : new Date().toISOString(),
    };
    const res = id
      ? await adminFetch(`/api/admin/blog/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/blog", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Post updated" : "Post created");
      router.push("/admin/blog");
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Post deleted");
      router.replace("/admin/blog");
    } else toast.error(res.error || "Failed");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Article</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Title" required>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Best Time to Visit Kashmir" />
            </FormField>
            <FormField label="Slug">
              <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
            </FormField>
            <FormField label="Excerpt" required>
              <Textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="A short summary of the article…" />
            </FormField>
            <MarkdownEditor
              label="Content (Markdown)"
              value={form.content}
              onChange={(v) => update("content", v)}
              rows={16}
              placeholder="# Heading\n\nWrite your story…"
            />
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
            <FormField label="Category">
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Author">
              <Input value={form.author} onChange={(e) => update("author", e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Read Time">
                <Input type="number" value={form.readTime} onChange={(e) => update("readTime", e.target.value)} />
                <p className="text-[10px] text-muted-foreground">minutes</p>
              </FormField>
              <FormField label="Published Date">
                <Input type="date" value={form.publishedAt} onChange={(e) => update("publishedAt", e.target.value)} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader>
          <CardContent>
            <ImageUploader value={form.coverImage} onChange={(v) => update("coverImage", v)} prefix={`blog-${form.slug || "new"}`} aspect="wide" />
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
          <CardContent>
            <TagInput value={form.tags} onChange={(v) => update("tags", v)} placeholder="kashmir, travel-tips…" suggestions={["kashmir", "ladakh", "travel-guide", "honeymoon", "adventure"]} />
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
              title="Delete post?"
              description={`"${form.title}" will be permanently deleted.`}
              onConfirm={handleDelete}
            />
          )}
          <Button asChild variant="outline" className="flex-1">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {id ? "Save" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
