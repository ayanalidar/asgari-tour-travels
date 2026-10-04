import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { parseJSON } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const source = url.searchParams.get("source") || "";
    const priority = url.searchParams.get("priority") || "";
    const search = url.searchParams.get("search") || "";

    const where: any = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { destination: { contains: search } },
      ];
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });
    const mapped = leads.map((l) => ({ ...l, notes: parseJSON(l.notes, []) }));
    return ok({ leads: mapped, total: mapped.length });
  } catch (e: any) {
    return err("Failed: " + (e?.message || "unknown"), 500);
  }
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  try {
    const body = await readBody<any>(req);
    if (!body.name) return err("Name is required", 400);

    const lead = await db.lead.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        destination: body.destination || null,
        packageId: body.packageId || null,
        travelDate: body.travelDate || null,
        groupSize: body.groupSize ? parseInt(body.groupSize) : null,
        budget: body.budget || null,
        message: body.message || null,
        status: body.status || "new",
        source: body.source || "phone",
        priority: body.priority || "medium",
        notes: JSON.stringify(Array.isArray(body.notes) ? body.notes : []),
      },
    });
    return ok({ lead }, 201);
  } catch (e: any) {
    return err("Create failed: " + (e?.message || "unknown"), 500);
  }
}

export const dynamic = "force-dynamic";
