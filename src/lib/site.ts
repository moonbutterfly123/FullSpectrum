export const SITE_DOMAIN = "readfullspectrum.com";
export const DEFAULT_SITE_URL = `https://${SITE_DOMAIN}`;

export const SITE_NAME = "Full Spectrum";
export const SITE_TAGLINE =
  "Explore the full spectrum of nature and culture — in-depth guides to birds, fish, music genres, and more.";
/** Homepage & JSON-LD description (140–160 chars, keyword-rich). */
export const SITE_DESCRIPTION =
  "Full Spectrum — 300+ in-depth articles on birds, fish, music genres, and natural history. Explore nature and culture at readfullspectrum.com.";
export const SITE_KEYWORDS = [
  "Full Spectrum",
  "readfullspectrum",
  "birds",
  "fish",
  "music genres",
  "natural history",
  "wildlife guide",
  "species encyclopedia",
];
export const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Public site origin used for canonical URLs, Open Graph, sitemap, and robots.txt. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url) return DEFAULT_SITE_URL;
  return url.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
