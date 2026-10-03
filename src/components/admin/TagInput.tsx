"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  suggestions?: string[];
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add item…",
  label,
  className,
  suggestions = [],
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const t = input.trim();
    if (!t) return;
    if (!value.includes(t)) {
      onChange([...value, t]);
    }
    setInput("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-white/5 border border-white/10 min-h-9">
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            } else if (e.key === "Backspace" && !input && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 h-7 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none px-1"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={addTag} className="text-xs">
          <Plus className="size-3" /> Add
        </Button>
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter((s) => !value.includes(s))
              .slice(0, 6)
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange([...value, s])}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground"
                >
                  + {s}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
