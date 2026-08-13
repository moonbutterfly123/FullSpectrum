export interface RawContentEntry {
  data: Record<string, unknown>;
  content: string;
}

type ContentBundle = Record<string, Record<string, RawContentEntry>>;

const CONTENT_URL = "/data/content.json";

let cache: ContentBundle | null = null;
let loadPromise: Promise<ContentBundle> | null = null;

function canReadFromDisk(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "development"
  );
}

async function readFromDisk(): Promise<ContentBundle | null> {
  if (!canReadFromDisk()) return null;

  const fs = await import("node:fs");
  const path = await import("node:path");
  const filePath = path.join(process.cwd(), "public/data/content.json");

  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as ContentBundle;
}

async function readFromNetwork(): Promise<ContentBundle> {
  const { getSiteUrl } = await import("./site");
  const url = `${getSiteUrl()}${CONTENT_URL}`;
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Failed to load content bundle (${response.status})`);
  }

  return response.json() as Promise<ContentBundle>;
}

export async function getContentBundle(): Promise<ContentBundle> {
  if (cache) return cache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const fromDisk = await readFromDisk();
    if (fromDisk) {
      cache = fromDisk;
      return fromDisk;
    }

    cache = await readFromNetwork();
    return cache;
  })();

  return loadPromise;
}

export async function getRawCategoryEntries(
  category: string
): Promise<Array<{ slug: string } & RawContentEntry>> {
  const bundle = await getContentBundle();
  const entries = bundle[category];
  if (!entries) return [];

  return Object.entries(entries).map(([slug, entry]) => ({
    slug,
    ...entry,
  }));
}

export async function getRawEntry(
  category: string,
  slug: string
): Promise<({ slug: string } & RawContentEntry) | null> {
  const bundle = await getContentBundle();
  const entry = bundle[category]?.[slug];
  if (!entry) return null;
  return { slug, ...entry };
}

export async function getRawSlugs(category: string): Promise<string[]> {
  const bundle = await getContentBundle();
  const entries = bundle[category];
  if (!entries) return [];
  return Object.keys(entries);
}
