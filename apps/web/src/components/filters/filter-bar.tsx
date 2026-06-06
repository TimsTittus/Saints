"use client";

import { useState } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import SearchInput from "./search-input";
import AlphaFilter from "./alpha-filter";
import CategoryFilter from "./category-filter";
import RegionFilter from "./region-filter";
import YearFilter from "./year-filter";
import type { FilterState } from "@/lib/filters";
import { DEFAULT_FILTERS, hasActiveFilters } from "@/lib/filters";
import type { Category, EraPeriod, Region, ViewMode } from "@/lib/constants";
import { cn } from "@Saints/ui/lib/utils";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableLetters: Set<string>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  availableLetters,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = hasActiveFilters(filters);

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onFiltersChange({ ...filters, [key]: value });

  const reset = () => onFiltersChange(DEFAULT_FILTERS);

  return (
    <>
      {/* Main sticky bar */}
      <div className="sticky top-[var(--header-height)] z-30 glass border-b border-white/60">
        <div className="mx-auto max-w-7xl px-4 py-3 space-y-3">
          {/* Row 1: Search + view controls + reset */}
          <div className="flex items-center gap-3">
            <SearchInput
              value={filters.query}
              onChange={(q) => update("query", q)}
              className="flex-1"
            />

            {/* View mode toggle */}
            <div className="hidden sm:flex items-center rounded-lg border border-white/70 bg-white/50 backdrop-blur-sm p-0.5 gap-0.5">
              {(["grid", "alpha", "map"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onViewModeChange(mode)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
                    viewMode === mode
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  )}
                  aria-pressed={viewMode === mode}
                >
                  {mode === "grid" ? "Grid" : mode === "alpha" ? "A–Z" : "Map"}
                </button>
              ))}
            </div>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "sm:hidden flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-150",
                active
                  ? "border-amber-400 bg-amber-500 text-white"
                  : "border-white/70 bg-white/50 text-slate-600"
              )}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={14} />
              Filters
              {active && (
                <span className="rounded-full bg-white/30 px-1 py-0 text-[10px]">
                  {[
                    filters.categories.length,
                    filters.regions.length,
                    filters.era ? 1 : 0,
                    filters.letter ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>

            {/* Reset */}
            {active && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 rounded-lg border border-slate-200/60 bg-white/50 px-2.5 py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors duration-150"
                aria-label="Reset all filters"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Row 2: Alpha filter (desktop) */}
          <div className="hidden sm:block">
            <AlphaFilter
              activeLetter={filters.letter}
              availableLetters={availableLetters}
              onChange={(l) => update("letter", l)}
            />
          </div>

          {/* Row 3: Category + Region + Era (desktop) */}
          <div className="hidden sm:flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide w-full sm:w-auto">
              Filter:
            </span>
            <CategoryFilter
              selected={filters.categories}
              onChange={(c) => update("categories", c as Category[])}
            />
            <div className="w-px h-4 bg-slate-200/60 hidden sm:block" />
            <RegionFilter
              selected={filters.regions}
              onChange={(r) => update("regions", r as Region[])}
            />
            <div className="w-px h-4 bg-slate-200/60 hidden sm:block" />
            <YearFilter
              selected={filters.era}
              onChange={(e) => update("era", e as EraPeriod | null)}
            />
          </div>

          {/* Result count */}
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-600">{filteredCount}</span>
            {filteredCount !== totalCount && (
              <> of <span className="font-semibold text-slate-600">{totalCount}</span></>
            )}{" "}
            saints
          </p>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Filter options"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-auto h-full w-80 max-w-full glass flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/60 px-5 py-4">
              <h2 className="serif text-lg font-semibold text-slate-800">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100/60"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6 p-5">
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Letter</h3>
                <AlphaFilter
                  activeLetter={filters.letter}
                  availableLetters={availableLetters}
                  onChange={(l) => update("letter", l)}
                />
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</h3>
                <CategoryFilter
                  selected={filters.categories}
                  onChange={(c) => update("categories", c as Category[])}
                />
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Region</h3>
                <RegionFilter
                  selected={filters.regions}
                  onChange={(r) => update("regions", r as Region[])}
                />
              </section>

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Era</h3>
                <YearFilter
                  selected={filters.era}
                  onChange={(e) => update("era", e as EraPeriod | null)}
                />
              </section>
            </div>

            <div className="border-t border-white/60 p-5 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-xl border border-slate-200/60 py-2.5 text-sm text-slate-600 hover:bg-slate-100/60 transition-colors"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
              >
                Show {filteredCount} saints
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}