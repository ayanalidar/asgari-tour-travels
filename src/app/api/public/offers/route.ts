import { db } from "@/lib/db"
import { ok } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function GET() {
  // Get the most recent active offer
  const offer = await db.offer.findFirst({
    where: {
      isActive: true,
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
  })
  return ok(offer)
}
