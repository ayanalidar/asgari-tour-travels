import { NextRequest } from "next/server";
import { ok, err, requireAdmin } from "@/lib/api";
import { saveFile, saveBase64Image, isDataUrl } from "@/lib/upload";

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return err("Unauthorized", 401);

  const ct = req.headers.get("content-type") || "";
  let prefix = "img";

  try {
    if (ct.startsWith("multipart/form-data")) {
      const fd = await req.formData();
      const file = fd.get("file") as File | null;
      const p = fd.get("prefix");
      if (p && typeof p === "string") prefix = p;
      if (!file) return err("No file provided", 400);
      const url = await saveFile(file, prefix);
      return ok({ url });
    }
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({} as any));
      const dataUrl = body?.dataUrl;
      const p = body?.prefix;
      if (p && typeof p === "string") prefix = p;
      if (!dataUrl || typeof dataUrl !== "string" || !isDataUrl(dataUrl)) {
        return err("Invalid dataUrl", 400);
      }
      const url = await saveBase64Image(dataUrl, prefix);
      return ok({ url });
    }
    return err("Unsupported content type", 415);
  } catch (e: any) {
    return err("Upload failed: " + (e?.message || "unknown"), 500);
  }
}
