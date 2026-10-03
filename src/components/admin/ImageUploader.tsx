"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud, X, ImageIcon, Loader2, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminFetch, adminUpload } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  prefix?: string;
  label?: string;
  className?: string;
  aspect?: "square" | "video" | "wide";
}

export function ImageUploader({
  value,
  onChange,
  prefix = "img",
  label,
  className,
  aspect = "video",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file");
        return;
      }
      setUploading(true);
      const url = await adminUpload(file, prefix);
      setUploading(false);
      if (url) {
        onChange(url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    },
    [prefix, onChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const aspectClass =
    aspect === "square" ? "aspect-square" : aspect === "wide" ? "aspect-[21/9]" : "aspect-video";

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className={cn("relative group rounded-xl overflow-hidden border border-white/10 bg-white/5", aspectClass)}>
          { }
          <img src={value} alt={label || "preview"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => {
                setShowUrlInput(false);
                document.getElementById(`file-${prefix}`)?.click();
              }}
            >
              <UploadCloud className="size-3.5" /> Replace
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => onChange(null)}>
              <X className="size-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById(`file-${prefix}`)?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center p-6",
            aspectClass,
            dragOver
              ? "border-primary bg-primary/10"
              : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
          )}
        >
          {uploading ? (
            <Loader2 className="size-7 animate-spin text-primary" />
          ) : (
            <ImageIcon className="size-7 text-muted-foreground" />
          )}
          <div>
            <p className="text-xs text-muted-foreground">
              {uploading ? "Uploading…" : "Drag & drop or click to upload"}
            </p>
          </div>
        </div>
      )}

      <input
        id={`file-${prefix}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {!value && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setShowUrlInput((s) => !s)}
          >
            <Link2 className="size-3" /> Use URL instead
          </Button>
        </div>
      )}
      {showUrlInput && !value && (
        <div className="flex gap-2">
          <Input
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setUrlInput("");
                setShowUrlInput(false);
              }
            }}
          >
            Set
          </Button>
        </div>
      )}
    </div>
  );
}
