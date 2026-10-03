"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ExternalLink, LogOut, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "./admin-auth";
import { toast } from "sonner";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/destinations": "Destinations",
  "/admin/packages": "Tour Packages",
  "/admin/activities": "Activities",
  "/admin/blog": "Blog Posts",
  "/admin/gallery": "Gallery",
  "/admin/seo-pages": "SEO Pages",
  "/admin/coupons": "Coupons",
  "/admin/testimonials": "Testimonials",
  "/admin/reviews": "Google Reviews",
  "/admin/leads": "Leads CRM",
  "/admin/settings": "Settings",
};

function deriveTitle(pathname: string) {
  // Look for the most specific match
  const sorted = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length);
  for (const p of sorted) {
    if (pathname === p || pathname.startsWith(p + "/")) {
      const sub = pathname.slice(p.length);
      if (sub.includes("/new")) return `New ${PAGE_TITLES[p].replace(/s$/, "")}`;
      if (sub.includes("/edit")) return `Edit ${PAGE_TITLES[p].replace(/s$/, "")}`;
      return PAGE_TITLES[p];
    }
  }
  return "Admin";
}

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [now, setNow] = useState("");

  useEffect(() => {
    const update = () =>
      setNow(
        new Date().toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  const title = deriveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 h-16 glass-strong border-b border-white/10 flex items-center gap-3 px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}>
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="font-display font-bold text-base lg:text-lg truncate">{title}</h1>
        <p className="hidden sm:block text-xs text-muted-foreground">{now}</p>
      </div>

      <div className="hidden md:block relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Quick search…"
          className="pl-9 bg-white/5 border-white/10 h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value;
              if (val.trim()) toast.info(`Search is coming soon — query: "${val}"`);
            }
          }}
        />
      </div>

      <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
        <Link href="/" target="_blank">
          <ExternalLink className="size-4" />
          View Site
        </Link>
      </Button>

      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
        <div className="size-8 rounded-full bg-gradient-to-br from-saffron to-emerald flex items-center justify-center shrink-0">
          <Sparkles className="size-4 text-background" />
        </div>
        <div className="hidden sm:block">
          <div className="text-xs font-semibold leading-tight">Admin</div>
          <div className="text-[10px] text-muted-foreground">Superuser</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => {
            logout();
            toast.success("Signed out");
          }}
          title="Logout"
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  );
}
