import Link from "next/link";

export interface InternalLinkTarget {
  title: string;
  href: string;
  slug: string;
}

/** Common English words that match short article titles but aren't intentional links. */
const SINGLE_WORD_BLOCKLIST = new Set([
  "pop",
  "emo",
  "spot",
  "house",
  "folk",
  "rock",
  "punk",
  "metal",
  "drill",
  "garage",
  "industrial",
  "swing",
  "trance",
  "ambient",
  "gospel",
  "worship",
  "americana",
]);

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isLinkableTitle(title: string): boolean {
  const trimmed = title.trim();
  if (!trimmed) return false;

  const words = trimmed.split(/\s+/);
  if (words.length >= 2) return true;

  const lower = trimmed.toLowerCase();
  if (SINGLE_WORD_BLOCKLIST.has(lower)) return false;

  return trimmed.length >= 5;
}

export function buildInternalLinkTargets(
  entries: { title: string; slug: string }[],
  basePath: string,
  excludeSlug?: string,
  extraTitles?: { title: string; href: string; slug: string }[]
): InternalLinkTarget[] {
  const targets = new Map<string, InternalLinkTarget>();

  for (const entry of entries) {
    if (entry.slug === excludeSlug) continue;
    if (!isLinkableTitle(entry.title)) continue;

    const key = entry.title.toLowerCase();
    if (!targets.has(key)) {
      targets.set(key, {
        title: entry.title,
        href: `${basePath}/${entry.slug}`,
        slug: entry.slug,
      });
    }
  }

  for (const extra of extraTitles ?? []) {
    if (extra.slug === excludeSlug) continue;
    if (!isLinkableTitle(extra.title)) continue;
    const key = extra.title.toLowerCase();
    if (!targets.has(key)) {
      targets.set(key, extra);
    }
  }

  return [...targets.values()].sort((a, b) => b.title.length - a.title.length);
}

interface TextSegment {
  type: "text" | "link";
  value: string;
  href?: string;
}

export function splitTextWithInternalLinks(
  text: string,
  targets: InternalLinkTarget[]
): TextSegment[] {
  if (!text || targets.length === 0) {
    return [{ type: "text", value: text }];
  }

  type Match = { start: number; end: number; href: string; label: string };
  const matches: Match[] = [];

  for (const target of targets) {
    const pattern = new RegExp(`\\b${escapeRegex(target.title)}\\b`, "gi");
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = matches.some(
        (existing) => start < existing.end && end > existing.start
      );
      if (!overlaps) {
        matches.push({
          start,
          end,
          href: target.href,
          label: match[0],
        });
      }
    }
  }

  if (matches.length === 0) {
    return [{ type: "text", value: text }];
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, match.start) });
    }
    segments.push({ type: "link", value: match.label, href: match.href });
    cursor = match.end;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return segments;
}
