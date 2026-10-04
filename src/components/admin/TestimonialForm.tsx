"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

export function TestimonialForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [pkgs, setPkgs] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState<any>({
    name: "",
    location: "",
    avatar: null,
    rating: 5,
    title: "",
    text: "",
    packageId: "",
    featured: false,
    approved: true,
    source: "direct",
  });

  useEffect(() => {
    (async () => {
      const pRes = await adminFetch<{ packages: { id: string; title: string }[] }>("/api/admin/packages");
      if (pRes.success && pRes.data) setPkgs(pRes.data.packages);
      if (id) {
        const res = await adminFetch<{ testimonial: any }>(`/api/admin/testimonials/${id}`);
        if (res.success && res.data) {
          const t = res.data.testimonial;
          setForm({
            ...t,
            packageId: t.packageId || "",
            rating: t.rating ?? 5,
          });
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/testimonials");
        }
      }
      setLoading(false);
    })();
     
  }, [id]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.text.trim()) return toast.error("Testimonial text is required");
    setSaving(true);
    const payload = {
      ...form,
      packageId: form.packageId || null,
      rating: parseInt(form.rating) || 5,
    };
    const res = id
      ? await adminFetch(`/api/admin/testimonials/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/testimonials", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Testimonial deleted");
      router.replace("/admin/testimonials");
    } else toast.error(res.error || "Failed");
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="glass border-white/10">
        <CardHeader><CardTitle className="text-base">Testimonial</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Reviewer Name" required>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </FormField>
            <FormField label="Location">
              <Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="Mumbai, India" />
            </FormField>
          </div>
          <FormField label="Title">
            <Input value={form.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="Unforgettable trip to Kashmir" />
          </FormField>
          <FormField label="Testimonial" required>
            <Textarea rows={4} value={form.text} onChange={(e) => update("text", e.target.value)} placeholder="What did the customer say?" />
          </FormField>
          <div className="grid sm:grid-cols-3 gap-3">
            <FormField label="Rating">
              <Select value={String(form.rating)} onValueChange={(v) => update("rating", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      <div className="flex items-center gap-1">
                        {n} <Star className="size-3 fill-saffron text-saffron" />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Source">
              <Select value={form.source} onValueChange={(v) => update("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Package">
              <Select value={form.packageId || "none"} onValueChange={(v) => update("packageId", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No package</SelectItem>
                  {pkgs.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField label="Reviewer Avatar">
            <ImageUploader value={form.avatar} onChange={(v) => update("avatar", v)} prefix="avatar" aspect="square" />
          </FormField>
          <div className="flex items-center gap-6 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between flex-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Featured</Label>
              <Switch checked={!!form.featured} onCheckedChange={(v) => update("featured", v)} />
            </div>
            <div className="flex items-center justify-between flex-1">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Approved</Label>
              <Switch checked={!!form.approved} onCheckedChange={(v) => update("approved", v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mt-4">
        {id && (
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="text-destructive hover:text-destructive flex-1">
                <Trash2 className="size-4" /> Delete
              </Button>
            }
            title="Delete testimonial?"
            description={`"${form.name}'s" testimonial will be permanently deleted.`}
            onConfirm={handleDelete}
          />
        )}
        <Button asChild variant="outline" className="flex-1">
          <Link href="/admin/testimonials">Cancel</Link>
        </Button>
        <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {id ? "Save Changes" : "Create"}
        </Button>
      </div>
    </div>
  );
}
