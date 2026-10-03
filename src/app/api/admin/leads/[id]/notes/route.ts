import { NextRequest } from "next/server";
import { ok, err, requireAdmin, readBody } from "@/lib/api";
import { db } from "@/lib/db";
import { parseJSON, LeadNote } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);
  const { id } = await ctx.params;
  const body = await readBody<any>(req);
  if (!body.text || typeof body.text !== "string") return err("Note text is required", 400);

  const existing = await db.lead.findUnique({ where: { id } });
  if (!existing) return err("Lead not found", 404);

  const notes: LeadNote[] = parseJSON<LeadNote[]>(existing.notes, []);
  notes.push({
    at: new Date().toISOString(),
    text: body.text.trim(),
    author: body.author || "admin",
  });

  const updated = await db.lead.update({
    where: { id },
    data: { notes: JSON.stringify(notes) },
  });
  return ok({ lead: { ...updated, notes } }, 201);
}
