/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminToken, setAdminToken, clearAdminToken, adminFetch } from "@/lib/admin-fetch";

interface AdminAuthContextValue {
  token: string | null;
  isAuthed: boolean;
  isReady: boolean;
  login: (token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize token from storage on mount
    const t = getAdminToken();
    setToken(t);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!token && !isPublic) {
      // not authed → redirect to login
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
    if (token && pathname === "/admin/login") {
      // already authed → go to dashboard
      router.replace("/admin");
    }
  }, [token, isReady, pathname, router]);

  const login = useCallback(async (newToken: string) => {
    // Validate by calling the auth API
    const res = await adminFetch<{ valid: boolean }>("/api/admin/auth", {
      method: "POST",
      json: { token: newToken },
    });
    if (!res.success || !res.data?.valid) {
      return { success: false, error: res.error || "Invalid admin token" };
    }
    setAdminToken(newToken);
    setToken(newToken);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearAdminToken();
    setToken(null);
    router.replace("/admin/login");
  }, [router]);

  const value: AdminAuthContextValue = {
    token,
    isAuthed: !!token,
    isReady,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

// Guard component - wraps protected admin pages
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, isReady } = useAdminAuth();
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!isAuthed) {
    return null; // redirect handled by provider
  }
  return <>{children}</>;
}
