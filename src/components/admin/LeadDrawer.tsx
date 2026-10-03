/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";
import { Save, Loader2, Trash2, Plus, Phone, Mail, Calendar, MapPin, MessageSquare, Clock, User, Package } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export interface LeadT {
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
  notes: any[];
  createdAt: string;
  updatedAt?: string;
}

export function LeadDrawer({
  lead,
  open,
  onOpenChange,
  onUpdated,
  onDeleted,
}: {
  lead: LeadT | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState<LeadT | null>(null);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (lead) setForm(lead);
  }, [lead]);

  if (!form) return null;

  const update = (k: string, v: any) => setForm((f) => (f ? { ...f, [k]: v } : f));

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const res = await adminFetch(`/api/admin/leads/${form.id}`, {
      method: "PUT",
      json: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        destination: form.destination,
        packageId: form.packageId,
        travelDate: form.travelDate,
        groupSize: form.groupSize,
        budget: form.budget,
        message: form.message,
        status: form.status,
        source: form.source,
        priority: form.priority,
      },
    });
    setSaving(false);
    if (res.success) {
      toast.success("Lead updated");
      onUpdated();
    } else toast.error(res.error || "Failed");
  };

  const addNote = async () => {
    if (!form || !newNote.trim()) return;
    const res = await adminFetch(`/api/admin/leads/${form.id}/notes`, {
      method: "POST",
      json: { text: newNote, author: "admin" },
    });
    if (res.success && res.data) {
      toast.success("Note added");
      setForm(res.data.lead);
      setNewNote("");
      onUpdated();
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!form) return;
    const res = await adminFetch(`/api/admin/leads/${form.id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Lead deleted");
      onOpenChange(false);
      onDeleted();
    } else toast.error(res.error || "Failed");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl glass-strong border-white/15 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="size-4 text-saffron" />
            {form.name}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <StatusBadge status={form.status} />
            <span className="text-xs">·</span>
            <span className="text-xs capitalize">{form.source}</span>
            <span className="text-xs">·</span>
            <span className="text-xs">{new Date(form.createdAt).toLocaleString("en-IN")}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-4 space-y-4 overflow-y-auto">
          {/* Quick status & priority */}
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Status">
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Priority">
              <Select value={form.priority} onValueChange={(v) => update("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Contact info */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <FormField label="Email">
                <Input value={form.email || ""} onChange={(e) => update("email", e.target.value)} className="text-xs h-8" />
              </FormField>
              <FormField label="Phone">
                <Input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} className="text-xs h-8" />
              </FormField>
              <FormField label="Destination">
                <Input value={form.destination || ""} onChange={(e) => update("destination", e.target.value)} className="text-xs h-8" />
              </FormField>
              <FormField label="Travel Date">
                <Input
                  type="date"
                  value={form.travelDate ? new Date(form.travelDate).toISOString().slice(0, 10) : ""}
                  onChange={(e) => update("travelDate", e.target.value ? new Date(e.target.value).toISOString() : null)}
                  className="text-xs h-8"
                />
              </FormField>
              <FormField label="Group Size">
                <Input type="number" value={form.groupSize ?? ""} onChange={(e) => update("groupSize", e.target.value ? parseInt(e.target.value) : null)} className="text-xs h-8" />
              </FormField>
              <FormField label="Budget">
                <Input value={form.budget || ""} onChange={(e) => update("budget", e.target.value)} className="text-xs h-8" />
              </FormField>
            </div>
          </div>

          {/* Original message */}
          {form.message && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block flex items-center gap-1">
                <MessageSquare className="size-3" /> Original Message
              </Label>
              <p className="text-sm text-foreground whitespace-pre-wrap">{form.message}</p>
            </div>
          )}

          {/* Notes */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" /> Notes & Follow-ups
            </Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(form.notes || []).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">No notes yet.</p>
              ) : (
                form.notes.map((n: any, i: number) => (
                  <div key={i} className="rounded-md bg-background/60 p-2 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-primary">{n.author || "admin"}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(n.at).toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-xs text-foreground whitespace-pre-wrap">{n.text}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note…"
                rows={2}
                className="text-xs bg-background/40"
              />
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addNote} disabled={!newNote.trim()}>
              <Plus className="size-3.5" /> Add Note
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 p-4 flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur">
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" />
              </Button>
            }
            title="Delete lead?"
            description={`"${form.name}" will be permanently deleted.`}
            onConfirm={handleDelete}
          />
          <Button onClick={save} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
