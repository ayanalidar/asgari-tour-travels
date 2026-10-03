/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: number;
  tags: string[];
  status: string;
  publishedAt: string;
  coverImage?: string | null;
}

export default function AdminBlogPage() {
  const [data, setData] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await adminFetch<{ posts: BlogRow[] }>(`/api/admin/blog?${params}`);
    if (res.success && res.data) setData(res.data.posts);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Post deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const columns: Column<BlogRow>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-md bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0 overflow-hidden">
            {r.coverImage ? (
               
              <img src={r.coverImage} alt={r.title} className="w-full h-full object-cover" />
            ) : (
              <Newspaper className="size-4 text-saffron" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate max-w-[300px]">{r.title}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[300px]">{r.excerpt}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (r) => <Badge variant="outline" className="text-xs">{r.category}</Badge>,
    },
    {
      key: "tags",
      header: "Tags",
      cell: (r) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {(r.tags || []).slice(0, 3).map((t, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] py-0">#{t}</Badge>
          ))}
          {r.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{r.tags.length - 3}</span>}
        </div>
      ),
    },
    {
      key: "author",
      header: "Author",
      cell: (r) => <span className="text-xs text-muted-foreground">{r.author}</span>,
    },
    {
      key: "readTime",
      header: "Read",
      sortable: true,
      cell: (r) => <span className="text-xs">{r.readTime} min</span>,
    },
    {
      key: "publishedAt",
      header: "Published",
      sortable: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{new Date(r.publishedAt).toLocaleDateString("en-IN")}</span>,
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
        title="Blog Posts"
        description="Travel guides, stories & articles"
        icon={Newspaper}
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
              <Link href="/admin/blog/new">
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
        searchKeys={["title", "excerpt", "slug"]}
        searchPlaceholder="Search posts…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="View">
              <Link href={`/blog/${r.slug}`} target="_blank">
                <Eye className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/blog/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete post?"
              description={`This will permanently delete "${r.title}".`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
