/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Plus, Pencil, Trash2, Eye, Star, IndianRupee } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PkgRow {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice?: number | null;
  currency: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  popular: boolean;
  status: string;
  order: number;
  destinations: { id: string; name: string; slug: string }[];
  coverImage?: string | null;
}

export default function AdminPackagesPage() {
  const [data, setData] = useState<PkgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await adminFetch<{ packages: PkgRow[] }>(`/api/admin/packages?${params}`);
    if (res.success && res.data) setData(res.data.packages);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Package deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const columns: Column<PkgRow>[] = [
    {
      key: "title",
      header: "Package",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-md bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0 overflow-hidden">
            {r.coverImage ? (
               
              <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover" />
            ) : (
              <Package className="size-4 text-saffron" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate flex items-center gap-1.5">
              {r.title}
              {r.featured && <Star className="size-3 fill-saffron text-saffron" />}
              {r.popular && <Star className="size-3 fill-emerald text-emerald" />}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {r.durationNights}N / {r.durationDays}D · {r.destinations.length} dest
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      sortAccessor: (r) => r.price,
      cell: (r) => (
        <div className="text-sm">
          <span className="font-medium">₹{r.price.toLocaleString("en-IN")}</span>
          {r.discountPrice && (
            <span className="text-xs text-emerald ml-1">→ ₹{r.discountPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-1 text-xs">
          <Star className="size-3 fill-saffron text-saffron" />
          <span className="font-medium">{r.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({r.reviewCount})</span>
        </div>
      ),
    },
    {
      key: "destinations",
      header: "Destinations",
      cell: (r) => (
        <div className="text-xs text-muted-foreground truncate max-w-[220px]">
          {r.destinations.map((d) => d.name).join(", ") || "—"}
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      sortable: true,
      cell: (r) => <span className="text-xs font-mono">{r.order}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Tour Packages"
        description="Manage all Kashmir & Ladakh tour packages"
        icon={Package}
        actions={
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Link href="/admin/packages/new">
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
        searchKeys={["title", "slug", "subtitle"]}
        searchPlaceholder="Search packages…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="View">
              <Link href={`/packages/${r.slug}`} target="_blank">
                <Eye className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/packages/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete package?"
              description={`This will permanently delete "${r.title}".`}
              confirmLabel="Delete"
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
