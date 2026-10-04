// API response helper
import { NextResponse } from "next/server"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function err(message: string, status = 400, details?: any) {
  return NextResponse.json({ success: false, error: message, details }, { status })
}

// Simple admin auth via header (shared secret).
// In production this would be NextAuth; for this demo a single admin token stored in env.
export function requireAdmin(req: Request): boolean {
  const auth = req.headers.get("x-admin-token")
  const expected = process.env.ADMIN_TOKEN || "asgari-admin-2024"
  return auth === expected
}

// CORS-safe headers for admin APIs
export function adminHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
  }
}

// Slugify helper
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Read request body safely
export async function readBody<T = any>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T
  } catch {
    return {} as T
  }
}
