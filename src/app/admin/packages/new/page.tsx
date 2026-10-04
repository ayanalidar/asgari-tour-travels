"use client";

import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageForm } from "@/components/admin/PackageForm";

export default function NewPackagePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/packages"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Package className="size-5 text-saffron" /> New Package
          </h1>
          <p className="text-xs text-muted-foreground">Create a new tour package</p>
        </div>
      </div>
      <PackageForm />
    </div>
  );
}
