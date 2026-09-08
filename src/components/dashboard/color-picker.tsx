"use client";

import { ITEM_COLORS } from "@/config/const/colors.const";
import { cn } from "@/lib/utils";
import { Check, Slash } from "lucide-react";

interface ColorPickerProps {
  value?: string | null;
  onChange: (colorId: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5 p-1", className)}>
      <button
        type="button"
        disabled={disabled}
        title="Без цвета"
        onClick={() => onChange(null)}
        className={cn(
          "w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 bg-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100",
          !value && "ring-2 ring-offset-2 ring-primary dark:ring-offset-neutral-950 font-bold"
        )}
      >
        <Slash className="w-3.5 h-3.5" />
      </button>
      {ITEM_COLORS.map((color) => {
        const isSelected = value === color.id;
        return (
          <button
            key={color.id}
            type="button"
            disabled={disabled}
            title={color.name}
            onClick={() => onChange(color.id)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xs",
              color.swatch,
              isSelected && "ring-2 ring-offset-2 ring-primary dark:ring-offset-neutral-950 text-white"
            )}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
          </button>
        );
      })}
    </div>
  );
}
