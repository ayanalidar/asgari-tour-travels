"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/components/admin/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, isAuthed, isReady } = useAdminAuth();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const next = params.get("next") || "/admin";

  useEffect(() => {
    if (isReady && isAuthed) {
      router.replace(next);
    }
  }, [isReady, isAuthed, next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    const res = await login(token.trim());
    setLoading(false);
    if (res.success) {
      toast.success("Welcome back, Admin");
      router.replace(next);
    } else {
      toast.error(res.error || "Invalid token");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 aurora-bg" />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
      <div className="pointer-events-none absolute inset-0 aurora-animated opacity-50" />

      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-14 rounded-xl bg-gradient-to-br from-saffron to-emerald flex items-center justify-center mb-4 glow-saffron">
              <Sparkles className="size-7 text-background" />
            </div>
            <h1 className="font-display text-2xl font-bold gradient-text-saffron">Asgari Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tour & Travels CMS - Kashmir & Ladakh
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Admin Token
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter your admin token…"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoFocus
                  className="pl-9 h-11 bg-white/5 border-white/10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full h-11 btn-glow bg-gradient-to-r from-saffron to-emerald text-background font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-muted-foreground/70">
              Hint: <code className="text-primary/90 font-mono">asgari-admin-2024</code>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-4">
          Protected area · Authorized personnel only
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
