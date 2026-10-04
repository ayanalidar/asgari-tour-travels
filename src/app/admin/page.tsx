"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  Newspaper,
  KanbanSquare,
  Star,
  TicketPercent,
  TrendingUp,
  Users,
  ArrowUpRight,
  Sparkles,
  Loader2,
  MessageSquareQuote,
  Phone,
  Mail,
  Globe,
  Calendar,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Stats {
  counts: {
    destinations: number;
    packages: number;
    blog: number;
    leads: number;
    testimonials: number;
    reviews: number;
    coupons: number;
  };
  revenue: number;
  googleRating: number;
  googleReviewCount: number;
  recentLeads: any[];
  convertedLeads: any[];
  recentTestimonials: any[];
  leadsBySource: { source: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  leadsByDay: { date: string; label: string; count: number }[];
  popularPackages: any[];
}

const SOURCE_COLORS: Record<string, string> = {
  website: "var(--color-chart-1)",
  phone: "var(--color-chart-2)",
  whatsapp: "var(--color-chart-3)",
  referral: "var(--color-chart-4)",
  newsletter: "var(--color-chart-5)",
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  new: "var(--color-chart-1)",
  contacted: "var(--color-chart-4)",
  qualified: "var(--color-chart-2)",
  converted: "var(--color-chart-5)",
  lost: "var(--color-chart-3)",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await adminFetch<Stats>("/api/admin/stats");
      if (res.success && res.data) setStats(res.data);
      else setError(res.error || "Failed to load stats");
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }
  if (error || !stats) {
    return (
      <div className="text-center text-destructive py-12">
        <p>{error || "Unable to load dashboard"}</p>
      </div>
    );
  }

  const { counts, recentLeads, convertedLeads, recentTestimonials, leadsBySource, leadsByDay, popularPackages } = stats;

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 size-48 rounded-full bg-saffron/20 blur-3xl" />
        <div className="absolute -left-8 -bottom-12 size-40 rounded-full bg-emerald/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge className="mb-2 bg-emerald/15 text-emerald border-emerald/30">
              <Sparkles className="size-3" /> Live Dashboard
            </Badge>
            <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text-mix">
              Welcome back, Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here&apos;s what&apos;s happening at Asgari Tour & Travels today.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/leads">
                <KanbanSquare className="size-4" /> Open CRM
              </Link>
            </Button>
            <Button asChild size="sm" className="btn-glow bg-gradient-to-r from-saffron to-emerald text-background">
              <Link href="/admin/destinations/new">
                <ArrowUpRight className="size-4" /> New Destination
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        <StatCard icon={MapPin} label="Destinations" value={counts.destinations} color="saffron" href="/admin/destinations" />
        <StatCard icon={Package} label="Packages" value={counts.packages} color="emerald" href="/admin/packages" />
        <StatCard icon={KanbanSquare} label="Leads" value={counts.leads} color="rose" href="/admin/leads" />
        <StatCard icon={Newspaper} label="Blog Posts" value={counts.blog} color="saffron" href="/admin/blog" />
        <StatCard icon={Star} label="Testimonials" value={counts.testimonials} color="emerald" href="/admin/testimonials" />
        <StatCard icon={TicketPercent} label="Coupons" value={counts.coupons} color="rose" href="/admin/coupons" />
      </div>

      {/* Revenue + Google rating row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass lg:col-span-2 border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Estimated Revenue</CardTitle>
            <Badge className="bg-emerald/15 text-emerald border-emerald/30">
              <TrendingUp className="size-3" /> All time
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="font-display text-4xl font-bold gradient-text-saffron">
                ₹{Math.round(stats.revenue).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ INR</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {convertedLeads.length} converted leads with budget data.
              Revenue is approximate and combines lead budgets with package activity.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-lg font-bold text-saffron">{convertedLeads.length}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Converted</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-lg font-bold text-emerald">
                  {stats.leadsByStatus.find((s) => s.status === "qualified")?.count || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Qualified</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-lg font-bold text-rose">
                  {stats.leadsByStatus.find((s) => s.status === "lost")?.count || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">Lost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Google Rating</CardTitle>
            <MessageSquareQuote className="size-5 text-saffron" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-bold glow-saffron text-saffron">
                {Number(stats.googleRating).toFixed(1)}
              </span>
              <div className="flex flex-col mb-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={cn(
                        "size-3.5",
                        n <= Math.round(stats.googleRating)
                          ? "fill-saffron text-saffron"
                          : "text-muted-foreground/40"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {stats.googleReviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full mt-4">
              <Link href="/admin/reviews">Sync Reviews</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Leads last 7 days - line chart */}
        <Card className="glass lg:col-span-2 border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Leads - Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ count: { label: "Leads", color: "var(--color-chart-1)" } }}
              className="h-[260px] w-full"
            >
              <LineChart data={leadsByDay} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-chart-1)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "var(--color-chart-1)", strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "var(--color-chart-1)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Leads by source - pie chart */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                website: { label: "Website", color: SOURCE_COLORS.website },
                phone: { label: "Phone", color: SOURCE_COLORS.phone },
                whatsapp: { label: "WhatsApp", color: SOURCE_COLORS.whatsapp },
                referral: { label: "Referral", color: SOURCE_COLORS.referral },
                newsletter: { label: "Newsletter", color: SOURCE_COLORS.newsletter },
              }}
              className="h-[260px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="source" />} />
                <Pie
                  data={leadsBySource}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={42}
                  paddingAngle={3}
                >
                  {leadsBySource.map((entry) => (
                    <Cell
                      key={entry.source}
                      fill={SOURCE_COLORS[entry.source] || "var(--color-chart-3)"}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="source" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent leads + Popular packages */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="glass lg:col-span-2 border-white/10">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/leads">
                View all <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No leads yet.</p>
              )}
              {recentLeads.map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/leads?lead=${l.id}`}
                  className="flex items-center gap-3 rounded-lg bg-white/5 hover:bg-white/10 p-3 transition-colors"
                >
                  <div className="size-9 rounded-full bg-gradient-to-br from-saffron/30 to-emerald/30 flex items-center justify-center text-sm font-bold shrink-0">
                    {l.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{l.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          l.status === "converted" && "border-emerald/40 text-emerald bg-emerald/10",
                          l.status === "lost" && "border-destructive/40 text-destructive bg-destructive/10",
                          l.status === "new" && "border-saffron/40 text-saffron bg-saffron/10",
                          l.status === "contacted" && "border-chart-4/40 text-chart-4",
                          l.status === "qualified" && "border-emerald/40 text-emerald"
                        )}
                      >
                        {l.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                      {l.destination && <span>{l.destination}</span>}
                      {l.travelDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" /> {new Date(l.travelDate).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {l.phone && (
                      <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Phone className="size-3" /> {l.phone}
                      </div>
                    )}
                    {l.source && (
                      <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                        <Globe className="size-3" /> {l.source}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Popular Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ reviewCount: { label: "Reviews", color: "var(--color-chart-2)" } }}
              className="h-[260px] w-full"
            >
              <BarChart
                data={popularPackages.map((p) => ({ name: p.title.split(" ").slice(0, 2).join(" "), reviews: p.reviewCount, rating: p.rating }))}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={70} stroke="var(--muted-foreground)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="reviews" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent testimonials */}
      {recentTestimonials && recentTestimonials.length > 0 && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {t.featured && (
                        <Badge variant="outline" className="h-4 px-1 text-[9px] border-primary/40 text-primary">Featured</Badge>
                      )}
                      {!t.approved && (
                        <Badge variant="outline" className="h-4 px-1 text-[9px] border-amber-400/40 text-amber-300">Pending</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.location || t.source}</p>
                    </div>
                    <Link
                      href="/admin/testimonials"
                      className="text-[10px] text-primary hover:underline"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "New Destination", href: "/admin/destinations/new", icon: MapPin },
              { label: "New Package", href: "/admin/packages/new", icon: Package },
              { label: "New Blog", href: "/admin/blog/new", icon: Newspaper },
              { label: "Add Coupon", href: "/admin/coupons/new", icon: TicketPercent },
              { label: "Add Testimonial", href: "/admin/testimonials/new", icon: Star },
              { label: "Settings", href: "/admin/settings", icon: Users },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="group flex flex-col items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 p-4 transition-colors lift"
                >
                  <div className="size-10 rounded-lg bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center group-hover:from-saffron/40 group-hover:to-emerald/40 transition-colors">
                    <Icon className="size-5 text-saffron" />
                  </div>
                  <span className="text-xs font-medium text-center">{a.label}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "saffron" | "emerald" | "rose";
  href: string;
}) {
  const colorMap = {
    saffron: "text-saffron",
    emerald: "text-emerald",
    rose: "text-rose-glow",
  };
  return (
    <Link href={href} className="block">
      <Card className="glass border-white/10 hover:border-white/20 transition-colors lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className={cn("size-9 rounded-lg bg-white/5 flex items-center justify-center", colorMap[color])}>
              <Icon className="size-4" />
            </div>
            <ArrowUpRight className="size-3.5 text-muted-foreground/50" />
          </div>
          <div className="mt-3">
            <div className="font-display text-2xl font-bold">{value.toLocaleString("en-IN")}</div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
