import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const logs = await db.hostingerLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return ok({ logs });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}
