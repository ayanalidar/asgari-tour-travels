"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoPageForm } from "@/components/admin/SeoPageForm";

export default function NewSeoPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/seo-pages"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Search className="size-5 text-saffron" /> New SEO Page
          </h1>
          <p className="text-xs text-muted-foreground">Create a custom landing page</p>
        </div>
      </div>
      <SeoPageForm />
    </div>
  );
}
