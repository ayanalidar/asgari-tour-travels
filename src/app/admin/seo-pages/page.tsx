/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SeoRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  metaTitle?: string | null;
  updatedAt: string;
}

export default function AdminSeoPagesPage() {
  const [data, setData] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await adminFetch<{ pages: SeoRow[] }>(`/api/admin/seo-pages?${params}`);
    if (res.success && res.data) setData(res.data.pages);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/seo-pages/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Page deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const columns: Column<SeoRow>[] = [
    {
      key: "title",
      header: "Page",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-md bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0">
            <Search className="size-4 text-saffron" />
          </div>
          <div>
            <div className="font-medium text-sm">{r.title}</div>
            <div className="text-xs text-muted-foreground font-mono">/{r.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "metaTitle",
      header: "Meta Title",
      cell: (r) => <span className="text-xs text-muted-foreground truncate max-w-[260px] block">{r.metaTitle || "—"}</span>,
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{new Date(r.updatedAt).toLocaleDateString("en-IN")}</span>,
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
        title="SEO Pages"
        description="Custom landing pages with editable content"
        icon={Search}
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
              <Link href="/admin/seo-pages/new">
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
        searchKeys={["title", "slug"]}
        searchPlaceholder="Search pages…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/seo-pages/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete page?"
              description={`"${r.title}" will be permanently deleted.`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
