import {
  loadAllEntries,
  loadEntry,
  type WikiEntry,
  type WikiEntryMeta,
} from "./wiki-content";

const STAT_KEYS = ["wingspan", "weight", "lifespan"] as const;
const STAT_LABELS: Record<string, string> = {
  wingspan: "Wingspan",
  weight: "Weight",
  lifespan: "Lifespan",
};

export type BirdMeta = WikiEntryMeta;
export type BirdArticle = WikiEntry;

export async function getAllBirds(): Promise<BirdMeta[]> {
  return loadAllEntries("birds", [...STAT_KEYS], STAT_LABELS);
}

export async function getBird(slug: string): Promise<BirdArticle | null> {
  return loadEntry("birds", slug, [...STAT_KEYS], STAT_LABELS);
}
