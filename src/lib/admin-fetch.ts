// Client-side admin fetch helper — auto-adds x-admin-token header
const TOKEN_KEY = "asgari_admin_token";

export function getAdminToken(): string | null {
  if (typeof document === "undefined") return null;
  // Try localStorage first, then cookie
  try {
    const ls = localStorage.getItem(TOKEN_KEY);
    if (ls) return ls;
  } catch {}
  const match = document.cookie.match(/(?:^|; )asgari_admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAdminToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
  // Cookie for SSR/initial route guards
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `asgari_admin_token=${encodeURIComponent(token)}; path=/${secure}; max-age=${60 * 60 * 24 * 7}`;
}

export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
  document.cookie = "asgari_admin_token=; path=/; max-age=0";
}

interface AdminFetchOptions extends RequestInit {
  // json body helper — pass any object, will be JSON.stringified
  json?: any;
  // skip auto-parsing response (return raw Response)
  raw?: boolean;
}

export async function adminFetch<T = any>(
  path: string,
  opts: AdminFetchOptions = {}
): Promise<{ success: boolean; data?: T; error?: string; status: number }> {
  const { json, raw, headers, ...rest } = opts;
  const token = getAdminToken();
  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };
  if (token) finalHeaders["x-admin-token"] = token;
  let body = rest.body;
  if (json !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }
  try {
    const res = await fetch(path, {
      ...rest,
      headers: finalHeaders,
      body,
    });
    if (raw) return { success: res.ok, status: res.status, data: res as any };
    let parsed: any = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      parsed = await res.json();
    } else {
      parsed = await res.text();
    }
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: parsed?.error || parsed || `Request failed (${res.status})`,
      };
    }
    return {
      success: true,
      status: res.status,
      data: parsed?.data !== undefined ? parsed.data : parsed,
    };
  } catch (e: any) {
    return { success: false, status: 0, error: e?.message || "Network error" };
  }
}

// Upload a file (multipart) via admin endpoint
export async function adminUpload(file: File, prefix = "img"): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("prefix", prefix);
  const res = await adminFetch<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: fd,
  });
  if (!res.success || !res.data) return null;
  return res.data.url;
}
