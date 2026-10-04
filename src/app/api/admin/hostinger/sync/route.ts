import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { db } from "@/lib/db";
import { getSetting, setSetting } from "@/lib/settings";

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const apiKey = (await getSetting("hostinger_api_key")) as string | null;

    if (!apiKey) {
      await db.hostingerLog.create({
        data: {
          action: "sync",
          status: "error",
          message: "No Hostinger API key configured.",
        },
      });
      return err("Hostinger API key not set. Configure it in Settings → Hostinger.", 400);
    }

    // Simulate sync: backup database + uploads
    const started = Date.now();
    const response = {
      ok: true,
      action: "backup",
      files: [
        { path: "/db/custom.db", size: "1.4MB" },
        { path: "/public/uploads", size: "8.2MB", count: 14 },
      ],
      durationMs: 0,
      backupId: `bk-${Date.now()}`,
      simulated: true,
    };
    response.durationMs = Date.now() - started;

    await db.hostingerLog.create({
      data: {
        action: "sync",
        status: "success",
        message: "Backup completed (simulated). Files: 2, Backup ID: " + response.backupId,
        response: JSON.stringify(response),
      },
    });

    await setSetting("hostinger_last_sync", new Date().toISOString(), "hostinger");
    return ok({ status: "success", response });
  } catch (e: any) {
    await db.hostingerLog.create({
      data: { action: "sync", status: "error", message: e?.message || "unknown" },
    }).catch(() => null);
    return err("Hostinger sync failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
