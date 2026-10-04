/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TicketPercent, Plus, Pencil, Trash2, Percent, IndianRupee, Clock } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CouponRow {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  maxUses: number;
  usedCount: number;
  minOrderValue?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  isActive: boolean;
  packages: { id: string; title: string; slug: string }[];
}

export default function AdminCouponsPage() {
  const [data, setData] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== "all") params.set("active", activeFilter);
    const res = await adminFetch<{ coupons: CouponRow[] }>(`/api/admin/coupons?${params}`);
    if (res.success && res.data) setData(res.data.coupons);
    else toast.error(res.error || "Failed to load");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [activeFilter]);

  const handleDelete = async (id: string) => {
    const res = await adminFetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Coupon deleted");
      load();
    } else toast.error(res.error || "Failed");
  };

  const now = new Date();
  const isExpired = (c: CouponRow) => c.validUntil && new Date(c.validUntil) < now;

  const columns: Column<CouponRow>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      cell: (r) => (
        <div>
          <div className="font-mono font-bold text-sm tracking-wider text-primary">{r.code}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[240px]">{r.description || "-"}</div>
        </div>
      ),
    },
    {
      key: "discountValue",
      header: "Discount",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          {r.discountType === "percentage" ? (
            <>
              <Percent className="size-3.5 text-saffron" />
              {r.discountValue}%
            </>
          ) : (
            <>
              <IndianRupee className="size-3.5 text-emerald" />
              {r.discountValue}
            </>
          )}
        </div>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      cell: (r) => (
        <div className="text-xs">
          <div className="font-medium">{r.usedCount} / {r.maxUses}</div>
          <div className="text-muted-foreground">used</div>
        </div>
      ),
    },
    {
      key: "minOrderValue",
      header: "Min Order",
      cell: (r) => (r.minOrderValue ? `₹${r.minOrderValue.toLocaleString("en-IN")}` : <span className="text-muted-foreground">-</span>),
    },
    {
      key: "validUntil",
      header: "Valid Until",
      sortable: true,
      cell: (r) => (
        <div className="text-xs">
          {r.validUntil ? (
            <div className={isExpired(r) ? "text-destructive" : "text-muted-foreground"}>
              <Clock className="size-3 inline mr-1" />
              {new Date(r.validUntil).toLocaleDateString("en-IN")}
            </div>
          ) : (
            <span className="text-muted-foreground">No expiry</span>
          )}
        </div>
      ),
    },
    {
      key: "packages",
      header: "Packages",
      cell: (r) => (
        <div className="text-xs text-muted-foreground truncate max-w-[180px]">
          {r.packages.length > 0 ? r.packages.map((p) => p.title).join(", ") : "All packages"}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      cell: (r) => (r.isActive ? <StatusBadge status="active" /> : <StatusBadge status="inactive" />),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Coupons"
        description="Discount codes & promotional offers"
        icon={TicketPercent}
        actions={
          <>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All coupons</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Link href="/admin/coupons/new">
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
        searchKeys={["code", "description"]}
        searchPlaceholder="Search coupons…"
        getRowId={(r) => r.id}
        rowActions={(r) => (
          <>
            <Button asChild variant="ghost" size="icon" className="size-7" title="Edit">
              <Link href={`/admin/coupons/${r.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Delete">
                  <Trash2 className="size-3.5" />
                </Button>
              }
              title="Delete coupon?"
              description={`Coupon "${r.code}" will be permanently deleted.`}
              onConfirm={() => handleDelete(r.id)}
            />
          </>
        )}
      />
    </div>
  );
}
