"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Phone, Mail, Calendar, MapPin, Star, Clock, User, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface LeadT {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  destination?: string | null;
  packageId?: string | null;
  travelDate?: string | null;
  groupSize?: number | null;
  budget?: string | null;
  message?: string | null;
  status: string;
  source: string;
  priority: string;
  notes?: any[];
  createdAt: string;
}

const COLUMNS = [
  { id: "new", label: "New", color: "saffron" },
  { id: "contacted", label: "Contacted", color: "chart-4" },
  { id: "qualified", label: "Qualified", color: "emerald" },
  { id: "converted", label: "Converted", color: "emerald" },
  { id: "lost", label: "Lost", color: "destructive" },
];

const PRIORITY_STYLES: Record<string, string> = {
  low: "border-muted-foreground/30 text-muted-foreground",
  medium: "border-chart-4/40 text-chart-4",
  high: "border-destructive/40 text-destructive",
};

function DraggableCard({ lead, onOpen }: { lead: LeadT; onOpen: (l: LeadT) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(lead)}
      className="glass rounded-lg p-3 cursor-pointer hover:border-white/30 border border-white/10 transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-medium text-sm truncate flex-1">{lead.name}</div>
        <span
          className={cn(
            "text-[9px] px-1.5 py-0.5 rounded border uppercase font-medium",
            PRIORITY_STYLES[lead.priority] || PRIORITY_STYLES.medium
          )}
        >
          {lead.priority}
        </span>
      </div>
      <div className="space-y-1 text-[11px] text-muted-foreground">
        {lead.destination && (
          <div className="flex items-center gap-1">
            <MapPin className="size-3" /> {lead.destination}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-1">
            <Phone className="size-3" /> {lead.phone}
          </div>
        )}
        {lead.travelDate && (
          <div className="flex items-center gap-1">
            <Calendar className="size-3" /> {new Date(lead.travelDate).toLocaleDateString("en-IN")}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground capitalize">{lead.source}</span>
        <span className="text-muted-foreground">
          {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </span>
      </div>
    </div>
  );
}

function Column({ column, leads, onOpen }: { column: typeof COLUMNS[number]; leads: LeadT[]; onOpen: (l: LeadT) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex-1 min-w-[240px] max-w-[340px] flex flex-col">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", `bg-${column.color}`)} style={{ background: `var(--${column.color === "chart-4" ? "color-chart-4" : column.color === "emerald" ? "accent" : column.color === "destructive" ? "destructive" : "primary"})` }} />
          <h3 className="text-sm font-semibold">{column.label}</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-white/5 rounded px-2 py-0.5">{leads.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2 p-2 rounded-xl border-2 border-dashed transition-colors min-h-[200px] overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar",
          isOver ? "border-primary/40 bg-primary/5" : "border-white/5 bg-black/20"
        )}
      >
        {leads.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-8">
            No leads here yet
          </div>
        ) : (
          leads.map((l) => <DraggableCard key={l.id} lead={l} onOpen={onOpen} />)
        )}
      </div>
    </div>
  );
}

export function LeadKanban({ leads, onLeadUpdated, onLeadOpen }: { leads: LeadT[]; onLeadUpdated: () => void; onLeadOpen: (l: LeadT) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);
  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as string;
    if (!COLUMNS.find((c) => c.id === newStatus)) return;
    const lead = leads.find((l) => l.id === active.id);
    if (!lead || lead.status === newStatus) return;
    setUpdating(true);
    const res = await adminFetch(`/api/admin/leads/${lead.id}`, {
      method: "PUT",
      json: { status: newStatus },
    });
    setUpdating(false);
    if (res.success) {
      toast.success(`Lead moved to ${newStatus}`);
      onLeadUpdated();
    } else {
      toast.error(res.error || "Failed to update");
    }
  };

  const activeLead = leads.find((l) => l.id === activeId);

  return (
    <div className="relative">
      {updating && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-white/10">
          <Loader2 className="size-3 animate-spin" /> Updating…
        </div>
      )}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              leads={leads.filter((l) => l.status === col.id)}
              onOpen={onLeadOpen}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead ? (
            <div className="opacity-90 rotate-2">
              <DraggableCard lead={activeLead} onOpen={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
