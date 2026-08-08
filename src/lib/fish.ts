import {
  loadAllEntries,
  loadEntry,
  loadSlugs,
  type WikiEntry,
  type WikiEntryMeta,
} from "./wiki-content";

const STAT_KEYS = ["maxLength", "weight", "lifespan"] as const;
const STAT_LABELS: Record<string, string> = {
  maxLength: "Max Length",
  weight: "Weight",
  lifespan: "Lifespan",
};

export type FishMeta = WikiEntryMeta;
export type FishArticle = WikiEntry;

export function getAllFish(): FishMeta[] {
  return loadAllEntries("fish", [...STAT_KEYS], STAT_LABELS);
}

export function getFish(slug: string): FishArticle | null {
  return loadEntry("fish", slug, [...STAT_KEYS], STAT_LABELS);
}

export function getFishSlugs(): string[] {
  return loadSlugs("fish");
}
