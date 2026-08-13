import {
  loadAllEntries,
  loadEntry,
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

export async function getAllFish(): Promise<FishMeta[]> {
  return loadAllEntries("fish", [...STAT_KEYS], STAT_LABELS);
}

export async function getFish(slug: string): Promise<FishArticle | null> {
  return loadEntry("fish", slug, [...STAT_KEYS], STAT_LABELS);
}
