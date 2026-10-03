"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponForm } from "@/components/admin/CouponForm";

export default function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/coupons"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <TicketPercent className="size-5 text-saffron" /> Edit Coupon
          </h1>
          <p className="text-xs text-muted-foreground">Update discount code</p>
        </div>
      </div>
      <CouponForm id={id} />
    </div>
  );
}
