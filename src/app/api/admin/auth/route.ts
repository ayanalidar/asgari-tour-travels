import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const token = (body as any)?.token;
  const expected = process.env.ADMIN_TOKEN || "asgari-admin-2024";
  if (!token || typeof token !== "string") return err("Missing token", 400);
  if (token === expected) return ok({ valid: true });
  return ok({ valid: false });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN || "asgari-admin-2024";
  return ok({ authed: auth === expected });
}
