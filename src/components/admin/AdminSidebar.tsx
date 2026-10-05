"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Package,
  TicketPercent,
  Newspaper,
  Star,
  Activity,
  Images,
  Search,
  KanbanSquare,
  MessageSquareQuote,
  Settings,
  Sparkles,
  Gift,
  ChevronLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/admin/leads", label: "Leads CRM", icon: KanbanSquare, group: "Overview" },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin, group: "Content" },
  { href: "/admin/packages", label: "Packages", icon: Package, group: "Content" },
  { href: "/admin/activities", label: "Activities", icon: Activity, group: "Content" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, group: "Content" },
  { href: "/admin/gallery", label: "Gallery", icon: Images, group: "Content" },
  { href: "/admin/seo-pages", label: "SEO Pages", icon: Search, group: "Content" },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent, group: "Marketing" },
  { href: "/admin/offers", label: "Popup Offers", icon: Gift, group: "Marketing" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star, group: "Marketing" },
  { href: "/admin/reviews", label: "Google Reviews", icon: MessageSquareQuote, group: "Marketing" },
  { href: "/admin/settings", label: "Settings", icon: Settings, group: "System" },
];

export function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Group nav items
  const groups: Record<string, NavItem[]> = {};
  NAV.forEach((item) => {
    const g = item.group || "Other";
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 lg:z-30 h-screen flex flex-col transition-all duration-300",
          "glass-strong border-r border-white/10",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
          mobileOpen ? "w-64 left-0" : "-left-72 lg:left-0"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10 shrink-0">
          <div className="size-9 rounded-lg bg-gradient-to-br from-saffron to-emerald flex items-center justify-center shrink-0 glow-saffron">
            <Sparkles className="size-5 text-background" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-sm leading-tight gradient-text-saffron truncate">
                Asgari Admin
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Tour CMS
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden size-8 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-4">
              {!collapsed && (
                <div className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                  {group}
                </div>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all relative",
                        active
                          ? "bg-primary/15 text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                        collapsed && "justify-center"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-saffron to-emerald" />
                      )}
                      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                      {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:block p-2 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
