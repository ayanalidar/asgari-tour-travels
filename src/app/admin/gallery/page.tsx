/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Images, Plus, Trash2, Pencil, Star, Loader2, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GalleryImg {
  id: string;
  title?: string | null;
  description?: string | null;
  url: string;
  alt?: string | null;
  category: string;
  destinationId?: string | null;
  featured: boolean;
  destination?: { id: string; name: string } | null;
}

const CATEGORIES = ["destination", "activity", "culture", "food", "hotel"];

export default function AdminGalleryPage() {
  const [data, setData] = useState<GalleryImg[]>([]);
  const [dests, setDests] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [lightbox, setLightbox] = useState<GalleryImg | null>(null);
  const [editing, setEditing] = useState<GalleryImg | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    const res = await adminFetch<{ images: GalleryImg[] }>(`/api/admin/gallery?${params}`);
    if (res.success && res.data) setData(res.data.images);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    adminFetch<{ destinations: { id: string; name: string }[] }>("/api/admin/destinations").then((r) => {
      if (r.success && r.data) setDests(r.data.destinations);
    });
    load();
  }, [category]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Image deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Visual media library for destinations & activities"
        icon={Images}
        actions={
          <>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-36 h-9 bg-white/5 border-white/10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setCreating(true)} className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Plus className="size-4" /> Add Image
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="size-8 animate-spin text-primary" /></div>
      ) : data.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="py-12 text-center text-muted-foreground">No images yet. Click &ldquo;Add Image&rdquo; to upload.</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {data.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5"
            >
              { }
              <img src={img.url} alt={img.alt || img.title || ""} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Badge variant="outline" className="text-[9px] px-1 py-0 bg-white/10 border-white/20 text-white capitalize">{img.category}</Badge>
                  {img.featured && <Star className="size-3 fill-saffron text-saffron" />}
                </div>
                <div className="text-[11px] text-white font-medium truncate">{img.title || img.alt || "Untitled"}</div>
                <div className="flex items-center gap-1 mt-2">
                  <Button size="icon" variant="ghost" className="size-7 text-white hover:bg-white/20" onClick={() => setLightbox(img)} title="View">
                    <Images className="size-3" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-7 text-white hover:bg-white/20" onClick={() => setEditing(img)} title="Edit">
                    <Pencil className="size-3" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button size="icon" variant="ghost" className="size-7 text-destructive hover:bg-destructive/40 hover:text-white" title="Delete">
                        <Trash2 className="size-3" />
                      </Button>
                    }
                    title="Delete image?"
                    description="This image will be removed from the gallery."
                    onConfirm={() => handleDelete(img.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl glass-strong border-white/15 p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{lightbox?.title || "Image preview"}</DialogTitle>
          </DialogHeader>
          {lightbox && (
            <div className="flex flex-col">
              { }
              <img src={lightbox.url} alt={lightbox.alt || ""} className="w-full max-h-[60vh] object-contain bg-black/40" />
              <div className="p-4 space-y-2">
                {lightbox.title && <h3 className="font-semibold">{lightbox.title}</h3>}
                {lightbox.description && <p className="text-sm text-muted-foreground">{lightbox.description}</p>}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize text-xs">{lightbox.category}</Badge>
                  {lightbox.destination?.name && <span className="text-xs text-muted-foreground">· {lightbox.destination.name}</span>}
                  {lightbox.featured && <Badge className="bg-saffron/15 text-saffron border-saffron/30 text-xs">Featured</Badge>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit dialog */}
      <ImageEditDialog
        image={editing}
        open={!!editing || creating}
        dests={dests}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSaved={() => { load(); setEditing(null); setCreating(false); }}
      />
    </div>
  );
}

function ImageEditDialog({
  image,
  open,
  dests,
  onClose,
  onSaved,
}: {
  image: GalleryImg | null;
  open: boolean;
  dests: { id: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    url: null,
    alt: "",
    category: "destination",
    destinationId: "",
    featured: false,
  });

  useEffect(() => {
    if (image) {
      setForm({
        title: image.title || "",
        description: image.description || "",
        url: image.url,
        alt: image.alt || "",
        category: image.category,
        destinationId: image.destinationId || "",
        featured: image.featured,
      });
    } else {
      setForm({
        title: "",
        description: "",
        url: null,
        alt: "",
        category: "destination",
        destinationId: "",
        featured: false,
      });
    }
  }, [image, open]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.url) return toast.error("Image is required");
    setSaving(true);
    const payload = { ...form, destinationId: form.destinationId || null };
    const res = image
      ? await adminFetch(`/api/admin/gallery/${image.id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/gallery", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(image ? "Image updated" : "Image added");
      onSaved();
    } else toast.error(res.error || "Failed");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong border-white/15 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{image ? "Edit Image" : "Add Image"}</DialogTitle>
        </DialogHeader>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-3">
            <ImageUploader value={form.url} onChange={(v) => update("url", v)} prefix="gallery" aspect="square" />
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Featured</Label>
              <Switch checked={!!form.featured} onCheckedChange={(v) => update("featured", v)} />
            </div>
          </div>
          <div className="space-y-3">
            <FormField label="Title">
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
            </FormField>
            <FormField label="Alt Text">
              <Input value={form.alt} onChange={(e) => update("alt", e.target.value)} />
            </FormField>
            <div className="grid grid-cols-2 gap-2">
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
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {dests.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Description">
              <Textarea rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </FormField>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {image ? "Save Changes" : "Add Image"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
