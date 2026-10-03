"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminGuard } from "./admin-auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="relative min-h-screen flex bg-background overflow-hidden">
        {/* Aurora backdrop */}
        <div className="pointer-events-none fixed inset-0 aurora-bg opacity-40 -z-10" />
        <div className="pointer-events-none fixed inset-0 grid-overlay opacity-[0.15] -z-10" />

        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar onMenu={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
