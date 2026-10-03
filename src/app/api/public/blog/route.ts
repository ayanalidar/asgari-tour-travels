import { getAllBlogPosts } from "@/lib/queries"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET() {
  const data = await getAllBlogPosts()
  return ok(data)
}
