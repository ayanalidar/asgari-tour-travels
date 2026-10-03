import { db } from "@/lib/db"
import { ok, err, readBody } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await readBody<any>(req)
  const email = (body.email ?? "").toString().trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return err("Please provide a valid email address", 422)
  }

  // Save as a lead with source = newsletter (so CRM can manage subscriptions)
  await db.lead.create({
    data: {
      name: "Newsletter Subscriber",
      email,
      phone: null,
      message: "Newsletter subscription",
      source: "newsletter",
      status: "new",
      priority: "low",
    },
  })

  return ok({ message: "Subscribed successfully" }, 201)
}
