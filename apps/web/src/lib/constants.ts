export const CATEGORIES = [
  "Saint",
  "Blessed",
  "Venerable",
  "Martyr",
  "Confessor",
  "Doctor",
  "Apostle",
  "Evangelist",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const REGIONS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Middle East",
  "Oceania",
] as const;

export type Region = (typeof REGIONS)[number];

export const ERA_PERIODS = [
  { label: "Early Church", min: 1, max: 500 },
  { label: "Medieval", min: 501, max: 1500 },
  { label: "Modern", min: 1501, max: 2100 },
] as const;

export type EraPeriod = (typeof ERA_PERIODS)[number]["label"];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const VIEW_MODES = ["grid", "alpha", "map"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "year-asc", label: "Earliest first" },
  { value: "year-desc", label: "Latest first" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];