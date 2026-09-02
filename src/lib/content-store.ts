export interface RawContentEntry {
  data: Record<string, unknown>;
  content: string;
}

type CategoryMeta = Record<string, { data: Record<string, unknown> }>;
type ContentBundle = Record<string, Record<string, RawContentEntry>>;

const FETCH_TIMEOUT_MS = 8000;
const jsonCache = new Map<string, Promise<unknown>>();

function canReadFromDisk(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "development"
  );
}

async function readJsonFromDisk<T>(assetPath: string): Promise<T | null> {
  if (!canReadFromDisk()) return null;

  const fs = await import("node:fs");
  const path = await import("node:path");
  const filePath = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));

  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

async function readJsonFromAssets<T>(assetPath: string): Promise<T | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    if (!env?.ASSETS) return null;

    const response = await env.ASSETS.fetch(
      new Request(new URL(assetPath, "https://assets.local"))
    );
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function readJsonFromNetwork<T>(assetPath: string): Promise<T> {
  const { getSiteUrl } = await import("./site");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(`${getSiteUrl()}${assetPath}`, {
      cache: "force-cache",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to load ${assetPath} (${response.status})`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function loadJson<T>(assetPath: string): Promise<T> {
  const cached = jsonCache.get(assetPath);
  if (cached) return cached as Promise<T>;

  const pending = (async () => {
    const fromDisk = await readJsonFromDisk<T>(assetPath);
    if (fromDisk) return fromDisk;

    const fromAssets = await readJsonFromAssets<T>(assetPath);
    if (fromAssets) return fromAssets;

    return readJsonFromNetwork<T>(assetPath);
  })();

  jsonCache.set(assetPath, pending);
  try {
    return (await pending) as T;
  } catch (error) {
    jsonCache.delete(assetPath);
    throw error;
  }
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  return loadJson<Record<string, number>>("/data/counts.json");
}

export async function getRawCategoryEntries(
  category: string
): Promise<Array<{ slug: string } & RawContentEntry>> {
  const entries = await loadJson<CategoryMeta>(`/data/meta/${category}.json`);

  return Object.entries(entries).map(([slug, entry]) => ({
    slug,
    data: entry.data,
    content: "",
  }));
}

export async function getRawEntry(
  category: string,
  slug: string
): Promise<({ slug: string } & RawContentEntry) | null> {
  try {
    const entry = await loadJson<RawContentEntry>(
      `/data/articles/${category}/${slug}.json`
    );
    if (!entry?.data) return null;
    return { slug, ...entry };
  } catch {
    return null;
  }
}

export async function getRawSlugs(category: string): Promise<string[]> {
  const entries = await loadJson<CategoryMeta>(`/data/meta/${category}.json`);
  return Object.keys(entries);
}

/** @deprecated Kept so older imports still type-check during the split. */
export async function getContentBundle(): Promise<ContentBundle> {
  const counts = await getCategoryCounts();
  const bundle: ContentBundle = {};

  for (const category of Object.keys(counts)) {
    const entries = await getRawCategoryEntries(category);
    bundle[category] = Object.fromEntries(
      entries.map(({ slug, data, content }) => [slug, { data, content }])
    );
  }

  return bundle;
}
