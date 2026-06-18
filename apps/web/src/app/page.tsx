"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import dynamic from "next/dynamic";
import { getSaintsCatalog } from "@/lib/saints";
import {
  filterSaints,
  sortSaints,
  getActiveLetters,
  DEFAULT_FILTERS,
  type FilterState,
} from "@/lib/filters";
import type { SortOption, ViewMode } from "@/lib/constants";
import FilterBar from "@/components/filters/filter-bar";
import SaintGrid from "@/components/saints/saint-grid";

const SaintsMap = dynamic(() => import("@/components/map/saints-map"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden glass border border-white/60 shadow-lg mt-6 flex flex-col items-center justify-center bg-slate-50/90 z-20">
      <div className="w-10 h-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
      <p className="serif text-lg font-medium text-slate-600">Loading Sacred Map...</p>
    </div>
  ),
});

const ALL_SAINTS = getSaintsCatalog();

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () => sortSaints(filterSaints(ALL_SAINTS, filters), sortBy),
    [filters, sortBy]
  );

  const availableLetters = useMemo(
    () => Array.from(getActiveLetters(filterSaints(ALL_SAINTS, { ...filters, letter: null }))),
    [filters]
  );

  const handleFiltersChange = useCallback((next: FilterState) => {
    startTransition(() => setFilters(next));
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-4 text-center"
        aria-labelledby="hero-heading"
      >
        {/* Background decorative halos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[500px] w-[500px] rounded-full border border-amber-200/20 animate-[halo-pulse_6s_ease-in-out_infinite]" />
          <div className="absolute h-[380px] w-[380px] rounded-full border border-amber-300/15 animate-[halo-pulse_6s_ease-in-out_infinite_1s]" />
          <div className="absolute h-[260px] w-[260px] rounded-full border border-amber-400/10 animate-[halo-pulse_6s_ease-in-out_infinite_2s]" />
          <div className="absolute h-32 w-32 rounded-full bg-amber-100/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Cross icon */}
          <div className="mb-6 flex justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="opacity-70"
            >
              <rect x="13" y="2" width="6" height="28" rx="3" fill="url(#hero-grad)" />
              <rect x="2" y="11" width="28" height="6" rx="3" fill="url(#hero-grad)" />
              <defs>
                <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d4a84b" />
                  <stop offset="100%" stopColor="#f0c060" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1
            id="hero-heading"
            className="serif text-5xl sm:text-6xl font-semibold tracking-tight text-slate-800"
            style={{ fontFamily: "var(--font-crimson, 'Crimson Pro', Georgia, serif)" }}
          >
            The Communion of Saints
          </h1>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Explore{" "}
            <span className="font-semibold text-amber-700">{ALL_SAINTS.length}</span>{" "}
            saints, blesseds &amp; martyrs across every era and region of the world.
          </p>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/60" />
            <span className="text-amber-400 text-lg">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/60" />
          </div>
        </div>
      </section>

      {/* Saint grid / map */}
      <section
        id="saints"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-10"
        aria-label="Saints catalog"
      >
        {viewMode === "map" ? (
          <SaintsMap saints={filtered} />
        ) : (
          <SaintGrid saints={filtered} viewMode={viewMode as "grid" | "alpha"} />
        )}
      </section>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        availableLetters={availableLetters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={ALL_SAINTS.length}
        filteredCount={filtered.length}
      />
    </>
  );
}