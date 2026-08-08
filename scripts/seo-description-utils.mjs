/**
 * Truncate text to 140–160 chars for SEO descriptions (mirrors src/lib/seo.ts).
 */
export function truncateSeoDescription(text, fallback = "") {
  const source = String(text || fallback || "")
    .replace(/\s+/g, " ")
    .trim();
  const MIN = 140;
  const MAX = 160;

  if (!source) return fallback.slice(0, MAX);
  if (source.length >= MIN && source.length <= MAX) return source;

  if (source.length > MAX) {
    const cut = source.slice(0, MAX - 1);
    const lastSpace = cut.lastIndexOf(" ");
    const trimmed =
      lastSpace >= MIN - 20 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed.trim()}…`;
  }

  const padded = `${source} ${fallback}`.replace(/\s+/g, " ").trim();
  if (padded.length <= MAX) return padded;
  const cut = padded.slice(0, MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace >= MIN ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
