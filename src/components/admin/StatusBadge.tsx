"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Star, AlertTriangle, CircleDot } from "lucide-react";

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; icon?: React.ComponentType<{ className?: string }> }
> = {
  published: { label: "Published", className: "border-emerald/40 text-emerald bg-emerald/10", icon: CheckCircle2 },
  draft: { label: "Draft", className: "border-muted-foreground/30 text-muted-foreground bg-muted/30", icon: Clock },
  active: { label: "Active", className: "border-emerald/40 text-emerald bg-emerald/10", icon: CheckCircle2 },
  inactive: { label: "Inactive", className: "border-muted-foreground/30 text-muted-foreground bg-muted/30", icon: XCircle },
  pending: { label: "Pending", className: "border-chart-4/40 text-chart-4 bg-chart-4/10", icon: Clock },
  // Lead statuses
  new: { label: "New", className: "border-saffron/40 text-saffron bg-saffron/10", icon: Star },
  contacted: { label: "Contacted", className: "border-chart-4/40 text-chart-4 bg-chart-4/10", icon: CircleDot },
  qualified: { label: "Qualified", className: "border-emerald/40 text-emerald bg-emerald/10", icon: CheckCircle2 },
  converted: { label: "Converted", className: "border-emerald/60 text-emerald bg-emerald/20", icon: CheckCircle2 },
  lost: { label: "Lost", className: "border-destructive/40 text-destructive bg-destructive/10", icon: XCircle },
  // priorities
  low: { label: "Low", className: "border-muted-foreground/30 text-muted-foreground bg-muted/30" },
  medium: { label: "Medium", className: "border-chart-4/40 text-chart-4 bg-chart-4/10" },
  high: { label: "High", className: "border-destructive/40 text-destructive bg-destructive/10", icon: AlertTriangle },
  // generic
  success: { label: "Success", className: "border-emerald/40 text-emerald bg-emerald/10", icon: CheckCircle2 },
  error: { label: "Error", className: "border-destructive/40 text-destructive bg-destructive/10", icon: XCircle },
};

export function StatusBadge({ status, className }: { status?: string; className?: string }) {
  if (!status) return null;
  const cfg = STATUS_STYLES[status.toLowerCase()] || { label: status, className: "border-white/20 text-foreground bg-white/5" };
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cn(cfg.className, className)}>
      {Icon && <Icon className="size-3" />}
      <span className="capitalize">{cfg.label}</span>
    </Badge>
  );
}
