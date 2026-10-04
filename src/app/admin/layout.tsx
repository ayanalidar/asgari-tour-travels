"use client";

import { AdminAuthProvider } from "@/components/admin/admin-auth";
import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <AdminAuthProvider>{children}</AdminAuthProvider>;
  }

  return <AdminAuthProvider><AdminShell>{children}</AdminShell></AdminAuthProvider>;
}
