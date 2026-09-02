import { getRawCategoryEntries, getRawEntry, getRawSlugs } from "./content-store";
import { parseSections } from "./wiki-content";
import type { GenreArticle, GenreMeta } from "./genres";
import { genreStatKeys } from "./genres";

export type AgentMeta = GenreMeta;
export type AgentArticle = GenreArticle;

const STAT_LABELS: Record<string, string> = {
  era: "Category",
  origin: "Tagline",
  tempo: "Read time",
  popularity: "Difficulty",
  roots: "Related",
  keyTools: "Key concepts",
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

function buildMeta(slug: string, data: Record<string, unknown>, wordCount: number): AgentMeta {
  const stats = (data.stats ?? {}) as Record<string, string>;
  return {
    slug,
    title: (data.title as string) ?? slug,
    subtitle: (data.subtitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    image: (data.image as string) ?? "",
    imageAlt: (data.imageAlt as string) ?? "",
    popularityTier: (data.popularityTier as string) ?? "Foundational",
    eraOrigin: (data.eraOrigin as string) ?? "",
    regionOrigin: (data.regionOrigin as string) ?? "",
    tempoBpm: (data.tempoBpm as string) ?? "",
    signatureSound: (data.signatureSound as string) ?? "",
    culturalMovement: (data.culturalMovement as string) ?? "",
    accentColor: (data.accentColor as string) ?? "#f59e0b",
    parentGenres: (data.parentGenres as string[]) ?? [],
    keyInstruments: (data.keyInstruments as string[]) ?? [],
    regions: (data.regions as string[]) ?? [],
    stats: Object.fromEntries(genreStatKeys.map((k) => [k, stats[k] ?? ""])),
    statLabels: STAT_LABELS,
    displayOrder: Number(data.displayOrder ?? 999),
    publishedAt: parseDate(data.publishedAt),
    wordCount,
  };
}

export async function getAllAgents(): Promise<AgentMeta[]> {
  const entries = (await getRawCategoryEntries("agents")).map(({ slug, data, content }) =>
    buildMeta(slug, data, resolveWordCount(data, content))
  );
  return entries.sort((a, b) => a.displayOrder - b.displayOrder);
}

export async function getAgent(slug: string): Promise<AgentArticle | null> {
  const raw = await getRawEntry("agents", slug);
  if (!raw) return null;

  const { data, content } = raw;
  return {
    ...buildMeta(slug, data, resolveWordCount(data, content)),
    sections: parseSections(content),
  };
}

export async function getAgentSlugs(): Promise<string[]> {
  return getRawSlugs("agents");
}

export const agentStatKeys = genreStatKeys;
