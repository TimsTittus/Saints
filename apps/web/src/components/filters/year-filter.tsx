"use client";

import { cn } from "@Saints/ui/lib/utils";
import { ERA_PERIODS, type EraPeriod } from "@/lib/constants";

interface YearFilterProps {
  selected: EraPeriod | null;
  onChange: (era: EraPeriod | null) => void;
}

export default function YearFilter({ selected, onChange }: YearFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Filter by era"
    >
      {ERA_PERIODS.map((era) => {
        const active = selected === era.label;
        return (
          <button
            key={era.label}
            type="button"
            onClick={() => onChange(active ? null : era.label)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
              active
                ? "bg-amber-600 text-white border-amber-600"
                : "border-amber-300/50 text-amber-700 hover:bg-amber-50/60"
            )}
            aria-pressed={active}
            title={`${era.min}–${era.max} AD`}
          >
            {era.label}
            <span className="ml-1 opacity-60 text-[10px]">
              {era.min}–{era.max === 2100 ? "now" : era.max}
            </span>
          </button>
        );
      })}
    </div>
  );
}