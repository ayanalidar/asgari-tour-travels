"use client";

import React from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface RepeaterProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, index: number, update: (v: T) => void) => React.ReactNode;
  itemLabel?: (item: T, index: number) => string;
  addLabel?: string;
  className?: string;
  min?: number;
}

function SortableItem<T>({
  id,
  children,
  dragHandle,
}: {
  id: string;
  children: React.ReactNode;
  dragHandle?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-2 size-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
        {dragHandle}
      </div>
    </div>
  );
}

export function Repeater<T extends { id?: string }>({
  items,
  onChange,
  newItem,
  renderItem,
  itemLabel,
  addLabel = "Add Item",
  className,
  min = 0,
}: RepeaterProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Ensure each item has an id for sortable
  const itemsWithIds = items.map((it, idx) => ({
    ...it,
    id: (it as any).id || `item-${idx}-${Math.random().toString(36).slice(2, 9)}`,
  })) as (T & { id: string })[];

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = itemsWithIds.findIndex((i) => i.id === active.id);
    const newIndex = itemsWithIds.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const moved = arrayMove(itemsWithIds, oldIndex, newIndex);
    onChange(moved.map(({ id, ...rest }) => rest as T));
  };

  const update = (idx: number, val: T) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };
  const remove = (idx: number) => {
    if (items.length <= min) return;
    onChange(items.filter((_, i) => i !== idx));
  };
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };
  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
    onChange(next);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={itemsWithIds.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {itemsWithIds.map((item, idx) => (
              <SortableItem<T>
                key={item.id}
                id={item.id}
                dragHandle={
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => moveDown(idx)}
                      disabled={idx === items.length - 1}
                    >
                      <ChevronDown className="size-3" />
                    </Button>
                  </div>
                }
              >
                {itemLabel && (
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {itemLabel(item, idx + 1)}
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    {renderItem(item, idx, (v) => update(idx, v))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive shrink-0"
                    onClick={() => remove(idx)}
                    disabled={items.length <= min}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, newItem()])}
        className="w-full border-dashed"
      >
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}
