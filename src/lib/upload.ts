// Image upload utility — stores base64 / multipart files into /public/uploads
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch {}
}

// Save a base64 data URL to /public/uploads and return the public path
export async function saveBase64Image(dataUrl: string, prefix = "img"): Promise<string> {
  await ensureUploadDir()
  const match = dataUrl.match(/^data:(image\/(\w+));base64,(.+)$/)
  if (!match) throw new Error("Invalid data URL")
  const ext = match[2] === "jpeg" ? "jpg" : match[2]
  const buffer = Buffer.from(match[3], "base64")
  const name = `${prefix}-${randomUUID()}.${ext}`
  const filePath = path.join(UPLOAD_DIR, name)
  await writeFile(filePath, buffer)
  return `/uploads/${name}`
}

// Save a File (multipart) — returns public path
export async function saveFile(file: File, prefix = "img"): Promise<string> {
  await ensureUploadDir()
  const ext = file.name.split(".").pop() || "jpg"
  const name = `${prefix}-${randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(UPLOAD_DIR, name)
  await writeFile(filePath, buffer)
  return `/uploads/${name}`
}

// Check if a string is a data URL
export function isDataUrl(s: string): boolean {
  return typeof s === "string" && s.startsWith("data:")
}

// Normalize image field: if data URL, save it; otherwise return as-is (external URL or already saved)
export async function normalizeImage(value: string | null | undefined, prefix = "img"): Promise<string | null> {
  if (!value) return null
  if (isDataUrl(value)) return await saveBase64Image(value, prefix)
  return value
}

// Normalize an array of image values
export async function normalizeImages(values: (string | null | undefined)[], prefix = "img"): Promise<string[]> {
  const out: string[] = []
  for (const v of values) {
    const n = await normalizeImage(v ?? null, prefix)
    if (n) out.push(n)
  }
  return out
}
