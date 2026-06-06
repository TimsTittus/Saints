import type { SaintCatalogEntry } from "./saints";
import type { Category, EraPeriod, Region, SortOption } from "./constants";
import { ERA_PERIODS } from "./constants";

export interface FilterState {
  query: string;
  categories: Category[];
  regions: Region[];
  countries: string[];
  era: EraPeriod | null;
  letter: string | null;
}

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  categories: [],
  regions: [],
  countries: [],
  era: null,
  letter: null,
};

export function filterSaints(
  saints: SaintCatalogEntry[],
  filters: FilterState
): SaintCatalogEntry[] {
  const q = filters.query.trim().toLowerCase();

  return saints.filter((saint) => {
    if (q) {
      const haystack = [
        saint.name,
        saint.shortName,
        saint.country,
        saint.region,
        ...saint.patronage,
        saint.excerpt,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.categories.length > 0) {
      if (!filters.categories.includes(saint.category)) return false;
    }

    if (filters.regions.length > 0) {
      if (!filters.regions.includes(saint.region)) return false;
    }

    if (filters.countries.length > 0) {
      if (!filters.countries.includes(saint.country)) return false;
    }

    if (filters.era) {
      const period = ERA_PERIODS.find((p) => p.label === filters.era);
      if (period) {
        const year = saint.deathYear ?? saint.birthYear;
        if (year === null || year < period.min || year > period.max)
          return false;
      }
    }

    if (filters.letter) {
      if (saint.letter !== filters.letter) return false;
    }

    return true;
  });
}

export function sortSaints(
  saints: SaintCatalogEntry[],
  sort: SortOption
): SaintCatalogEntry[] {
  const sorted = [...saints];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) =>
        a.shortName.localeCompare(b.shortName, "en")
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        b.shortName.localeCompare(a.shortName, "en")
      );
    case "year-asc":
      return sorted.sort(
        (a, b) => (a.deathYear ?? 9999) - (b.deathYear ?? 9999)
      );
    case "year-desc":
      return sorted.sort(
        (a, b) => (b.deathYear ?? 0) - (a.deathYear ?? 0)
      );
    default:
      return sorted;
  }
}

export function groupByLetter(
  saints: SaintCatalogEntry[]
): Record<string, SaintCatalogEntry[]> {
  return saints.reduce<Record<string, SaintCatalogEntry[]>>((acc, saint) => {
    const key = saint.letter;
    if (!acc[key]) acc[key] = [];
    acc[key].push(saint);
    return acc;
  }, {});
}

export function getAvailableCountries(saints: SaintCatalogEntry[]): string[] {
  return [...new Set(saints.map((s) => s.country))].sort((a, b) =>
    a.localeCompare(b, "en")
  );
}

export function getActiveLetters(saints: SaintCatalogEntry[]): Set<string> {
  return new Set(saints.map((s) => s.letter));
}

export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.query !== "" ||
    filters.categories.length > 0 ||
    filters.regions.length > 0 ||
    filters.countries.length > 0 ||
    filters.era !== null ||
    filters.letter !== null
  );
}