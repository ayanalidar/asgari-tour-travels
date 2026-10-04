"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = "Write markdown here…",
  className,
  rows = 12,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={cn("space-y-2", className, fullscreen && "fixed inset-0 z-50 bg-background p-6 m-0 rounded-none")}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={preview ? "outline" : "ghost"}
            onClick={() => setPreview(!preview)}
            className="text-xs h-7"
          >
            {preview ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
            {preview ? "Edit" : "Preview"}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setFullscreen(!fullscreen)}
            className="size-7"
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
          </Button>
        </div>
      </div>
      {preview ? (
        <div
          className={cn(
            "rounded-lg border border-white/10 bg-white/5 p-4 overflow-y-auto prose prose-invert max-w-none",
            fullscreen ? "h-[80vh]" : "min-h-[200px]"
          )}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="font-display text-2xl font-bold mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="font-display text-xl font-bold mt-3 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="font-display text-lg font-semibold mt-3 mb-1">{children}</h3>,
              p: ({ children }) => <p className="text-sm leading-relaxed my-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1 text-sm">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-sm">{children}</ol>,
              li: ({ children }) => <li className="text-sm">{children}</li>,
              a: ({ children, href }) => <a href={href} className="text-primary underline">{children}</a>,
              code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
              pre: ({ children }) => <pre className="bg-black/30 p-3 rounded my-2 overflow-x-auto">{children}</pre>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/40 pl-4 italic text-muted-foreground my-2">{children}</blockquote>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="text-muted-foreground">{children}</em>,
              hr: () => <hr className="my-4 border-white/10" />,
              table: ({ children }) => <table className="w-full text-xs my-2 border-collapse">{children}</table>,
              th: ({ children }) => <th className="border border-white/10 px-2 py-1 text-left bg-white/5">{children}</th>,
              td: ({ children }) => <td className="border border-white/10 px-2 py-1">{children}</td>,
            }}
          >
            {value || "_Nothing to preview yet._"}
          </ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={fullscreen ? 28 : rows}
          className="font-mono text-sm bg-white/5 border-white/10"
        />
      )}
      <p className="text-[10px] text-muted-foreground">
        Supports Markdown · # headings · **bold** · *italic* · [links](url) · - lists · `code` · &gt; quotes
      </p>
    </div>
  );
}
