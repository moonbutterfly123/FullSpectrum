import contentBundle from "@/generated/content.json";

export interface RawContentEntry {
  data: Record<string, unknown>;
  content: string;
}

type ContentBundle = Record<string, Record<string, RawContentEntry>>;

const bundle = contentBundle as ContentBundle;

export function getRawCategoryEntries(category: string): Array<{ slug: string } & RawContentEntry> {
  const entries = bundle[category];
  if (!entries) return [];

  return Object.entries(entries).map(([slug, entry]) => ({
    slug,
    ...entry,
  }));
}

export function getRawEntry(category: string, slug: string): ({ slug: string } & RawContentEntry) | null {
  const entry = bundle[category]?.[slug];
  if (!entry) return null;
  return { slug, ...entry };
}

export function getRawSlugs(category: string): string[] {
  const entries = bundle[category];
  if (!entries) return [];
  return Object.keys(entries);
}
