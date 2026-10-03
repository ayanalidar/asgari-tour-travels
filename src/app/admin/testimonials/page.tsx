/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Plus, Pencil, Trash2, Quote } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TestimonialRow {
  id: string;
  name: string;
  location?: string | null;
  avatar?: string | null;
  rating: number;
  title?: string | null;
  text: string;
  featured: boolean;
  approved: boolean;
  source: string;
  package?: { id: string; title: string; slug: string } | null;
}

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter === "approved") params.set("approved", "true");
    if (filter === "pending") params.set("approved", "false");
    if (filter === "featured") params.set("featured", "true");
    const res = await adminFetch<{ testimonials: TestimonialRow[] }>(`/api/admin/testimonials?${params}`);
    if (res.success && res.data) setData(res.data.testimonials);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Testimonial deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const columns: Column<TestimonialRow>[] = [
    {
      key: "name",
      header: "Reviewer",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-gradient-to-br from-saffron/30 to-emerald/30 flex items-center justify-center shrink-0 overflow-hidden">
            {r.avatar ? (
               
              <img src={r.avatar} alt={r.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold">{r.name?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{r.name}</div>
            <div className="text-xs text-muted-foreground truncate">{r.location || r.source}</div>
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
            <Star key={n} className={`size-3 ${n <= r.rating ? "fill-saffron text-saffron" : "text-muted-foreground/40"}`} />
          ))}
        </div>
      ),
    },
    {
      key: "text",
      header: "Testimonial",
      cell: (r) => (
        <div className="text-xs text-muted-foreground truncate max-w-[280px]">
          <Quote className="size-3 inline mr-1 text-saffron" />
          {r.text}
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (r) => <Badge variant="outline" className="text-xs capitalize">{r.source}</Badge>,
    },
    {
      key: "approved",
      header: "Status",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-1">
          {r.approved ? (
            <Badge className="bg-emerald/15 text-emerald border-emerald/30 text-[10px]">Approved</Badge>
          ) : (
            <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/30 text-[10px]">Pending</Badge>
          )}
          {r.featured && <Badge className="bg-saffron/15 text-saffron border-saffron/30 text-[10px]">Featured</Badge>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Customer reviews & feedback"
        icon={Star}
        actions={
          <>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Link href="/admin/testimonials/new">
                <Plus className="size-4" /> New
              </Link>
            </Button>
          </>
        }
      />
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        searchKeys={["name", "text", "location"]}
        searchPlaceholder="Search testimonials…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/testimonials/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete testimonial?"
              description={`"${r.name}'s" testimonial will be permanently deleted.`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
