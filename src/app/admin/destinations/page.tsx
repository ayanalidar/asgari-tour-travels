/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Pencil, Trash2, Loader2, Star, Eye } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface DestRow {
  id: string;
  slug: string;
  name: string;
  region: string;
  category: string;
  shortDescription: string;
  featured: boolean;
  popular: boolean;
  status: string;
  order: number;
  heroImage?: string | null;
}

export default function AdminDestinationsPage() {
  const [data, setData] = useState<DestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (region !== "all") params.set("region", region);
    const res = await adminFetch<{ destinations: DestRow[] }>(`/api/admin/destinations?${params}`);
    if (res.success && res.data) setData(res.data.destinations);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [region]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Destination deleted");
      load();
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  const columns: Column<DestRow>[] = [
    {
      key: "name",
      header: "Destination",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-md bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0 overflow-hidden">
            {r.heroImage ? (
               
              <img src={r.heroImage} alt={r.name} className="w-full h-full object-cover" />
            ) : (
              <MapPin className="size-4 text-saffron" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate flex items-center gap-1.5">
              {r.name}
              {r.featured && <Star className="size-3 fill-saffron text-saffron" />}
              {r.popular && <Star className="size-3 fill-emerald text-emerald" />}
            </div>
            <div className="text-xs text-muted-foreground truncate">{r.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "region",
      header: "Region",
      sortable: true,
      cell: (r) => (
        <span className="capitalize text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10">
          {r.region}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (r) => <span className="text-xs text-muted-foreground capitalize">{r.category}</span>,
    },
    {
      key: "shortDescription",
      header: "Tagline",
      cell: (r) => <span className="text-xs text-muted-foreground truncate max-w-[280px] block">{r.shortDescription}</span>,
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
        title="Destinations"
        description="Manage Kashmir, Ladakh & Jammu destinations"
        icon={MapPin}
        actions={
          <>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="kashmir">Kashmir</SelectItem>
                <SelectItem value="ladakh">Ladakh</SelectItem>
                <SelectItem value="jammu">Jammu</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Link href="/admin/destinations/new">
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
        searchKeys={["name", "slug", "shortDescription"]}
        searchPlaceholder="Search destinations…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="View">
              <Link href={`/destinations/${r.slug}`} target="_blank">
                <Eye className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/destinations/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete destination?"
              description={`This will permanently delete "${r.name}" and remove all its activities & gallery links.`}
              confirmLabel="Delete"
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
