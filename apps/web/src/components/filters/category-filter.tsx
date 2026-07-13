"use client";

import { cn } from "@Saints/ui/lib/utils";
import { CATEGORIES, type Category } from "@/lib/constants";

interface CategoryFilterProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}

const categoryColors: Record<Category, { active: string; inactive: string }> = {
  Saint: { active: "bg-amber-500 text-white border-amber-500", inactive: "border-amber-300/60 text-amber-700 hover:bg-amber-50" },
  Blessed: { active: "bg-blue-500 text-white border-blue-500", inactive: "border-blue-300/60 text-blue-700 hover:bg-blue-50" },
  Venerable: { active: "bg-purple-500 text-white border-purple-500", inactive: "border-purple-300/60 text-purple-700 hover:bg-purple-50" },
  Martyr: { active: "bg-red-500 text-white border-red-500", inactive: "border-red-300/60 text-red-700 hover:bg-red-50" },
  Confessor: { active: "bg-green-500 text-white border-green-500", inactive: "border-green-300/60 text-green-700 hover:bg-green-50" },
  Doctor: { active: "bg-indigo-500 text-white border-indigo-500", inactive: "border-indigo-300/60 text-indigo-700 hover:bg-indigo-50" },
  Apostle: { active: "bg-cyan-500 text-white border-cyan-500", inactive: "border-cyan-300/60 text-cyan-700 hover:bg-cyan-50" },
  Evangelist: { active: "bg-orange-500 text-white border-orange-500", inactive: "border-orange-300/60 text-orange-700 hover:bg-orange-50" },
};

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const toggle = (cat: Category) => {
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );
  };

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => {
        const active = selected.includes(cat);
        const colors = categoryColors[cat];
        return (
          <button
            key={cat}
            type="button"
            onClick={() => toggle(cat)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
              active ? colors.active : colors.inactive
            )}
            aria-pressed={active}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}