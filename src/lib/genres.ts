import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parseSections } from "./wiki-content";
import type { WikiSection } from "./types";

const genresDir = path.join(process.cwd(), "content", "music");

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

export function getAllGenres(): GenreMeta[] {
  if (!fs.existsSync(genresDir)) return [];
  const entries: GenreMeta[] = [];
  for (const file of fs.readdirSync(genresDir).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(genresDir, file), "utf-8");
    const { data, content } = matter(raw);
    entries.push(buildMeta(file.replace(/\.md$/, ""), data, countWords(content)));
  }
  return entries.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getGenre(slug: string): GenreArticle | null {
  const filePath = path.join(genresDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    ...buildMeta(slug, data, countWords(content)),
    sections: parseSections(content),
  };
}

export function getGenreSlugs(): string[] {
  if (!fs.existsSync(genresDir)) return [];
  return fs
    .readdirSync(genresDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export const genreStatKeys = STAT_KEYS;
