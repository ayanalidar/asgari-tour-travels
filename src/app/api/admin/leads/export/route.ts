import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/api"

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get("status")
  const source = url.searchParams.get("source")

  const leads = await db.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
    },
    orderBy: { createdAt: "desc" },
  })

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Destination",
    "Package ID",
    "Travel Date",
    "Group Size",
    "Budget",
    "Status",
    "Source",
    "Priority",
    "Message",
    "Created At",
    "Updated At",
  ]

  const escapeCSV = (val: unknown): string => {
    const s = val === null || val === undefined ? "" : String(val)
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }

  const rows = leads.map((l) =>
    [
      l.id,
      l.name,
      l.email,
      l.phone,
      l.destination,
      l.packageId,
      l.travelDate,
      l.groupSize,
      l.budget,
      l.status,
      l.source,
      l.priority,
      l.message,
      l.createdAt.toISOString(),
      l.updatedAt.toISOString(),
    ]
      .map(escapeCSV)
      .join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")
  const date = new Date().toISOString().slice(0, 10)

  return new Response("\uFEFF" + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asgari-leads-${date}.csv"`,
    },
  })
}
