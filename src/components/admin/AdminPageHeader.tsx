"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  backHref?: string;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  actions,
  backHref,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3 mb-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <Button asChild variant="ghost" size="icon" className="size-9 shrink-0">
            <Link href={backHref}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        )}
        {Icon && (
          <div className="size-10 rounded-lg bg-gradient-to-br from-saffron/20 to-emerald/20 flex items-center justify-center shrink-0">
            <Icon className="size-5 text-saffron" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-xl lg:text-2xl font-bold truncate">{title}</h1>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
