/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Loader2, Server, Globe, Phone, Mail, Share2, Sparkles, RefreshCw, Zap, History } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General", icon: Sparkles },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social", icon: Share2 },
  { id: "hostinger", label: "Hostinger", icon: Server },
  { id: "google", label: "Google", icon: Globe },
];

export default function AdminSettingsPage() {
  const [active, setActive] = useState("general");
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const load = async () => {
    setLoading(true);
    const res = await adminFetch<{ settings: Record<string, any> }>("/api/admin/settings");
    if (res.success && res.data) {
      setSettings(res.data.settings || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (k: string, v: any) => setSettings((s) => ({ ...s, [k]: v }));

  const save = async (category: string) => {
    setSaving(true);
    // Pick keys for category — but settings API just updates by key
    const res = await adminFetch("/api/admin/settings", {
      method: "PUT",
      json: { settings, category },
    });
    setSaving(false);
    if (res.success) {
      toast.success("Settings saved");
      load();
    } else toast.error(res.error || "Failed to save");
  };

  const testHostinger = async () => {
    setTesting(true);
    const res = await adminFetch("/api/admin/hostinger/test", { method: "POST" });
    setTesting(false);
    if (res.success) {
      toast.success("Hostinger connection OK");
      load();
      setLogRefreshKey((k) => k + 1);
    } else {
      toast.error(res.error || "Test failed");
      setLogRefreshKey((k) => k + 1);
    }
  };

  const syncHostinger = async () => {
    setSyncing(true);
    const res = await adminFetch("/api/admin/hostinger/sync", { method: "POST" });
    setSyncing(false);
    if (res.success) {
      toast.success("Hostinger sync completed");
      load();
      setLogRefreshKey((k) => k + 1);
    } else {
      toast.error(res.error || "Sync failed");
      setLogRefreshKey((k) => k + 1);
    }
  };

  const syncGoogle = async () => {
    setSyncing(true);
    const res = await adminFetch("/api/admin/google/sync", { method: "POST" });
    setSyncing(false);
    if (res.success) {
      const r = res.data;
      toast.success(`Synced ${r.inserted} review(s) · Rating ${r.rating} · ${r.totalReviews} total`);
      load();
    } else toast.error(res.error || "Sync failed");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage site configuration, integrations & secrets"
        icon={Settings}
      />

      <Tabs value={active} onValueChange={setActive}>
        <TabsList className="bg-white/5 border border-white/10 p-1 h-auto flex flex-wrap gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <TabsTrigger key={t.id} value={t.id} className={cn("gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-saffron/30 data-[state=active]:to-emerald/30 data-[state=active]:text-primary")}>
                <Icon className="size-3.5" />
                {t.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="mt-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="size-4 text-saffron" /> Brand & General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Brand Name">
                  <Input value={settings.brand_name || ""} onChange={(e) => update("brand_name", e.target.value)} />
                </FormField>
                <FormField label="Brand Tagline">
                  <Input value={settings.brand_tagline || ""} onChange={(e) => update("brand_tagline", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Brand Description">
                <Textarea rows={3} value={settings.brand_description || ""} onChange={(e) => update("brand_description", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
                <FormField label="Travelers">
                  <Input type="number" value={settings.stats_travelers || 0} onChange={(e) => update("stats_travelers", parseInt(e.target.value) || 0)} />
                </FormField>
                <FormField label="Packages">
                  <Input type="number" value={settings.stats_packages || 0} onChange={(e) => update("stats_packages", parseInt(e.target.value) || 0)} />
                </FormField>
                <FormField label="Years">
                  <Input type="number" value={settings.stats_years || 0} onChange={(e) => update("stats_years", parseInt(e.target.value) || 0)} />
                </FormField>
                <FormField label="Destinations">
                  <Input type="number" value={settings.stats_destinations || 0} onChange={(e) => update("stats_destinations", parseInt(e.target.value) || 0)} />
                </FormField>
              </div>
              <SaveButton saving={saving} onClick={() => save("general")} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACT */}
        <TabsContent value="contact" className="mt-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="size-4 text-saffron" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Primary Phone">
                  <Input value={settings.phone_primary || ""} onChange={(e) => update("phone_primary", e.target.value)} placeholder="+91 94190 12345" />
                </FormField>
                <FormField label="WhatsApp Number">
                  <Input value={settings.phone_whatsapp || ""} onChange={(e) => update("phone_whatsapp", e.target.value)} />
                </FormField>
                <FormField label="Primary Email">
                  <Input type="email" value={settings.email_primary || ""} onChange={(e) => update("email_primary", e.target.value)} />
                </FormField>
                <FormField label="Bookings Email">
                  <Input type="email" value={settings.email_bookings || ""} onChange={(e) => update("email_bookings", e.target.value)} />
                </FormField>
              </div>
              <FormField label="Office Address">
                <Textarea rows={2} value={settings.address || ""} onChange={(e) => update("address", e.target.value)} />
              </FormField>
              <FormField label="Office Hours">
                <Input value={settings.office_hours || ""} onChange={(e) => update("office_hours", e.target.value)} placeholder="Mon–Sat: 9 AM – 7 PM" />
              </FormField>
              <SaveButton saving={saving} onClick={() => save("contact")} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOCIAL */}
        <TabsContent value="social" className="mt-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="size-4 text-saffron" /> Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Facebook">
                  <Input value={settings.social_facebook || ""} onChange={(e) => update("social_facebook", e.target.value)} placeholder="https://facebook.com/…" />
                </FormField>
                <FormField label="Instagram">
                  <Input value={settings.social_instagram || ""} onChange={(e) => update("social_instagram", e.target.value)} placeholder="https://instagram.com/…" />
                </FormField>
                <FormField label="YouTube">
                  <Input value={settings.social_youtube || ""} onChange={(e) => update("social_youtube", e.target.value)} placeholder="https://youtube.com/…" />
                </FormField>
                <FormField label="WhatsApp Channel">
                  <Input value={settings.social_whatsapp || ""} onChange={(e) => update("social_whatsapp", e.target.value)} placeholder="https://wa.me/…" />
                </FormField>
              </div>
              <SaveButton saving={saving} onClick={() => save("social")} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOSTINGER */}
        <TabsContent value="hostinger" className="mt-4">
          <div className="space-y-4">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="size-4 text-saffron" /> Hostinger Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Hostinger API Key">
                  <Input
                    type="password"
                    value={settings.hostinger_api_key || ""}
                    onChange={(e) => update("hostinger_api_key", e.target.value)}
                    placeholder="Enter your Hostinger API token…"
                  />
                </FormField>
                <div className="grid sm:grid-cols-2 gap-3">
                  <FormField label="Hostinger Endpoint">
                    <Input value={settings.hostinger_endpoint || ""} onChange={(e) => update("hostinger_endpoint", e.target.value)} placeholder="https://api.hostinger.com" />
                  </FormField>
                  <FormField label="Status">
                    <div className="flex items-center h-9">
                      <StatusBadge status={settings.hostinger_status || "inactive"} />
                    </div>
                  </FormField>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <Button onClick={testHostinger} disabled={testing} variant="outline">
                    {testing ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
                    Test Connection
                  </Button>
                  <Button onClick={syncHostinger} disabled={syncing} variant="outline">
                    {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    Sync / Backup
                  </Button>
                  <SaveButton saving={saving} onClick={() => save("hostinger")} compact />
                </div>
              </CardContent>
            </Card>

            <HostingerLogsCard refreshKey={logRefreshKey} />
          </div>
        </TabsContent>

        {/* GOOGLE */}
        <TabsContent value="google" className="mt-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="size-4 text-saffron" /> Google Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="Google Place ID">
                  <Input
                    value={settings.google_place_id || ""}
                    onChange={(e) => update("google_place_id", e.target.value)}
                    placeholder="ChIJ…"
                  />
                </FormField>
                <FormField label="Google API Key">
                  <Input
                    type="password"
                    value={settings.google_api_key || ""}
                    onChange={(e) => update("google_api_key", e.target.value)}
                    placeholder="AIza…"
                  />
                </FormField>
                <FormField label="Google Rating">
                  <Input type="number" step="0.1" value={settings.google_rating ?? ""} onChange={(e) => update("google_rating", parseFloat(e.target.value))} />
                </FormField>
                <FormField label="Review Count">
                  <Input type="number" value={settings.google_review_count ?? ""} onChange={(e) => update("google_review_count", parseInt(e.target.value))} />
                </FormField>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <Button onClick={syncGoogle} disabled={syncing} variant="outline">
                  {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                  Sync Reviews Now
                </Button>
                <SaveButton saving={saving} onClick={() => save("google")} compact />
              </div>
              {settings.google_last_sync && (
                <p className="text-xs text-muted-foreground">Last sync: {new Date(settings.google_last_sync).toLocaleString("en-IN")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SaveButton({ saving, onClick, compact }: { saving: boolean; onClick: () => void; compact?: boolean }) {
  return (
    <Button onClick={onClick} disabled={saving} className={cn("btn-glow bg-gradient-to-r from-saffron to-emerald text-background", compact && "h-9")}>
      {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      Save Settings
    </Button>
  );
}

function HostingerLogsCard({ refreshKey }: { refreshKey?: number }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    const res = await adminFetch<{ logs: any[] }>("/api/admin/hostinger/logs");
    if (res.success && res.data) setLogs(res.data.logs || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [refreshKey]);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <History className="size-4 text-saffron" /> Recent Hostinger Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6"><Loader2 className="size-5 animate-spin text-primary" /></div>
        ) : logs.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No Hostinger activity yet. Use the Test Connection or Sync buttons above to start.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="rounded-md bg-white/5 p-2 text-xs flex items-center gap-2">
                <StatusBadge status={log.status} />
                <span className="font-medium capitalize">{log.action}</span>
                <span className="text-muted-foreground truncate flex-1">{log.message}</span>
                <span className="text-muted-foreground">{new Date(log.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
