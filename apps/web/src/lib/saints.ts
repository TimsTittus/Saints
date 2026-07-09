import type { Category, Region } from "./constants";

export interface SaintCatalogEntry {
  id: string;
  name: string;
  shortName: string;
  letter: string;
  category: Category;
  feastDay: string;
  birthYear: number | null;
  deathYear: number | null;
  country: string;
  region: Region;
  coordinates: { lat: number; lng: number } | null;
  thumbUrl: string;
  patronage: string[];
  excerpt: string;
}

interface SaintInfobox {
  veneratedIn: string;
  feastDay: string;
  bornDate: string;
  bornPlace: string;
  diedDate: string;
  diedPlace: string;
  canonized: string;
  attributes: string[];
  patronage: string[];
  shrine?: string;
}

export interface SaintFrontmatter {
  id: string;
  displayName: string;
  mainImageUrl: string;
  imageCaption: string;
  infobox: SaintInfobox;
  seoDescription: string;
}

import catalog from "../data/catalog.json";

export function getSaintsCatalog(): SaintCatalogEntry[] {
  return catalog as SaintCatalogEntry[];
}

export function getSaintBySlug(slug: string): SaintCatalogEntry | undefined {
  return (catalog as SaintCatalogEntry[]).find((s) => s.id === slug);
}

export function getAllSlugs(): string[] {
  return (catalog as SaintCatalogEntry[]).map((s) => s.id);
}