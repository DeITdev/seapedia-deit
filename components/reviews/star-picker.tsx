"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = React.useState(0);

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const active = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-checked={value === star}
            role="radio"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="disabled:opacity-50"
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                active
                  ? "fill-warning text-warning"
                  : "fill-muted text-muted-foreground/40",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
