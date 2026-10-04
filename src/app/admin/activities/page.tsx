/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ActRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  duration?: string | null;
  difficulty?: string | null;
  bestSeason?: string | null;
  featured: boolean;
  status: string;
  order: number;
  destination?: { id: string; name: string; slug: string } | null;
  images?: string[];
}

export default function AdminActivitiesPage() {
  const [data, setData] = useState<ActRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await adminFetch<{ activities: ActRow[] }>(`/api/admin/activities?${params}`);
    if (res.success && res.data) setData(res.data.activities);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/activities/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Activity deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const columns: Column<ActRow>[] = [
    {
      key: "title",
      header: "Activity",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-md bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0 overflow-hidden">
            {r.images && r.images[0] ? (
               
              <img src={r.images[0]} alt={r.title} className="w-full h-full object-cover" />
            ) : (
              <Activity className="size-4 text-saffron" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{r.title}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[280px]">{r.shortDescription}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (r) => <span className="text-xs capitalize">{r.category}</span>,
    },
    {
      key: "destination",
      header: "Destination",
      cell: (r) => <span className="text-xs text-muted-foreground">{r.destination?.name || "-"}</span>,
    },
    {
      key: "duration",
      header: "Duration",
      cell: (r) => <span className="text-xs">{r.duration || "-"}</span>,
    },
    {
      key: "bestSeason",
      header: "Best Season",
      cell: (r) => <span className="text-xs text-muted-foreground">{r.bestSeason || "-"}</span>,
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
        title="Activities"
        description="Things to do in Kashmir & Ladakh"
        icon={Activity}
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
              <Link href="/admin/activities/new">
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
        searchKeys={["title", "shortDescription", "slug"]}
        searchPlaceholder="Search activities…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/activities/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete activity?"
              description={`"${r.title}" will be permanently deleted.`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
