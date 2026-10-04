import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { db } from "@/lib/db";
import { clearSettingsCache } from "@/lib/settings";

// GET: return ALL settings including secrets (admin only)
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const rows = await db.siteSetting.findMany({ orderBy: { category: "asc" } });
    const obj: Record<string, any> = {};
    for (const r of rows) {
      try {
        obj[r.key] = JSON.parse(r.value);
      } catch {
        obj[r.key] = r.value;
      }
    }
    // Group by category for easier admin display
    const byCategory: Record<string, Record<string, any>> = {};
    for (const r of rows) {
      if (!byCategory[r.category]) byCategory[r.category] = {};
      let v: any = r.value;
      try {
        v = JSON.parse(r.value);
      } catch {}
      byCategory[r.category][r.key] = v;
    }
    return ok({ settings: obj, byCategory, rows });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

// PUT: bulk update settings by key
export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await req.json().catch(() => ({} as any));
    // Accept: { settings: { key: value, ... } } OR { key, value, category } for single
    let updates: { key: string; value: any; category?: string }[] = [];
    if (body.settings && typeof body.settings === "object") {
      const category = body.category || "general";
      for (const [k, v] of Object.entries(body.settings)) {
        updates.push({ key: k, value: v, category });
      }
    } else if (body.key) {
      updates.push({ key: body.key, value: body.value, category: body.category || "general" });
    } else {
      return err("No settings provided", 400);
    }

    for (const u of updates) {
      const v = typeof u.value === "string" ? u.value : JSON.stringify(u.value);
      await db.siteSetting.upsert({
        where: { key: u.key },
        create: { key: u.key, value: v, category: u.category || "general" },
        update: { value: v, category: u.category || "general" },
      });
    }
    clearSettingsCache();
    return ok({ updated: updates.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
