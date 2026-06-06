"use client";

import { cn } from "@Saints/ui/lib/utils";
import { REGIONS, type Region } from "@/lib/constants";

interface RegionFilterProps {
  selected: Region[];
  onChange: (regions: Region[]) => void;
}

export default function RegionFilter({ selected, onChange }: RegionFilterProps) {
  const toggle = (region: Region) => {
    onChange(
      selected.includes(region)
        ? selected.filter((r) => r !== region)
        : [...selected, region]
    );
  };

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Filter by region"
    >
      {REGIONS.map((region) => {
        const active = selected.includes(region);
        return (
          <button
            key={region}
            type="button"
            onClick={() => toggle(region)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
              active
                ? "bg-slate-700 text-white border-slate-700"
                : "border-slate-300/60 text-slate-600 hover:bg-slate-100/60"
            )}
            aria-pressed={active}
          >
            {region}
          </button>
        );
      })}
    </div>
  );
}