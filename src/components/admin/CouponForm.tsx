"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/FormField";
import { MultiSelect } from "@/components/admin/MultiSelect";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { adminFetch } from "@/lib/admin-fetch";
import { toast } from "sonner";

interface CouponFormProps {
  id?: string;
}

export function CouponForm({ id }: CouponFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [pkgOptions, setPkgOptions] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState<any>({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    maxUses: 100,
    minOrderValue: "",
    validFrom: "",
    validUntil: "",
    isActive: true,
    packageIds: [] as string[],
  });

  useEffect(() => {
    (async () => {
      const pRes = await adminFetch<{ packages: { id: string; title: string }[] }>("/api/admin/packages");
      if (pRes.success && pRes.data) setPkgOptions(pRes.data.packages);
      if (id) {
        const res = await adminFetch<{ coupon: any }>(`/api/admin/coupons/${id}`);
        if (res.success && res.data) {
          const c = res.data.coupon;
          setForm({
            ...c,
            minOrderValue: c.minOrderValue ?? "",
            validFrom: c.validFrom ? new Date(c.validFrom).toISOString().slice(0, 10) : "",
            validUntil: c.validUntil ? new Date(c.validUntil).toISOString().slice(0, 10) : "",
            packageIds: (c.packages || []).map((p: any) => p.id),
          });
        } else {
          toast.error(res.error || "Not found");
          router.replace("/admin/coupons");
        }
      }
      setLoading(false);
    })();
     
  }, [id]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.code.trim()) return toast.error("Coupon code is required");
    setSaving(true);
    const payload = {
      code: form.code.toUpperCase(),
      description: form.description || null,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue) || 0,
      maxUses: parseInt(form.maxUses) || 100,
      minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : null,
      validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : null,
      validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
      isActive: !!form.isActive,
      packageIds: form.packageIds,
    };
    const res = id
      ? await adminFetch(`/api/admin/coupons/${id}`, { method: "PUT", json: payload })
      : await adminFetch("/api/admin/coupons", { method: "POST", json: payload });
    setSaving(false);
    if (res.success) {
      toast.success(id ? "Coupon updated" : "Coupon created");
      router.push("/admin/coupons");
    } else toast.error(res.error || "Failed");
  };

  const handleDelete = async () => {
    if (!id) return;
    const res = await adminFetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.success) {
      toast.success("Coupon deleted");
      router.replace("/admin/coupons");
    } else toast.error(res.error || "Failed");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-base">Coupon Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Coupon Code" required>
              <Input
                value={form.code}
                onChange={(e) => update("code", e.target.value.toUpperCase())}
                placeholder="EARLYBIRD10"
                className="font-mono"
              />
            </FormField>
            <FormField label="Status">
              <div className="flex items-center justify-between h-9 px-3 rounded-md border border-white/10 bg-white/5">
                <Label className="text-xs">{form.isActive ? "Active" : "Inactive"}</Label>
                <Switch checked={!!form.isActive} onCheckedChange={(v) => update("isActive", v)} />
              </div>
            </FormField>
          </div>
          <FormField label="Description">
            <Textarea rows={2} value={form.description || ""} onChange={(e) => update("description", e.target.value)} placeholder="10% off for early bookings" />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Discount Type">
              <Select value={form.discountType} onValueChange={(v) => update("discountType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Discount Value" required>
              <Input type="number" step="0.01" value={form.discountValue} onChange={(e) => update("discountValue", e.target.value)} />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <FormField label="Max Uses">
              <Input type="number" value={form.maxUses} onChange={(e) => update("maxUses", e.target.value)} />
            </FormField>
            <FormField label="Min Order Value">
              <Input type="number" value={form.minOrderValue} onChange={(e) => update("minOrderValue", e.target.value)} />
            </FormField>
            <FormField label="Used (read-only)">
              <Input value={form.usedCount || 0} disabled />
            </FormField>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormField label="Valid From">
              <Input type="date" value={form.validFrom} onChange={(e) => update("validFrom", e.target.value)} />
            </FormField>
            <FormField label="Valid Until">
              <Input type="date" value={form.validUntil} onChange={(e) => update("validUntil", e.target.value)} />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-white/10 mt-4">
        <CardHeader>
          <CardTitle className="text-base">Linked Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelect
            options={pkgOptions.map((p) => ({ value: p.id, label: p.title }))}
            value={form.packageIds}
            onChange={(v) => update("packageIds", v)}
            placeholder="Apply to specific packages (leave empty for all)…"
            searchPlaceholder="Search packages…"
          />
        </CardContent>
      </Card>

      <div className="flex gap-2 mt-4">
        {id && (
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="text-destructive hover:text-destructive flex-1">
                <Trash2 className="size-4" /> Delete
              </Button>
            }
            title="Delete coupon?"
            description={`Coupon "${form.code}" will be permanently deleted.`}
            onConfirm={handleDelete}
          />
        )}
        <Button asChild variant="outline" className="flex-1">
          <Link href="/admin/coupons">Cancel</Link>
        </Button>
        <Button onClick={submit} disabled={saving} className="flex-1 btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {id ? "Save Changes" : "Create Coupon"}
        </Button>
      </div>
    </div>
  );
}
