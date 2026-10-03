"use client";

import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityForm } from "@/components/admin/ActivityForm";

export default function NewActivityPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button asChild variant="ghost" size="icon" className="size-9">
          <Link href="/admin/activities"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="font-display text-xl lg:text-2xl font-bold flex items-center gap-2">
            <Activity className="size-5 text-saffron" /> New Activity
          </h1>
          <p className="text-xs text-muted-foreground">Add a new thing-to-do</p>
        </div>
      </div>
      <ActivityForm />
    </div>
  );
}
