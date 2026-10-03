"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UploadCloud, X, Plus, GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminUpload } from "@/lib/admin-fetch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  prefix?: string;
  label?: string;
  className?: string;
}

function SortableImage({
  url,
  id,
  onRemove,
}: {
  url: string;
  id: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5"
    >
      { }
      <img src={url} alt="" className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 size-6 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="size-3" />
      </button>
      <button
        type="button"
        className="absolute bottom-1 left-1 size-6 rounded-full bg-black/70 hover:bg-primary/70 text-white flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3" />
      </button>
    </div>
  );
}

export function MultiImageUploader({
  value,
  onChange,
  prefix = "img",
  label,
  className,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (imgs.length === 0) return;
      setUploading(true);
      const urls: string[] = [];
      for (const f of imgs) {
        const u = await adminUpload(f, prefix);
        if (u) urls.push(u);
      }
      setUploading(false);
      if (urls.length > 0) {
        onChange([...value, ...urls]);
        toast.success(`Uploaded ${urls.length} image(s)`);
      } else {
        toast.error("Upload failed");
      }
    },
    [value, onChange, prefix]
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(active.id as string);
    const newIndex = value.indexOf(over.id as string);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(value, oldIndex, newIndex));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 text-center p-6",
          dragOver ? "border-primary bg-primary/10" : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
        )}
        onClick={() => document.getElementById(`mfile-${prefix}`)?.click()}
      >
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-primary" />
        ) : (
          <UploadCloud className="size-6 text-muted-foreground" />
        )}
        <p className="text-xs text-muted-foreground">
          {uploading ? "Uploading…" : "Drag & drop multiple images or click to select"}
        </p>
        <Button type="button" size="sm" variant="ghost" className="text-xs">
          <Plus className="size-3" /> Add images
        </Button>
      </div>

      <input
        id={`mfile-${prefix}`}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={value} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {value.map((url) => (
                <SortableImage
                  key={url}
                  id={url}
                  url={url}
                  onRemove={() => onChange(value.filter((v) => v !== url))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
