"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoPageForm } from "@/components/admin/SeoPageForm";

export default function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/seo-pages"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Search className="size-5 text-saffron" /> Edit SEO Page
          </h1>
          <p className="text-xs text-muted-foreground">Update page content</p>
        </div>
      </div>
      <SeoPageForm id={id} />
    </div>
  );
}
