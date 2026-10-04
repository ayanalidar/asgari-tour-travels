/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { KanbanSquare, Table as TableIcon, Plus, Phone, Mail, Calendar, MapPin, User, Inbox, Loader2, Download } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadKanban } from "@/components/admin/LeadKanban";
import { LeadDrawer, type LeadT } from "@/components/admin/LeadDrawer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface LeadRow extends LeadT {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  destination?: string | null;
  travelDate?: string | null;
  status: string;
  source: string;
  priority: string;
  createdAt: string;
}

function LeadsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLeadId = searchParams.get("lead");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [data, setData] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (sourceFilter !== "all") params.set("source", sourceFilter);
    if (priorityFilter !== "all") params.set("priority", priorityFilter);
    const res = await adminFetch<{ leads: LeadRow[] }>(`/api/admin/leads?${params}`);
    if (res.success && res.data) {
      setData(res.data.leads);
      // If lead id in URL, open drawer
      if (initialLeadId) {
        const found = res.data.leads.find((l) => l.id === initialLeadId);
        if (found) {
          setSelectedLead(found);
          setDrawerOpen(true);
        }
      }
    } else {
      toast.error(res.error || "Failed to load");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
     
  }, [statusFilter, sourceFilter, priorityFilter, initialLeadId]);

  const openLead = (l: LeadRow) => {
    setSelectedLead(l);
    setDrawerOpen(true);
    // Update URL without reloading
    const params = new URLSearchParams(searchParams.toString());
    params.set("lead", l.id);
    router.replace(`/admin/leads?${params.toString()}`);
  };

  const handleDrawerChange = (o: boolean) => {
    setDrawerOpen(o);
    if (!o) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("lead");
      router.replace(`/admin/leads?${params.toString()}`);
    }
  };

  // Summary stats by status
  const stats = {
    total: data.length,
    new: data.filter((l) => l.status === "new").length,
    contacted: data.filter((l) => l.status === "contacted").length,
    qualified: data.filter((l) => l.status === "qualified").length,
    converted: data.filter((l) => l.status === "converted").length,
    lost: data.filter((l) => l.status === "lost").length,
    high: data.filter((l) => l.priority === "high").length,
  };

  const columns: Column<LeadRow>[] = [
    {
      key: "name",
      header: "Lead",
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-full bg-gradient-to-br from-saffron/30 to-emerald/30 flex items-center justify-center shrink-0 text-sm font-bold">
            {r.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate flex items-center gap-1.5">
              {r.name}
              {r.priority === "high" && <span className="text-[10px] px-1 py-0 rounded bg-destructive/20 text-destructive">HIGH</span>}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {r.destination || r.message?.slice(0, 60) + (r.message && r.message.length > 60 ? "…" : "") || "No destination"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Contact",
      cell: (r) => (
        <div className="text-xs space-y-0.5">
          {r.phone && (
            <div className="flex items-center gap-1"><Phone className="size-3" /> {r.phone}</div>
          )}
          {r.email && (
            <div className="flex items-center gap-1 text-muted-foreground"><Mail className="size-3" /> {r.email}</div>
          )}
        </div>
      ),
    },
    {
      key: "travelDate",
      header: "Travel Date",
      sortable: true,
      cell: (r) => (
        r.travelDate ? (
          <span className="text-xs flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(r.travelDate).toLocaleDateString("en-IN")}
          </span>
        ) : <span className="text-xs text-muted-foreground">—</span>
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (r) => <span className="text-xs capitalize px-2 py-0.5 rounded bg-white/5 border border-white/10">{r.source}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      cell: (r) => <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}</span>,
    },
  ];

  const statCards = [
    { label: "Total Leads", value: stats.total, color: "text-foreground" },
    { label: "New", value: stats.new, color: "text-saffron" },
    { label: "Contacted", value: stats.contacted, color: "text-chart-4" },
    { label: "Qualified", value: stats.qualified, color: "text-emerald" },
    { label: "Converted", value: stats.converted, color: "text-emerald" },
    { label: "High Priority", value: stats.high, color: "text-destructive" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Leads CRM"
        description="Manage enquiries, bookings & follow-ups"
        icon={KanbanSquare}
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const token = typeof window !== "undefined"
                  ? localStorage.getItem("asgari_admin_token") || "asgari-admin-2024"
                  : "asgari-admin-2024"
                const params = new URLSearchParams()
                if (statusFilter !== "all") params.set("status", statusFilter)
                if (sourceFilter !== "all") params.set("source", sourceFilter)
                const url = `/api/admin/leads/export${params.toString() ? "?" + params.toString() : ""}`
                fetch(url, { headers: { "x-admin-token": token } })
                  .then((r) => {
                    if (!r.ok) throw new Error("Export failed")
                    return r.blob()
                  })
                  .then((blob) => {
                    const a = document.createElement("a")
                    a.href = URL.createObjectURL(blob)
                    a.download = `asgari-leads-${new Date().toISOString().slice(0, 10)}.csv`
                    a.click()
                    URL.revokeObjectURL(a.href)
                    toast.success("Leads exported to CSV")
                  })
                  .catch(() => toast.error("Export failed"))
              }}
              className="h-8"
            >
              <Download className="size-3.5" /> Export CSV
            </Button>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              <Button
                size="sm"
                variant={view === "kanban" ? "default" : "ghost"}
                onClick={() => setView("kanban")}
                className={cn("h-8", view === "kanban" && "btn-glow bg-gradient-to-r from-saffron to-emerald text-background")}
              >
                <KanbanSquare className="size-3.5" /> Kanban
              </Button>
              <Button
                size="sm"
                variant={view === "table" ? "default" : "ghost"}
                onClick={() => setView("table")}
                className={cn("h-8", view === "table" && "btn-glow bg-gradient-to-r from-saffron to-emerald text-background")}
              >
                <TableIcon className="size-3.5" /> Table
              </Button>
            </div>
          </>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass border-white/10 py-0">
            <CardContent className="p-3 text-center">
              <div className={cn("text-2xl font-display font-bold", s.color)}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="website">Website</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 h-9 bg-white/5 border-white/10">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : data.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="py-12 text-center">
            <Inbox className="size-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No leads found matching your filters.</p>
          </CardContent>
        </Card>
      ) : view === "kanban" ? (
        <LeadKanban leads={data} onLeadUpdated={load} onLeadOpen={openLead} />
      ) : (
        <DataTable
          data={data}
          columns={columns}
          searchKeys={["name", "email", "phone", "destination"]}
          searchPlaceholder="Search leads…"
          getRowId={(r) => r.id}
          onRowClick={(r) => openLead(r)}
        />
      )}

      <LeadDrawer
        lead={selectedLead}
        open={drawerOpen}
        onOpenChange={handleDrawerChange}
        onUpdated={load}
        onDeleted={load}
      />
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsInner />
    </Suspense>
  );
}
