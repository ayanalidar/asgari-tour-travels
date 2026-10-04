import { NextResponse } from "next/server"
import { ok, err } from "@/lib/api"

// This is a simulated payment integration endpoint.
// In production, this would integrate with Razorpay/UPI/Stripe.
// For now it validates and returns a mock payment session.

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { packageId, packageName, amount, name, email, phone, groupSize } = body

    if (!packageName || !amount || amount < 100) {
      return err("Invalid payment details", 400)
    }
    if (!name || !phone) {
      return err("Name and phone are required", 400)
    }

    // In production: create Razorpay order here
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR", ... })

    // Mock payment session
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const sessionId = `sess_${Date.now()}`

    return ok({
      paymentId,
      sessionId,
      amount,
      currency: "INR",
      packageName,
      customer: { name, email, phone },
      // In production these would be real gateway URLs
      gateway: "razorpay",
      upiId: "asgaritourandtravel@okhdfcbank",
      qrCode: `/api/public/payment/qr?amount=${amount}&id=${paymentId}`,
      status: "created",
      expiresIn: 600, // 10 minutes
      notes: "This is a simulated payment session. In production, integrate with Razorpay/UPI gateway.",
    })
  } catch (e: any) {
    return err("Payment init failed: " + (e?.message || "unknown"), 500)
  }
}
