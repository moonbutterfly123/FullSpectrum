import {
  buildInternalLinkTargets,
  type InternalLinkTarget,
} from "@/lib/internal-links";

export interface RelatedEntry {
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  href: string;
  reason?: string;
}

interface WikiLikeEntry {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  family: string;
  order: string;
  regions: string[];
}

export function getRelatedWikiEntries<T extends WikiLikeEntry>(
  current: T,
  all: T[],
  basePath: string,
  limit = 4
): RelatedEntry[] {
  const scored = all
    .filter((entry) => entry.slug !== current.slug)
    .map((entry) => {
      let score = 0;
      const reasons: string[] = [];

      if (entry.family && entry.family === current.family) {
        score += 4;
        reasons.push(`Same family · ${entry.family}`);
      }
      if (entry.order && entry.order === current.order) {
        score += 2;
        if (!reasons.length) reasons.push(`Same order · ${entry.order}`);
      }

      const sharedRegions = entry.regions.filter((region) =>
        current.regions.includes(region)
      );
      if (sharedRegions.length > 0) {
        score += sharedRegions.length;
        if (!reasons.length) reasons.push(`Also found in ${sharedRegions[0]}`);
      }

      return {
        entry,
        score,
        reason: reasons[0] ?? "Related species",
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

  if (scored.length >= limit) {
    return scored.slice(0, limit).map(({ entry, reason }) => toRelated(entry, basePath, reason));
  }

  const fallback = all
    .filter((entry) => entry.slug !== current.slug)
    .slice(0, limit)
    .map((entry) => toRelated(entry, basePath, "From the collection"));

  const merged = [...scored.map(({ entry, reason }) => toRelated(entry, basePath, reason))];
  for (const item of fallback) {
    if (merged.length >= limit) break;
    if (!merged.some((existing) => existing.slug === item.slug)) {
      merged.push(item);
    }
  }

  return merged.slice(0, limit);
}

interface GenreLikeEntry {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  parentGenres: string[];
  popularityTier: string;
  regionOrigin: string;
  regions: string[];
}

export function getRelatedGenres(
  current: GenreLikeEntry,
  all: GenreLikeEntry[],
  limit = 4,
  basePath = "/music"
): RelatedEntry[] {
  const scored = all
    .filter((entry) => entry.slug !== current.slug)
    .map((entry) => {
      let score = 0;
      const reasons: string[] = [];

      for (const parent of current.parentGenres) {
        if (entry.title.toLowerCase() === parent.toLowerCase()) {
          score += 5;
          reasons.push(`Root genre · ${parent}`);
        }
        if (entry.parentGenres.some((g) => g.toLowerCase() === parent.toLowerCase())) {
          score += 3;
          if (!reasons.length) reasons.push(`Shares roots with ${parent}`);
        }
      }

      for (const parent of entry.parentGenres) {
        if (current.title.toLowerCase() === parent.toLowerCase()) {
          score += 4;
          reasons.push(`Influenced ${entry.title}`);
        }
      }

      if (entry.popularityTier === current.popularityTier) {
        score += 1;
      }

      if (
        entry.regionOrigin &&
        current.regionOrigin &&
        entry.regionOrigin === current.regionOrigin
      ) {
        score += 2;
        if (!reasons.length) reasons.push(`From ${entry.regionOrigin}`);
      }

      const sharedRegions = entry.regions.filter((region) =>
        current.regions.includes(region)
      );
      if (sharedRegions.length > 0) {
        score += 1;
      }

      return { entry, score, reason: reasons[0] ?? "Related genre" };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));

  const results = scored.slice(0, limit).map(({ entry, reason }) =>
    toRelated(entry, basePath, reason)
  );

  if (results.length < limit) {
    for (const parent of current.parentGenres) {
      const match = all.find(
        (entry) =>
          entry.slug !== current.slug &&
          entry.title.toLowerCase() === parent.toLowerCase()
      );
      if (match && !results.some((item) => item.slug === match.slug)) {
        results.push(toRelated(match, basePath, `Related · ${parent}`));
      }
      if (results.length >= limit) break;
    }
  }

  return results.slice(0, limit);
}

export function buildGenreTitleIndex(
  genres: GenreLikeEntry[]
): Map<string, string> {
  return new Map(genres.map((genre) => [genre.slug, genre.title]));
}

function toRelated(
  entry: { slug: string; title: string; subtitle: string; image: string },
  basePath: string,
  reason: string
): RelatedEntry {
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    image: entry.image,
    href: `${basePath}/${entry.slug}`,
    reason,
  };
}

export function buildGenreLinkTargets(
  genres: { title: string; slug: string; parentGenres?: string[] }[],
  excludeSlug?: string,
  basePath = "/music"
): InternalLinkTarget[] {
  const parentLinks = genres.flatMap((genre) =>
    (genre.parentGenres ?? []).flatMap((parent) => {
      const match = genres.find(
        (candidate) => candidate.title.toLowerCase() === parent.toLowerCase()
      );
      return match
        ? [{ title: match.title, href: `${basePath}/${match.slug}`, slug: match.slug }]
        : [];
    })
  );

  return buildInternalLinkTargets(genres, basePath, excludeSlug, parentLinks);
}
