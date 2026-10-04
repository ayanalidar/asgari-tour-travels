"use client";

import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/blog"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Newspaper className="size-5 text-saffron" /> New Blog Post
          </h1>
          <p className="text-xs text-muted-foreground">Write a new article or guide</p>
        </div>
      </div>
      <BlogForm />
    </div>
  );
}
