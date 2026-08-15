"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 12,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex h-10 items-center rounded-full border border-line bg-white", className)}>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center text-ink disabled:opacity-30"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
