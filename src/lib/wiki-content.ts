import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ConservationCode, WikiSection } from "./types";

const contentDir = path.join(process.cwd(), "content");

function parseDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (typeof value === "string") return value;
  return new Date().toISOString().split("T")[0];
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function parseSections(content: string): WikiSection[] {
  const sections: WikiSection[] = [];
  const parts = content.split(/^## /m).filter(Boolean);

  for (const part of parts) {
    const newline = part.indexOf("\n");
    if (newline === -1) continue;
    const title = part.slice(0, newline).trim();
    const body = part.slice(newline + 1).trim();
    if (title && body) sections.push({ title, content: body });
  }

  return sections;
}

export function toConservationCode(status: string | undefined): ConservationCode {
  const map: Record<string, ConservationCode> = {
    "Least Concern": "LC",
    "Near Threatened": "NT",
    Vulnerable: "VU",
    Endangered: "EN",
    "Critically Endangered": "CR",
    "Extinct in the Wild": "EW",
    "Data Deficient": "DD",
  };
  if (!status) return "LC";
  return map[status] ?? "LC";
}

export interface WikiEntryMeta {
  slug: string;
  title: string;
  scientificName: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  conservationCode: ConservationCode;
  conservationLabel: string;
  order: string;
  family: string;
  stats: Record<string, string>;
  statLabels: Record<string, string>;
  regions: string[];
  habitat: string;
  displayOrder: number;
  publishedAt: string;
  wordCount: number;
}

export interface WikiEntry extends WikiEntryMeta {
  sections: WikiSection[];
}

function buildMeta(
  slug: string,
  data: Record<string, unknown>,
  wordCount: number,
  statKeys: string[],
  statLabels: Record<string, string>
): WikiEntryMeta {
  const stats = (data.stats ?? {}) as Record<string, string>;
  return {
    slug,
    title: (data.title as string) ?? slug,
    scientificName: (data.scientificName as string) ?? "",
    subtitle: (data.subtitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    image: (data.image as string) ?? "",
    imageAlt: (data.imageAlt as string) ?? "",
    conservationCode: (data.conservationCode as ConservationCode) ?? "LC",
    conservationLabel: (data.conservationLabel as string) ?? "Least Concern",
    order: (data.order as string) ?? "",
    family: (data.family as string) ?? "",
    stats: Object.fromEntries(statKeys.map((k) => [k, stats[k] ?? ""])),
    statLabels,
    regions: (data.regions as string[]) ?? [],
    habitat: (data.habitat as string) ?? "",
    displayOrder: Number(data.displayOrder ?? 999),
    publishedAt: parseDate(data.publishedAt),
    wordCount,
  };
}

export function loadAllEntries(
  category: string,
  statKeys: string[],
  statLabels: Record<string, string>
): WikiEntryMeta[] {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];

  const entries: WikiEntryMeta[] = [];
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    entries.push(buildMeta(slug, data, countWords(content), statKeys, statLabels));
  }

  return entries.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function loadEntry(
  category: string,
  slug: string,
  statKeys: string[],
  statLabels: Record<string, string>
): WikiEntry | null {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    ...buildMeta(slug, data, countWords(content), statKeys, statLabels),
    sections: parseSections(content),
  };
}

export function loadSlugs(category: string): string[] {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
