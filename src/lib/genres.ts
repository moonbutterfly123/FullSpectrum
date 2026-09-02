import { getRawCategoryEntries, getRawEntry, getRawSlugs } from "./content-store";
import { parseSections } from "./wiki-content";
import type { WikiSection } from "./types";

export interface GenreMeta {
  slug: string;
  title: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  popularityTier: string;
  eraOrigin: string;
  regionOrigin: string;
  tempoBpm: string;
  signatureSound: string;
  culturalMovement: string;
  accentColor: string;
  parentGenres: string[];
  keyInstruments: string[];
  regions: string[];
  stats: Record<string, string>;
  statLabels: Record<string, string>;
  displayOrder: number;
  publishedAt: string;
  wordCount: number;
}

export interface GenreArticle extends GenreMeta {
  sections: WikiSection[];
}

const STAT_KEYS = ["era", "origin", "tempo", "popularity", "roots", "keyTools"];
const STAT_LABELS: Record<string, string> = {
  era: "Era",
  origin: "Origin",
  tempo: "Tempo",
  popularity: "Popularity",
  roots: "Roots",
  keyTools: "Key Tools",
};

function parseDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return new Date().toISOString().split("T")[0];
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function resolveWordCount(data: Record<string, unknown>, content: string): number {
  const bundled = Number(data.wordCount);
  if (Number.isFinite(bundled) && bundled > 0) return bundled;
  return countWords(content);
}

function buildMeta(slug: string, data: Record<string, unknown>, wordCount: number): GenreMeta {
  const stats = (data.stats ?? {}) as Record<string, string>;
  return {
    slug,
    title: (data.title as string) ?? slug,
    subtitle: (data.subtitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    image: (data.image as string) ?? "",
    imageAlt: (data.imageAlt as string) ?? "",
    popularityTier: (data.popularityTier as string) ?? "Major",
    eraOrigin: (data.eraOrigin as string) ?? "",
    regionOrigin: (data.regionOrigin as string) ?? "",
    tempoBpm: (data.tempoBpm as string) ?? "",
    signatureSound: (data.signatureSound as string) ?? "",
    culturalMovement: (data.culturalMovement as string) ?? "",
    accentColor: (data.accentColor as string) ?? "#a855f7",
    parentGenres: (data.parentGenres as string[]) ?? [],
    keyInstruments: (data.keyInstruments as string[]) ?? [],
    regions: (data.regions as string[]) ?? [],
    stats: Object.fromEntries(STAT_KEYS.map((k) => [k, stats[k] ?? ""])),
    statLabels: STAT_LABELS,
    displayOrder: Number(data.displayOrder ?? 999),
    publishedAt: parseDate(data.publishedAt),
    wordCount,
  };
}

export async function getAllGenres(): Promise<GenreMeta[]> {
  const entries = (await getRawCategoryEntries("music")).map(({ slug, data, content }) =>
    buildMeta(slug, data, resolveWordCount(data, content))
  );
  return entries.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getGenre(slug: string): Promise<GenreArticle | null> {
  const raw = await getRawEntry("music", slug);
  if (!raw) return null;

  const { data, content } = raw;
  return {
    ...buildMeta(slug, data, resolveWordCount(data, content)),
    sections: parseSections(content),
  };
}

export async function getGenreSlugs(): Promise<string[]> {
  return getRawSlugs("music");
}

export const genreStatKeys = STAT_KEYS;
