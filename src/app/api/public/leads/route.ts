import { db } from "@/lib/db"
import { ok, err, readBody } from "@/lib/api"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const body = await readBody<any>(req)

  const name = (body.name ?? "").toString().trim()
  const email = (body.email ?? "").toString().trim() || null
  const phone = (body.phone ?? "").toString().trim() || null

  if (!name || name.length < 2) {
    return err("Please provide your name", 422)
  }
  if (!email && !phone) {
    return err("Please provide either email or phone", 422)
  }

  const travelDate = body.travelDate ? String(body.travelDate) : null
  const groupSize =
    body.groupSize != null && body.groupSize !== ""
      ? Number(body.groupSize) || null
      : null
  const source = body.source ?? "website"
  const priority = body.priority ?? "medium"

  const lead = await db.lead.create({
    data: {
      name,
      email,
      phone,
      destination: body.destination ?? null,
      packageId: body.packageId ?? null,
      travelDate,
      groupSize,
      budget: body.budget ?? null,
      message: body.message ?? null,
      source,
      priority,
      status: "new",
    },
  })

  return ok({ id: lead.id, message: "Enquiry received" }, 201)
}
