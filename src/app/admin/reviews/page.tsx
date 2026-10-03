/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { MessageSquareQuote, Plus, Pencil, Trash2, RefreshCw, Star, Loader2, ExternalLink } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/admin/FormField";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewRow {
  id: string;
  placeId?: string | null;
  authorName: string;
  authorAvatar?: string | null;
  rating: number;
  text: string;
  reviewDate: string;
  sourceUrl?: string | null;
}

export default function AdminReviewsPage() {
  const [data, setData] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await adminFetch<{ reviews: ReviewRow[] }>("/api/admin/reviews");
    if (res.success && res.data) setData(res.data.reviews);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    const res = await adminFetch("/api/admin/google/sync", { method: "POST" });
    setSyncing(false);
    if (res.success && res.data) {
      const r = res.data;
      toast.success(`Synced ${r.inserted} review(s) · Rating ${r.rating} · ${r.totalReviews} total`);
      load();
    } else {
      toast.error(res.error || "Sync failed");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Review deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const avgRating = data.length > 0 ? (data.reduce((s, r) => s + r.rating, 0) / data.length).toFixed(1) : "—";

  const columns: Column<ReviewRow>[] = [
    {
      key: "authorName",
      header: "Author",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-saffron/30 to-emerald/30 flex items-center justify-center shrink-0 overflow-hidden">
            {r.authorAvatar ? (
               
              <img src={r.authorAvatar} alt={r.authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold">{r.authorName?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div>
            <div className="font-medium text-sm">{r.authorName}</div>
            {r.sourceUrl && (
              <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center gap-1">
                <ExternalLink className="size-3" /> Google review
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      cell: (r) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={cn("size-3", n <= r.rating ? "fill-saffron text-saffron" : "text-muted-foreground/40")} />
          ))}
        </div>
      ),
    },
    {
      key: "text",
      header: "Review",
      cell: (r) => <p className="text-xs text-muted-foreground line-clamp-2 max-w-[400px]">{r.text}</p>,
    },
    {
      key: "reviewDate",
      header: "Date",
      sortable: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{new Date(r.reviewDate).toLocaleDateString("en-IN")}</span>,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Google Reviews"
        description="Synced customer reviews from Google Places"
        icon={MessageSquareQuote}
        actions={
          <>
            <Button variant="outline" onClick={handleSync} disabled={syncing}>
              {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Sync from Google
            </Button>
            <Button onClick={() => setCreating(true)} className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Plus className="size-4" /> Add Manually
            </Button>
          </>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="glass border-white/10 py-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-saffron/15 flex items-center justify-center">
              <Star className="size-6 fill-saffron text-saffron" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold gradient-text-saffron">{avgRating}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 py-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-emerald/15 flex items-center justify-center">
              <MessageSquareQuote className="size-6 text-emerald" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-emerald">{data.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Reviews</div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/10 py-0">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-rose/15 flex items-center justify-center">
              <Star className="size-6 text-rose-glow" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-rose-glow">
                {data.filter((r) => r.rating >= 4).length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">4+ Stars</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        searchKeys={["authorName", "text"]}
        searchPlaceholder="Search reviews…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button variant="ghost" size="icon" className="size-7" title="Edit" onClick={() => setEditing(r)}>
              <Pencil className="size-3.5" />
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete review?"
              description={`"${r.authorName}'s" review will be permanently deleted.`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />

      <ReviewDialog
        review={editing}
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        onSaved={() => { load(); setEditing(null); setCreating(false); }}
      />
    </div>
  );
}

function ReviewDialog({
  review,
  open,
  onClose,
  onSaved,
}: {
  review: ReviewRow | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    authorName: "",
    authorAvatar: "",
    rating: 5,
    text: "",
    reviewDate: new Date().toISOString().slice(0, 10),
    sourceUrl: "",
  });

  useEffect(() => {
    if (review) {
      setForm({
        authorName: review.authorName,
        authorAvatar: review.authorAvatar || "",
        rating: review.rating,
        text: review.text,
        reviewDate: new Date(review.reviewDate).toISOString().slice(0, 10),
        sourceUrl: review.sourceUrl || "",
      });
    } else {
      setForm({
        authorName: "",
        authorAvatar: "",
        rating: 5,
        text: "",
        reviewDate: new Date().toISOString().slice(0, 10),
        sourceUrl: "",
      });
    }
  }, [review, open]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.authorName.trim() || !form.text.trim()) {
      toast.error("Author name and review text are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      authorAvatar: form.authorAvatar || null,
      reviewDate: form.reviewDate ? new Date(form.reviewDate).toISOString() : new Date().toISOString(),
      sourceUrl: form.sourceUrl || null,
      rating: parseInt(form.rating) || 5,
    };
    const res = review
      ? await adminFetch(`/api/admin/reviews/${review.id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/reviews", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(review ? "Review updated" : "Review added");
      onSaved();
    } else toast.error(res.error || "Failed");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong border-white/15">
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "Add Review"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Author Name" required>
              <Input value={form.authorName} onChange={(e) => update("authorName", e.target.value)} />
            </FormField>
            <FormField label="Avatar URL">
              <Input value={form.authorAvatar} onChange={(e) => update("authorAvatar", e.target.value)} placeholder="https://…" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <FormField label="Rating">
              <Select value={String(form.rating)} onValueChange={(v) => update("rating", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((n) => <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Review Date">
              <Input type="date" value={form.reviewDate} onChange={(e) => update("reviewDate", e.target.value)} />
            </FormField>
            <FormField label="Source URL">
              <Input value={form.sourceUrl} onChange={(e) => update("sourceUrl", e.target.value)} placeholder="https://…" />
            </FormField>
          </div>
          <FormField label="Review Text" required>
            <Textarea rows={4} value={form.text} onChange={(e) => update("text", e.target.value)} />
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={saving} className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {review ? "Save Changes" : "Add Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
