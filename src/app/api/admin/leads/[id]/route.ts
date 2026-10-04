import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { parseJSON } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return err("Not found", 404);
  return ok({ lead: { ...lead, notes: parseJSON(lead.notes, []) } });
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) return err("Not found", 404);

  const updated = await db.lead.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      email: body.email !== undefined ? (body.email || null) : existing.email,
      phone: body.phone !== undefined ? (body.phone || null) : existing.phone,
      destination: body.destination !== undefined ? (body.destination || null) : existing.destination,
      packageId: body.packageId !== undefined ? (body.packageId || null) : existing.packageId,
      travelDate: body.travelDate !== undefined ? (body.travelDate || null) : existing.travelDate,
      groupSize: body.groupSize !== undefined ? (body.groupSize ? parseInt(body.groupSize) : null) : existing.groupSize,
      budget: body.budget !== undefined ? (body.budget || null) : existing.budget,
      message: body.message !== undefined ? (body.message || null) : existing.message,
      status: body.status ?? existing.status,
      source: body.source ?? existing.source,
      priority: body.priority ?? existing.priority,
      notes:
        body.notes !== undefined
          ? JSON.stringify(Array.isArray(body.notes) ? body.notes : parseJSON(existing.notes, []))
          : existing.notes,
    },
  });
  return ok({ lead: { ...updated, notes: parseJSON(updated.notes, []) } });
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  try {
    await db.lead.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return err("Delete failed: " + (e?.message || "unknown"), 500);
  }
}
